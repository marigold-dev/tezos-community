import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy as TwitterStrategy } from 'passport-twitter';

@Injectable()
export class TwitterOauthStrategy extends PassportStrategy(
  TwitterStrategy,
  'twitter',
) {
  static getCallback = (provider: string) => {
    return process.env.NODE_ENV === 'production'
      ? `https://tzcommunity.marigold.dev/${provider}/callback`
      : `http://localhost:3001/${provider}/callback`;
  };

  constructor(configService: ConfigService) {
    super({
      consumerKey: configService.get('TWITTER_KEY'),
      consumerSecret: configService.get('TWITTER_SECRET'),
      callbackURL: TwitterOauthStrategy.getCallback('twitter'),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, provider, displayName, username, photos } = profile;

    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    return {
      provider: provider,
      providerId: id,
      name: displayName,
      username: username,
      photo: photos ? photos[0].value : '',
    };
  }
}
