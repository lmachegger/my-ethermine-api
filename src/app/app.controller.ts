import { Controller, Get } from '@nestjs/common';
import { ok } from 'node:assert';

@Controller()
export class AppController {
  constructor() {}

  @Get('healthcheck')
  healthCheck(): string {
    return 'ok';
  }
}
