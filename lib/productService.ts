import { Product } from '../types';
import { supabase } from './supabase';

// READ - Mengambil semua produk dari Supabase
export const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return data || [];
};

// CREATE - Menambah produk baru ke Supabase
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        throw error;
    }

    return data;
};

// UPDATE - Memperbarui produk di Supabase
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        throw error;
    }

    return data;
};

// DELETE - Menghapus produk dari Supabase
export const deleteProductFromDB = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// READ - Mengambil satu produk berdasarkan ID
export const getProductById = async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data;
};

// UPDATE STOCK - Memperbarui stok produk di Supabase
export const updateStock = async (id: string, newStock: number): Promise<void> => {
    const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id);

    if (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
};

// BATCH UPDATE STOCK - Update stok multiple produk sekaligus
export const updateMultipleStocks = async (
    stockUpdates: { id: string; newStock: number }[]
): Promise<void> => {
    const promises = stockUpdates.map(({ id, newStock }) =>
        supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', id)
    );

    const results = await Promise.all(promises);

    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
        console.error('Errors updating stocks:', errors);
        throw new Error('Failed to update some product stocks');
    }
};
