import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*', credentials: true });
  app.use(
    session({
      secret: 'YOUWILLNEVERGUESSWHATITIS',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3001);
}
bootstrap();
