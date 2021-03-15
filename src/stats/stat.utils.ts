import { StatDto } from './stat.dto';
import { StatEntity } from './stat.entity';

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

  return result;
}
