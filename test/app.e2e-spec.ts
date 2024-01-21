import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql'
import { KafkaContainer } from '@testcontainers/kafka'
import { MongoDBContainer } from '@testcontainers/mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OverrideBy } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../src/configurations/typeormconfig';
import { Transport } from '@nestjs/microservices';


describe('AppController (e2e)', () => {

  jest.setTimeout(180000);

  it('/ (GET)', async () => {

    request(global.app.getHttpServer())
      .get('/orders/health')
      .expect(200)
      .expect('{"message":"ok"}');

    const payload = {
      "orderId": "1236",
      "description": "desc 1",
      "customerId": "1234",
      "orderlines": [
        {
          "orderlineId": "12",
          "skuId": "234234"

        }
      ],
      "deliveryAddress": {
        "addressId": "223",
        "addressLine1": "address line 1"

      }
    }

    return request(global.app.getHttpServer())
      .post('/orders')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(201)
      .then((response)=>{
        return request(global.app.getHttpServer()).get('/orders/' + payload.orderId)
        .expect(200)
        .expect('{"orderId":"1236","description":"desc 1","orderlines":[{"orderlineId":"12"}],"deliveryAddress":{"addressId":"223","addressLine1":"address line 1"}}')
      })

  });


});
