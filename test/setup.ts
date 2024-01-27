import { INestApplication } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import { TestingModule, Test } from "@nestjs/testing";
import { KafkaContainer } from "@testcontainers/kafka";
import { MongoDBContainer } from "@testcontainers/mongodb";
import { MySqlContainer } from "@testcontainers/mysql";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { AppModule } from "./../src/app.module";
import { StartedTestContainer } from "testcontainers";

let app: INestApplication;
let dbContainer: StartedTestContainer;
let mysqlContainer: StartedTestContainer;
let kafkaContainer: StartedTestContainer;
let mongoContainer: StartedTestContainer;

beforeAll(async () => {
    // Perform setup actions here
    // This will run once before any test suites

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


    global.app = moduleFixture.createNestApplication({
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    global.app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:' + kafkaMappedPort],
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


    await global.app.init();
});

afterAll(async () => {
    // Perform teardown actions here
    // This will run once after all test suites
    if (global.app) {
        await global.app.close();
      }
  
      // Stop and cleanup the Kafka and Zookeeper containers
      if (kafkaContainer) {
        await kafkaContainer.stop();
      }
      if (mongoContainer) {
        await mongoContainer.stop();
      }
      if (mysqlContainer) {
        await mysqlContainer.stop();
      }
      if (dbContainer) {
        await dbContainer.stop();
      }
});