import { StatDto } from 'src/stats/stat.dto';
import { AllTimeStatEntity } from './allTimeStats.entity';

export function dtoToAllTimeStatMaxEntity(dto: StatDto): AllTimeStatEntity {
  const ent = new AllTimeStatEntity();
  ent.averageHashrate = (dto.averageHashrate * 1000000).toString();
  ent.btcPerMin = (dto.btcPerHour / 60).toString();
  ent.coinsPerMin = (dto.coinsPerHour / 60).toString();
  ent.currentHashrate = (dto.currentHashrate * 1000000).toString();
  ent.invalidShares = dto.invalidShares;
  ent.reportedHashrate = (dto.reportedHashrate * 1000000).toString();
  ent.staleShares = dto.staleShares;
  ent.usdPerMin = (dto.usdPerHour / 60).toString();
  ent.validShares = dto.validShares;
  ent.time = null;
  ent.isMaxEntity = true;

  return ent;
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
