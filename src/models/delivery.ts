import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./order";

@Entity()
export class DeliveryAddress {
    @PrimaryColumn()
    addressId: string;

    @Column()
    addressLine1: string;


    // @Column()
    //orderId: string;

    
    @OneToOne(() => Order, (order) => order.deliveryAddress)
    @JoinColumn({name: "orderId"})
    order: Order;
}