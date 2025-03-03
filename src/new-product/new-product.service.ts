import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewProduct } from './new-product.entity';
import {
  calculateComissionFee,
  calculateDigiKalaCosts,
  calculateInitialCosts,
  calculateNetProfit,
  calculateProfitPercentage,
  calculateVAT,
} from 'src/utils/pricing.util';
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
  ) {}

  async create(productData: Partial<CreateProductData>): Promise<NewProduct> {
    try {
      // Validate required fields
      if (!productData.currencyRate) {
        throw new BadRequestException('نرخ ارز را وارد کنید');
      }
      if (!productData.title) {
        throw new BadRequestException('عنوان کالا را وارد کنید');
      }
      if (!productData.buyingPrice) {
        throw new BadRequestException('قیمت خرید را وارد کنید')
      }
      if (!productData.sellingPrice) {
        throw new BadRequestException('قیمت فروش را وارد کنید')
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
        buyingPrice: productData.buyingPrice,
        shippingCost: productData.shippingCost,
        cargoCost: productData.cargoCost,
        currencyRate: productData.currencyRate,
        totalCost: calculateInitialCosts(
          productData.buyingPrice || 0,
          productData.shippingCost || 0,
          productData.cargoCost || 0,
          productData.currencyRate,
          (productData.currencyType = 'toman'),
        ),
      });
      await this.initialCostRepository.save(initialCost);

      // Create and save DigikalaCost
      const digikalaCost = this.digikalaCostRepository.create({
        commission: productData.commission,
        fulfillmentAndDeliveryCost: productData.fulfillmentAndDeliveryCost,
        labelCost: productData.labelCost,
        wareHousingCost: productData.wareHousingCost,
        commissionFee: calculateComissionFee(
          productData.sellingPrice,
          productData.currencyType || 'toman',
          productData.commission || 0,
        ),
        taxCost: calculateVAT(
          productData.sellingPrice,
          productData.commission,
          productData.fulfillmentAndDeliveryCost,
          productData.labelCost,
          productData.wareHousingCost,
          productData.currencyType || 'toman',
        ),
        totalCost: calculateDigiKalaCosts(
          productData.sellingPrice,
          productData.commission || 0,
          productData.fulfillmentAndDeliveryCost || 0,
          (productData.currencyType = 'toman'),
          productData.labelCost,
          productData.wareHousingCost,
        ),
      });
      await this.digikalaCostRepository.save(digikalaCost);

      // Create and save NewProduct
      const product = this.newProductRepository.create({
        ...productData,
        netProfit: calculateNetProfit(
          productData.currencyRate,
          productData.buyingPrice || 0,
          productData.shippingCost || 0,
          productData.cargoCost || 0,
          productData.sellingPrice,
          digikalaCost.totalCost,
          (productData.currencyType = 'toman'),
        ),
        profitPercentage: calculateProfitPercentage(
          productData.currencyRate,
          productData.buyingPrice || 0,
          productData.shippingCost || 0,
          productData.cargoCost || 0,
          productData.sellingPrice,
          digikalaCost.totalCost,
          (productData.currencyType = 'toman'),
        ),
        initialCost,
        digikalaCost,
      });

      return await this.newProductRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async findAll(): Promise<NewProduct[]> {
    try {
      return await this.newProductRepository.find({
        relations : ['initialCost' , 'digikalaCost']
      });
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
