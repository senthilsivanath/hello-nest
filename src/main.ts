import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { Transport } from '@nestjs/microservices';
import { kafkaConfig } from './configurations/kafkaconfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  NestFactory.createMicroservice(AppModule, {})
  app.connectMicroservice(kafkaConfig(process.env.KAFKA_HOST || 'localhost', 
  process.env.KAFKA_PORT || '9092'))
  await app.startAllMicroservices()
  await app.listen(3001);

}
bootstrap();
