import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';

@Entity('history')
@Index(['userId', 'trackId', 'origin'], { unique: true })
export class HistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.listeningHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  trackId!: string;

  @Column()
  origin!: 'JAMENDO' | 'LOCAL';

  @UpdateDateColumn()
  playedAt!: Date;
}
