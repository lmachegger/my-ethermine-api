import { StatDto } from './stat.dto';
import { StatEntity } from './stat.entity';

export function dtoToStat(dto: StatDto): StatEntity {
  const stat = new StatEntity();
  stat.averageHashrate = dto.averageHashrate.toString();
  stat.btcPerMin = stat.btcPerMin.toString();
  stat.coinsPerMin = stat.coinsPerMin.toString();
  stat.currentHashrate = stat.currentHashrate.toString();
  stat.id = stat.id;
  stat.invalidShares = stat.invalidShares;
  stat.reportedHashrate = stat.reportedHashrate.toString();
  stat.staleShares = stat.staleShares;
  stat.time = stat.time;
  stat.usdPerMin = stat.usdPerMin.toString();
  stat.validShares = stat.validShares;
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
