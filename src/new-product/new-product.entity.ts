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

  @Column({ nullable: true })
  title: string;

  @Column()
  currencyType: CurrencyType;

  @Column('decimal', { precision: 20, scale: 1 })
  sellingPrice: number;

  @Column('decimal', { precision: 20, scale: 1 })
  netProfit: number;

  @Column('decimal', { precision: 20, scale: 1 })
  profitPercentage: number;

  @OneToOne(() => DigikalaCost, (digikalaCost) => digikalaCost.product)
  digikalaCost: DigikalaCost;

  @OneToOne(() => InitialCost, (initialCost) => initialCost.product)
  initialCost: InitialCost;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;
}
