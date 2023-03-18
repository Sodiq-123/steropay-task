import { ApiProperty } from '@nestjs/swagger';
import { MediaStatus, MediaType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The title of the media',
    example: 'My first video',
  })
  title: string;

  @IsNotEmpty()
  @IsEnum(MediaType, { message: 'Invalid media type' })
  @ApiProperty({
    type: MediaType,
    description: 'The type of the media',
    enum: MediaType,
    example: 'VIDEO',
  })
  type: MediaType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The description of the media',
    example: 'This is my first video',
  })
  description: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    type: String,
    description: 'The url of the media',
    example: 'https://www.youtube.com/watch?v=1',
  })
  url: string;
}
