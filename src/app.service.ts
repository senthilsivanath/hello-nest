import { Injectable } from '@nestjs/common';
import { Order } from './models/order';
import { ConfigService } from '@nestjs/config';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Department, Student } from './models/student';
import mongoose, { Model, ObjectId } from 'mongoose';
import { StudentRepository } from './repositories/student.repository';
import { Publisher } from './events/publisher';


@Injectable()
export class AppService {

  constructor(private readonly configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private studentRepository: StudentRepository,
    //private eventPublisher: Publisher
  ) {

  }

  getHello(): string {
    const host = this.configService.get<string>("db.postgres.url")
    return 'Hello World!';
  }

  async getOrders(): Promise<Order[]> {

   
    return null
  }

  async getOrder(orderId: string): Promise<Order> {

    // const student = await this.studentRepository.findById("65349e416dbd3d13b081ab56")
    // console.log(student)

    //const students = await this.studentRepository.findAll("", "")

    //console.log(students)

    //console.log(student["_id"])
    //student.studentId = new ObjectId(student["_id"].toString()).toHexString()
    //console.log(student._id.toHexString())
    
    const orders = await this.orderRepository.find({
      where: {
        orderId,
      },
      relations: {
        orderlines: true,
        // customer: true,
        deliveryAddress: true
      }
    })

    return orders[0]
  }

  async saveOrder(order: Order) {
    //await this.eventPublisher.sendMessage(12)
    let student = new Student()
    //const { ObjectId } = mongoose.Types;
    //student.studentId = new mongoose.Types.ObjectId("64b0ee2c189286a5abc6b4ba").toString()
    student.name = "Senthil"
    student.department = new Department();
    student.department.departmentName = "defsdf";
    student.age = 23
    await this.studentRepository.save(student)

    await this.orderRepository.save(order)
  }
}
