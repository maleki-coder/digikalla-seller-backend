import { IVariants } from "src/interface/IVariants";

export const findPriceRange = (variants: IVariants[]): { minPrice: number; maxPrice: number } | null =>  {
    if (variants.length === 0) return null;
  
    let minPrice = variants[0].price.selling_price;
    let maxPrice = variants[0].price.selling_price;
  
    for (const variant of variants) {
      const price = variant.price.selling_price;
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    }
  
    return { minPrice, maxPrice };
  }