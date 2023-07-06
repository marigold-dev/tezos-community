import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { FacebookController } from './facebook.controller';
import { FacebookOauthStrategy } from './facebook.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [FacebookOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [FacebookController],
})
export class FacebookModule {}
