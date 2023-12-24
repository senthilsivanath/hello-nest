import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { DeliveryAddress } from "src/models/delivery";
import { Order, OrderLine, Customer } from "src/models/order";

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
    constructor(private readonly configService: ConfigService) { }
    createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {        
        
        return {
            uri: `mongodb://${this.configService.get('db.mongo.host')}/${this.configService.get('db.mongo.database')}` 
        }
    }
}