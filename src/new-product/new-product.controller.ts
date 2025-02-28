import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { NewProductService } from './new-product.service';
import { NewProduct } from './new-product.entity';

@Controller('new-product')
export class NewProductController {
  constructor(private readonly productService: NewProductService) {}

  @Post()
  async create(@Body() productData: Partial<NewProduct>): Promise<NewProduct> {
    return await this.productService.create(productData);
  }

  @Get()
  async findAll(): Promise<NewProduct[]> {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<NewProduct> {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() productData: Partial<NewProduct>,
  ): Promise<NewProduct> {
    return await this.productService.update(id, productData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.productService.delete(id);
  }
}
