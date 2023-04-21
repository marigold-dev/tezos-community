import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Response,
} from '@nestjs/common';
import * as express from 'express';
import { SOCIAL_ACCOUNT_TYPE } from 'src/userprofiles/UserProfile';
import { UserProfilesService } from '../userprofiles/userprofiles.service';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  constructor(
    private twitterService: TwitterService,
    private userProfileService: UserProfilesService,
  ) {}

  @Get('callback')
  async callback(@Param('code') code: string, @Param('state') state: string) {
    console.log('Calling Twitter callback', code, state);
    try {
      const socialAccountAlias = state;
      const token = await this.twitterService.authClient.requestAccessToken(
        code as string,
      );
      console.log('user token set', token);
      this.twitterService.authClient.token = token.token;

      const res = await this.twitterService.twitterClient.users.findMyUser();
      if (res && res.data && !res.errors) {
        console.log('res ', res);

        if (res.data.username == socialAccountAlias) {
          let up =
            await this.userProfileService.getUserProfileFromSocialAccount(
              SOCIAL_ACCOUNT_TYPE.TWITTER,
              res.data.username,
            );
          if (up) {
            up.verified = true;
            await this.userProfileService.save(up);
          } else {
            throw new HttpException(
              'Cannot find existing user from social type ' +
                SOCIAL_ACCOUNT_TYPE.TWITTER +
                ' and alias ' +
                res.data.username,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        } else {
          throw new HttpException(
            'Mismatch users : original call was : ' +
              socialAccountAlias +
              ' by callback response is for user ' +
              res.data.username,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else {
        throw new HttpException(
          res.errors!.map((err) => err.title).join(', '),
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Get('login/:socialAccountAlias')
  async login(
    @Response() response: express.Response,
    @Param('socialAccountAlias') socialAccountAlias: string,
  ) {
    console.log('Calling Twitter login and redirect user');
    const authUrl = this.twitterService.authClient.generateAuthURL({
      state: socialAccountAlias,
      code_challenge_method: 's256',
    });
    response.redirect(authUrl);
  }
}
