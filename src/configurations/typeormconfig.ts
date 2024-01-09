import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { DeliveryAddress } from "../models/delivery";
import { Order, OrderLine, Customer } from "../models/order";

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {

        console.log('while reading config', this.configService.get<string>('db.default.type'))

        const obj = {

            type: this.configService.get('db.default.type'),
            host: this.configService.get('db.default.host'),
            port: this.configService.get('db.default.port'),
            username: this.configService.get('db.default.username'),
            password: this.configService.get('db.default.password'),
            database: this.configService.get('db.default.database'),
            // what has to be passed here is tricky, is it all models are connected models
            entities: [Order, OrderLine, Customer, DeliveryAddress],
            synchronize: true // TODO make this to go with a config in env variable
        };
  
        return obj;
    }
}