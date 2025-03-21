import {
  Column,
  CreateDateColumn,
  DeepPartial,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CurrencyType } from 'src/types/global.types';
import { DigikalaCost } from 'src/digikala-cost/digikala-cost.entity';
import { ICurrencyType } from './product.dto';
import { InitialCost } from 'src/initial-cost/initial-cost.entity';
import { SellingProfit } from 'src/selling-profit/selling-profit.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  dkp: number;

  @Column({ nullable: true })
  title: string;

  @Column('jsonb')
  currencyType: string | null;

  @Column('decimal', { precision: 20, scale: 0, nullable: true })
  sellingPrice: number;

  @OneToOne(() => SellingProfit, (SellingProfit) => SellingProfit.product)
  profit: SellingProfit;

  @OneToOne(() => DigikalaCost, (digikalaCost) => digikalaCost.product, {
    nullable: true,
  })
  digikalaCost: DigikalaCost;

  @OneToOne(() => InitialCost, (initialCost) => initialCost.product)
  initialCost: InitialCost;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @Column()
  isNewProduct: boolean;
}
