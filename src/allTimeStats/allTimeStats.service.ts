import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { AllStatDto } from '../stats/allStat.dto';
import { apiObjectToDto, fetchFromApi } from '../stats/fetch-stats.utils';
import { StatDto } from '../stats/stat.dto';
import {
  calculateAverage,
  calculateMax,
  dtoToStat,
  getMinUnixTimeByInterval,
  mapStatsToHumanReadableDto,
  StatInterval,
  statToDto,
} from '../stats/stat.utils';
import { AllTimeStatEntity } from './allTimeStats.entity';

@Injectable()
export class AllTimeStatService {
  private interval: any;

  constructor(
    @InjectRepository(AllTimeStatEntity)
    private statRepo: Repository<AllTimeStatEntity>,
  ) {
    const fetchInterval = () => {
      this.fetchApiAndCreateStat();
    };

    fetchInterval();
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(fetchInterval, 14400 * 1000); // 4h
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

  async createAll(dtos: StatDto[]): Promise<StatDto[]> {
    const result = new Array();
    for await (const dto of dtos) {
      const created = await this.create(dto);
      result.push(created);
    }
    return result;
  }

  // returns allStats, avgStats, and maxStats
  async getAllStats(): Promise<AllStatDto> {
    const statEntities = await this.statRepo.find({
      order: {
        time: 'DESC',
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
}
