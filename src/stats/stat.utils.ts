import { AllTimeStatEntity } from 'src/allTimeStats/allTimeStats.entity';
import { AllTimeStatService } from 'src/allTimeStats/allTimeStats.service';
import { StatDto } from './stat.dto';
import { StatEntity } from './stat.entity';

export enum StatInterval {
  ALL = 'ALL',
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
}

export const MIN_ALLTIME_STAT_ENTITY: AllTimeStatEntity = {
  id: null,
  averageHashrate: '0',
  currentHashrate: '0',
  reportedHashrate: '0',
  validShares: 0,
  staleShares: 0,
  invalidShares: 0,
  btcPerMin: '0',
  usdPerMin: '0',
  coinsPerMin: '0',
  time: null,
  isMaxEntity: true,
};

export function dtoToStat(dto: StatDto): StatEntity {
  const stat = new StatEntity();
  stat.averageHashrate = dto.averageHashrate?.toString();
  stat.btcPerMin = dto.btcPerMin?.toString();
  stat.coinsPerMin = dto.coinsPerMin?.toString();
  stat.currentHashrate = dto.currentHashrate?.toString();
  stat.id = dto.id;
  stat.invalidShares = dto.invalidShares;
  stat.reportedHashrate = dto.reportedHashrate?.toString();
  stat.staleShares = dto.staleShares;
  stat.time = dto.time;
  stat.usdPerMin = dto.usdPerMin?.toString();
  stat.validShares = dto.validShares;
  return stat;
}

export function statToDto(stat: StatEntity): StatDto {
  const dto = new StatDto();
  dto.averageHashrate = +stat.averageHashrate;
  dto.btcPerMin = +stat.btcPerMin;
  dto.coinsPerMin = +stat.coinsPerMin;
  dto.currentHashrate = +stat.currentHashrate;
  dto.id = stat.id;
  dto.invalidShares = stat.invalidShares;
  dto.reportedHashrate = +stat.reportedHashrate;
  dto.staleShares = stat.staleShares;
  dto.time = stat.time;
  dto.usdPerMin = +stat.usdPerMin;
  dto.validShares = stat.validShares;
  return dto;
}

export function mapStatsToDto(stats: StatEntity[]): StatDto[] {
  return stats.map((stat) => statToDto(stat));
}

export function mapStatsToHumanReadableDto(stats: StatEntity[]): StatDto[] {
  return stats.map((stat) => {
    return dtoToHumanReadableDto(statToDto(stat));
  });
}

export function calculateAverage(stats: StatEntity[]): StatDto {
  let reportedHashrate = 0;
  let currentHashrate = 0;
  let validShares = 0;
  let invalidShares = 0;
  let staleShares = 0;
  let averageHashrate = 0;
  let coinsPerMin = 0;
  let usdPerMin = 0;
  let btcPerMin = 0;

  stats.forEach((stat) => {
    reportedHashrate += +stat.reportedHashrate;
    currentHashrate += +stat.currentHashrate;
    averageHashrate += +stat.averageHashrate;
    validShares += stat.validShares;
    invalidShares += stat.invalidShares;
    staleShares += stat.staleShares;
    coinsPerMin += +stat.coinsPerMin;
    usdPerMin += +stat.usdPerMin;
    btcPerMin += +stat.btcPerMin;
  });

  const result = new StatDto();
  result.reportedHashrate = reportedHashrate / stats.length;
  result.currentHashrate = currentHashrate / stats.length;
  result.averageHashrate = averageHashrate / stats.length;
  result.validShares = validShares / stats.length;
  result.invalidShares = invalidShares / stats.length;
  result.staleShares = staleShares / stats.length;
  result.coinsPerMin = coinsPerMin / stats.length;
  result.usdPerMin = usdPerMin / stats.length;
  result.btcPerMin = btcPerMin / stats.length;

  return dtoToHumanReadableDto(result);
}

export function calculateMax(stats: StatEntity[]): StatDto {
  let reportedHashrate = 0;
  let currentHashrate = 0;
  let validShares = 0;
  let invalidShares = 0;
  let staleShares = 0;
  let averageHashrate = 0;
  let coinsPerMin = 0;
  let usdPerMin = 0;
  let btcPerMin = 0;

  stats.forEach((stat) => {
    reportedHashrate = Math.max(+stat.reportedHashrate, reportedHashrate);
    currentHashrate = Math.max(+stat.currentHashrate, currentHashrate);
    averageHashrate = Math.max(+stat.averageHashrate, averageHashrate);
    validShares = Math.max(stat.validShares, validShares);
    invalidShares = Math.max(stat.invalidShares, invalidShares);
    staleShares = Math.max(stat.staleShares, staleShares);
    coinsPerMin = Math.max(+stat.coinsPerMin, coinsPerMin);
    usdPerMin = Math.max(+stat.usdPerMin, usdPerMin);
    btcPerMin = Math.max(+stat.btcPerMin, btcPerMin);
  });

  const result = new StatDto();
  result.reportedHashrate = reportedHashrate;
  result.currentHashrate = currentHashrate;
  result.averageHashrate = averageHashrate;
  result.validShares = validShares;
  result.invalidShares = invalidShares;
  result.staleShares = staleShares;
  result.coinsPerMin = coinsPerMin;
  result.usdPerMin = usdPerMin;
  result.btcPerMin = btcPerMin;

  return dtoToHumanReadableDto(result);
}

export function dtoToHumanReadableDto(dto: StatDto): StatDto {
  const result = dto;
  result.reportedHashrate /= 1000000;
  result.currentHashrate /= 1000000;
  result.averageHashrate /= 1000000;
  result.coinsPerMin *= 60;
  result.usdPerMin *= 60;
  result.btcPerMin *= 60;
  return result;
}

// returns UNIX timestamp of given interval
export function getMinUnixTimeByInterval(interval: StatInterval): number {
  const d = new Date();
  let unixTime = 0;
  switch (interval) {
    case StatInterval.ALL:
      return 0;
    case StatInterval.YEAR:
      unixTime = d.setFullYear(d.getFullYear() - 1);
      break;
    case StatInterval.MONTH:
      unixTime = d.setMonth(d.getMonth() - 1);
      break;
    case StatInterval.WEEK:
      unixTime = d.setDate(d.getDate() - 7);
      break;
    case StatInterval.DAY:
      unixTime = d.setDate(d.getDate() - 1);
      break;
  }

  unixTime /= 1000; // ms to s
  return Math.round(unixTime);
}

export function dtoToAllTimeStatMaxEntity(dto: StatDto): AllTimeStatEntity {
  const ent = new AllTimeStatEntity();
  ent.averageHashrate = (dto.averageHashrate * 1000000).toString();
  ent.btcPerMin = (dto.btcPerMin / 60).toString();
  ent.coinsPerMin = (dto.coinsPerMin / 60).toString();
  ent.currentHashrate = (dto.currentHashrate * 1000000).toString();
  ent.invalidShares = dto.invalidShares;
  ent.reportedHashrate = (dto.reportedHashrate * 1000000).toString();
  ent.staleShares = dto.staleShares;
  ent.usdPerMin = (dto.usdPerMin / 60).toString();
  ent.validShares = dto.validShares;
  ent.time = null;
  ent.isMaxEntity = true;

  return ent;
}
