import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { Colors } from '../constants/Colors';

export default function HomeScreen() {
  const { products, cart, isDarkMode } = useStore();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          SweetBite 🎂
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Tempatnya Kue Lezat
        </Text>
      </View>

      {/* Navigation Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.navContainer}
      >
        <Link href="/cart" asChild>
          <TouchableOpacity 
            style={[styles.navButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.navButtonText}>
              🛒 Keranjang ({cart.length})
            </Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/add-product" asChild>
          <TouchableOpacity 
            style={[styles.navButton, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.navButtonText}>➕ Tambah Produk</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>

      {/* Products List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Belum ada produk. Yuk tambahkan produk pertama!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  navContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
});