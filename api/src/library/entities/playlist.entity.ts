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
}

@Entity('playlists')
export class PlaylistEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('jsonb', { default: [] })
  tracks!: PlaylistTrackReference[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
