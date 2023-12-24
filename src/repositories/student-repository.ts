import { Student } from "src/models/student";
import { CrudRepository } from "./crud-repository";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class StudentRepository implements CrudRepository<Student, String>{

    constructor(@InjectModel(Student.name) private studentModel: Model<Student>) {

    }
    async save(entity: Student): Promise<Student> {
        const model = new this.studentModel(entity)
        return model.save()
    }
    async findById(id: String): Promise<Student> {
        const student = await this.studentModel.findById(id)
        student.studentId = student._id.toHexString()
        return student
    }
    async findAll(filters: string, orderBys: string, limit: number = 100, offset: number = 0): Promise<Student[]> {
        const students = await this.studentModel.find({
            name: {
                $eq: "abc"
            },
            age: {
                $gt: 30
            }
        }).sort({ age: -1 }).skip(offset).limit(limit)
        return students
    }
    async deleteById(id: String): Promise<void> {
        throw new Error("not implemented")
        //return this.studentModel.dele
    }

}