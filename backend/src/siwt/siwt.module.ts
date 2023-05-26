import { Module } from '@nestjs/common';
import { SiwtController } from './siwt.controller';
import { SiwtService } from './siwt.service';

@Module({
  controllers: [SiwtController],
  providers: [SiwtService],
})
export class SiwtModule {}
