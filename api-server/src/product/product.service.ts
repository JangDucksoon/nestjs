import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
  }

  findAll(query: any) {
    const skip: number = query?.skip ? +query.skip : 0;
    const take: number = query?.limit ? +query.limit : 10;
    const order: Record<string, 'ASC' | 'DESC'> = {'id': 'DESC'}
    const search: string = query?.search || '';

    return this.productRepository.findAndCount({
      where: search? [{ name: ILike(`%${search}%`) }, {description: ILike(`%${search}%`)}] : undefined,
      skip, 
      take,
      order
    });
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({id});
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update({id}, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  findPreImage(id: number) {
    return this.productRepository.createQueryBuilder('product')
    .select(['product.image_url', 'product.name'])
    .where('id = :id', {id})
    .getOneOrFail();
  }
}
