import { BadGatewayException, Body, Controller, Delete, ForbiddenException, Get, Header, HttpCode, Inject, OnModuleInit, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { Order } from './models/order';
import { SomeService } from './configurations/someservice';
import { RadicalException } from './exceptions/radical-exception';
import { Context } from './configurations/user-decorator';
import { Client, ClientKafka, EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';


@Controller("orders")
export class AppController implements OnModuleInit {

  @Get("health")
  getHealth() {
    return { "message": "ok" };
  }

  constructor(private readonly appService: AppService, 
    private readonly someService: SomeService,
    @Inject('HERO_SERVICE') private readonly kafkaClient: ClientKafka,) { }

  @Get(":orderId")
  getHello(@Param("orderId") orderId: string): Promise<Order> {
    return this.appService.getOrder(orderId);
  }

  async onModuleInit() {
    const requestPatterns = [
      'user-topic3',
    ];

    await this.kafkaClient.connect()

    requestPatterns.forEach(pattern => {
      this.kafkaClient.subscribeToResponseOf(pattern);
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

  @Delete("orders/:id")
  delete(@Param('id') id): string {
    return "delete" + id;
  }
}
