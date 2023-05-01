import {
  Controller,
  Get
} from '@nestjs/common';

@Controller('health')
export class HealthcheckController {

  @Get('/')
  async healthcheck(): Promise<{ status: string }> {
    return { status: 'OK' };
  }
}
