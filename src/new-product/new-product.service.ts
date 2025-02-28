import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewProduct } from './new-product.entity';
import { calculateComissionFee, calculateVAT } from 'src/utils/pricing.util';
import { normalizeArabicPersianNumbers } from 'src/utils/character.covertor';

@Injectable()
export class NewProductService {
  constructor(
    @InjectRepository(NewProduct)
    private readonly newProductRepository: Repository<NewProduct>,
  ) {}

  async create(productData: Partial<NewProduct>): Promise<NewProduct> {
    try {
      if (
        !productData.title ||
        !productData.buyingPrice ||
        !productData.sellingPrice ||
        !productData.commission ||
        !productData.fulfillmentAndDeliveryCost
      ) {
        throw new BadRequestException('Missing required fields');
      }
      productData.title = normalizeArabicPersianNumbers(productData.title);
      // Check if product with the same title or other unique field exists
      const existingProduct = await this.newProductRepository.findOne({
        where: { title: productData.title }, // You can add more conditions here if needed (e.g., buyingPrice)
      });

      if (existingProduct) {
        throw new BadRequestException('یک محصول با این عنوان وجود دارد');
      }
      productData.taxCost = calculateVAT(
        productData.sellingPrice,
        productData.commission,
        productData.fulfillmentAndDeliveryCost,
        (productData.labelCost = 4000), // Default value
        (productData.wareHousingCost = 6000), // Default value
        (productData.currencyType = 'toman'), // Default value,
      );

      productData.commissionFee = calculateComissionFee(
        productData.sellingPrice,
        productData.currencyType || 'toman',
        productData.commission,
      );
      if (
        !productData.currencyRate ||
        productData.currencyRate == 0 ||
        productData.currencyRate < 0
      ) {
        throw new BadRequestException('نرخ ارز را به درستی وارد کنید');
      }
      const product = this.newProductRepository.create(productData);
      return await this.newProductRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async findAll(): Promise<NewProduct[]> {
    try {
      return await this.newProductRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve products: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<NewProduct> {
    try {
      const product = await this.newProductRepository.findOne({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`NewProduct with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve product: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    productData: Partial<NewProduct>,
  ): Promise<NewProduct> {
    try {
      const existingProduct = await this.findOne(id);
      if (!existingProduct) {
        throw new NotFoundException(
          `Cannot update: Product with ID ${id} not found.`,
        );
      }

      await this.newProductRepository.update(id, productData);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update product: ${error.message}`,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.newProductRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Cannot delete: Product with ID ${id} not found.`,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete product: ${error.message}`,
      );
    }
  }
}
