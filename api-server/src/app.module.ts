import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { BasketModule } from './basket/basket.module';
import { CustomNamingStrategy } from './utils/name.strategy';


//fill with code for using type orm and sqllite3
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images'
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'test.db',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      namingStrategy: new CustomNamingStrategy()
    }),
    ProductModule,
    AuthModule,
    BasketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
