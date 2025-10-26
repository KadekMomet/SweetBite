import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { ProductCard } from '../../components/ProductCard';
import { Colors } from '../../constants/Colors';

export default function ProductsScreen() {
  const { products, cart, isDarkMode } = useStore();
  const router = useRouter();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Cake', 'Cookies', 'Pastry', 'Bread', 'Dessert'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryStats = (category: string) => {
    if (category === 'All') return products.length;
    return products.filter(p => p.category === category).length;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header dengan Gradient Effect */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>SweetBite 🎂</Text>
          <Text style={styles.headerSubtitle}>Tempatnya Kue Lezat</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Produk</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
            <Text style={styles.statLabel}>Item</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              Rp {cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.text + '80'} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Cari kue favorit..."
          placeholderTextColor={colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.text + '80'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === category ? colors.primary : colors.card,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              { 
                color: selectedCategory === category ? '#FFFFFF' : colors.text,
                fontWeight: selectedCategory === category ? 'bold' : 'normal'
              }
            ]}>
              {category} ({getCategoryStats(category)})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={80} color={colors.text + '40'} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text }]}>
              {searchQuery ? 'Coba kata kunci lain' : 'Yuk tambahkan produk pertama!'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={[styles.addFirstButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/add-product')}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addFirstButtonText}>Tambah Produk Pertama</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListHeaderComponent={
          filteredProducts.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={[styles.listHeaderText, { color: colors.text }]}>
                Menampilkan {filteredProducts.length} produk
              </Text>
            </View>
          ) : null
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-product')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listHeaderText: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  addFirstButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});