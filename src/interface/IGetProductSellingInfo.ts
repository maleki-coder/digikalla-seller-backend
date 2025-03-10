export interface IGetProductSellingInfo {
    status: string;
    data: {
        name: string;
        brand: string;
        productId: number;
        commission: {
            canSell: boolean;
            commission: number;
            commissionDiscount: number | null;
        };
        productURL: string;
        referencePrice: number;
        productImage: string;
        fulfillmentAndDeliveryCost: number;
        category: {
            id: number;
            title: string;
            theme: string;
        };
        site: string;
        product_dimension: {
            width: number;
            length: number;
            height: number;
            weight: number;
        };
        price_type: string;
    };
}
