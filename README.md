# elusivebot-http

## Prereq

To run locally, create a file with .env with the following:

* `KAFKA_BOOTSTRAP=kafka-ip-or-dns:port` -- typically localhost:9092

You can optionally define the following key-value pairs:

* `HTTP_LISTEN=dns-or-ip-address` -- IP/DNS to listen on; defaults to localhost
* `HTTP_PORT=port-number` -- port to listen on; defaults to 8080
* `KAFKA_PRODUCER_TOPIC=topic` -- Kafka topic to send messages to; defaults to messages-input
* `KAFKA_CONSUMER_TOPIC=topic` -- Kafka topic to receive messages from; defaults to messages-output
* `KAFKA_CLIENT_ID=identifier` -- identifier to use when connecting to Kafka, also used as Kafka message key; defaults to http.

