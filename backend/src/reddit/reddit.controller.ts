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

@Controller('reddit')
export class RedditController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('reddit'))
  @Get()
  async Reddit() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMyReddit(
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

    Logger.debug('Calling claimMyReddit');

    let up: UserProfile | undefined =
      this.siwtService.redditPending.get(providerAccessToken);
    if (up) {
      this.siwtService.redditPending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      Logger.warn(
        'Cannot retrieve claim for Reddit on memory for address ' + pkh,
      );
    }
  }

  @UseGuards(AuthGuard('reddit'))
  @Get('callback')
  async RedditCallback(@Req() req: any, @Res() res: express.Response) {
    const redditAccessToken = req.user.accessToken;

    Logger.debug(
      'Reddit callback received user with RedditAccessToken',
      redditAccessToken,
      req.user,
    );

    this.siwtService.redditPending.set(
      redditAccessToken,
      new UserProfile(
        redditAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo,
      ),
    );

    Logger.debug('CALLBACK=>', [...this.siwtService.redditPending.entries()]);

    //push on websocket
    this.eg.server.emit('reddit', redditAccessToken);
    res.end();
  }
}
