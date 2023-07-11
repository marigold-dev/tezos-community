import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
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
import { BigMap, address, unit } from 'src/type-aliases';
import { UserProfile } from './UserProfile';
import { UserProfilesService } from './userprofiles.service';

enum CACHE_PREFIX {
  URL = 'CACHE_URL',
  MEMBER = 'CACHE_MEMBER',
  MEMBERREQUEST = 'CACHE_MEMBERREQUEST',
}

type MemberRequest = {
  joinRequest: {
    orgName: string;
    reason: string;
  };
  user: address;
};

type Organization = {
  admins: Array<address>;
  autoRegistration: boolean;
  business: string;
  fundingAddress?: address;
  ipfsNftUrl: string;
  logoUrl: string;
  memberRequests: Array<MemberRequest>;
  members: BigMap<address, unit>;
  name: string;
  siteUrl: string;
  status: { active: unit } | { frozen: unit } | { pendingApproval: unit };
};

@Controller('user')
export class UserProfilesController {
  private Tezos: TezosToolkit;

  constructor(
    private readonly userProfilesService: UserProfilesService,
    private siwtGuard: SiwtGuard,
    private siwtService: SiwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('CONTRACT') private mainContractType: MainContractType,
  ) {
    this.Tezos = new TezosToolkit(
      'https://' + process.env.NETWORK + '.tezos.marigold.dev',
    );
    api.defaults.baseUrl = 'https://api.' + process.env.NETWORK + '.tzkt.io';
  }

  async fetchOrgMembers(): Promise<void> {
    const storage = await this.mainContractType.storage();

    Promise.all(
      storage.organizations.map(async (org) => {
        const membersBigMapId = (
          org.members as unknown as { id: BigNumber }
        ).id.toNumber();

        try {
          const keys: api.BigMapKey[] = Array.from(
            await api.bigMapsGetKeys(membersBigMapId, {
              micheline: 'Json',
            }),
          );
          await this.cacheManager.store.set(
            CACHE_PREFIX.MEMBER + org.name,
            keys,
          );
        } catch (error) {
          Logger.warn('TZKT issue to fetch bigmap keys', error);
        }
      }),
    );
  }

  async fetchOrgMembersForOrg(org: Organization): Promise<void> {
    const storage = await this.mainContractType.storage();

    const membersBigMapId = (
      org.members as unknown as { id: BigNumber }
    ).id.toNumber();

    try {
      const keys: api.BigMapKey[] = Array.from(
        await api.bigMapsGetKeys(membersBigMapId, {
          micheline: 'Json',
        }),
      );
      await this.cacheManager.store.set(CACHE_PREFIX.MEMBER + org.name, keys);
    } catch (error) {
      Logger.warn('TZKT issue to fetch bigmap keys', error);
    }
  }

  @UseGuards(SiwtGuard)
  @Get(':address')
  async getUserProfile(
    @Param('address') address: string,
    @Req() req: express.Request,
  ): Promise<UserProfile> {
    const keys = (await this.cacheManager.store.keys()).filter((key) =>
      key.startsWith(CACHE_PREFIX.URL),
    );
    const key = req.url;

    //extract user address
    const token = this.siwtGuard.extractTokenFromHeader(req);
    const pkh = this.siwtService.siwtClient.verifyAccessToken(token!);

    //check cahce and return, cache is per user to not mix permissions
    if (keys.indexOf(CACHE_PREFIX.URL + key + pkh) >= 0) {
      Logger.debug('USED HTTP CACHE for getUserProfile ', address);
      return (await this.cacheManager.store.get(CACHE_PREFIX.URL + key + pkh))!;
    }

    //force init if no cache found for members

    if (
      (await this.cacheManager.store.keys()).findIndex((key) =>
        key.startsWith(CACHE_PREFIX.MEMBER),
      ) < 0
    ) {
      Logger.debug(
        'Forcing to fetch members for each org on TZKT as there is no more cache',
      );
      await this.fetchOrgMembers();
    }

    const storage = await this.mainContractType.storage();

    //check if user is a super admin or part of same organization or an admin where someone who wants to join his org, or himself
    if (
      storage.tezosOrganization.admins.indexOf(pkh) >= 0 ||
      pkh === address ||
      (await this.isOnSameGroup(pkh, address as address, storage)) ||
      (await this.isOnMemberRequestList(pkh, address as address, storage))
    ) {
      //fetch it
      const up = await this.userProfilesService.getUserProfile(address);

      if (up) {
        //add to cache
        // to always get the base url of the incoming get request url.

        await this.cacheManager.store.set(CACHE_PREFIX.URL + key + pkh, up);
        Logger.debug('STORE ON HTTP CACHE for getUserProfile ', address);

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
        let keys: api.BigMapKey[] | undefined =
          (await this.cacheManager.store.get(
            CACHE_PREFIX.MEMBER + org.name,
          )) as unknown as api.BigMapKey[] | undefined;

        if (!keys) {
          /*  Logger.debug('FAILURE CACHE ****** Fecthing members for ', org.name);*/

          await this.fetchOrgMembersForOrg(org);

          keys = (await this.cacheManager.store.get(
            CACHE_PREFIX.MEMBER + org.name,
          )) as unknown as api.BigMapKey[] | undefined;
          /*
          Logger.debug(
            'FAILURE CACHE ****** Fecthing members for ',
            org.name,
            'key is now ',
            keys,
          );*/
        }

        if (
          keys!.findIndex((key) => key.active == true && key.key == user1) >=
            0 &&
          keys!.findIndex((key) => key.active == true && key.key == user2) >= 0
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
