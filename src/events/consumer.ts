import { Controller, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka, EventPattern, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";

@Controller()
export class ConsumerController {

    //constructor(@Inject('HERO_SERVICE') private readonly client: ClientKafka){}

    // @Client({
    //     transport: Transport.KAFKA,
    //     options: {
    //         producer: {
    //             allowAutoTopicCreation: true,
    //             createPartitioner: Partitioners.DefaultPartitioner
    //         },
    //         client: {
    //             clientId: 'user',
    //             brokers: ['localhost:29092'],
    //         },
    //         consumer: {
    //             groupId: 'user-consume1',
    //             allowAutoTopicCreation: true,
    //         },

    //     }
    // })
    // client: ClientKafka;


    @EventPattern('user-topic3', Transport.KAFKA)
    async handleEntityCreated(payload: any) {
        console.log(JSON.stringify(payload) + ' in event consumer pattern created');
        //console.log(payload.value + ' created');
    }

}