import { BadGatewayException, Body, Controller, Delete, ForbiddenException, Get, Header, HttpCode, OnModuleInit, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { Order } from './models/order';
import { SomeService } from './configurations/someservice';
import { RadicalException } from './exceptions/radical-exception';
import { Context } from './configurations/user-decorator';
import { Client, ClientKafka, EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';


@Controller("orders")
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService, private readonly someService: SomeService) { }

  @Get(":orderId")
  getHello(@Param("orderId") orderId: string): Promise<Order> {
    return this.appService.getOrder(orderId);
  }

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
        groupId: 'user-consume1',        
        allowAutoTopicCreation: true,
      },

    }
  })
  client: ClientKafka;

 
  async onModuleInit() {
    const requestPatterns = [
      'user-topic3',     
    ];

    await this.client.connect()
    
    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });

  }

  @Post()
  @Header('Location', '/redirect/url')
  @HttpCode(201)
  async createOrder(@Context() context: any, @Body() order: Order) {
    await this.appService.saveOrder(order)
  }


  @Put(":clientId/orders/:orderId")
  updateOrder(@Param("clientId") clientId, @Param("orderId") orderId): string {
    return "param" + clientId;
  }

  // @Get("orders/:id")
  // getOrders(@Query('filters') filters): string {
  //   return filters;
  // }

  @Delete("orders/:id")
  delete(@Param('id') id): string {
    return "delete" + id;
  }

  // @EventPattern('user-topic3', Transport.KAFKA)
  // async handleEntityCreated(payload: any) {
  //   console.log(JSON.stringify(payload) + ' in event pattern created');
  //   //console.log(payload.value + ' created');
  // }

  // @EventPattern('user-topic3.reply', Transport.KAFKA)
  // async handleEntityCreatedReply(payload: any) {
  //   console.log(JSON.stringify(payload) + ' created');
  //   //console.log(payload.value + ' created');
  // }

  // @MessagePattern('user-topic3', Transport.KAFKA)
  // async handleEntityCreatedReplyMessageReply(payload: any) {
  //   console.log(JSON.stringify(payload) + ' in message pattern created');
  //   //console.log(payload.value + ' created');
  // }

  // @MessagePattern('user-topic3.reply', Transport.KAFKA)
  // async handleEntityCreatedReplyMessage(payload: any) {
  //   console.log(JSON.stringify(payload) + ' created');
  //   //console.log(payload.value + ' created');
  // }
}
