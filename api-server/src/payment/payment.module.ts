import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Basket } from 'src/basket/entities/basket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Basket])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
