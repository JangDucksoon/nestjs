import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  create(@Body() createBasketDto: CreateBasketDto) {
    return this.basketService.create(createBasketDto);
  }

  @Get(':userId')
  findAllByUserId(@Param('userId') id: string) {
    return this.basketService.findAll(id);
  }

  @Patch(':userId/:productId')
  update(@Param('userId') userId: string, @Param('productId') productId: string, @Body() updateBasketDto: UpdateBasketDto) {
    return this.basketService.update(userId, +productId, updateBasketDto);
  }

  @Delete(':userId/:productId')
  removeOne(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.basketService.removeOne(userId, +productId);
  }
}
