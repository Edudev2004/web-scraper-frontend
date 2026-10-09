export interface Currency {
  currency_id: number;
  currency_code: string;
  currency_name: string;
  symbol: string;
}

export interface Vendor {
  vendor_id: number;
  vendor_name: string;
  country_code: string;
  website: string | null;
  contact_email: string | null;
  default_currency_id: number;
  is_active: boolean;
  created_at: string;
  currency?: Currency | null;
  total_catalogs?: number;
  has_driver?: boolean;
}

export interface VendorFormData {
  vendor_name: string;
  country_code: string;
  website: string;
  contact_email: string;
  default_currency_id: number;
  is_active: boolean;
}
