import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { SlackController } from './slack.controller';
import { SlackOauthStrategy } from './slack.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [SlackOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [SlackController],
})
export class SlackModule {}
