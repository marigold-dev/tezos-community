import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GithubStrategy, Profile } from 'passport-github';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(
  GithubStrategy,
  'github',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: process.env.GITHUB_KEY,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: process.env.SERVER_URL + `/github/callback`,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    Logger.debug('GOOGLE', profile);

    const { id, provider, displayName, username, photos } = profile;

    console.log('PROFILE', profile);

    return {
      accessToken: _accessToken,
      provider: provider,
      providerId: username,
      name: displayName,
      username: username,
      photo: photos ? photos[0].value : '',
    };
  }
}
