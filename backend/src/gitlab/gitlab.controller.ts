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

@Controller('gitlab')
export class GitlabController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('gitlab'))
  @Get()
  async Gitlab() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMyGitlab(
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

    Logger.debug('Calling claimMyGitlab');

    let up: UserProfile | undefined =
      this.siwtService.gitlabPending.get(providerAccessToken);
    if (up) {
      this.siwtService.gitlabPending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      Logger.warn(
        'Cannot retrieve claim for Gitlab on memory for address ' + pkh,
      );
    }
  }

  @UseGuards(AuthGuard('gitlab'))
  @Get('callback')
  async GitlabCallback(@Req() req: any, @Res() res: express.Response) {
    const gitlabAccessToken = req.user.accessToken;

    Logger.debug(
      'Gitlab callback received user with GitlabAccessToken',
      gitlabAccessToken,
      req.user,
    );

    this.siwtService.gitlabPending.set(
      gitlabAccessToken,
      new UserProfile(
        gitlabAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo,
      ),
    );

    Logger.debug('CALLBACK=>', [...this.siwtService.gitlabPending.entries()]);

    //push on websocket
    this.eg.server.emit('gitlab', gitlabAccessToken);

    Logger.debug('websocket emitted ', 'gitlab', gitlabAccessToken);

    res.end();
  }
}
