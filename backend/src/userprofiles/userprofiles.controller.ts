import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { UserProfile } from './UserProfile';
import { UserProfilesService } from './userprofiles.service';

@Controller('user')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

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
}
