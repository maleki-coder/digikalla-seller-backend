import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NewProduct } from 'src/new-product/new-product.entity';

@Entity()
export class InitialCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 20, scale: 1 })
  buyingPrice: number;

  @Column('decimal', { precision: 20, scale: 1, nullable: true })
  shippingCost: number;

  @Column('decimal', { precision: 20, scale: 1, nullable: true })
  cargoCost: number;

  @Column('decimal', { precision: 20, scale: 1 })
  currencyRate: number;

  @Column('decimal', { precision: 20, scale: 1 })
  totalCost: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @OneToOne(() => NewProduct, (product) => product.initialCost)
  @JoinColumn({ name: 'productId' })
  product: NewProduct;
}
