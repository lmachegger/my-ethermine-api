import { StatDto } from './stat.dto';
import { StatEntity } from './stat.entity';

export function dtoToStat(dto: StatDto): StatEntity {
  const stat = dto as StatEntity;
  return stat;
}

export function statToDto(stat: StatEntity): StatDto {
  const dto = stat as StatDto;
  return dto;
}

export function mapStatsToDto(stats: StatEntity[]): StatDto[] {
  return stats.map((stat) => statToDto(stat));
}
