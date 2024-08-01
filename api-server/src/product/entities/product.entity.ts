import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

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
}
