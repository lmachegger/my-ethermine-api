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

  @Post()
  async create(@Body() dtos: StatDto[]): Promise<StatDto[]> {
    try {
      return await this.statService.createAll(dtos);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creating multiple alltimestats entry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAll(): Promise<AllStatDto> {
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
