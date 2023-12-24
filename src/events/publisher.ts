import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka, Ctx, EventPattern, KafkaContext, MessagePattern, Payload, Transport } from "@nestjs/microservices";
import { Partitioners, Message, Kafka, EachMessagePayload } from "kafkajs";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092'],
})

@Injectable()
export class Publisher {

    // kafka = new Kafka({
    //     clientId: 'my-app',
    //     brokers: ['localhost:29092'],        
    // })

    // producer = this.kafka.producer()
    // adminClient = this.kafka.admin()


    @Client({
        transport: Transport.KAFKA,
        options: {
            producer: {
                allowAutoTopicCreation: true,
                createPartitioner: Partitioners.DefaultPartitioner
            },
            client: {
                clientId: 'user',
                brokers: ['localhost:29092'],
            },
            consumer: {
                groupId: 'user-consumer',
                allowAutoTopicCreation: true,
            },
        }
    })
    client: ClientKafka;

    async onModuleInit() {
        this.client.connect();
        //this.client.subscribeToResponseOf('user-topic3')

        // const consumer = kafka.consumer({ groupId: 'consumer-group' })

        // await consumer.connect()
        // await consumer.subscribe({
        //     topics: ['sometopic'],
        //     fromBeginning: false
        // })

        // await consumer.run({
        //     eachMessage: async (messagePayload: EachMessagePayload) => {
        //         const { topic, partition, message } = messagePayload
        //         const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
        //         console.log(`- ${prefix} ${message.key}#${message.value}`)
        //     }
        // })

    }

    // @EventPattern('user-topic3')
    // async handleUserCreated(payload: any) {
    //     console.log(JSON.stringify(payload) + ' created');
    // }



    //@EventPattern('sometopic')

    async sendMessage(id: number) {
        // await this.producer.send({
        //     topic: 'user-topic-1',
        //     messages: [
        //         { value: 'hello' }
        //     ]
        // });;

        const message: Message = {
            key: 'my-message-key',
            value: 'Hello, Kafka!',
            headers: {
                'custom-header-1': 'value-1',
                'custom-header-2': 'value-2',
            },
        };

        this.client.emit('user-topic3', message)

        // no control to send headers
        // this.client.send('user-topic3', {
        //     message: 'hello', headers: {
        //         'key': 'value'
        //     }
        // }).subscribe(() => {

        // })

    }

}