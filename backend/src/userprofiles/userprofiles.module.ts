import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfile } from './UserProfile';
import { UserProfilesController } from './userprofiles.controller';
import { UserProfilesService } from './userprofiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile]), ConfigModule],
  providers: [UserProfilesService, SiwtService],
  controllers: [UserProfilesController],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}
