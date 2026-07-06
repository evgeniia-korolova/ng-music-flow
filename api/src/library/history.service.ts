import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntity } from './entities/history.entity';
import { HistoryModel } from './models/history.model';
import { TracksService } from './tracks.service';
import { JamendoService } from 'src/jamendo/jamendo.service';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly repo: Repository<HistoryEntity>,
    private readonly tracksService: TracksService,
    private readonly jamendoService: JamendoService,
  ) {}

  async upsertHistory(
    userId: string,
    trackId: string,
    origin: 'JAMENDO' | 'LOCAL',
  ): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .values({ userId, trackId, origin })
      .orUpdate(['playedAt'], ['userId', 'trackId', 'origin'])
      .execute();
  }

  async getHistory(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<HistoryModel[]> {
    const history = await this.repo.find({
      where: { userId },
      order: { playedAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const hydrated = await Promise.all(
      history.map(async (h) => {
        const track =
          h.origin === 'LOCAL'
            ? await this.tracksService.getLocalTrack(userId, h.trackId)
            : await this.jamendoService.getTrackById(h.trackId);

        return track
          ? {
              track,
              origin: h.origin,
              playedAt: h.playedAt.toISOString(),
            }
          : null;
      }),
    );

    return hydrated.filter((item): item is HistoryModel => item !== null);
  }
}
