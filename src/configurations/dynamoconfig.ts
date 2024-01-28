import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateTableCommand, DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { AttributeMap } from "dynamoose/dist/Types";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Person } from "src/models/person";

@Injectable()
export class DynamoDb implements OnModuleInit {
    private readonly dynamoDB: DynamoDBClient;

    constructor(private readonly configService: ConfigService) {
        this.dynamoDB = new DynamoDBClient({
            region: this.configService.get('db.dynamo.region'),
            endpoint: this.configService.get('db.dynamo.endpoint')
        });
    }
    async onModuleInit() {
        const entityNames = ["Person"]
        for (const entityName of entityNames) {
            const tableName = this.configService.get(`db.dynamo.config.${entityName}.tableName`) ?? entityName.toLowerCase()
            const keyField = this.configService.get(`db.dynamo.config.${entityName}.keyField`) ?? "id"
            const readCapacityUnits = this.configService.get(`db.dynamo.config.${entityName}.readCapacityUnits`) ??
                this.configService.get(`db.dynamo.config.${entityName}.defaultReadCapacityUnits`)

            const writeCapacityUnits = this.configService.get(`db.dynamo.config.${entityName}.writeCapacityUnits`) ??
                this.configService.get(`db.dynamo.config.${entityName}.defaultWriteCapacityUnits`)

            await this.createTableIfNotExists(tableName, keyField, readCapacityUnits, writeCapacityUnits)
        }

    }

    dynamoDBDocumentClient() {
        return DynamoDBDocumentClient.from(this.dynamoDB);
    }

    async createTableIfNotExists(tableName: string, keyField: string, readCapacityUnit = 5, writeCapacityUnit = 5): Promise<void> {
        try {
            // Check if the table exists
            await this.dynamoDB.send(new DescribeTableCommand({ TableName: tableName }));
        } catch (error) {
            // If the table doesn't exist, create it
            console.log('in catch block', error.__type)
            if (error.__type.includes('ResourceNotFoundException')) {
                await this.createTable(tableName, keyField, readCapacityUnit, writeCapacityUnit);
            } else {
                throw error;
            }
        }
    }

    private async createTable(tableName: string, keyField: string, readCapacityUnit = 5, writeCapacityUnit = 5): Promise<void> {
        console.log('in create table')
        const params  = new CreateTableCommand({
            TableName: tableName,
            AttributeDefinitions: [
                { AttributeName: keyField, AttributeType: 'S' }, // Change the attribute type based on your requirements
            ],
            KeySchema: [
                { AttributeName: keyField, KeyType: 'HASH' },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacityUnit,
                WriteCapacityUnits: writeCapacityUnit
            },
        });

        await this.dynamoDB.send(params);
        console.log('in create table complete')
    }
}
