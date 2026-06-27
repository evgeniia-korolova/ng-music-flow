import {
  IsString,
  IsArray,
  IsIn,
  IsInt,
  Min,
  IsOptional,
  ValidateNested,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TrackOrderPayloadDto {
  @IsString()
  trackId!: string;

  @IsString()
  @IsIn(['JAMENDO', 'LOCAL'])
  origin!: 'JAMENDO' | 'LOCAL';

  @IsInt()
  @Min(0)
  order!: number;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  waveform?: number[];
}

export class CreatePlaylistDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ArrayNotEmpty({
    message: 'A playlist must be created with at least one track.',
  })
  @ValidateNested({ each: true })
  @Type(() => TrackOrderPayloadDto)
  tracks!: TrackOrderPayloadDto[];
}

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackOrderPayloadDto)
  tracks?: TrackOrderPayloadDto[];
}
