import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { TwitterController } from './twitter.controller';
import { TwitterOauthStrategy } from './twitter.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [TwitterOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [TwitterController],
})
export class TwitterModule {}
