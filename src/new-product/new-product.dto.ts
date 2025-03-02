import { CurrencyType } from "src/types/global.types";

export type CreateProductData = {
    title: string;
    sellingPrice: number;
    currencyType?: CurrencyType; // Optional, default is 'toman'
    currencyRate: number; // Required for calculations
    buyingPrice?: number; // For InitialCost
    shippingCost?: number; // For InitialCost
    cargoCost?: number; // For InitialCost
    commission?: number; // For DigikalaCost
    fulfillmentAndDeliveryCost?: number; // For DigikalaCost
    labelCost?: number; // For DigikalaCost
    wareHousingCost?: number; // For DigikalaCost
  };