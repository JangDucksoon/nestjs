import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
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

  @Delete(':userId/checked')
  removeBaskets(@Param('userId') userId: string, @Query('productIdArray') productIdArray: string) {
    if (!productIdArray) {
      throw new BadRequestException('Checking product is required');
    }

    const productIds: number[] = productIdArray.split(',').map(id => Number(id));
    return this.basketService.removeBaskets(userId, productIds);
  }

  @Delete(':userId/:productId')
  removeOne(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.basketService.removeOne(userId, +productId);
  }
}
