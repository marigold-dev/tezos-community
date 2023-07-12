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

@Controller('telegram')
export class TelegramController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('telegram'))
  @Get()
  async Telegram() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMyTelegram(
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

    Logger.debug('Calling claimMyTelegram');

    let up: UserProfile | undefined =
      this.siwtService.telegramPending.get(providerAccessToken);
    if (up) {
      this.siwtService.telegramPending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      Logger.warn(
        'Cannot retrieve claim for Telegram on memory for address ' + pkh,
      );
    }
  }

  @UseGuards(AuthGuard('telegram'))
  @Get('callback')
  async TelegramCallback(@Req() req: any, @Res() res: express.Response) {
    const telegramAccessToken = req.user.accessToken;

    Logger.debug(
      'Telegram callback received user with TelegramAccessToken',
      telegramAccessToken,
      req.user,
    );

    this.siwtService.telegramPending.set(
      telegramAccessToken,
      new UserProfile(
        telegramAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo,
      ),
    );

    //Logger.debug('CALLBACK=>', [...this.siwtService.telegramPending.entries()]);

    //push on websocket
    this.eg.server.emit('telegram', telegramAccessToken);
    res.end();
  }
}
