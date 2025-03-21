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
export class DigikalaCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 20, scale: 0, nullable: true })
  commission: number;

  @Column('decimal', { precision: 20, scale: 0, nullable: true })
  commissionFee: number;

  @Column('decimal', { precision: 20, scale: 0, nullable: true })
  fulfillmentAndDeliveryCost: number;

  @Column('decimal', { precision: 20, scale: 0, nullable: true })
  labelCost: number;

  @Column('decimal', { precision: 20, scale: 0, nullable: true })
  taxCost: number;

  @Column('decimal', { precision: 20, scale: 0, nullable: true })
  wareHousingCost: number;

  @Column('decimal', { precision: 20, scale: 0, nullable: true })
  totalCost: number;

  @OneToOne(() => Product, (product) => product.digikalaCost, {
    nullable: true,
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ name: 'productId', nullable: true })
  productId: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;
}
