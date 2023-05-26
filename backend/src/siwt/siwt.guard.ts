import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SiwtService } from './siwt.service';

@Injectable()
export class SiwtGuard implements CanActivate {
  constructor(private siwtService: SiwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const pkh = this.siwtService.siwtClient.verifyAccessToken(token);

      if (pkh) {
        //TODO, can do more check here already looking at smartcontract stuff ...

        return true;
      } else {
        Logger.debug(
          'Cannot find the user address inside the access_token claims',
        );
        throw new UnauthorizedException();
      }
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException();
    }
  }

  public extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
