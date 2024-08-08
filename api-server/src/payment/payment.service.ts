import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import type { CreateBasketDto } from 'src/basket/dto/create-basket.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository, DataSource, Transaction } from 'typeorm';
import { Basket } from 'src/basket/entities/basket.entity';

@Injectable()
export class PaymentService {
	constructor(
		@InjectRepository(Basket)
		private readonly basketRepository: Repository<Basket>,

		@InjectRepository(Payment)
		private readonly paymentRepository: Repository<Payment>,

		private readonly dataSource: DataSource,
	) { }

	async create(createBasketDtoList: CreateBasketDto[]) {
		if (!Array.isArray(createBasketDtoList) || createBasketDtoList.length === 0) {
			throw new BadRequestException('No items found in the basket. Please add items to your cart before proceeding to payment.');
		}

		const paymentList: Payment[] = [];

		// 다건의 row 핸들링 시, transaction 적용
		await this.dataSource.transaction(async (manager) => {
			for (const dto of createBasketDtoList) {
				const productId: number = dto.productId;
				const userId: string = dto.userId;
				const amount: number = dto.product.price;

				for (let i = 0; i < dto.productQuantity; i++) {
					const payment = plainToClass(CreatePaymentDto, { productId, userId, amount });
					const paymentEntity = this.paymentRepository.create(payment);
					paymentList.push(paymentEntity);
				}

				await manager.delete(Basket, { userId, productId });
				console.log('Successfully deleted from basket', { userId, productId });
			}

			//벌크 인서트
			await manager.insert(Payment, paymentList);
		});

		return this.basketRepository.find({
			where: { userId: createBasketDtoList[0].userId },
			relations: ['product'],
			order: { 'totalPrice': 'desc', 'productId': 'desc' }
		});
	}

	findAllByUserId(userId: string, query: any) {
		const limit = +query?.limit || 20;
		const skip = +query?.skip || 0;
		

		return this.paymentRepository.createQueryBuilder('a')
			.innerJoin('a.product', 'b')
			.select(['a.userId as userId', 'a.productId as productId', 'b.name as name', 'a.payDate as payDate', 'b.image_url as imageUrl'])
			.addSelect('COUNT(1)', 'pCnt')
			.addSelect('SUM(a.amount)', 'totalPrice')
			.where('a.userId = :userId', { userId })
			.groupBy('a.userId, a.productId, b.name, a.payDate, b.image_url')
			.orderBy('a.payId', 'DESC').getRawMany();
	}

	findOne(id: number) {
		return `This action returns a #${id} payment`;
	}
}
