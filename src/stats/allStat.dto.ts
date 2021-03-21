import { StatDto } from './stat.dto';

export class AllStatDto {
  stats: StatDto[];
  avgStats: StatDto;
  maxStats: StatDto;
}
