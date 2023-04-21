import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserProfile } from './UserProfile';
import { UserProfilesService } from './userprofiles.service';

@Controller('user')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Get(':address')
  async getUserProfile(
    @Param('address') address: string,
  ): Promise<UserProfile> {
    const up = await this.userProfilesService.getUserProfile(address);
    if (up) return up;
    else
      throw new HttpException(
        'User ' + address + ' not found',
        HttpStatus.NOT_FOUND,
      );
  }

  /*
  @Post(':address/generateProof')
  async generateProof(
    @Param('address') address: string,
    @Body('displayName') displayName: string,
    @Body('socialAccountAlias') socialAccountAlias: string,
    @Body('socialAccountType') socialAccountType: SOCIAL_ACCOUNT_TYPE,
  ): Promise<UserProfile> {
    console.log(
      'generateProof for ',
      address,
      displayName,
      socialAccountAlias,
      socialAccountType,
    );
    return this.userProfilesService.generateProof(
      address,
      displayName,
      socialAccountAlias,
      socialAccountType,
    );
  }

  @Post(':address/verifyProof')
  async verifyProof(
    @Param('address') address: string,
    @Body('proofUrl') proofUrl: string,
  ): Promise<UserProfile> {
    console.log('verifyProof for ' + address + ' on url ' + proofUrl);
    const up = await this.userProfilesService.getUserProfile(address);
    if (!up)
      throw new HttpException(
        'Cannot verify the proof for user ' + address + ' from url ' + proofUrl,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    switch (up.socialAccountType) {
      case SOCIAL_ACCOUNT_TYPE.TWITTER: {
        return (await this.verifyTwitterProof(address, proofUrl))
          ? up
          : new Promise((resolve, reject) =>
              reject('Twitter proof is not recognized'),
            );
      }
      default:
        return new Promise((resolve, reject) =>
          reject("We don't manage your social account " + up.socialAccountType),
        );
    }
  }

  private async verifyTwitterProof(
    address: string,
    proofUrl: string,
  ): Promise<boolean> {
    console.log('verifyTwitterProof', address, proofUrl);
    console.log('this.twitterClient', this.twitterService.twitterClient);
    try {
      const tweet =
        await this.twitterService.twitterClient.tweets.findTweetById(
          '1648611708129234944',
        );
      console.log(tweet);
      if (tweet && tweet.data) console.log(tweet.data.text);
      return new Promise((resolve, reject) => resolve(true));
    } catch (error) {
      console.log('error', error);
      return new Promise((resolve, reject) => reject(false));
    }
  }*/
}
