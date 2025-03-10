import { IFetchProductResponseDto } from "src/interface/IFetchProductResponseDto";
import { IGetProductSellingInfo } from "../interface/IGetProductSellingInfo";
import { IExistingProduct } from "src/new-product/product.dto";
import { calculateComissionFee, calculateDigiKalaCosts, calculateNetProfit, calculateProfitPercentage, calculateVAT } from "./pricing.util";
import { findPriceRange } from "./findPriceRange";
import { LabelCost } from "src/types/labelCost.enum";
import { InitialCost } from "src/initial-cost/initial-cost.entity";
import { DigikalaCost } from "src/digikala-cost/digikala-cost.entity";

export const convertDigiKalaDataForColumn = (
    productInfo: IFetchProductResponseDto,
    productSellingInfo: IGetProductSellingInfo,
    initialCost: InitialCost,
    digikalaCost: DigikalaCost
): IExistingProduct => {
    // Helper function to calculate Digikala costs
    const calculateCosts = (price: number) => ({
        commission: productSellingInfo.data.commission.commission,
        commissionFee: calculateComissionFee(
            price,
            "rial",
            productSellingInfo.data.commission.commission
        ),
        fulfillmentAndDeliveryCost: productSellingInfo.data.fulfillmentAndDeliveryCost,
        labelCost: LabelCost.Standard,
        taxCost: calculateVAT(
            price,
            productSellingInfo.data.commission.commission,
            productSellingInfo.data.fulfillmentAndDeliveryCost,
            LabelCost.Standard,
            0,
            "rial"
        ),
        totalCost: calculateDigiKalaCosts(
            price,
            productSellingInfo.data.commission.commission,
            productSellingInfo.data.fulfillmentAndDeliveryCost,
            "rial",
            LabelCost.Standard,
            0
        ),
    });

    // Calculate min and max prices
    const minPrice = findPriceRange(productInfo.data.product.variants)?.minPrice || productSellingInfo.data.referencePrice;
    const maxPrice = findPriceRange(productInfo.data.product.variants)?.maxPrice || productSellingInfo.data.referencePrice;

    // Define lowestDigikalaCost and highestDigikalaCost
    const lowestDigikalaCost = calculateCosts(minPrice);
    const highestDigikalaCost = calculateCosts(maxPrice);

    // Calculate lowestProfit
    const lowestProfit = {
        netProfit: calculateNetProfit(
            initialCost.currencyRate,
            initialCost.buyingPrice,
            initialCost.shippingCost,
            initialCost.cargoCost,
            minPrice,
            lowestDigikalaCost.totalCost,
            'rial'
        ),
        percentageProfit: calculateProfitPercentage(
            initialCost.currencyRate,
            initialCost.buyingPrice,
            initialCost.shippingCost,
            initialCost.cargoCost,
            minPrice,
            lowestDigikalaCost.totalCost,
            'rial'
        ),
    };
    const highestProfit = {
        netProfit: calculateNetProfit(
            initialCost.currencyRate,
            initialCost.buyingPrice,
            initialCost.shippingCost,
            initialCost.cargoCost,
            maxPrice, // Convert rial to toman
            highestDigikalaCost.totalCost,
            'rial'
        ),
        percentageProfit: calculateProfitPercentage(
            initialCost.currencyRate,
            initialCost.buyingPrice,
            initialCost.shippingCost,
            initialCost.cargoCost,
            maxPrice, // Convert rial to toman
            highestDigikalaCost.totalCost,
            'rial'
        ),
    };

    return {
            id: productInfo?.data?.product?.id,
            dkp: productInfo?.data?.product?.id,
            title: productInfo?.data?.product?.title_fa,
            highestDigikalaCost,
            lowestDigikalaCost,
            lowestSellingPrice: minPrice,
            highestSellingPrice: maxPrice,
            sellingStatus: productSellingInfo.data.commission.canSell,
            commentRate: productInfo?.data?.product?.comments_count,
            ratingValue: productInfo?.data?.seo?.markup_schema[0]?.['aggregateRating']?.ratingValue,
            reviewCount: productInfo?.data?.seo?.markup_schema[0]?.['aggregateRating']?.reviewCount,
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
        }
    ;
};