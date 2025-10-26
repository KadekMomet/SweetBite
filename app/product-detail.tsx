import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { Colors } from '../constants/Colors';
import Toast from 'react-native-toast-message';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { products, addToCart, deleteProduct, isDarkMode } = useStore();
  const router = useRouter();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Produk tidak ditemukan
        </Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    Toast.show({
      type: 'success',
      text1: 'Produk ditambahkan ke keranjang!',
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Hapus Produk',
      `Yakin ingin menghapus ${product.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => {
            deleteProduct(product.id);
            Toast.show({
              type: 'success',
              text1: 'Produk berhasil dihapus!',
            });
            router.back();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Product Image/Emoji */}
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{product.image}</Text>
        </View>

        {/* Product Info */}
        <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.name, { color: colors.text }]}>
            {product.name}
          </Text>
          <Text style={[styles.category, { color: colors.primary }]}>
            {product.category}
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            Rp {product.price.toLocaleString()}
          </Text>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Deskripsi
            </Text>
            <Text style={[styles.description, { color: colors.text }]}>
              {product.description}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Stok Tersedia
            </Text>
            <Text style={[styles.stock, { color: colors.text }]}>
              {product.stock} buah
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddToCart}
            disabled={product.stock === 0}
          >
            <Text style={styles.addButtonText}>
              {product.stock === 0 ? 'Stok Habis' : '+ Tambah ke Keranjang'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.editButton, { borderColor: colors.secondary }]}
            onPress={() => router.push(`/edit-product?id=${product.id}`)}
          >
            <Text style={[styles.editButtonText, { color: colors.secondary }]}>
              ✏️ Edit Produk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton, { borderColor: colors.error }]}
            onPress={handleDelete}
          >
            <Text style={[styles.deleteButtonText, { color: colors.error }]}>
              🗑️ Hapus Produk
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  emojiContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  emoji: {
    fontSize: 80,
  },
  infoContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  stock: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    gap: 12,
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  editButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});