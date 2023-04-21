import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/userprofiles/UserProfile';
import { UserProfilesService } from 'src/userprofiles/userprofiles.service';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserProfile])],
  providers: [TwitterService, UserProfilesService],
  controllers: [TwitterController],
})
export class TwitterModule {}
