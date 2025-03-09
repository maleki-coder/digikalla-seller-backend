import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CurrencyType } from 'src/types/global.types';
import { DigikalaCost } from 'src/digikala-cost/digikala-cost.entity';
import { InitialCost } from 'src/initial-cost/initial-cost.entity';
import { SellingProfit } from 'src/selling-profit/selling-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  dkp: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  currencyType: CurrencyType;

  @Column('decimal', { precision: 20, scale: 1, nullable: true })
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
