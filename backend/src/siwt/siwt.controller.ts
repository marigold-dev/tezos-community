import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import * as express from 'express';

import { verifySignature as taquitoVerifySignature } from '@taquito/utils';
import { SiwtService } from './siwt.service';
@Controller('siwt')
export class SiwtController {
  constructor(private siwtService: SiwtService) {}

  @Post('refreshToken')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Body('pkh') pkh: string,
    @Res() res: express.Response,
  ) {
    Logger.debug('POST refreshToken', refreshToken);
    try {
      const isValidSignature =
        this.siwtService.siwtClient.verifyRefreshToken(refreshToken);
      if (isValidSignature) {
        const newRefreshToken =
          this.siwtService.siwtClient.generateRefreshToken({ pkh });

        const claims = {
          iss: 'marigold',
        };

        // the minimum we need to return is an access token that
        // allows the user to access the API. The pkh is required,
        // extra claims are optional.
        const accessToken = this.siwtService.siwtClient.generateAccessToken({
          pkh,
          claims,
        });

        const idToken = this.siwtService.siwtClient.generateIdToken({
          pkh,
          claims,
        });

        return res.send({
          accessToken,
          newRefreshToken,
          idToken,
          tokenType: 'Bearer',
        });
      } else {
        Logger.warn('refreshToken invalid signature !');
      }

      return res.status(403).send('Forbidden');
    } catch (e) {
      Logger.error(e);
      return res.status(403).send('Forbidden');
    }
  }

  @Post('signin')
  async signin(
    @Body('message') message: string,
    @Body('pk') pk: string,
    @Body('pkh') pkh: string,
    @Body('signature') signature: string,
    @Res() res: express.Response,
  ) {
    Logger.debug('POST signin', pkh);
    try {
      const isValidSignature = taquitoVerifySignature(message, pk, signature);
      if (isValidSignature) {
        //Logger.warn('signin signature ok ', { message, pk, signature });

        // when a user provided a valid signature, we can obtain and
        // return the required information about the user.

        // the usage of claims is supported but not required.
        const claims = {
          iss: 'marigold',
        };

        // the minimum we need to return is an access token that
        // allows the user to access the API. The pkh is required,
        // extra claims are optional.
        const accessToken = this.siwtService.siwtClient.generateAccessToken({
          pkh,
          claims,
        });

        // we can use a refresh token to allow the access token to
        // be refreshed without the user needing to log in again.
        const refreshToken = this.siwtService.siwtClient.generateRefreshToken({
          pkh,
        });

        const idToken = this.siwtService.siwtClient.generateIdToken({
          pkh,
          claims,
        });

        return res.send({
          accessToken,
          refreshToken,
          idToken,
          tokenType: 'Bearer',
        });
      } else {
        // Logger.warn('signin invalidSignature ', { message, pk, signature });
      }
      return res.status(403).send('Forbidden');
    } catch (e) {
      Logger.error(e);
      return res.status(403).send('Forbidden');
    }
  }
}
