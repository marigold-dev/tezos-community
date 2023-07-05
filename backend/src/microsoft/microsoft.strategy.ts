import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

@Injectable()
export class MicrosoftOauthStrategy extends PassportStrategy(
  MicrosoftStrategy,
  'microsoft',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: process.env.MICROSOFT_KEY,
      clientSecret: process.env.MICROSOFT_SECRET,
      callbackURL: process.env.SERVER_URL + `/microsoft/callback`,
      scope: ['user.read'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    Logger.debug('GOOGLE', profile);

    const { id, provider, displayName, photos } = profile;

    console.log('PROFILE', profile);

    return {
      accessToken: _accessToken,
      provider: provider,
      providerId: id,
      name: displayName,
      username: id,
      photo: photos ? photos[0].value : '',
    };
  }
}
