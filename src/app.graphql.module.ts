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

@Module({
    providers: [AppService, AppController, StudentRepository],
    imports: [TypeOrmModule.forFeature([Order]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }])],
})
export class AppGraphqlModule { }