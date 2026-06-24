import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface PlaylistTrackReference {
  trackId: string;
  origin: 'JAMENDO' | 'LOCAL';
  order: number;
}

@Entity('playlists')
export class PlaylistEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ unique: true })
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
