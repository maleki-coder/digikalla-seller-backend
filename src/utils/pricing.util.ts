import { CurrencyType } from "src/types/global.types";

export const calculateComissionFee = (sellingPrice: number, currencyType: "toman" | "rial", commission: number) => {
  let finalSellingPrice = currencyType == 'rial' ? Number(sellingPrice) / 10 : Number(sellingPrice);
  let final = (Number(finalSellingPrice) * Number(commission)) / 100;
  return final;
}

export const calculateVAT = (
  sellingPrice,
  commission,
  fulfillmentAndDeliveryCost,
  labelCost,
  warehousing,
  currencyType: CurrencyType,
) => {
  let commissionFee = calculateComissionFee(
    sellingPrice,
    currencyType,
    commission,
  );
  let fulfillmentAndDeliveryCostToman =
    currencyType == 'rial'
      ? Number(fulfillmentAndDeliveryCost) / 10
      : Number(fulfillmentAndDeliveryCost);
  let final =
    ((commissionFee +
      Number(labelCost) +
      Number(warehousing) +
      Number(fulfillmentAndDeliveryCostToman) / 2) *
      10) /
    100;
  return final;
};

export const calculateDigiKalaCosts = (
  sellingPrice: number,
  commission: number,
  fulfillmentAndDeliveryCost: number,
  currencyType: "rial" | "toman",
  labelCost,
  warehousing
) => {
  let commissionFee = calculateComissionFee(sellingPrice, currencyType, commission);
  let fulfillmentAndDeliveryCostToman = (currencyType == 'rial') ? Number(fulfillmentAndDeliveryCost) / 10 : Number(fulfillmentAndDeliveryCost);
  let tax = calculateVAT(sellingPrice, commission, fulfillmentAndDeliveryCost, labelCost, warehousing, currencyType);
  return Math.round(
    Number(fulfillmentAndDeliveryCostToman) +
    Number(commissionFee) +
    Number(tax) +
    Number(labelCost) +
    Number(warehousing)
  );
};

export const calculateInitialCosts = (
  buyingPrice: number,
  shippingCosts: number,
  cargoCosts: number,
  currencyRate: number,
  type: 'rial' | "toman"
): number => {
  let finalBuyingPrice = Number(buyingPrice) * Number(currencyRate);
  let finalCargoCosts = (Number(cargoCosts) * finalBuyingPrice) / 100;
  let finalShippingCosts = type == 'rial' ? Number(shippingCosts) / 10 : Number(shippingCosts);
  return finalBuyingPrice + finalCargoCosts + finalShippingCosts;
};

export const calculateNetProfit = (
  currencyRate: number,
  buyingPrice: number,
  shippingCost: number,
  cargoCostPercentage: number,
  sellingPrice: number,
  digikalaCosts: number,
  type: "rial" | "toman"
): number => {
  let profitPercentage = calculateProfitPercentage(
    currencyRate,
    buyingPrice || 0,
    shippingCost || 0,
    cargoCostPercentage || 0,
    sellingPrice || 0,
    digikalaCosts || 0,
    type
  );
  let buyingPriceInToman = type == "rial" ? Number(buyingPrice) / 10 : Number(buyingPrice);
  let finalBuyingPrice = buyingPriceInToman * currencyRate;
  return (finalBuyingPrice * profitPercentage) / 100;
};

export const calculateProfitPercentage = (
  currencyRate: number,
  buyingPrice: number,
  shippingCost: number,
  cargoCostPercentage: number,
  sellingPrice: number,
  digikalaCosts: number,
  type: "rial" | "toman"
): number => {
  let convertedBuyingPrice = type == "rial" ? Number(buyingPrice) / 10 : Number(buyingPrice);
  let buyingPriceInToman = convertedBuyingPrice * currencyRate;
  let finalCargoCost = (buyingPriceInToman * Number(cargoCostPercentage)) / 100;
  let convertedShippingInToman = type == "rial" ? Number(shippingCost) / 10 : Number(shippingCost);
  let finalBuyingPrice = buyingPriceInToman + convertedShippingInToman + finalCargoCost;
  let sellingPriceInToman = type == "rial" ? Number(sellingPrice) / 10 : Number(sellingPrice);
  let digikalaCostsInToman = type == "rial" ? Number(digikalaCosts) / 10 : Number(digikalaCosts);
  let finalSellingPrice = sellingPriceInToman - digikalaCostsInToman;
  let finalProfit = finalSellingPrice - finalBuyingPrice;
  // if (finalProfit && finalBuyingPrice) {
    return Math.round((finalProfit / finalBuyingPrice) * 100);
  // }
};

