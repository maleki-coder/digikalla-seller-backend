import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { IExistingProduct, Product as IProduct } from './product.dto';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() productData: Partial<IProduct>): Promise<Product> {
    return await this.productService.create(productData);
  }

  @Get()
  async findAll(@Query('isNewProduct') isNewProduct?: string): Promise<Product[] | IExistingProduct[]> {
    return await this.productService.findAll(isNewProduct);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() productData: Partial<Product>,
  ): Promise<Product> {
    return await this.productService.update(id, productData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.productService.delete(id);
  }
}
