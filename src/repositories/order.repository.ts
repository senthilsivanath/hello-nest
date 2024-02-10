import { Order } from "src/models/order";
import { Repository } from "typeorm";
import { CrudRepository } from "./crud.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OrderRepository implements CrudRepository<Order, string> {
	constructor(
		@InjectRepository(Order) public orderRepositoryBase: Repository<Order>
	) {}

	async save(entity: Order): Promise<Order> {
		return await this.orderRepositoryBase.save(entity)
	}

	findById(id: string): Promise<Order> {
		return this.orderRepositoryBase.findOne({
			where: {
				['orderId']: id,
			},
		})
	}

	async deleteById(id: string): Promise<void> {
		await this.orderRepositoryBase.delete(id)
	}
}