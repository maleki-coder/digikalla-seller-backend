import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { normalizeArabicPersianNumbers } from 'src/utils/character.covertor';
import { INewProduct, Product as IProduct } from './product.dto';
import { InitialCost } from 'src/initial-cost/initial-cost.entity';
import { DigikalaCost } from 'src/digikala-cost/digikala-cost.entity';
import { Product } from './product.entity';
import { SellingProfit } from 'src/selling-profit/selling-product.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(InitialCost)
    private readonly initialCostRepository: Repository<InitialCost>,
    @InjectRepository(DigikalaCost)
    private readonly digikalaCostRepository: Repository<DigikalaCost>,
    @InjectRepository(SellingProfit)
    private readonly sellingProfitRepository: Repository<SellingProfit>,
  ) { }

  async create(productData: Partial<IProduct>): Promise<Product> {
    try {
      if (!productData.initialCost?.currencyRate) {
        throw new BadRequestException('نرخ ارز را وارد کنید');
      }
      if (!productData.initialCost?.buyingPrice) {
        throw new BadRequestException('قیمت خرید را وارد کنید');
      }
      if (productData.isNewProduct) {
        if (!productData.title) {
          throw new BadRequestException('عنوان کالا را وارد کنید');
        }
        if (!(productData as INewProduct).sellingPrice) {
          throw new BadRequestException('قیمت فروش را وارد کنید');
        }
        productData.title = normalizeArabicPersianNumbers(productData.title);
      }

      if (!productData.isNewProduct) {
        // Check if product with the same title exists
        const existingProduct = await this.productRepository.findOne({
          where: { dkp: productData.dkp },
        });

        if (existingProduct) {
          throw new BadRequestException('یک محصول با این کد وجود دارد');
        }
        // Create and save InitialCost
        const initialCost = this.initialCostRepository.create({
          buyingPrice: productData.initialCost?.buyingPrice,
          shippingCost: productData.initialCost?.shippingCost,
          cargoCost: productData.initialCost?.cargoCost,
          currencyRate: productData.initialCost?.currencyRate,
          totalCost: productData.initialCost?.totalCost,
        });
        // Create and save Product
        await this.initialCostRepository.save(initialCost);
        const product = this.productRepository.create({
          ...productData,
          initialCost
        });
        return await this.productRepository.save(product);
      }
      // Normalize title

      // Check if product with the same title exists
      const existingProduct = await this.productRepository.findOne({
        where: { title: productData.title },
      });

      if (existingProduct) {
        throw new BadRequestException('یک محصول با این عنوان وجود دارد');
      }

      // Create and save InitialCost
      const initialCost = this.initialCostRepository.create({
        buyingPrice: productData.initialCost?.buyingPrice,
        shippingCost: productData.initialCost?.shippingCost,
        cargoCost: productData.initialCost?.cargoCost,
        currencyRate: productData.initialCost?.currencyRate,
        totalCost: productData.initialCost?.totalCost,
      });
      await this.initialCostRepository.save(initialCost);

      // Create and save DigikalaCost
      const digikalaCost = this.digikalaCostRepository.create({
        commission: (productData as INewProduct)?.digikalaCost?.commission,
        fulfillmentAndDeliveryCost: (productData as INewProduct)?.digikalaCost
          ?.fulfillmentAndDeliveryCost,
        labelCost: (productData as INewProduct)?.digikalaCost?.labelCost,
        wareHousingCost: (productData as INewProduct)?.digikalaCost
          ?.wareHousingCost,
        commissionFee: (productData as INewProduct)?.digikalaCost.commissionFee,
        taxCost: (productData as INewProduct)?.digikalaCost?.taxCost,
        totalCost: (productData as INewProduct)?.digikalaCost?.totalCost,
      });
      await this.digikalaCostRepository.save(digikalaCost);

      const profit = this.sellingProfitRepository.create({
        netProfit: (productData as INewProduct)?.profit.netProfit,
        profitPercentage: (productData as INewProduct)?.profit
          ?.percentageProfit,
      })
      await this.sellingProfitRepository.save(profit);
      // Create and save Product
      const product = this.productRepository.create({
        ...productData,
        profit,
        initialCost,
        digikalaCost,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async findAll(isNewProduct?: boolean): Promise<Product[]> {
    try {
      const queryOptions: any = {
        relations: ['initialCost', 'digikalaCost', 'profit'],
      };

      if (isNewProduct !== undefined) {
        queryOptions.where = { isNewProduct };
      }

      return await this.productRepository.find(queryOptions);
    } catch (error) {
      throw new InternalServerErrorException(
        `خطا در دریافت اطلاعات: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve product: ${error.message}`,
      );
    }
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    try {
      const existingProduct = await this.findOne(id);
      if (!existingProduct) {
        throw new NotFoundException(
          `Cannot update: Product with ID ${id} not found.`,
        );
      }

      await this.productRepository.update(id, productData);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update product: ${error.message}`,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.productRepository.delete(id);
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
