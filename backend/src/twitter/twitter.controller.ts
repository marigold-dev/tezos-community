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

@Controller('twitter')
export class TwitterController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('twitter'))
  @Get()
  async twitter() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMyTwitter(
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

    Logger.debug('Calling claimMyTwitter');

    let up: UserProfile | undefined =
      this.siwtService.twitterPending.get(providerAccessToken);
    if (up) {
      this.siwtService.twitterPending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      throw new HttpException(
        'Cannot retrieve claim for Twitter on memory for address ' + pkh,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(AuthGuard('twitter'))
  @Get('callback')
  async twitterCallback(@Req() req: any, @Res() res: express.Response) {
    const twitterAccessToken = req.user.accessToken;

    Logger.debug('Twitter callback received user with twitterAccessToken');

    this.siwtService.twitterPending.set(
      twitterAccessToken,
      new UserProfile(
        twitterAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo.replace(/_normal/, ''),
      ),
    );

    //push on websocket
    this.eg.server.emit('twitter', twitterAccessToken);
    res.end();
  }
}
