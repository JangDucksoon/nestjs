import { Auth } from "src/auth/entities/auth.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index('ix_payment_pay_id', ['payId'])
@Index('ix_payment_product_id', ['productId'])
@Index('ix_payment_user_id', ['userId'])
export class Payment {

    @PrimaryGeneratedColumn()
    payId: string;

    @Column({ type: 'integer', nullable: false })
    productId: number;

    @Column({ type: 'varchar', nullable: false  })
    userId: string;

    @Column({ type: 'integer', nullable: false })
    amount: number;

    @Column({ type : 'datetime', nullable : false, default: () => 'CURRENT_TIMESTAMP' })
    payData: Date;

    @ManyToOne(() => Auth, auth => auth.payment)
    @JoinColumn({name: 'userId', referencedColumnName: 'username'})
    auth: Auth;

    @ManyToOne(() => Product, product => product.payment)
    @JoinColumn({name: 'productId', referencedColumnName: 'id'})
    product: Product;
}
