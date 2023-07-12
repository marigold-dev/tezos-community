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

@Controller('microsoft')
export class MicrosoftController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('microsoft'))
  @Get()
  async Microsoft() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMyMicrosoft(
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

    Logger.debug('Calling claimMyMicrosoft');

    let up: UserProfile | undefined =
      this.siwtService.microsoftPending.get(providerAccessToken);
    if (up) {
      this.siwtService.microsoftPending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      Logger.warn(
        'Cannot retrieve claim for Microsoft on memory for address ' + pkh,
      );
    }
  }

  @UseGuards(AuthGuard('microsoft'))
  @Get('callback')
  async MicrosoftCallback(@Req() req: any, @Res() res: express.Response) {
    const microsoftAccessToken = req.user.accessToken;

    Logger.debug(
      'Microsoft callback received user with MicrosoftAccessToken',
      microsoftAccessToken,
    );

    this.siwtService.microsoftPending.set(
      microsoftAccessToken,
      new UserProfile(
        microsoftAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo.replace(/_normal/, ''),
      ),
    );

    // Logger.debug('CALLBACK=>', [      ...this.siwtService.microsoftPending.entries(),    ]);

    //push on websocket
    this.eg.server.emit('microsoft', microsoftAccessToken);
    res.end();
  }
}
