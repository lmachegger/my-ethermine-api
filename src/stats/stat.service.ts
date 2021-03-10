import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { apiObjectToDto, fetchFromApi } from './fetch-stats.utils';
import { StatDto } from './stat.dto';
import { StatEntity } from './stat.entity';
import { dtoToStat, mapStatsToDto, statToDto } from './stat.utils';

@Injectable()
export class StatService {
  private interval: any;

  constructor(
    @InjectRepository(StatEntity)
    private statRepo: Repository<StatEntity>,
  ) {
    const fetchInterval = () => {
      this.fetchApiAndCreateStat();
    };

    fetchInterval();
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(fetchInterval, 300000); // 5min
  }

  fetchApiAndCreateStat() {
    fetchFromApi(
      (data) => {
        const dto = apiObjectToDto(data);
        this.create(dto);
      },
      (error) => {
        console.error('error happened while fetching: ', error);
      },
    );
  }

  async create(dto: StatDto): Promise<StatDto> {
    // dont allow duplicate entries
    const statWithTime = await this.statRepo.findOne({
      time: dto.time,
    });
    if (statWithTime) return;

    const stat = dtoToStat(dto);
    const saved = await this.statRepo.save(stat);
    const savedDto = statToDto(saved);
    return savedDto;
  }

  async getAll(limit: number): Promise<StatDto[]> {
    const stats = await this.statRepo.find({
      order: {
        time: 'DESC',
      },
      take: limit,
    });

    return mapStatsToDto(stats);
  }
}
