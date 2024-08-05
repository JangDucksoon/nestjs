import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {web_config} from './property/config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({origin: web_config.webOrigin});
  await app.listen(3000);
}
bootstrap();
