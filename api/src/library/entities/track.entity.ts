import { IsNotEmpty, IsString, Length } from 'class-validator';
import { trimAndSanitize } from 'src/common/utils/sanitize.util';
import { Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tracks')
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ unique: true })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @Transform(trimAndSanitize)
  @Length(1, 100)
  title!: string;

  @Column()
  @IsNotEmpty({ message: 'Artist name is required' })
  @IsString()
  @Transform(trimAndSanitize)
  @Length(1, 100)
  artist!: string;

  @Column()
  @IsNotEmpty({ message: 'Genre is required' })
  @IsString()
  @Transform(trimAndSanitize)
  @Length(2, 30)
  genre!: string;

  @Column({ type: 'simple-array', nullable: true })
  waveform!: number[];

  @Column()
  url!: string;

  @Column({ type: 'int', default: 0 })
  duration!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
