import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka, Ctx, EventPattern, KafkaContext, MessagePattern, Payload, Transport } from "@nestjs/microservices";
import { Partitioners, Message, Kafka, EachMessagePayload } from "kafkajs";

@Injectable()
export class Publisher {

    constructor(
        @Inject('HERO_SERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        this.kafkaClient.connect();
        

    }


    async sendMessage(id: number) {
     

        const message: Message = {
            key: 'my-message-key',
            value: 'Hello, Kafka!',
            headers: {
                'custom-header-1': 'value-1',
                'custom-header-2': 'value-2',
            },
        };

        this.kafkaClient.emit('user-topic3', message)

    }

}