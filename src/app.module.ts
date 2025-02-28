import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { NewProduct } from './new-product/new-product.entity';
import { NewProductController } from './new-product/new-product.controller';
import { NewProductService } from './new-product/new-product.service';
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
      entities: [NewProduct],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([NewProduct]),
  ],
  controllers: [AppController, NewProductController],
  providers: [AppService, NewProductService],
})
export class AppModule {}
