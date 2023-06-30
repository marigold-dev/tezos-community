import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { GoogleController } from './google.controller';
import { GoogleOauthStrategy } from './google.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [GoogleOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [GoogleController],
})
export class GoogleModule {}
