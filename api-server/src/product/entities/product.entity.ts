import { Basket } from "src/basket/entities/basket.entity";
import { Payment } from "src/payment/entities/payment.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn()
    @Index()
    id: number;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type : 'varchar', nullable : false})
    description: string;

    @Column({type: 'bigint', nullable : false})
    @Index()
    price: number;

    @Column({type: 'varchar', nullable: true})
    image_url: string;

    @OneToMany(() => Basket, basket => basket.product)
    basket: Basket[];

    @OneToMany(() => Payment, payment => payment.product)
    payment: Payment[];
}
