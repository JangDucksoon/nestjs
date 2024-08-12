import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import type { CreateBasketDto } from 'src/basket/dto/create-basket.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository, DataSource, In} from 'typeorm';
import { Basket } from 'src/basket/entities/basket.entity';

@Injectable()
export class PaymentService {
	constructor(
		@InjectRepository(Basket)
		private readonly basketRepository: Repository<Basket>,

		@InjectRepository(Payment)
		private readonly paymentRepository: Repository<Payment>,
	) { }

	async createPaymentList(createBasketDtoList: CreateBasketDto[]) {
		if (!Array.isArray(createBasketDtoList) || createBasketDtoList.length === 0) {
			throw new BadRequestException('No items found in the basket. Please add items to your cart before proceeding to payment.');
		}

		const paymentList: CreatePaymentDto[] = [];

		// 다건의 row 핸들링 시, transaction 적용
		await this.paymentRepository.manager.transaction(async (manager) => {
			for (const dto of createBasketDtoList) {
				const productId: number = dto.productId;
				const userId: string = dto.userId;
				const amount: number = dto.product.price;

				for (let i = 0; i < dto.productQuantity; i++) {
					const payment = plainToClass(CreatePaymentDto, { productId, userId, amount });
					paymentList.push(payment);
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

	async createPaymentNow(createPaymentDtoList: CreatePaymentDto[]) {
		if (!Array.isArray(createPaymentDtoList) || createPaymentDtoList.length === 0) {
			throw new BadRequestException('No items found');
		}

		return this.paymentRepository.insert(createPaymentDtoList);
	}

	async findAllByUserId(userId: string, query: any) {
		const limit = +query?.limit || 20;
		const skip = +query?.skip || 0;
		const search = query?.search ?  `%${query.search}%`: '%';
		const priority = query?.priority || 'payData';
		let priorityOrderby = {};
		priorityOrderby[priority] = query[priority];
		const orderCondition = {...priorityOrderby, payDate: query.payDate || 'DESC', totalPrice: query.totalPrice || 'DESC', name: query.name || 'DESC' };

		const paymentList = this.paymentRepository.createQueryBuilder('a')
			.innerJoin('a.product', 'b')
			.select(['a.userId as userId', 'a.productId as productId', 'b.name as name', 'a.payDate as payDate', 'b.image_url as imageUrl'])
			.addSelect('COUNT(1)', 'pCnt')
			.addSelect('SUM(a.amount)', 'totalPrice')
			.where('a.userId = :userId', { userId })
			.andWhere('lower(b.name) LIKE lower(:search)', { search })
			.groupBy('a.userId, a.productId, b.name, a.payDate, b.image_url')
			.orderBy('a.payId', 'DESC');

		const paymentListWithPaging = this.paymentRepository.manager.createQueryBuilder()
		    .select('aa.*')
			.from(`(${paymentList.getQuery()})`, 'aa')
			.skip(skip)
			.take(limit)
			.setParameters(paymentList.getParameters());

		Object.entries(orderCondition).forEach(([col, order]) => {
			paymentListWithPaging.addOrderBy(`aa.${col}`, (order as 'DESC'|'ASC'));
		});

		const paymemtCount = this.paymentRepository.manager.createQueryBuilder()
		    .select('count(1)', 'cnt')
			.from(`(${paymentList.getQuery()})`, 'aa')
			.setParameters(paymentList.getParameters());

		const [list, count] = await Promise.all([paymentListWithPaging.getRawMany(), paymemtCount.getRawOne()]);

		return { list, count: count.cnt };
	}

	async findPaidProduct(userId: string, productId: number, payDate: string) {
		return await this.paymentRepository.createQueryBuilder('a')
		.innerJoin('a.product', 'b')
		.select('a.payId')
		.addSelect('b')
		.where('a.userId = :userId', { userId })
		.andWhere('a.productId = :productId', { productId })
		.andWhere('a.payDate = :payDate', { payDate })
		.getMany();
	}

	async removePayments(payIdArray: number[]) {
		if (!Array.isArray(payIdArray) || payIdArray.length === 0) {
			throw new BadRequestException('No payments found to delete.');
		}

		return this.paymentRepository.delete({payId: In(payIdArray)});
	}
}
