import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';
import * as express from 'express';
import { EventsGateway } from 'src/EventsGateway';
import { UserProfile } from 'src/userprofiles/UserProfile';
import { UserProfilesService } from 'src/userprofiles/userprofiles.service';

@Controller('twitter')
export class TwitterController {
  constructor(
    private eg: EventsGateway,
    private userProfilesService: UserProfilesService,
  ) {}

  @UseGuards(AuthGuard('twitter'))
  @Get()
  async twitter() {}

  @UseGuards(AuthGuard('twitter'))
  @Get('callback')
  async twitterCallback(
    @Req() req: any,
    @Res() res: express.Response,
    @Query('userAddress') userAddress: string,
    @Session() session: Record<string, any>,
  ) {
    log('*******Twitter callback received : ', req.user);

    log('******* check now session', session);

    const up = await this.userProfilesService.save(
      new UserProfile(
        session.userAddress,
        req.user.displayName,
        req.user.provider,
        req.user?.username,
        req.user?.photo.replace(/_normal/, ''),
      ),
    );
    this.eg.server.emit('twitter', up);
    res.end();
  }
}
