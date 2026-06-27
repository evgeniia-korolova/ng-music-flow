import { UserEntity } from 'src/users/entities/user.entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

export interface PlaylistTrackReference {
  trackId: string;
  origin: 'JAMENDO' | 'LOCAL';
  order: number;
  coverUrl?: string;
  waveform?: number[];
}

@Entity('playlists')
@Unique(['userId', 'name'])
export class PlaylistEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.playlists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('jsonb', { default: [] })
  tracks!: PlaylistTrackReference[];

  @Column({ type: 'int', default: 0 })
  totalDuration!: number;

  @Column({ type: 'int', default: 0 })
  trackCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
