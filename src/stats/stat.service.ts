import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { AllStatDto } from './allStat.dto';
import { apiObjectToDto, fetchFromApi } from './fetch-stats.utils';
import { StatDto } from './stat.dto';
import { StatEntity } from './stat.entity';
import {
  calculateAverage,
  calculateMax,
  dtoToStat,
  getMinUnixTimeByInterval,
  mapStatsToHumanReadableDto,
  StatInterval,
  statToDto,
} from './stat.utils';

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

  // returns allStats, avgStats, and maxStats
  async getAllStats(interval: StatInterval): Promise<AllStatDto> {
    const minTimeStamp = getMinUnixTimeByInterval(interval);
    const statEntities = await this.statRepo.find({
      where: {
        time: MoreThanOrEqual(minTimeStamp),
      },
      order: {
        time: 'ASC',
      },
    });

    const stats = mapStatsToHumanReadableDto(statEntities);
    const avgs = calculateAverage(statEntities);
    const maxs = calculateMax(statEntities);

    const allStatDto = new AllStatDto();
    allStatDto.stats = stats;
    allStatDto.avgStats = avgs;
    allStatDto.maxStats = maxs;

    return allStatDto;
  }

  // returns allStats
  async getAll(limit: number, interval: StatInterval): Promise<StatDto[]> {
    const minTimeStamp = getMinUnixTimeByInterval(interval);
    const stats = await this.statRepo.find({
      where: {
        time: MoreThanOrEqual(minTimeStamp),
      },
      order: {
        time: 'ASC',
      },
      take: limit,
    });

    return mapStatsToHumanReadableDto(stats);
  }

  async getAvg(): Promise<StatDto> {
    const stats = await this.statRepo.find();
    return calculateAverage(stats);
  }

  async getMax(): Promise<StatDto> {
    const stats = await this.statRepo.find();
    return calculateMax(stats);
  }

  async delete(id: string): Promise<any> {
    return await this.statRepo.delete(id);
  }
}
