import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { TwitterController } from './twitter.controller';
import { TwitterOauthStrategy } from './twitter.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [TwitterOauthStrategy, EventsGateway],
  controllers: [TwitterController],
})
export class TwitterModule {}
