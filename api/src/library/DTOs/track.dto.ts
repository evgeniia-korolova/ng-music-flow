import { PartialType, PickType } from '@nestjs/mapped-types';
import { TrackEntity } from '../entities/track.entity';

export class TrackUploadDto extends PickType(TrackEntity, [
  'title',
  'artist',
  'genre',
] as const) {}

export class TrackUpdateDto extends PartialType(TrackUploadDto) {}

export interface NestMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
