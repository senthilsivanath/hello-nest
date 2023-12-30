import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SomeService } from './configurations/someservice';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter, HttpExceptionFilter, HttpForbiddenExceptionFilter } from './exceptions/http-exception.filter';
import { ValidationPipe } from './configurations/validation-pipe';
import { AuthGuard } from './configurations/authconfig';
import appconfiguration from './configurations/appconfiguration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, Order, OrderLine } from './models/order';
import { DeliveryAddress } from './models/delivery';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './models/student';
import { StudentRepository } from './repositories/student.repository';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { Publisher } from './events/publisher';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmConfig } from './configurations/typeormconfig';
import { MongoConfig } from './configurations/mongoconfig';
import { ConsumerController } from './events/consumer';
import { Partitioners } from 'kafkajs';
import { kafkaConfig } from './configurations/kafkaconfig';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppGraphqlModule } from './app.graphql.module';

@Module({
  imports: [
    AppGraphqlModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appconfiguration]
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'HERO_SERVICE',
        useFactory:
          (configService: ConfigService) =>
          (kafkaConfig(configService.get<string>('kafka.host'),
            configService.get<string>('kafka.port'))),
        inject: [ConfigService],
      },
    ]),   
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfig
    }),
    // this produces orderRepository
    TypeOrmModule.forFeature([Order]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: MongoConfig
    }),
    // this produces Model<Student> but manually a repo is layer is required to build symmetry between DB's
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }])
  ],
  controllers: [AppController, ], /// ConsumerController
  providers: [AppService, Publisher, SomeService, StudentRepository, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpForbiddenExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
