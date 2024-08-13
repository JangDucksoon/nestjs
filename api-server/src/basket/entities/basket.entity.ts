import { Auth } from "src/auth/entities/auth.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('shopping_basket')
@Index('ix_shopping_basket_product_id', ['productId'])
@Index('ix_shopping_basket_user_id', ['userId'])
export class Basket {

    @PrimaryColumn('varchar')
    userId: string;

    @PrimaryColumn('integer')
    productId: number;

    @Column('integer', {default: 1, nullable: false})
    productQuantity: number;

    @Column('integer', {nullable: false})
    totalPrice: number;

    @ManyToOne(() => Auth, auth => auth.basket, { onUpdate: 'CASCADE' })
    @JoinColumn({name: 'userId', referencedColumnName: 'username'})
    auth: Auth;

    @ManyToOne(() => Product, product => product.basket)
    @JoinColumn({name: 'productId', referencedColumnName: 'id'})
    product: Product;
}
