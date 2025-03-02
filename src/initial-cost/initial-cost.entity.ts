import { NewProduct } from 'src/new-product/new-product.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class InitialCost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 20, scale: 1 })
    buyingPrice: number;

    @Column('decimal', { precision: 20, scale: 1 })
    shippingCost: number;

    @Column('decimal', { precision: 20, scale: 1, nullable: true })
    cargoCost: number;

    @Column('decimal', { precision: 20, scale: 1 })
    currencyRate: number;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;

    @OneToOne(() => NewProduct, (product) => product.initialCost)
    @JoinColumn({ name: 'productId' })
    product: NewProduct;
}