import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
// @ts-ignore
import * as GitlabStrategy from 'passport-gitlab2';

@Injectable()
export class GitlabOauthStrategy extends PassportStrategy(
  GitlabStrategy,
  'gitlab',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: process.env.GITLAB_KEY,
      clientSecret: process.env.GITLAB_SECRET,
      callbackURL: process.env.SERVER_URL + `/gitlab/callback`,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile & { avatarUrl: string },
  ) {
    Logger.debug('GOOGLE', profile);

    const { avatarUrl, provider, displayName, username } = profile;

    console.log('PROFILE', profile);

    return {
      accessToken: _accessToken,
      provider: provider,
      providerId: username,
      name: displayName,
      username: username,
      photo: avatarUrl,
    };
  }
}
