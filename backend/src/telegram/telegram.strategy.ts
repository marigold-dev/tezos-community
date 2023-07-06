import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
// @ts-ignore
import { Strategy as TelegramStrategy } from 'passport-telegram';

@Injectable()
export class TelegramOauthStrategy extends PassportStrategy(
  TelegramStrategy,
  'telegram',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: process.env.TELEGRAM_KEY,
      clientSecret: process.env.TELEGRAM_SECRET,
      callbackURL: process.env.SERVER_URL + `/telegram/callback`,
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
