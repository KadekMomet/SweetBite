import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { Link } from 'expo-router';
import { Product } from '../types';
import { Colors } from '../constants/Colors';
import { useStore } from '../store/useStore';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isDarkMode } = useStore();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  const handleAddToCart = () => {
    if (product.stock === 0) {
    Toast.show({
      type: 'error',
      text1: 'Stok produk habis!',
      position: 'top', 
      visibilityTime: 3000,
    });
    return;
    }

    addToCart(product);
    Toast.show({
        type: 'success',
        text1: `${product.name} ditambahkan ke keranjang!`,
        position: 'top',
        visibilityTime: 2000,
    });

    
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Link href={`/product-detail?id=${product.id}`} asChild>
        <TouchableOpacity style={styles.productInfo}>
          <Text style={[styles.emoji, { fontSize: width * 0.1 }]}>
            {product.image}
          </Text>
          <View style={styles.details}>
            <Text style={[styles.name, { color: colors.text }]}>
              {product.name}
            </Text>
            <Text style={[styles.description, { color: colors.text }]} 
                  numberOfLines={2}>
              {product.description}
            </Text>
            <Text style={[styles.price, { color: colors.primary }]}>
              Rp {product.price.toLocaleString()}
            </Text>
            <Text style={[styles.stock, { color: colors.text }]}>
              Stok: {product.stock}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={handleAddToCart}
        disabled={product.stock === 0}
      >
        <Text style={styles.addButtonText}>
          {product.stock === 0 ? 'Stok Habis' : '+ Keranjang'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stock: {
    fontSize: 12,
    opacity: 0.6,
  },
  addButton: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});