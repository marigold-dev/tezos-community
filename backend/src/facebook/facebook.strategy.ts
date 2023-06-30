import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(
  FacebookStrategy,
  'facebook',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: process.env.FACEBOOK_KEY,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.SERVER_URL + `/facebook/callback`,
      profileFields: ['id', 'name', 'picture'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, provider, displayName, username, photos } = profile;

    //FIXME https://developers.facebook.com/tools/explorer/1000206071170259/?method=GET&path=me%3Ffields%3Did%2Cname%2Cfirst_name%2Clast_name%2Cpicture&version=v17.0
    //https://www.passportjs.org/packages/passport-facebook/

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
