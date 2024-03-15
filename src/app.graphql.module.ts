import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Repository } from "typeorm";
import { StudentRepository } from "./repositories/student.repository";
import { Order } from "./models/order";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongooseModule } from "@nestjs/mongoose";
import { Student, StudentSchema } from "./models/student";
import { Publisher } from "./events/publisher";
import { ConfigService } from "@nestjs/config";
import { kafkaConfig } from "./configurations/kafkaconfig";
import { ClientsModule } from "@nestjs/microservices";

@Module({

    providers: [AppService, AppController, StudentRepository, Publisher],
    imports: [
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
        TypeOrmModule.forFeature([Order],),
        MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }])],
})
export class AppGraphqlModule { }