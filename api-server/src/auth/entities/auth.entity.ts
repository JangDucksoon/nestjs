import { Basket } from "src/basket/entities/basket.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    hashed_password: string;

    @Column({default: 'user'})
    auth: string;

    @OneToMany(() => Basket, basket => basket.auth)
    basket: Basket[];
}
