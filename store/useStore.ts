import { create } from 'zustand';
import * as productService from '../lib/productService';
import { CartItem, Order, Product } from '../types';

const MAX_ORDERS = 20; // Batas maksimal riwayat pesanan

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isDarkMode: boolean;
  isLoading: boolean;
  // Supabase async operations
  fetchProducts: () => Promise<void>;
  addProductAsync: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProductAsync: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProductAsync: (id: string) => Promise<void>;
  createOrderAsync: () => Promise<void>;
  // Local operations (kept for offline/fallback)
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
  editProduct: (id: string, product: Partial<Product>) => void;
  updateStockOnOrder: (cartItems: CartItem[]) => void;
  // Order history management
  deleteOrder: (id: string) => void;
  clearOrderHistory: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  cart: [],
  orders: [],
  isDarkMode: false,
  isLoading: false,

  // Supabase: Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const products = await productService.getProducts();
      set({ products, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ isLoading: false });
    }
  },

  // Supabase: Create product
  addProductAsync: async (product) => {
    try {
      const newProduct = await productService.createProduct(product);
      set((state) => ({
        products: [newProduct, ...state.products]
      }));
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  },

  // Supabase: Update product
  updateProductAsync: async (id, product) => {
    try {
      const updatedProduct = await productService.updateProduct(id, product);
      set((state) => ({
        products: state.products.map(p => p.id === id ? updatedProduct : p)
      }));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  // Supabase: Delete product
  deleteProductAsync: async (id) => {
    try {
      await productService.deleteProductFromDB(id);
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  // Supabase: Create order and update stock
  createOrderAsync: async () => {
    const state = get();
    if (state.cart.length === 0) return;

    try {
      // Calculate new stock for each product
      const stockUpdates = state.cart.map(item => ({
        id: item.product.id,
        newStock: Math.max(0, item.product.stock - item.quantity)
      }));

      // Update stock in Supabase
      await productService.updateMultipleStocks(stockUpdates);

      // Create order locally
      const newOrder: Order = {
        id: Date.now().toString(),
        items: [...state.cart],
        total: state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        status: 'pending',
        createdAt: new Date()
      };

      // Update local state with max orders limit
      set((currentState) => {
        const updatedOrders = [...currentState.orders, newOrder];
        // Jika melebihi batas, hapus pesanan terlama yang sudah selesai/dibatalkan
        const trimmedOrders = updatedOrders.length > MAX_ORDERS
          ? updatedOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, MAX_ORDERS)
          : updatedOrders;

        return {
          orders: trimmedOrders,
          cart: [],
          products: currentState.products.map(product => {
            const cartItem = state.cart.find(item => item.product.id === product.id);
            if (cartItem) {
              return {
                ...product,
                stock: Math.max(0, product.stock - cartItem.quantity)
              };
            }
            return product;
          })
        };
      });
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

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
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantityInCart + quantity;

    // Check if adding would exceed available stock
    if (newTotalQuantity > product.stock) {
      // Don't add if it exceeds stock
      return state;
    }

    if (existingItem) {
      return {
        cart: state.cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newTotalQuantity }
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

    state.updateStockOnOrder(state.cart);

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

  editProduct: (id: string, product: Partial<Product>) => set((state) => ({
    products: state.products.map(p =>
      p.id === id ? { ...p, ...product } : p
    )
  })),

  updateStockOnOrder: (cartItems: CartItem[]) => set((state) => ({
    products: state.products.map(product => {
      const cartItem = cartItems.find(item => item.product.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: Math.max(0, product.stock - cartItem.quantity)
        };
      }
      return product;
    })
  })),

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // Order history management
  deleteOrder: (id: string) => set((state) => ({
    orders: state.orders.filter(order => order.id !== id)
  })),

  clearOrderHistory: () => set((state) => ({
    // Hanya hapus pesanan yang sudah selesai atau dibatalkan
    orders: state.orders.filter(order => order.status === 'pending')
  })),
}));