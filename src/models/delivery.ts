import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./order";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class DeliveryAddress {
    @PrimaryColumn()
    @Field(type => String)
    addressId: string;

    @Column()
    @Field(type => String)
    addressLine1: string;


    // @Column()
    //orderId: string;

    
    @OneToOne(() => Order, (order) => order.deliveryAddress)
    @JoinColumn({name: "orderId"})
    @Field(type => Order)
    order: Order;
}