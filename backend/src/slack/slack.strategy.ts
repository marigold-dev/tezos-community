import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';

/*@ts-ignore*/
import { Strategy as SlackStrategy } from 'passport-slack-oauth2';

@Injectable()
export class SlackOauthStrategy extends PassportStrategy(
  SlackStrategy,
  'slack',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: process.env.SLACK_KEY,
      clientSecret: process.env.SLACK_SECRET,
      callbackURL: process.env.SERVER_URL + `/slack/callback`,
      scope: ['identity.basic', 'identity.avatar'], // default
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile & { user: { image_24: string } },
  ) {
    Logger.debug('GOOGLE', profile);

    const { user, provider, displayName, id } = profile;

    //console.log('PROFILE', profile);

    return {
      accessToken: _accessToken,
      provider: provider.toLowerCase(),
      providerId: id,
      name: displayName,
      username: id,
      photo: user.image_24,
    };
  }
}
