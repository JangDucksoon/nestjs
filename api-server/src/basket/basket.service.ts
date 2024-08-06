import { Injectable } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { Repository } from 'typeorm';
import { Basket } from './entities/basket.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
  ) {}

  async create(createBasketDto: CreateBasketDto) {
	const cart = await this.findOneByUserIAndProductId(createBasketDto.userId, createBasketDto.productId);
	
	if (cart) {
		const userId = cart.userId;
		const productId = cart.productId;
		const productQuantity = createBasketDto.productQuantity + cart.productQuantity;
		const totalPrice = createBasketDto.totalPrice + cart.totalPrice;
		const updateBasket = new UpdateBasketDto({productQuantity, totalPrice});
		return this.basketRepository.update({userId, productId}, updateBasket);
	} else {
		return this.basketRepository.insert(createBasketDto);
	}
  }

  findAll() {
    return `This action returns all basket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} basket`;
  }

  async findOneByUserIAndProductId(userId: string, productId: number) {
	return await this.basketRepository.findOne({where: { userId, productId }});
  }

  update(id: number, updateBasketDto: UpdateBasketDto) {
    return `This action updates a #${id} basket`;
  }

  remove(id: number) {
    return `This action removes a #${id} basket`;
  }
}
