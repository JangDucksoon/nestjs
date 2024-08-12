import { Basket } from "src/basket/entities/basket.entity";
import { Payment } from "src/payment/entities/payment.entity";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class Auth {
    @PrimaryGeneratedColumn()
    @Index()
    id: number;

    @Column({type: 'varchar', unique: true, nullable: false})
    @Index()
    username: string;

    @Column({type: 'varchar', nullable: false})
    hashedPassword: string;

    @Column({type: 'varchar', nullable: false, default: 'user'})
    auth: string;

    @OneToMany(() => Basket, basket => basket.auth)
    basket: Basket[];

    @OneToMany(() => Payment, payment => payment.auth)
    payment: Payment[];
}
