import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import helmet from 'helmet';
import * as compression from 'compression';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { PrismaClientExceptionFilter } from './exceptions/prisma-exception.filter';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NODE_ENV } from './config/env.config';
import { setupSwagger } from './config/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages:
        process.env.NODE_ENV === 'production' ? true : false,
    }),
  );

  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaClientExceptionFilter(),
  );
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms'),
  );
  if (NODE_ENV !== 'production') {
    setupSwagger(app);
  }
  app.enableShutdownHooks();
  await app.listen(process.env.PORT);
}

bootstrap().then(() => {
  console.info(`
  -------------------------------------------
  Server Application Started!
  BASE URL: http://localhost:${process.env.PORT}
  DOCS: http://localhost:${process.env.PORT}/docs
  -------------------------------------------
  `);
});
