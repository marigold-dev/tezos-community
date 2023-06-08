import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfile } from './UserProfile';
import { UserProfilesController } from './userprofiles.controller';
import { UserProfilesService } from './userprofiles.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 15000, // milliseconds
      max: 100, // maximum number of items in cache
    }),
    TypeOrmModule.forFeature([UserProfile]),
    ConfigModule,
  ],
  providers: [UserProfilesService, SiwtService, SiwtGuard],
  controllers: [UserProfilesController],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}
