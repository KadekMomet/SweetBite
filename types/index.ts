export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

/**
 * Form data interface for product add/edit forms
 */
export interface ProductForm {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: string;
}