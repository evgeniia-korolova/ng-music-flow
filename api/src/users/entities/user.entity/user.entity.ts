import { PlaylistEntity } from 'src/library/entities/playlist.entity';
import { TrackEntity } from 'src/library/entities/track.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column('text', { array: true, default: ['user'] })
  roles!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ unique: true, nullable: true })
  jamendoId?: string;

  @Column({ select: false, nullable: true })
  jamendoAccessToken?: string;

  @Column({ select: false, nullable: true })
  jamendoRefreshToken?: string;

  @OneToMany(() => TrackEntity, (track) => track.user)
  tracks!: TrackEntity[];

  @OneToMany(() => PlaylistEntity, (playlist) => playlist.user)
  playlists!: PlaylistEntity[];
}
