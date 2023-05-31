import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.enableCors({ origin: '*', credentials: true });
  /*app.use(cookieParser());
  app.use(
    session({
      secret: 'YOUWILLNEVERGUESSWHATITIS',
      resave: true,
      saveUninitialized: false,
    }),
  );*/
  await app.listen(3001);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
