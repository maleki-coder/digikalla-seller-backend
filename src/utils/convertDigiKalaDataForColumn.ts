import {
  calculateComissionFee,
  calculateDigiKalaCosts,
  calculateNetProfit,
  calculateProfitPercentage,
  calculateVAT,
} from './pricing.util';

import { IExistingProduct } from 'src/new-product/product.dto';
import { IFetchProductResponseDto } from 'src/interface/IFetchProductResponseDto';
import { IGetProductSellingInfo } from '../interface/IGetProductSellingInfo';
import { InitialCost } from 'src/initial-cost/initial-cost.entity';
import { LabelCost } from 'src/types/labelCost.enum';
import { findPriceRange } from './findPriceRange';

export const convertDigiKalaDataForColumn = (
  productInfo: IFetchProductResponseDto,
  productSellingInfo: IGetProductSellingInfo,
  initialCost: InitialCost,
  id: number
): IExistingProduct => {
  // Helper function to calculate Digikala costs
  const calculateCosts = (price: number) => ({
    commission: productSellingInfo.data.commission.commission * 100,
    commissionFee: calculateComissionFee(
      price,
      'toman',
      productSellingInfo.data.commission.commission * 100,
    ),
    fulfillmentAndDeliveryCost:
      productSellingInfo.data.fulfillmentAndDeliveryCost / 10,
    labelCost: LabelCost.Standard,
    taxCost: calculateVAT(
      price,
      productSellingInfo.data.commission.commission * 100,
      productSellingInfo.data.fulfillmentAndDeliveryCost / 10,
      LabelCost.Standard,
      0,
      'toman',
    ),
    totalCost: calculateDigiKalaCosts(
      price,
      productSellingInfo.data.commission.commission * 100,
      productSellingInfo.data.fulfillmentAndDeliveryCost / 10,
      'toman',
      LabelCost.Standard,
      0,
    ),
  });

  // Calculate min and max prices
  const minPrice =
    findPriceRange(productInfo.data.product.variants)?.minPrice ||
    productSellingInfo.data.referencePrice;
  const maxPrice =
    findPriceRange(productInfo.data.product.variants)?.maxPrice ||
    productSellingInfo.data.referencePrice;

  // Define lowestDigikalaCost and highestDigikalaCost
  const lowestDigikalaCost = calculateCosts(minPrice / 10);
  const highestDigikalaCost = calculateCosts(maxPrice / 10);

  // Calculate lowestProfit
  const lowestProfit = {
    netProfit: calculateNetProfit(
      initialCost.currencyRate,
      initialCost.buyingPrice,
      initialCost.shippingCost,
      initialCost.cargoCost,
      minPrice / 10,
      lowestDigikalaCost.totalCost,
      'toman',
    ),
    percentageProfit: calculateProfitPercentage(
      initialCost.currencyRate,
      initialCost.buyingPrice,
      initialCost.shippingCost,
      initialCost.cargoCost,
      minPrice / 10,
      lowestDigikalaCost.totalCost,
      'toman',
    ),
  };
  const highestProfit = {
    netProfit: calculateNetProfit(
      initialCost.currencyRate,
      initialCost.buyingPrice,
      initialCost.shippingCost,
      initialCost.cargoCost,
      maxPrice / 10, // Convert rial to toman
      highestDigikalaCost.totalCost,
      'toman',
    ),
    percentageProfit: calculateProfitPercentage(
      initialCost.currencyRate,
      initialCost.buyingPrice,
      initialCost.shippingCost,
      initialCost.cargoCost,
      maxPrice / 10, // Convert rial to toman
      highestDigikalaCost.totalCost,
      'toman',
    ),
  };

  return {
    id: id,
    dkp: productInfo?.data?.product?.id,
    title: productInfo?.data?.product?.title_fa,
    highestDigikalaCost,
    lowestDigikalaCost,
    lowestSellingPrice: minPrice,
    highestSellingPrice: maxPrice,
    sellingStatus: productSellingInfo.data.commission.canSell,
    commentRate: productInfo?.data?.product?.comments_count,
    ratingValue:
      productInfo?.data?.seo?.markup_schema[0]?.['aggregateRating']
        ?.ratingValue,
    reviewCount:
      productInfo?.data?.seo?.markup_schema[0]?.['aggregateRating']
        ?.reviewCount,
    suggestionRate: productInfo?.data?.product?.suggestion?.percentage,
    isNewProduct: false,
    initialCost: {
      id: initialCost.id,
      buyingPrice: initialCost.buyingPrice,
      shippingCost: initialCost.shippingCost,
      currencyRate: initialCost.currencyRate,
      totalCost: initialCost.totalCost,
      cargoCost: initialCost.cargoCost,
      createdAt: initialCost.createdAt as unknown as string,
    },
    lowestProfit,
    highestProfit, // You can calculate this similarly if needed
    imageList: productInfo.data.product.images.list,
    currencyType: null,
  };
};
