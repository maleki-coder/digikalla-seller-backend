export interface IInitialCost {
  id?: number;
  buyingPrice: number;
  shippingCost: number;
  currencyRate: number;
  totalCost: number;
  cargoCost?: number;
  createdAt?: string;
}
export interface IDigikalaCost {
  id?: number;
  commission: number;
  commissionFee: number;
  fulfillmentAndDeliveryCost: number;
  labelCost: number;
  taxCost: number;
  totalCost: number;
  wareHousingCost?: number;
  createdAt?: string;
}
export interface IProfit {
  netProfit: number;
  percentageProfit: number;
}
export type ICurrencyType = 'rial' | 'toman';
export interface IExistingProduct {
  isNewProduct: false;
  dkp: number;
  id?: number;
  title?: string;
  initialCost: IInitialCost;
  highestDigikalaCost: IDigikalaCost;
  highestSellingPrice: number;
  lowestDigikalaCost: IDigikalaCost;
  lowestSellingPrice: number;
  lowestProfit: IProfit;
  highestProfit: IProfit;
  imageList: Array<any>;
  sellingStatus: boolean;
  commentRate: number;
  ratingValue: number;
  reviewCount: number;
  suggestionRate: number;
  currencyType: ICurrencyType;
}
export interface INewProduct {
  id?: number;
  dkp?: number;
  isNewProduct: true;
  title: string;
  digikalaCost: IDigikalaCost;
  initialCost: IInitialCost;
  sellingPrice: number;
  profit: IProfit;
  ImageList: Array<string>;
  '1688_WebLink': string;
  taobao_WebLink: string;
  currencyType: ICurrencyType;
}

export type Product = INewProduct | IExistingProduct;
