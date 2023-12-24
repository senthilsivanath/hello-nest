import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ForbiddenException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { RadicalException } from './radical-exception';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(RadicalException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: RadicalException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url + "rad",
            });
    }
}

@Catch(BadRequestException)
export class HttpForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
               
        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                errors : exception.getResponse()["message"],
                path: request.url + "badreq",
            });
    }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        console.log(exception)
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
                
        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()) + "all",
        };


        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}