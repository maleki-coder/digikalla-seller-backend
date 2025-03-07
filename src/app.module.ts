import { DigikalaCost } from './digikala-cost/digikala-cost.entity';
import { InitialCost } from './initial-cost/initial-cost.entity';
import { Module } from '@nestjs/common';
import { Product } from './new-product/product.entity';
import { ProductController } from './new-product/product.controller';
import { ProductService } from './new-product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'digikala-seller',
      entities: [Product, InitialCost, DigikalaCost],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, InitialCost, DigikalaCost]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
