import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaService } from '../prisma.service';
import { HttpResponse } from '../utils/response.util';

@Module({
  controllers: [MediaController],
  providers: [MediaService, PrismaService, HttpResponse],
})
export class MediaModule {}
