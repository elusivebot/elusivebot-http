import { Kafka, KafkaConfig } from 'kafkajs';
import express, { Express, Request, Response } from 'express';
import expressWs from 'express-ws';
import dotenv from 'dotenv';
import { ChatMessage } from 'elusivebot-schema';
import WebSocket from 'ws';

dotenv.config();

const httpPort: number = Number(process.env.HTTP_PORT) || 8080;
const httpListen = process.env.HTTP_LISTEN || 'localhost';

const kafkaClientId = process.env.KAFKA_CLIENT_ID || 'http';

const kafkaConfig: KafkaConfig = {
  clientId: kafkaClientId,
  brokers:  process.env.KAFKA_BOOTSTRAP!.split(','),
};
const kafka = new Kafka(kafkaConfig);

const producerTopic = process.env.KAFKA_PRODUCER_TOPIC || 'messages-input';
const consumerTopic = process.env.KAFKA_CONSUMER_TOPIC || 'messages-output';

const server: Express = express();
const ExpressWs = expressWs(server);
const app = ExpressWs.app;

const producer = kafka.producer();
await producer.connect();

const consumer = kafka.consumer({ groupId: kafkaClientId });
await consumer.connect();

const lookups: { [id: string] : WebSocket } = {};

await consumer.subscribe({ topics: [consumerTopic] });

app.get('/', function(req, res, next){
  res.end();
});

app.ws('/chat', function(ws, req) {
  let id = `http-${crypto.randomUUID()}`;
  lookups[id] = ws;
  ws.on('message', async function(msg) {
    console.log(msg);
    let body: ChatMessage = {
      header: {
        serviceId: 'http',
        serverId: id,
      },
      message: msg.toString(),
    }
    await producer.send({
      topic: producerTopic,
      messages: [{
        key: kafkaClientId,
        value: JSON.stringify(body),
      }],
    });
  });
});

app.listen(httpPort, httpListen);

await consumer.run({
  eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
    if (message.key?.toString() === kafkaClientId) {
      if (message.value === null) {
        console.log("Received message without a body");
      } else {
        let body: ChatMessage = JSON.parse(message.value!.toString());
        let serverId = body.header.serverId;
        if (serverId !== undefined && !(serverId in lookups)) {
          console.log("Received message with serverId %s which doesn't map to a websocket instance!", serverId);
        } else {
          await lookups[serverId!].send(body.message);
        }
      }
    }
  },
})
