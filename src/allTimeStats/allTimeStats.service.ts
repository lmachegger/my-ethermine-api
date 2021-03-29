import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { AllStatDto } from '../stats/allStat.dto';
import { apiObjectToDto, fetchFromApi } from '../stats/fetch-stats.utils';
import { StatDto } from '../stats/stat.dto';
import {
  calculateAverage,
  calculateMax,
  dtoToHumanReadableDto,
  dtoToStat,
  mapStatsToHumanReadableDto,
  statToDto,
} from '../stats/stat.utils';
import { AllTimeStatEntity } from './allTimeStats.entity';
import { StatEntity } from 'src/stats/stat.entity';
import {
  dtoToAllTimeStatMaxEntity,
  MIN_ALLTIME_STAT_ENTITY,
} from './allTimeStats.utils';

@Injectable()
export class AllTimeStatService {
  private interval: any;
  private maxInterval: any;

  constructor(
    @InjectRepository(AllTimeStatEntity)
    private allTimeStatRepo: Repository<AllTimeStatEntity>,
    @InjectRepository(StatEntity)
    private statRepo: Repository<StatEntity>,
  ) {
    // fetch every 4h
    const fetchInterval = () => {
      this.fetchApiAndCreateStat();
    };

    fetchInterval();
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(fetchInterval, 14400 * 1000); // 4h

    // fetch every 24h
    const fetchMaxInterval = () => {
      this.fetchMaxAndCreateStat();
    };
    fetchMaxInterval();
    if (this.maxInterval) {
      clearInterval(this.maxInterval);
    }
    this.maxInterval = setInterval(fetchMaxInterval, 600 * 1000); // 10min
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

  async fetchMaxAndCreateStat() {
    const all = await this.statRepo.find();
    const newMaxDto = calculateMax(all);

    const oldMaxEntity =
      (await this.allTimeStatRepo.findOne({
        isMaxEntity: true,
        time: null,
      })) || MIN_ALLTIME_STAT_ENTITY;
    const oldMaxDto = dtoToHumanReadableDto(statToDto(oldMaxEntity));

    // check all values, and update max dto
    oldMaxDto.averageHashrate = Math.max(
      newMaxDto.averageHashrate,
      oldMaxDto.averageHashrate,
    );
    oldMaxDto.btcPerHour = Math.max(newMaxDto.btcPerHour, oldMaxDto.btcPerHour);
    oldMaxDto.coinsPerHour = Math.max(
      newMaxDto.coinsPerHour,
      oldMaxDto.coinsPerHour,
    );
    oldMaxDto.currentHashrate = Math.max(
      newMaxDto.currentHashrate,
      oldMaxDto.currentHashrate,
    );
    oldMaxDto.invalidShares = Math.max(
      newMaxDto.invalidShares,
      oldMaxDto.invalidShares,
    );
    oldMaxDto.reportedHashrate = Math.max(
      newMaxDto.reportedHashrate,
      oldMaxDto.reportedHashrate,
    );
    oldMaxDto.staleShares = Math.max(
      newMaxDto.staleShares,
      oldMaxDto.staleShares,
    );
    oldMaxDto.usdPerHour = Math.max(newMaxDto.usdPerHour, oldMaxDto.usdPerHour);
    oldMaxDto.validShares = Math.max(
      newMaxDto.validShares,
      oldMaxDto.validShares,
    );
    const allTimeStatMaxEntity = dtoToAllTimeStatMaxEntity(oldMaxDto);
    allTimeStatMaxEntity.id = oldMaxDto.id;

    await this.allTimeStatRepo.save(allTimeStatMaxEntity);
  }

  async create(dto: StatDto): Promise<StatDto> {
    // dont allow duplicate entries
    const statWithTime = await this.allTimeStatRepo.findOne({
      time: dto.time,
    });
    if (statWithTime) return;

    const stat = dtoToStat(dto);
    const saved = await this.allTimeStatRepo.save(stat);
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
    const statEntities = await this.allTimeStatRepo.find({
      where: {
        time: Not(IsNull()),
        isMaxEntity: IsNull(),
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

  async delete(id: string): Promise<any> {
    return await this.allTimeStatRepo.delete(id);
  }
}
