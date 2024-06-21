import { Kafka, KafkaConfig } from 'kafkajs';
import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import createMemoryStore from 'memorystore';
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
const MemoryStore = createMemoryStore(session);
const ExpressWs = expressWs(server);
const app = ExpressWs.app;

app.use(session({
    cookie: { maxAge: 86400000, },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET!,
}));

app.get('/', function(req, res, next){
  res.end();
});

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
});

app.listen(process.env.HTTP_PORT || 8080)
