export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";
export type SaleDiscountScope = "ALL_PRODUCTS" | "SPECIFIC_PRODUCTS";

export type ActiveSaleDiscount = {
  id: string;
  title: string;
  discountType: DiscountType;
  value: number;
  scope?: SaleDiscountScope;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type ProductPricing = {
  originalPrice: number;
  salePrice: number;
  saleDiscountAmount: number;
  saleDiscountPercentage: number;
  activeSaleDiscount: ActiveSaleDiscount | null;
};

export type PriceableProduct = {
  price?: number;
  originalPrice?: number;
  pricing?: ProductPricing;
};

const money = (value: unknown): number => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

export const getOriginalPrice = (product: PriceableProduct): number =>
  money(
    product.pricing?.originalPrice ?? product.originalPrice ?? product.price
  );

export const getSalePrice = (product: PriceableProduct): number =>
  money(product.pricing?.salePrice ?? product.price);

export const getSaleDiscountAmount = (product: PriceableProduct): number =>
  Math.max(
    0,
    money(product.pricing?.saleDiscountAmount) ||
      getOriginalPrice(product) - getSalePrice(product)
  );

export const hasSaleDiscount = (product: PriceableProduct): boolean =>
  getSaleDiscountAmount(product) > 0 &&
  getOriginalPrice(product) > getSalePrice(product);

export const getSaleDiscountPercentage = (product: PriceableProduct): number => {
  const explicitPercentage = money(product.pricing?.saleDiscountPercentage);
  if (explicitPercentage > 0) return Math.round(explicitPercentage);

  const originalPrice = getOriginalPrice(product);
  const salePrice = getSalePrice(product);
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;

  return Math.round((1 - salePrice / originalPrice) * 100);
};

export const formatCurrency = (value: number): string =>
  `৳${money(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
