import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from 'src/new-product/product.entity';

@Entity()
  export class SellingProfit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 20, scale: 1, nullable: true })
    netProfit: number;
  
    @Column('decimal', { precision: 20, scale: 1, nullable: true })
    percentageProfit: number;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;
  
    @OneToOne(() => Product, (product) => product.profit)
    @JoinColumn({ name: 'productId' })
    product: Product;
  }
  