import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  Res,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/media.dto';
import { HttpResponse } from '../utils/response.util';
import { Response } from 'express';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  @Inject(HttpResponse) private readonly httpResponse: HttpResponse;

  @ApiOperation({ summary: 'Create a Media' })
  @Post('create')
  async createMedia(@Res() res: Response, @Body() dto: CreateMediaDto) {
    const data = await this.mediaService.createMedia(dto);
    return this.httpResponse.createdResponse(
      res,
      data,
      'Media created successfully',
    );
  }

  @ApiOperation({ summary: 'Get all Media' })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @Get()
  async allMedia(
    @Res() res: Response,
    @Query('pageNumber') page = 1,
    @Query('perPage') perPage = 12,
  ) {
    const data = await this.mediaService.allMedia(page, perPage);
    return this.httpResponse.okResponse(res, data, 'Medias fetched');
  }

  @ApiOperation({ summary: 'Search Media' })
  @ApiQuery({ name: 'query', required: false })
  @Get('search')
  async searchMedia(@Res() res: Response, @Query('query') query: string) {
    const data = await this.mediaService.searchMedia(query);
    return this.httpResponse.okResponse(res, data, 'Media(s) fetched');
  }

  @ApiOperation({ summary: 'Get a Media' })
  @Get(':mediaId')
  async getMedia(@Res() res: Response, @Param('mediaId') mediaId: string) {
    const data = await this.mediaService.getMedia(mediaId);
    return this.httpResponse.okResponse(res, data, 'Media fetched');
  }

  @ApiOperation({ summary: 'Update a Media' })
  @Patch(':mediaId')
  async updateMedia(@Res() res: Response, @Param('mediaId') mediaId: string) {
    const data = await this.mediaService.updateMedia(mediaId);
    return this.httpResponse.okResponse(res, data, 'Media updated');
  }

  @ApiOperation({ summary: 'Delete a Media' })
  @Patch('delete/:mediaId')
  async deleteMedia(@Res() res: Response, @Param('mediaId') mediaId: string) {
    const data = await this.mediaService.deleteMedia(mediaId);
    return this.httpResponse.okResponse(res, data, 'Media deleted');
  }
}
