import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  fullfilmentAndDeliveryCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cargoCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  labelCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  taxCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  commisionCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  wareHousingCost: number;
}