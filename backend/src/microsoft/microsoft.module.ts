import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { MicrosoftController } from './microsoft.controller';
import { MicrosoftOauthStrategy } from './microsoft.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [MicrosoftOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [MicrosoftController],
})
export class MicrosoftModule {}
