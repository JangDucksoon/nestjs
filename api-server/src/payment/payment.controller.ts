import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { CreateBasketDto } from 'src/basket/dto/create-basket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { CreatePaymentDto } from './dto/create-payment.dto';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) { }

	@Post()
	createPaymentList(@Body() createBasketDtoList: CreateBasketDto[]) {
		return this.paymentService.createPaymentList(createBasketDtoList);
	}

	@Post('now')
	createPaymentNow(@Body() CreatePaymentDtoList: CreatePaymentDto[]) {
		return this.paymentService.createPaymentNow(CreatePaymentDtoList);
	}

	@Get(':userId')
	findAllByUserId(@Param('userId') userId: string, @Query() query: any) {
        return this.paymentService.findAllByUserId(userId, query);
    }

	@Get(':userId/:productId')
	findPaidProduct(@Param('userId') userId: string, @Param('productId') productId: string, @Query('payDate') payDate: string) {
		return this.paymentService.findPaidProduct(userId, +productId, payDate);
	}

	@Delete()
	removePayments(@Body() payIdArray: number[]) {
		return this.paymentService.removePayments(payIdArray);
	}
}
