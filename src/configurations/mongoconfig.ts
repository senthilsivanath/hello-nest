import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { DeliveryAddress } from "../models/delivery";
import { Order, OrderLine, Customer } from "../models/order";

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
    constructor(private readonly configService: ConfigService) { }
    createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {        
        
        const host = this.configService.get('db.mongo.host');
        const port = this.configService.get('db.mongo.port');
        const uri = `mongodb://${host}:${port}/${this.configService.get('db.mongo.database')}?directConnection=true` 
        console.log('mongoose options',uri)
        return {
            
            uri,
            
        }
    }
}