import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';
import { EventsGateway } from 'src/EventsGateway';
import { SiwtGuard } from 'src/siwt/siwt.guard';
import { SiwtService } from 'src/siwt/siwt.service';
import { UserProfile } from 'src/userprofiles/UserProfile';
import { UserProfilesService } from 'src/userprofiles/userprofiles.service';

@Controller('facebook')
export class FacebookController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('facebook'))
  @Get()
  async Facebook() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMyFacebook(
    @Req() req: express.Request,
    @Body('providerAccessToken')
    providerAccessToken: string,
  ) {
    if (!providerAccessToken)
      throw new HttpException(
        'providerAccessToken body field is mandatory ',
        HttpStatus.BAD_REQUEST,
      );

    const token = this.siwtGuard.extractTokenFromHeader(req);
    const pkh = this.siwtService.siwtClient.verifyAccessToken(token!);

    Logger.debug('Calling claimMyFacebook');

    let up: UserProfile | undefined =
      this.siwtService.facebookPending.get(providerAccessToken);
    if (up) {
      this.siwtService.facebookPending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      throw new HttpException(
        'Cannot retrieve claim for Facebook on memory for address ' + pkh,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(AuthGuard('facebook'))
  @Get('callback')
  async FacebookCallback(@Req() req: any, @Res() res: express.Response) {
    const facebookAccessToken = req.user.accessToken;

    Logger.debug('Facebook callback received user with FacebookAccessToken');

    this.siwtService.facebookPending.set(
      facebookAccessToken,
      new UserProfile(
        facebookAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo.replace(/_normal/, ''),
      ),
    );

    //push on websocket
    this.eg.server.emit('facebook', facebookAccessToken);
    res.end();
  }
}
