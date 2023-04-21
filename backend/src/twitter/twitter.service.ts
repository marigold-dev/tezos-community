import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, auth } from 'twitter-api-sdk';

@Injectable()
export class TwitterService {
  authClient: auth.OAuth2User;
  twitterClient: Client;

  constructor(private configService: ConfigService) {
    this.authClient = new auth.OAuth2User({
      client_id: this.configService.get<string>('TWITTER_API_KEY')!,
      client_secret: this.configService.get<string>('TWITTER_API_SECRET')!,
      callback: 'http://127.0.0.1:3001/twitter/callback',
      scopes: ['tweet.read', 'users.read', 'offline.access'],
    });

    this.twitterClient = new Client(this.authClient);
    console.log('twitterClient initialized');
  }
}
