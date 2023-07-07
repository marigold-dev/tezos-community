import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfilesModule } from 'src/userprofiles/userprofiles.module';
import { GithubController } from './github.controller';
import { GithubOauthStrategy } from './github.strategy';

@Module({
  imports: [ConfigModule, UserProfilesModule],
  providers: [GithubOauthStrategy, EventsGateway, SiwtService, SiwtGuard],
  controllers: [GithubController],
})
export class GithubModule {}
