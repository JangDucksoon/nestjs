import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { CreateBasketDto } from 'src/basket/dto/create-basket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) { }

	@Post()
	create(@Body() createBasketDtoList: CreateBasketDto[]) {
		return this.paymentService.create(createBasketDtoList);
	}

	@Get(':userId')
	findAllByUserId(@Param('userId') userId: string, @Query() query: any) {
        return this.paymentService.findAllByUserId(userId, query);
    }
}
