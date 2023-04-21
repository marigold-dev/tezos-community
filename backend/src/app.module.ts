import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterModule } from './twitter/twitter.module';
import { UserProfile } from './userprofiles/UserProfile';
import { UserProfilesModule } from './userprofiles/userprofiles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://admin:adminadmin@cluster0.rwypvvm.mongodb.net/?retryWrites=true&w=majority',
      database: 'mongo',
      useNewUrlParser: true,
      synchronize: true,
      logging: true,
      entities: [UserProfile],
    }),
    UserProfilesModule,
    TwitterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
