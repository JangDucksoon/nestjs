import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { CreateBasketDto } from 'src/basket/dto/create-basket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) { }

	@Post()
	create(@Body() createBasketDtoList: CreateBasketDto[]) {
		return this.paymentService.create(createBasketDtoList);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.paymentService.findOne(+id);
	}
}
