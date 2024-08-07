import { Injectable } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { Repository, type DeleteResult } from 'typeorm';
import { Basket } from './entities/basket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
  ) {}

  async create(createBasketDto: CreateBasketDto) {
    const cart = await this.findOneByUserIdAndProductId(createBasketDto.userId, createBasketDto.productId);
    
    if (cart) {
        const userId = cart.userId;
        const productId = cart.productId;
        const productQuantity = createBasketDto.productQuantity + cart.productQuantity;
        const totalPrice = createBasketDto.totalPrice + cart.totalPrice;
        const updateBasket = plainToClass(UpdateBasketDto, {productQuantity, totalPrice});
        return this.basketRepository.update({userId, productId}, updateBasket); 
    } else {
        return this.basketRepository.insert(createBasketDto);
    }
  }

  findAll(userId: string) {
    return this.basketRepository.find({
        where: {userId},
        relations: ['product'],
        order: {'totalPrice': 'desc', 'productId': 'desc'}
    });
  }

  findOneByUserIdAndProductId(userId: string, productId: number) {
	return this.basketRepository.createQueryBuilder('b')
    .innerJoin('b.product', 'p')
    .select('b')
    .addSelect('p')
    .where('b.userId = :userId', { userId })
    .andWhere('b.productId = :productId', { productId })
    .getOne();
  }

  async update(userId: string, productId:number, updateBasketDto: UpdateBasketDto) {
    await this.basketRepository.update({userId, productId}, updateBasketDto);
    return this.findOneByUserIdAndProductId(userId, productId);
  }

  async removeOne(userId: string, productId: number) {
    await this.basketRepository.delete({userId, productId});
    return this.findAll(userId);
  }
}
