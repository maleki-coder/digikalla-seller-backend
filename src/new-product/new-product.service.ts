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
import { CreateProductData } from './new-product.dto';
import { InitialCost } from 'src/initial-cost/initial-cost.entity';
import { DigikalaCost } from 'src/digikala-cost/digikala-cost.entity';

@Injectable()
export class NewProductService {
  constructor(
    @InjectRepository(NewProduct)
    private readonly newProductRepository: Repository<NewProduct>,
    @InjectRepository(InitialCost)
    private readonly initialCostRepository: Repository<InitialCost>, // Inject InitialCost repository
    @InjectRepository(DigikalaCost)
    private readonly digikalaCostRepository: Repository<DigikalaCost>, // Inject DigikalaCost repository
  ) { }

  async create(productData: Partial<CreateProductData>): Promise<NewProduct> {
    try {
      // Validate required fields
      if (
        !productData.title ||
        !productData.sellingPrice ||
        !productData.currencyRate
      ) {
        throw new BadRequestException('Missing required fields');
      }

      // Normalize title
      productData.title = normalizeArabicPersianNumbers(productData.title);

      // Check if product with the same title exists
      const existingProduct = await this.newProductRepository.findOne({
        where: { title: productData.title },
      });

      if (existingProduct) {
        throw new BadRequestException('یک محصول با این عنوان وجود دارد');
      }

      // Create and save InitialCost
      const initialCost = this.initialCostRepository.create({
        buyingPrice: productData.buyingPrice || 0,
        shippingCost: productData.shippingCost || 0,
        cargoCost: productData.cargoCost || 0,
        currencyRate: productData.currencyRate || 0,
      });
      await this.initialCostRepository.save(initialCost);

      // Create and save DigikalaCost
      const digikalaCost = this.digikalaCostRepository.create({
        commission: productData.commission || 0,
        fulfillmentAndDeliveryCost: productData.fulfillmentAndDeliveryCost || 0,
        labelCost: productData.labelCost || 4000,
        wareHousingCost: productData.wareHousingCost || 6000,
        commissionFee: calculateComissionFee(
          productData.sellingPrice,
          productData.currencyType || 'toman',
          productData.commission || 0,
        ),
        taxCost: calculateVAT(
          productData.sellingPrice,
          productData.commission,
          productData.fulfillmentAndDeliveryCost,
          productData.labelCost || 4000,
          productData.wareHousingCost || 6000,
          productData.currencyType || 'toman',
        )
      });
      await this.digikalaCostRepository.save(digikalaCost);

      // Create and save NewProduct
      const product = this.newProductRepository.create({
        ...productData,
        initialCost, // Link InitialCost
        digikalaCost, // Link DigikalaCost
      });

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
