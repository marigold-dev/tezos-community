import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './UserProfile';
import { UserProfilesController } from './userprofiles.controller';
import { UserProfilesService } from './userprofiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile]), ConfigModule],
  providers: [UserProfilesService],
  controllers: [UserProfilesController],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}
