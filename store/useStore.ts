import { create } from 'zustand';
import { Product, CartItem, Order } from '../types';

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isDarkMode: boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  createOrder: () => void;
  toggleDarkMode: () => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [
    {
      id: '1',
      name: 'Red Velvet Cake',
      description: 'Lembut dengan cream cheese frosting yang creamy',
      price: 85000,
      image: '🍰',
      category: 'Cake',
      stock: 10
    },
    {
      id: '2',
      name: 'Chocolate Chip Cookies',
      description: 'Renyah dengan choco chips melimpah',
      price: 15000,
      image: '🍪',
      category: 'Cookies',
      stock: 25
    },
    {
      id: '3',
      name: 'Croissant Butter',
      description: 'Berlapis-lapis dengan butter premium',
      price: 22000,
      image: '🥐',
      category: 'Pastry',
      stock: 15
    }
  ],
  cart: [],
  orders: [],
  isDarkMode: false,

  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Date.now().toString() }]
  })),

  updateProduct: (id, product) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),

  addToCart: (product, quantity = 1) => set((state) => {
    const existingItem = state.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      return {
        cart: state.cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    
    return {
      cart: [...state.cart, { 
        id: Date.now().toString(), 
        product, 
        quantity 
      }]
    };
  }),

  updateCartItem: (id, quantity) => set((state) => ({
    cart: quantity === 0 
      ? state.cart.filter(item => item.id !== id)
      : state.cart.map(item => item.id === id ? { ...item, quantity } : item)
  })),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),

  clearCart: () => set({ cart: [] }),

  createOrder: () => set((state) => {
    if (state.cart.length === 0) return state;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...state.cart],
      total: state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      status: 'pending',
      createdAt: new Date()
    };
    
    return {
      orders: [...state.orders, newOrder],
      cart: []
    };
  }),

  updateOrder: (id: string, updates: Partial<Order>) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === id ? { ...order, ...updates } : order
    )
  })),
  
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}));