import { Kafka, KafkaConfig } from 'kafkajs';
import express, { Express, Request, Response } from 'express';
import expressWs from 'express-ws';
import dotenv from 'dotenv';
import { ChatMessage } from 'elusivebot-schema';

dotenv.config();

const kafkaConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'http',
  brokers:  process.env.KAFKA_BOOTSTRAP!.split(','),
};
const kafka = new Kafka(kafkaConfig);

const server: Express = express();
const ExpressWs = expressWs(server);
const app = ExpressWs.app;

app.get('/', function(req, res, next){
  res.end();
});

app.ws('/chat', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
});

app.listen(process.env.HTTP_PORT || 8080)
