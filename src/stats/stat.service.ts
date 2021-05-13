import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
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
  reduceNumOfStatsWithInterval,
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
        if (!data?.data?.time) {
          return;
        }
        const dto = apiObjectToDto(data);
        this.create(dto);

        // delete old stats every few minutes
        this.deleteEveryStatOlderThanOneMonth();
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

    const reducedStats = reduceNumOfStatsWithInterval(statEntities, interval);
    const stats = mapStatsToHumanReadableDto(reducedStats);
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

    if (interval !== StatInterval.NONE)
      return mapStatsToHumanReadableDto(
        reduceNumOfStatsWithInterval(stats, interval),
      );

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

  async deleteEveryStatOlderThanOneMonth(): Promise<any> {
    // get timestamp from 1 month before now
    const minTimeStamp = getMinUnixTimeByInterval(StatInterval.MONTH);

    // get all stats older than 1 month
    const statsToDelete = await this.statRepo.find({
      where: {
        time: LessThan(minTimeStamp),
      },
    });
    console.log('num of stats to delete: ' + statsToDelete.length);

    // delete stats
    for await (let stat of statsToDelete) {
      await this.delete(stat.id.toString());
    }

    return `Successfully deleted ${statsToDelete.length} stats.`;
  }
}
