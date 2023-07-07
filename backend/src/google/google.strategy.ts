import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(
  GoogleStrategy,
  'google',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: process.env.GOOGLE_KEY,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.SERVER_URL + `/google/callback`,
      scope: ['profile'],
      state: true,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    Logger.debug('GOOGLE', profile);

    const { id, provider, displayName, photos } = profile;

    //FIXME https://developers.google.com/tools/explorer/1000206071170259/?method=GET&path=me%3Ffields%3Did%2Cname%2Cfirst_name%2Clast_name%2Cpicture&version=v17.0
    //https://www.passportjs.org/packages/passport-google/

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
