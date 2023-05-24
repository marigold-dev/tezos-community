import { Module } from '@nestjs/common';
import { HealthcheckController } from './healthcheck.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [HealthcheckController],
})
export class HealthcheckModule { }

