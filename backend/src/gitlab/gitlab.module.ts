import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { GitlabController } from './gitlab.controller';
import { GitlabOauthStrategy } from './gitlab.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [GitlabOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [GitlabController],
})
export class GitlabModule {}
