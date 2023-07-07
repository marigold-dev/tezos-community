import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { TelegramController } from './telegram.controller';
import { TelegramOauthStrategy } from './telegram.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [TelegramOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [TelegramController],
})
export class TelegramModule {}
