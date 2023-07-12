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

@Controller('github')
export class GithubController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
    private siwtService: SiwtService,
    private siwtGuard: SiwtGuard,
  ) {}

  @UseGuards(SiwtGuard)
  @UseGuards(AuthGuard('github'))
  @Get()
  async Github() {}

  @UseGuards(SiwtGuard)
  @Post('claim')
  async claimMyGithub(
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

    Logger.debug('Calling claimMyGithub');

    let up: UserProfile | undefined =
      this.siwtService.githubPending.get(providerAccessToken);
    if (up) {
      this.siwtService.githubPending.delete(providerAccessToken); //remove from cache
      up!._id = pkh; //set owner
      up = await this.userProfilesService.save(up!);
      return up;
    } else {
      Logger.warn(
        'Cannot retrieve claim for Github on memory for address ' + pkh,
      );
    }
  }

  @UseGuards(AuthGuard('github'))
  @Get('callback')
  async GithubCallback(@Req() req: any, @Res() res: express.Response) {
    const githubAccessToken = req.user.accessToken;

    Logger.debug(
      'Github callback received user with GithubAccessToken',
      githubAccessToken,
    );

    this.siwtService.githubPending.set(
      githubAccessToken,
      new UserProfile(
        githubAccessToken,
        req.user.name,
        req.user.provider,
        req.user.username,
        req.user.photo.replace(/_normal/, ''),
      ),
    );

    //Logger.debug('CALLBACK=>', [...this.siwtService.githubPending.entries()]);

    //push on websocket
    this.eg.server.emit('github', githubAccessToken);

    Logger.debug('websocket emitted ', 'github', githubAccessToken);

    res.end();
  }
}
