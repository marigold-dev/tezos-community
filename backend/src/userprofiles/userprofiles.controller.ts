import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as express from 'express';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfile } from './UserProfile';
import { UserProfilesService } from './userprofiles.service';

@Controller('user')
export class UserProfilesController {
  constructor(
    private readonly userProfilesService: UserProfilesService,
    private siwtGuard: SiwtGuard,
    private siwtService: SiwtService,
  ) {}

  @UseGuards(SiwtGuard)
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

  @UseGuards(SiwtGuard)
  @Post('unlink')
  async unlink(@Req() req: express.Request): Promise<void> {
    const token = this.siwtGuard.extractTokenFromHeader(req);
    const pkh = this.siwtService.siwtClient.verifyAccessToken(token!);
    await this.userProfilesService.remove(pkh);
  }
}
