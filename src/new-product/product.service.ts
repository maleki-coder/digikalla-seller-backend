import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { normalizeArabicPersianNumbers } from 'src/utils/character.covertor';
import {
  IExistingProduct,
  IInitialCost,
  INewProduct,
  Product as IProduct,
} from './product.dto';
import { InitialCost } from 'src/initial-cost/initial-cost.entity';
import { DigikalaCost } from 'src/digikala-cost/digikala-cost.entity';
import { Product } from './product.entity';
import { SellingProfit } from 'src/selling-profit/selling-profit.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IFetchProductResponseDto } from 'src/interface/IFetchProductResponseDto';
import { IGetProductSellingInfo } from 'src/interface/IGetProductSellingInfo';
import { convertDigiKalaDataForColumn } from 'src/utils/convertDigiKalaDataForColumn';
import Bottleneck from 'bottleneck';
// import pLimit from 'p-limit';
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
    private readonly httpService: HttpService,
    private readonly connection: Connection,
  ) {}

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
          initialCost,
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
        percentageProfit: (productData as INewProduct)?.profit
          ?.percentageProfit,
      });
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

  async findAll(
    isNewProduct?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Product[] | IExistingProduct[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const queryOptions: any = {
        relations: ['initialCost', 'digikalaCost', 'profit'],
        skip: (page - 1) * limit, // Skip items based on page
        take: limit, // Limit results per page
      };

      const isNewProductBoolean = isNewProduct === 'true';

      if (isNewProduct !== undefined) {
        queryOptions.where = { isNewProduct: isNewProductBoolean };
      }

      const [products, totalItems] =
        await this.productRepository.findAndCount(queryOptions);
      const totalPages = Math.ceil(totalItems / limit);
      if (page > totalPages) {
        // Return empty data but correct pagination info
        return {
          data: [],
          totalItems,
          totalPages,
          currentPage: page,
        };
      }
      if (isNewProductBoolean) {
        return {
          data: products,
          totalItems,
          totalPages,
          currentPage: page,
        };
      }
      // if (isNewProductBoolean) {
      //   return products;
      // }

      // Initialize concurrency limiter (e.g., 2 requests at a time)
      const limiter = new Bottleneck({
        maxConcurrent: 2, // 2 requests at a time
        minTime: 1000, // 1 second between requests
      });

      const processingPromises = products.map((product) =>
        limiter.schedule(async () => {
          const dkp = product.dkp;
          if (!product.isNewProduct) {
            try {
              const DIGIKALA_BASE_URL = 'https://api.digikala.com';
              const SELLER_BASE_URL = 'https://seller.digikala.com';
              const PRODUCT_INFO_URL = `${DIGIKALA_BASE_URL}/v2/product/${dkp}/`;
              const SELLING_INFO_URL = `${SELLER_BASE_URL}/api/v2/product-creation/be-seller/${dkp}`;
              const AUTH_TOKEN =
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0b2tlbl9pZCI6MjQ2NTI0NzMsInNlbGxlcl9pZCI6MTUzOTEyOSwicGF5bG9hZCI6eyJ1c2VybmFtZSI6Ijk4OTkxMDcxMTg3MiIsInJlZ2lzdGVyX3Bob25lIjoiOTg5OTEwNzExODcyIiwiZW1haWwiOiJuYWFiaWNvLnRyYWRlQGdtYWlsLmNvbSIsImJ1c2luZXNzX25hbWUiOiJcdTA2MzNcdTA2MmFcdTA2MjdcdTA2MzFcdTA2NDcgXHUwNjQ2XHUwNjM0XHUwNjI3XHUwNjQ2IFx1MDYyYVx1MDYyY1x1MDYyN1x1MDYzMVx1MDYyYSIsImZpcnN0X25hbWUiOiJcdTA2NDVcdTA2MmRcdTA2NDVcdTA2MmYiLCJsYXN0X25hbWUiOiJcdTA2NDVcdTA2NDRcdTA2NDNcdTA2NGEiLCJjb21wYW55X25hbWUiOm51bGwsInZlcmlmaWVkX2J5X290cCI6WyI5ODk5MTA3MTE4NzIiXX0sImV4cCI6MTc0MzM0NzIyOH0.aLIxEUcKpgn3QzJBiYb0-LvlFq-VjvPJ1NuqaPHwUixCX9jsZYTPDrHGGZLPd1Be';

              // Add a delay between requests (optional)
              // await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

              const [productInfo, sellingInfo] = await Promise.all([
                lastValueFrom(
                  this.httpService.get<IFetchProductResponseDto>(
                    PRODUCT_INFO_URL,
                  ),
                ),
                lastValueFrom(
                  this.httpService.get<IGetProductSellingInfo>(
                    SELLING_INFO_URL,
                    {
                      headers: { Authorization: AUTH_TOKEN },
                    },
                  ),
                ),
              ]);

              return convertDigiKalaDataForColumn(
                productInfo.data,
                sellingInfo.data,
                product.initialCost,
                product.id,
              );
            } catch (error) {
              return { error: `خطا در دریافت محصول ${dkp}`, dkp };
            }
          }
          return null;
        }),
      );

      const settledResults = await Promise.allSettled(processingPromises);

      const results: IExistingProduct[] = [];
      const errors: string[] = [];

      settledResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          if (result.value && !('error' in result.value)) {
            results.push(result.value);
          } else if (result.value?.error) {
            errors.push(result.value.error);
          }
        } else {
          errors.push(result.reason.message);
        }
      });

      if (errors.length > 0) {
        throw new InternalServerErrorException(`${errors.join('; ')}`);
      }

      return {
        data: results,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if product exists first
      const product = await queryRunner.manager.findOne(Product, {
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`کالا با کد ${id} یافت نشد.`);
      }

      // Delete related entities first
      await queryRunner.manager.delete(InitialCost, { productId: id });
      await queryRunner.manager.delete(DigikalaCost, { productId: id });
      await queryRunner.manager.delete(SellingProfit, { productId: id });

      // Delete the product
      await queryRunner.manager.delete(Product, id);

      await queryRunner.commitTransaction();
      return {
        success: true,
        message: `کالا با شناسه ${id} با موفقیت حذف شد`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Handle foreign key constraint violation for unexpected relations
      if (error.code === '23503' || error?.driverError?.code === '23503') {
        const constraintMessage = error.driverError?.detail || error.message;
        throw new ConflictException(
          `امکان حذف وجود ندارد: این کالا در سایر موجودیت‌ها استفاده شده است. (${constraintMessage})`,
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(`خطا در حذف: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
