import { Prop, Schema, SchemaFactory,  } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Document, ObjectId } from "mongoose";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
//import mongoose, { HydratedDocument, Schema as S, SchemaTypes } from "mongoose";

export type StudentDocument = HydratedDocument<Student>;

export class Department{
    @Prop()
    departmentName: string;
}

@Schema()
export class Student  {
    

    // @Prop()
    // _id: string = UUID.generate().toString()

    @Prop()                      
    studentId: string;

    @Prop()
    name: string;

    @Prop()
    age: number;

    @Prop()
    department: Department
}




export const StudentSchema = SchemaFactory.createForClass(Student);


// StudentSchema.virtual('studentId').get(function() {
//     return this._id;
// });