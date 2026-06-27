import { PartialType, PickType } from '@nestjs/mapped-types';
import { TrackEntity } from '../entities/track.entity';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

// export class TrackUploadDto extends PickType(TrackEntity, [
//   'title',
//   'artist',
//   'genre',
// ] as const) {}

export class TrackUploadBaseDto extends PickType(TrackEntity, [
  'title',
  'artist',
  'genre',
  'url',
] as const) {}

export class TrackUploadDto extends TrackUploadBaseDto {
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  waveform?: number[];
}

export class TrackUpdateDto extends PartialType(TrackUploadDto) {}

export interface NestMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
