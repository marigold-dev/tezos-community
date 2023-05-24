import { Module } from '@nestjs/common';
import { SiwtController } from './siwt.controller';

@Module({
  controllers: [SiwtController],
})
export class SiwtModule {}
