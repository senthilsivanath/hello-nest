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
  let app: INestApplication;
  let dbContainer: StartedTestContainer;
  let mysqlContainer: StartedMySqlContainer;
  let kafkaContainer: StartedTestContainer;
  let mongoContainer: StartedTestContainer;
  jest.setTimeout(180000);

  let configService: ConfigService;

  beforeAll(async () => {


  }, 180000);

  it('/ (GET)', async () => {


    dbContainer = await new PostgreSqlContainer()
      .start();


    mongoContainer = await new MongoDBContainer("mongo:6.0.1").start();

    mysqlContainer = await new MySqlContainer()
      .withExposedPorts(3306)
      .withRootPassword("root1")
      .withUsername("root2")
      .withUserPassword("root3")
      .withDatabase('test')
      .start();

    const mappedPort = mysqlContainer.getMappedPort(3306)

    process.env.DATABASE_PORT = mappedPort.toString()

    kafkaContainer = await new KafkaContainer().withExposedPorts(9092).start();


    const mappedMongoPort = mongoContainer.getMappedPort(27017);

    process.env.MONGO_PORT = mappedMongoPort.toString()

    const kafkaMappedPort = kafkaContainer.getMappedPort(9092);

    process.env.KAFKA_PORT = kafkaMappedPort.toString()

    // //await Promise.all([dbContainerPromise, mysqlContainerPromise, kafkaContainerPromise, mongodbContainerPromise])


    // // dbContainer = await dbContainerPromise
    // // mongoContainer= await mongodbContainerPromise
    // // mysqlContainer = await mysqlContainerPromise
    // // kafkaContainer = await kafkaContainerPromise

    // let stream1 = await dbContainer.logs();
    // stream1
    //   .on("data", line => console.log(line))
    //   .on("err", line => console.error(line))
    //   .on("end", () => console.log("Stream closed"));


    // const stream = await mysqlContainer.logs();
    // stream
    //   .on("data", line => console.log(line))
    //   .on("err", line => console.error(line))
    //   .on("end", () => console.log("Stream closed"));

    //await waitUntilContainerIsReady(mysqlContainer)


    // let stream2 = await kafkaContainer.logs();
    // stream2
    //   .on("data", line => console.log(line))
    //   .on("err", line => console.error(line))
    //   .on("end", () => console.log("Stream closed"));


    // let stream3 = await mongoContainer.logs();
    // stream3
    //   .on("data", line => console.log(line))
    //   .on("err", line => console.error(line))
    //   .on("end", () => console.log("Stream closed"));



    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();


    app = moduleFixture.createNestApplication({
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:'+kafkaMappedPort],
        }
      }
    }) 

    // const originalConfigService = moduleFixture.get<ConfigService>(ConfigService);

    // const moduleFixture1: TestingModule = await Test.createTestingModule({
    //   imports: [AppModule],
    // }).overrideProvider(ConfigService).useValue({
    //   get:(key: string)=>{
    //     if (key === 'db.default.port') {
    //       return mappedPort;
    //     }
    //     return originalConfigService.get(key)
    //   }
    // }).compile();

    // app = moduleFixture1.createNestApplication();


    await app.init();


    return request(app.getHttpServer())
      .get('/orders/health')
      .expect(200)
      .expect('{"message":"ok"}');
  });

  // async function waitUntilContainerIsReady(container) {
  //   const maxRetries = 30;
  //   let retries = 0;
  //   while (retries < maxRetries) {
  //     if (false) {
  //       console.log('Container is ready!');
  //       return;
  //     }
  //     await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 1 second before checking again
  //     retries++;
  //   }
  //   throw new Error('Container did not start in time.');
  // }

  afterAll(async () => {
    // Close your NestJS application
    if (app) {
      await app.close();
    }

    // Stop and cleanup the Kafka and Zookeeper containers
    if (kafkaContainer) {
      await kafkaContainer.stop();
    }
    if(mongoContainer){
      await mongoContainer.stop();
    }
    if(mysqlContainer){
      await mysqlContainer.stop();
    }
    if(dbContainer){
      await dbContainer.stop();
    }
  });

});
