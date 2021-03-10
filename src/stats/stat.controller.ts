import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { StatDto } from './stat.dto';
import { StatService } from './stat.service';

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
  async getAll(@Query('limit') limit: number): Promise<StatDto[]> {
    try {
      return await this.statService.getAll(limit);
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
}
