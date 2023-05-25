import { Body, Controller, Post, Res, Session } from '@nestjs/common';
import * as express from 'express';

import { siwt } from '@siwt/core';
import { verifySignature as taquitoVerifySignature } from '@taquito/utils';
@Controller('signin')
export class SiwtController {
  siwtClient = siwt({
    accessTokenSecret: 'MY_SUPER ACCESS TOKEN SECRET',
    refreshTokenSecret: 'MY_SUPER REFRESH TOKEN SECRET',
    idTokenSecret: 'MY_SUPER  ID TOKEN SECRET',
    accessTokenExpiration: 900, // Seconds. Optional, Default 15 mins
    refreshTokenExpiration: 36000, // Seconds. Optional, Default 1 month
    idTokenExpiration: 2592000, // Seconds. Optional, Default 10 hrs
  });

  @Post()
  async signin(
    @Body('message') message: string,
    @Body('pk') pk: string,
    @Body('pkh') pkh: string,
    @Body('signature') signature: string,
    @Res() res: express.Response,
    @Session() session: Record<string, any>,
  ) {
    console.log('*************** POST signin', message, pk, pkh, signature);
    try {
      const isValidSignature = taquitoVerifySignature(message, pk, signature);
      if (isValidSignature) {
        // when a user provided a valid signature, we can obtain and
        // return the required information about the user.

        // the usage of claims is supported but not required.
        const claims = {
          iss: 'https://api.siwtdemo.stakenow.fi',
          aud: 'https://siwtdemo.stakenow.fi',
          azp: 'https://siwtdemo.stakenow.fi',
        };

        // the minimum we need to return is an access token that
        // allows the user to access the API. The pkh is required,
        // extra claims are optional.
        const accessToken = this.siwtClient.generateAccessToken({
          pkh,
          claims,
        });

        // we can use a refresh token to allow the access token to
        // be refreshed without the user needing to log in again.
        const refreshToken = this.siwtClient.generateRefreshToken({ pkh });

        // we can use a long-lived ID token to return some personal
        // information about the user to the UI.
        /*
        const access = queryAccessControl({
          contractAddress: 'KT1',
          parameters: {
            pkh,
          },
          test: {
            comparator: '>=',
            value: 1,
          },
        });
*/
        const idToken = this.siwtClient.generateIdToken({
          pkh,
          claims,
          /* userInfo: {
            ...access,
          },*/
        });

        return res.send({
          accessToken,
          refreshToken,
          idToken,
          tokenType: 'Bearer',
        });
      }
      return res.status(403).send('Forbidden');
    } catch (e) {
      console.log(e);
      return res.status(403).send('Forbidden');
    }
  }
}
