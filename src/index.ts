import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
  clientId: 'http',
  brokers: ['kafka1:9092', 'kafka2:9092'],
};
const kafka = new Kafka(kafkaConfig);

console.log("Hello world!");
