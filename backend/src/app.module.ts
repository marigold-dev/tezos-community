import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { SiwtModule } from './siwt/siwt.module';
import { TwitterModule } from './twitter/twitter.module';
import { UserProfile } from './userprofiles/UserProfile';
import { UserProfilesModule } from './userprofiles/userprofiles.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: `mongodb+srv://${configService.get(
          'MONGO_USER',
        )}:${configService.get('MONGO_PASSWORD')}@${configService.get(
          'MONGO_HOST',
        )}/?retryWrites=true&w=majority`,
        database: configService.get('MONGO_DATABASE'),
        useNewUrlParser: true,
        synchronize: true,
        logging: true,
        entities: [UserProfile],
      }),
      inject: [ConfigService],
    }),
    UserProfilesModule,
    TwitterModule,
    HealthcheckModule,
    SiwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
