import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CurrencyType } from 'src/types/global.types';

@Entity()
export class NewProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  currencyType: CurrencyType;

  @Column('decimal', { precision: 20, scale: 1 })
  buyingPrice: number;

  @Column('decimal', { precision: 20, scale: 1,nullable: true  })
  shippingCost: number;

  @Column('decimal', { precision: 20, scale: 1, nullable: true })
  cargoCost: number;

  @Column('decimal', { precision: 20, scale: 1 })
  sellingPrice: number;

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

  @Column('decimal', { precision: 20, scale: 1 })
  digikalaCost: number;

  @Column('decimal', { precision: 20, scale: 1 })
  currencyRate: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;
}
