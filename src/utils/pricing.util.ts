import { CurrencyType } from "src/types/global.types";

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
      ? fulfillmentAndDeliveryCost / 10
      : fulfillmentAndDeliveryCost;
  let final =
    ((commissionFee +
      labelCost +
      warehousing +
      Number(fulfillmentAndDeliveryCostToman) / 2) *
      10) /
    100;
  return final;
};

export const calculateComissionFee = (
  sellingPrice,
  currencyType: CurrencyType,
  commission,
) => {
  let finalSellingPrice =
    currencyType == 'rial' ? sellingPrice / 10 : sellingPrice;
  let finalCommission =
    (Number(finalSellingPrice) * Number(commission) * 100) / 100;
  return finalCommission;
};
