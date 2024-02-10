import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosResponse } from "axios";
import { lastValueFrom } from "rxjs";
import { Order } from "src/models/order";
import qs from 'qs'

@Injectable()
class DefaultService {

    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
        // base url
        httpService.axiosRef.defaults.baseURL = this.configService.get('rest.default.baseurl')
        const username = this.configService.get('rest.default.username')
        const password = this.configService.get('rest.default.password')
        const apiKey = this.configService.get('rest.default.apiKey')

        const encodedBasicToken = Buffer.from(`${username}:${password}`).toString('base64')

        // common headers
        httpService.axiosRef.interceptors.request.use((config) => {

            config.headers.set('Content-Type', 'application/json') // common token
            config.headers.set('Authorization', `Basic ${encodedBasicToken}`) // basic auth
            config.headers.set('X-API-KEY', `${apiKey}`) // basic auth
            return config
        })
    }

    findAll(): Promise<AxiosResponse<Order[]>> {
        // simple get 
        return lastValueFrom(this.httpService.get('http://localhost:3000/cats'));
    }

    sendMessage(order: Order): Promise<AxiosResponse<Order[]>> {
        // request level headers
        return lastValueFrom(this.httpService.post('http://localhost:3000/cats', order, {
            headers: {
                "Content-Type": "application/json"
            }
        }));
    }

    sendMessageWithFormData(order: Order): Promise<AxiosResponse<Order[]>> {

        // request level headers        
        return lastValueFrom(this.httpService.post('http://localhost:3000/cats', axios.toFormData(order), {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }));
    }

    sendMessageWithEncoded(entity: Order): Promise<AxiosResponse<Order[]>> {

        // request level headers        
        return lastValueFrom(this.httpService.post('http://localhost:3000/cats',
            qs.stringify(entity), {
            headers: {
                "Content-Type": " application/x-www-form-urlencoded"
            }
        }));
    }

}