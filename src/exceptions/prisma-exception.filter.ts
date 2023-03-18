import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';

/**
 *
 * {@link PrismaClientExceptionFilter} handling {@link rismaClientKnownRequestError} exceptions.
 *
 * Error codes definition for Prisma Client (Query Engine)
 * https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
 */
@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (process.env.NODE_ENV !== 'production') {
      console.log(exception);
    }

    switch (exception.code) {
      case 'P2000':
        this.catchValueTooLong(exception, response);
        break;
      case 'P2002':
        this.catchUniqueConstraint(exception, response);
        break;
      case 'P2003':
        this.catchFKConflictConstraint(exception, response);
        break;
      case 'P2025':
        this.catchNotFound(exception, response);
        break;
      default:
        this.unhandledException(exception, response);
        break;
    }
  }

  /**
   * Catches P2000 error code
   * https://www.prisma.io/docs/reference/api-reference/error-reference#p2000
   *
   * @param exception P2000
   * @param response 400 Bad Request
   */
  catchValueTooLong(
    exception: PrismaClientKnownRequestError,
    response: Response,
  ) {
    const status = HttpStatus.BAD_REQUEST;
    response.status(status).json({
      statusCode: status,
      message: this.cleanUpException(exception),
      status: false,
    });
  }

  /**
   * Catches P2002 error code
   * https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
   *
   * @param exception P2002
   * @param response 409 Conflict
   */
  catchUniqueConstraint(
    exception: PrismaClientKnownRequestError,
    response: Response,
  ) {
    const status = HttpStatus.CONFLICT;
    response.status(status).json({
      statusCode: status,
      message: 'An unknown error occurred.',
      devMessage: 'Record already exists.',
      status: false,
    });
  }

  /**
   * Catches P2003 error code
   * https://www.prisma.io/docs/reference/api-reference/error-reference#p2003
   *
   * @param exception P2003
   * @param response 400 Bad Request
   */
  catchFKConflictConstraint(
    exception: PrismaClientKnownRequestError,
    response: Response,
  ) {
    const status = HttpStatus.BAD_REQUEST;
    response.status(status).json({
      statusCode: status,
      message: 'An unknown error occurred.',
      devMessage: 'Invalid record relationship attempted.',
      status: false,
    });
  }

  /**
   * Catches P2025 error code
   * https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
   *
   * @param exception P2025
   * @param response 404 Not Found
   */
  catchNotFound(exception: PrismaClientKnownRequestError, response: Response) {
    const status = HttpStatus.NOT_FOUND;
    response.status(status).json({
      statusCode: status,
      message: 'An unknown error occurred.',
      status: false,
    });
  }

  unhandledException(
    exception: PrismaClientKnownRequestError,
    response: Response,
  ) {
    // default 500 error code
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
      status: false,
    });
  }

  /**
   *
   * @param exception
   * @returns replace line breaks with empty string
   */
  cleanUpException(exception: PrismaClientKnownRequestError): string {
    return exception.message.replace(/\n/g, '');
  }
}
