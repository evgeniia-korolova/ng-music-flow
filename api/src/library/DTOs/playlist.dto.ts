import {
  IsString,
  IsArray,
  IsIn,
  IsInt,
  Min,
  IsOptional,
  ValidateNested,
  ArrayNotEmpty,
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

export class UpdatePlaylistTracksDto {
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
  sortedTracks?: TrackOrderPayloadDto[];
}
