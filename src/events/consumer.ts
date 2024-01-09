import { Controller, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka, EventPattern, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";

@Controller()
export class ConsumerController {

    @EventPattern('user-topic3', Transport.KAFKA)
    async handleEntityCreated(payload: any) {
        console.log(JSON.stringify(payload) + ' in event consumer pattern created');     
    }

}