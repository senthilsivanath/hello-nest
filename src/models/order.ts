import { Type } from "class-transformer";
import { IsArray, IsDefined, IsEmail, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, ColumnOptions } from "typeorm";
import { DeliveryAddress } from "./delivery";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity()
export class Customer {

    @PrimaryColumn()
    customerId: string;

    @MinLength(5)
    @IsDefined()
    @Column()
    name: string;

    @Max(100)
    @Min(1)
    @Column()
    age: number;


    // @OneToMany(() => Order, order => order.customer)
    // orders: Order[];
}


@Entity()
@ObjectType()
export class Order {
    @IsString()
    @MinLength(4)
    @Column()
    @PrimaryColumn()
    @Field(type => String)
    orderId: string;

    @Column({ default: null })
    @Field(type => String)
    description: string

    // @Column()
    // customerId: string;

    // @ManyToOne(type => Customer, customer => customer.orders)
    // @JoinColumn({ name: "customerId" })
    // customer: Customer;


    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderLine)
    @OneToMany(() => OrderLine, orderline => orderline.order, { cascade: true })
    @Field(type => [OrderLine])
    orderlines: OrderLine[];

    @OneToOne(() => DeliveryAddress, deliveryAddress => deliveryAddress.order, { cascade: true, })
    @Field(type => DeliveryAddress)
    deliveryAddress: DeliveryAddress;

}

@Entity()
@ObjectType()
export class OrderLine {

    @Column()
    @PrimaryColumn()
    @Field(type => String)
    orderlineId: string;

    @IsString()
    @MinLength(2)
    @Field(type => String)
    skuId: string;

    @ManyToOne(() => Order, (order) => order.orderlines)    
    @JoinColumn({ name: "orderId" })
    @Field(type => Order)
    order: Order;

}

