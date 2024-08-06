import { Basket } from "src/basket/entities/basket.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn()
    @Index()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({type: 'bigint'})
    price: number;

    @Column({nullable: true})
    image_url: string;

    @OneToMany(() => Basket, basket => basket.product)
    basket: Basket[];
}
