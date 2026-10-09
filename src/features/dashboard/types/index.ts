export interface Brand {
  brand_id: number;
  brand_name: string;
}

export interface Category {
  category_id: number;
  category_name: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  brand: Brand | null;
  category: Category | null;
  part_number: string | null;
  model_number: string | null;
}

export interface Deal {
  log_id: number;
  scraped_at: string;
  price_usd: number;
  stock_status: string;
}
