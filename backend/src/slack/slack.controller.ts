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

@Controller('slack')
export class SlackController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('slack'))
  @Get()
  async Slack() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMySlack(
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

    Logger.debug('Calling claimMySlack');

    let up: UserProfile | undefined =
      this.siwtService.slackPending.get(providerAccessToken);
    if (up) {
      this.siwtService.slackPending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      Logger.warn(
        'Cannot retrieve claim for Slack on memory for address ' + pkh,
      );
    }
  }

  @UseGuards(AuthGuard('slack'))
  @Get('callback')
  async SlackCallback(@Req() req: any, @Res() res: express.Response) {
    const slackAccessToken = req.user.accessToken;

    Logger.debug(
      'Slack callback received user with SlackAccessToken',
      slackAccessToken,
      req.user,
    );

    this.siwtService.slackPending.set(
      slackAccessToken,
      new UserProfile(
        slackAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo,
      ),
    );

    // Logger.debug('CALLBACK=>', [...this.siwtService.slackPending.entries()]);

    //push on websocket
    this.eg.server.emit('slack', slackAccessToken);

    Logger.debug('websocket emitted ', 'slack', slackAccessToken);

    res.end();
  }
}
