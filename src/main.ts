import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe()
  )
  // console.log('hello',join(__dirname, '../../uploads'))
  app.useStaticAssets(join(__dirname, '../../uploads'));
  // app.use('/uploads', express.static('/Users/haupham/Desktop/git/Elearning_BE/uploads'));
  

  await app.listen(3000);
}
bootstrap();
