import { ClientProvider, Transport } from "@nestjs/microservices"
import { Partitioners } from "kafkajs"

export const kafkaConfig = (host: string = "localhost", port: string) : ClientProvider=>{
    
    return {
        transport: Transport.KAFKA,
        options: {
          producer: {
            allowAutoTopicCreation: true,
            createPartitioner: Partitioners.DefaultPartitioner,
          },
          client: {
            clientId: 'user',
            brokers: [`${host}:${port}`],
          },
          consumer: {
            groupId: 'user-consume1',
            allowAutoTopicCreation: true,
          },
        },
      }
}