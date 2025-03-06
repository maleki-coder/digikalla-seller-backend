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

@Entity()
export class NewProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  currencyType: CurrencyType;

  @Column('decimal', { precision: 20, scale: 1, nullable: true })
  sellingPrice: number;

  @Column('decimal', { precision: 20, scale: 1, nullable: true })
  netProfit: number;

  @Column('decimal', { precision: 20, scale: 1, nullable: true })
  profitPercentage: number;

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
