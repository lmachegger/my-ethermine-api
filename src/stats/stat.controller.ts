import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AllStatDto } from './allStat.dto';
import { StatDto } from './stat.dto';
import { StatService } from './stat.service';
import { StatInterval } from './stat.utils';

@Controller('stats')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Post()
  async create(@Body() dto: StatDto): Promise<StatDto> {
    try {
      return await this.statService.create(dto);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creating stat entry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAll(
    @Query('limit') limit: number,
    @Query('interval') interval: string,
  ): Promise<StatDto[]> {
    try {
      if (!StatInterval[interval]) {
        interval = StatInterval.NONE;
      }
      return await this.statService.getAll(limit, StatInterval[interval]);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting stat entry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('allStats')
  async getAllStats(@Query('interval') interval: string): Promise<AllStatDto> {
    try {
      if (!StatInterval[interval]) {
        interval = StatInterval.ALL;
      }
      return await this.statService.getAllStats(StatInterval[interval]);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting allStats',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('average')
  async getAvg(): Promise<StatDto> {
    try {
      return await this.statService.getAvg();
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting avg',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('max')
  async getMax(): Promise<StatDto> {
    try {
      return await this.statService.getMax();
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting max',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    try {
      return await this.statService.delete(id);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error deleting stats',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Delete('deleteOldStats')
  // async deleteOldStats(): Promise<any> {
  //   try {
  //     return await this.statService.deleteEveryStatOlderThanOneMonth();
  //   } catch (e) {
  //     console.error(e);
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.INTERNAL_SERVER_ERROR,
  //         error: 'Error deleting stats',
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
