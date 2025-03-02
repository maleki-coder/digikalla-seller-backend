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
export class DigikalaCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 20, scale: 1 })
  commission: number;

  @Column('decimal', { precision: 20, scale: 1 })
  commissionFee: number;

  @Column('decimal', { precision: 20, scale: 1 })
  fulfillmentAndDeliveryCost: number;

  @Column('decimal', { precision: 20, scale: 1, nullable : true })
  labelCost: number;

  @Column('decimal', { precision: 20, scale: 1 })
  taxCost: number;

  @Column('decimal', { precision: 20, scale: 1 , nullable : true})
  wareHousingCost: number;
  
  @Column('decimal', { precision: 20, scale: 1 })
  totalCost: number;

  @OneToOne(() => NewProduct, (product) => product.digikalaCost)
  @JoinColumn({ name: 'productId' })
  product: NewProduct;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;
}