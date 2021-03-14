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
