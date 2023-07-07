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

@Controller('google')
export class GoogleController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('google'))
  @Get()
  async Google() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMyGoogle(
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

    Logger.debug('Calling claimMyGoogle');

    let up: UserProfile | undefined =
      this.siwtService.googlePending.get(providerAccessToken);
    if (up) {
      this.siwtService.googlePending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      Logger.warn(
        'Cannot retrieve claim for Google on memory for address ' + pkh,
      );
    }
  }

  @UseGuards(AuthGuard('google'))
  @Get('callback')
  async GoogleCallback(@Req() req: any, @Res() res: express.Response) {
    const googleAccessToken = req.user.accessToken;

    Logger.debug(
      'Google callback received user with GoogleAccessToken',
      googleAccessToken,
    );

    this.siwtService.googlePending.set(
      googleAccessToken,
      new UserProfile(
        googleAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo.replace(/_normal/, ''),
      ),
    );

    Logger.debug('CALLBACK=>', [...this.siwtService.googlePending.entries()]);

    //push on websocket
    this.eg.server.emit('google', googleAccessToken);

    Logger.debug('websocket emitted ', 'google', googleAccessToken);

    res.end();
  }
}
