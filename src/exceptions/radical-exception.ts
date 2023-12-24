import { HttpException, HttpStatus } from "@nestjs/common";

export class RadicalException extends HttpException{
    constructor() {
        super('Forbidden', HttpStatus.INTERNAL_SERVER_ERROR);
      }
}