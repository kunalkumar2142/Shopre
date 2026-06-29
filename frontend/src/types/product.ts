export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  brand: string;
  description: string;
  stock: number;
  price: number;
  rating: number;
  ratingCount: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface ApiProductResponse {
  message: string;
  data: ApiProduct[] | ApiProduct | null;
}

export interface DisplayProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  description?: string;
  stock?: number;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  quantity: number;
}

export interface CartResponse {
  products: CartProduct[];
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}
