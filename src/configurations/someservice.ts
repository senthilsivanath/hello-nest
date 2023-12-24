import { Injectable } from "@nestjs/common";

@Injectable()
export class SomeService {
    someMethod(): string {
        return "av"
    }
}