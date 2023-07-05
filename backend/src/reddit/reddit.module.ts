import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { RedditController } from './reddit.controller';
import { RedditOauthStrategy } from './reddit.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [RedditOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [RedditController],
})
export class RedditModule {}
