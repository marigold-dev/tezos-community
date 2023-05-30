import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy as TwitterStrategy } from 'passport-twitter';

@Injectable()
export class TwitterOauthStrategy extends PassportStrategy(
  TwitterStrategy,
  'twitter',
) {
  constructor(configService: ConfigService) {
    super({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: process.env.SERVER_URL + `/twitter/callback`,
    });
    Logger.debug('TWITTER_KEY', process.env.TWITTER_KEY);
    Logger.debug('TWITTER_SECRET', process.env.TWITTER_SECRET);
    Logger.debug('SERVER_URL', process.env.SERVER_URL);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, provider, displayName, username, photos } = profile;

    return {
      accessToken: _accessToken,
      provider: provider,
      providerId: id,
      name: displayName,
      username: username,
      photo: photos ? photos[0].value : '',
    };
  }
}
