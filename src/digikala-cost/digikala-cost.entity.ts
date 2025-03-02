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
export class DigikalaCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 20, scale: 1 })
  commission: number;

  @Column('decimal', { precision: 20, scale: 1 })
  commissionFee: number;

  @Column('decimal', { precision: 20, scale: 1 })
  fulfillmentAndDeliveryCost: number;

  @Column('decimal', { precision: 20, scale: 1 })
  labelCost: number;

  @Column('decimal', { precision: 20, scale: 1 })
  taxCost: number;

  @Column('decimal', { precision: 20, scale: 1 })
  wareHousingCost: number;

  @OneToOne(() => NewProduct, (product) => product.digikalaCost)
  @JoinColumn({ name: 'productId' })
  product: NewProduct;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;
}