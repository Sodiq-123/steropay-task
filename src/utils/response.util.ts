import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class HttpResponse {
  createdResponse(res: Response, data: any, message: string) {
    return res.status(HttpStatus.CREATED).send({
      success: true,
      message,
      data,
    });
  }

  okResponse(res: Response, data: any, message: string) {
    return res.status(HttpStatus.OK).send({
      success: true,
      message,
      data,
    });
  }
}
