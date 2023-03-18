import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/media.dto';
import { PrismaService } from 'src/prisma.service';
import { MediaStatus } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}
  async createMedia(dto: CreateMediaDto) {
    try {
      const uniqueMedia = await this.prisma.media.findUnique({
        where: {
          url: dto.url,
        },
      });

      if (uniqueMedia) {
        throw new BadRequestException('Media already exists');
      }

      const media = await this.prisma.media.create({
        data: {
          title: dto.title,
          type: dto.type,
          description: dto.description,
          url: dto.url,
        },
      });

      return media;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async allMedia(page: number, perPage: number) {
    try {
      const media = await this.prisma.media.findMany({
        where: {
          deleted: false,
        },
        skip: (page - 1) * perPage,
        take: Number(perPage) || 12,
        orderBy: { createdAt: 'desc' },
      });

      return media;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getMedia(id: string) {
    try {
      const media = await this.prisma.media.findFirst({
        where: {
          id,
          deleted: false,
        },
      });

      if (!media) {
        throw new NotFoundException('Media not found');
      }

      return media;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async searchMedia(query: string) {
    try {
      const results = await this.prisma.media.findMany({
        where: {
          OR: [{ title: { contains: query } }, { url: { contains: query } }],
        },
      });

      if (!results) {
        throw new NotFoundException('No search results found');
      }

      return results;
    } catch (error) {
      console.log(error.message);
      return new BadRequestException(error.message);
    }
  }

  async updateMedia(id: string) {
    try {
      const media = await this.prisma.media.update({
        where: {
          id,
        },
        data: {
          status: MediaStatus.INACTIVE,
        },
      });

      return media;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async deleteMedia(id: string) {
    try {
      const media = await this.prisma.media.update({
        where: {
          id,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });

      return media;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
