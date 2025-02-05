import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { web_config } from './property/config';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { EncryptionUtil } from './utils/EncryptionUtil';

dotenv.config();

async function bootstrap() {
	EncryptionUtil.initialize(process.env.CRYPTO_KEY);
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.enableCors({ 
		origin: web_config.webOrigin,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  		allowedHeaders: ['Content-Type', 'Authorization'],
	 });
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.use(session({
		secret: 'test',
		resave: false,
		saveUninitialized: true,
		rolling: true,
		cookie: {
			secure: process.env.NODE_ENV === 'production'? true : false,
			sameSite: process.env.NODE_ENV === 'production'? 'none' : 'lax',
			domain: process.env.NODE_ENV === 'production'? '.cloudtype.app' : 'localhost',
			httpOnly: true,
		}
	}));
	await app.listen(3000);
}
bootstrap();
