import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AllStatDto } from '../stats/allStat.dto';
import { StatDto } from '../stats/stat.dto';
import { AllTimeStatService } from './allTimeStats.service';

@Controller('alltimestats')
export class AllTimeStatController {
  constructor(private readonly statService: AllTimeStatService) {}
  @Get()
  async getAll(
    @Query('limit') limit: number,
    @Query('interval') interval: string,
  ): Promise<AllStatDto> {
    try {
      return await this.statService.getAllStats();
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting alltimestat stats',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
