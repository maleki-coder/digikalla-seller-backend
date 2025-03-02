import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { NewProduct } from './new-product/new-product.entity';
import { NewProductController } from './new-product/new-product.controller';
import { NewProductService } from './new-product/new-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigikalaCost } from './digikala-cost/digikala-cost.entity';
import { InitialCost } from './initial-cost/initial-cost.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'digikala',
      entities: [NewProduct,InitialCost, DigikalaCost],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([NewProduct,InitialCost, DigikalaCost]),
  ],
  controllers: [AppController, NewProductController],
  providers: [AppService, NewProductService],
})
export class AppModule { }
