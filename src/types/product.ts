export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string | null;
  image_url?: string;
  category?: number | null;
  is_featured?: boolean;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
}
