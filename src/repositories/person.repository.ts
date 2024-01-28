import { Injectable } from "@nestjs/common";
import { CrudRepository } from "./crud.repository";
import { Person } from "src/models/person";
import { DynamoDb } from "src/configurations/dynamoconfig";
import { ConfigService } from "@nestjs/config";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";


@Injectable()
export class DynamoRepository<T extends object> implements CrudRepository<T, String>{

    tableName: string
    keyField: string

    constructor(private readonly dynamoDb: DynamoDb,
        private readonly configService: ConfigService,
        private readonly entityName) {
        const entityTypeName = this.entityName
        this.tableName = this.configService.get('db.dynamo.config.' + entityTypeName + '.tableName') ?? entityTypeName
        this.keyField = this.configService.get('db.dynamo.config.' + entityTypeName + '.keyField') ?? "id"
    }


    async save(entity: T): Promise<T> {
        console.log('storing',{...entity})
        const output = await this.dynamoDb.dynamoDBDocumentClient().send(new PutCommand({
            TableName: this.tableName,
            Item: {
                ...entity
            }
        }))
        
        return entity
    }
    async findById(id: String): Promise<T> {

        const result = await this.dynamoDb.dynamoDBDocumentClient().send(new GetCommand({
            TableName: this.tableName,            
            Key: {
                [this.keyField]: id
            }
        }))

        return result.Item as T;
    }
    async deleteById(id: String): Promise<void> {
        await this.dynamoDb.dynamoDBDocumentClient().send(new DeleteCommand({ TableName: this.tableName, Key: { id } }))
    }

}



@Injectable()
export class PersonRepository extends DynamoRepository<Person>{
    constructor(private readonly _dynamoDb: DynamoDb,
        private readonly _configService: ConfigService) {
        const entity = new Person()
        super(_dynamoDb, _configService, entity.constructor.name)
    }
}
