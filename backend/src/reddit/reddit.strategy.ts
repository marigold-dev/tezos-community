import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';

// @ts-ignore
import { Strategy as RedditStrategy } from 'passport-reddit';

@Injectable()
export class RedditOauthStrategy extends PassportStrategy(
  RedditStrategy,
  'reddit',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: process.env.REDDIT_KEY,
      clientSecret: process.env.REDDIT_SECRET,
      callbackURL: process.env.SERVER_URL + `/reddit/callback`,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile & { avatar_url: string },
  ) {
    Logger.debug('GOOGLE', profile);

    const { avatar_url, provider, displayName, username } = profile;

    console.log('PROFILE', profile);

    return {
      accessToken: _accessToken,
      provider: provider,
      providerId: username,
      name: displayName,
      username: username,
      photo: avatar_url,
    };
  }
}
