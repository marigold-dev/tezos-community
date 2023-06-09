import { Injectable } from '@nestjs/common';
import { siwt } from '@siwt/core';
import { UserProfile } from 'src/userprofiles/UserProfile';

@Injectable()
export class SiwtService {
  siwtClient = siwt({
    accessTokenSecret: 'MY_SUPER ACCESS TOKEN SECRET',
    refreshTokenSecret: 'MY_SUPER REFRESH TOKEN SECRET',
    idTokenSecret: 'MY_SUPER  ID TOKEN SECRET',
    accessTokenExpiration: 900, // Seconds. Optional, Default 15 mins
    refreshTokenExpiration: 36000, // Seconds. Optional, Default 1 month
    idTokenExpiration: 2592000, // Seconds. Optional, Default 10 hrs
  });

  public twitterPending = new Map<string, UserProfile>(); //twitterAccessToken,
  public facebookPending = new Map<string, UserProfile>(); //facebookAccessToken,
  public googlePending = new Map<string, UserProfile>(); //googleAccessToken,
  public githubPending = new Map<string, UserProfile>(); //githubAccessToken,
  public gitlabPending = new Map<string, UserProfile>(); //gitlabAccessToken,
  public microsoftPending = new Map<string, UserProfile>(); //microsoftAccessToken,
  public redditPending = new Map<string, UserProfile>(); //redditAccessToken,
  public slackPending = new Map<string, UserProfile>(); //slackAccessToken,
  public telegramPending = new Map<string, UserProfile>(); //telegramAccessToken,
}
