import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TezosToolkit } from '@taquito/taquito';
import * as api from '@tzkt/sdk-api';
import { BigNumber } from 'bignumber.js';
import { Cache } from 'cache-manager';
import * as express from 'express';
import { MainContractType, Storage } from 'src/main.types';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { address } from 'src/type-aliases';
import { UserProfile } from './UserProfile';
import { UserProfilesService } from './userprofiles.service';

@Controller('user')
export class UserProfilesController {
  private Tezos: TezosToolkit;
  private mainContractType: MainContractType;

  constructor(
    private readonly userProfilesService: UserProfilesService,
    private siwtGuard: SiwtGuard,
    private siwtService: SiwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.Tezos = new TezosToolkit(
      'https://' + process.env.NETWORK + '.tezos.marigold.dev',
    );
    api.defaults.baseUrl = 'https://api.' + process.env.NETWORK + '.tzkt.io';
  }

  async init(): Promise<void> {
    this.mainContractType = await this.Tezos.contract.at<MainContractType>(
      process.env.CONTRACT_ADDRESS!,
    );
  }

  @UseGuards(SiwtGuard)
  @Get(':address')
  async getUserProfile(
    @Param('address') address: string,
    @Req() req: express.Request,
  ): Promise<UserProfile> {
    const cachedRoutes = this.cacheManager.store;
    const keys = await cachedRoutes.keys();
    const key = req.url;

    //extract user address
    const token = this.siwtGuard.extractTokenFromHeader(req);
    const pkh = this.siwtService.siwtClient.verifyAccessToken(token!);

    //check cahce and return, cache is per user to not mix permissions
    if (keys.indexOf(key + pkh) >= 0)
      return (await cachedRoutes.get(key + pkh))!;

    //init if necessary
    if (!this.mainContractType) await this.init();

    const storage = await this.mainContractType.storage();

    //check if user is a super admin or part of same organization or an admin where someone who wants to join his org
    if (
      storage.tezosOrganization.admins.indexOf(pkh) >= 0 ||
      (await this.isOnSameGroup(pkh, address as address, storage)) ||
      (await this.isOnMemberRequestList(pkh, address as address, storage))
    ) {
      //fetch it
      const up = await this.userProfilesService.getUserProfile(address);

      if (up) {
        //add to cache
        // to always get the base url of the incoming get request url.

        cachedRoutes.set(key + pkh, up);

        return up;
      } else
        throw new HttpException(
          'User ' + address + ' not found',
          HttpStatus.NOT_FOUND,
        );
    } else {
      throw new HttpException(
        'User ' + address + ' cannot be displayed',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async isOnSameGroup(
    user1: address,
    user2: address,
    storage: Storage,
  ): Promise<boolean> {
    //get user groups
    let isOnSameGroup = false;
    await Promise.all(
      storage.organizations.map(async (org) => {
        const membersBigMapId = (
          org.members as unknown as { id: BigNumber }
        ).id.toNumber();

        const keys: api.BigMapKey[] = Array.from(
          await api.bigMapsGetKeys(membersBigMapId, {
            micheline: 'Json',
          }),
        );
        if (
          keys.findIndex((key) => key.active == true && key.key == user1) >=
            0 &&
          keys.findIndex((key) => key.active == true && key.key == user2) >= 0
        ) {
          isOnSameGroup = true;
          return;
        }
      }),
    );

    return isOnSameGroup;
  }

  async isOnMemberRequestList(
    admin: address,
    member: address,
    storage: Storage,
  ): Promise<boolean> {
    //get user groups
    let isOnMemberRequestList = false;
    await Promise.all(
      storage.organizations
        .filter((o) => o.admins.indexOf(admin) >= 0)
        .map(async (org) => {
          if (org.memberRequests.findIndex((mr) => mr.user == member) >= 0) {
            isOnMemberRequestList = true;
            return;
          }
        }),
    );

    return isOnMemberRequestList;
  }

  @UseGuards(SiwtGuard)
  @Post('unlink')
  async unlink(@Req() req: express.Request): Promise<void> {
    const token = this.siwtGuard.extractTokenFromHeader(req);
    const pkh = this.siwtService.siwtClient.verifyAccessToken(token!);
    await this.userProfilesService.remove(pkh);
  }
}
