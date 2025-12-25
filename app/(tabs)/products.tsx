import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmptyState, ProductCard, SearchBar } from '../../components';
import { CATEGORIES } from '../../constants/Categories';
import { Colors } from '../../constants/Colors';
import { useStore } from '../../store/useStore';

export default function ProductsScreen() {
  const { products, isDarkMode } = useStore();
  const router = useRouter();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isFilterActive = selectedCategory !== 'All';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Produk</Text>
          <Text style={styles.headerSubtitle}>{products.length} item tersedia</Text>
        </View>
      </LinearGradient>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari produk..."
          />
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categorySection}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            const count = item.name === 'All'
              ? products.length
              : products.filter(p => p.category === item.name).length;
            const isSelected = selectedCategory === item.name;

            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setSelectedCategory(item.name)}
              >
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={[
                  styles.categoryLabel,
                  { color: isSelected ? '#FFFFFF' : colors.text }
                ]}>
                  {item.label}
                </Text>
                <View style={[
                  styles.categoryCount,
                  { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : colors.background }
                ]}>
                  <Text style={[
                    styles.categoryCountText,
                    { color: isSelected ? '#FFFFFF' : colors.text + '80' }
                  ]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Active Filter Badge */}
      {isFilterActive && (
        <View style={styles.activeFilterSection}>
          <TouchableOpacity
            style={[styles.activeFilterBadge, { backgroundColor: colors.primary + '15' }]}
            onPress={() => setSelectedCategory('All')}
          >
            <Ionicons name="filter" size={14} color={colors.primary} />
            <Text style={[styles.activeFilterText, { color: colors.primary }]}>
              {selectedCategory}
            </Text>
            <View style={[styles.clearFilter, { backgroundColor: colors.primary }]}>
              <Ionicons name="close" size={10} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.resultCount, { color: colors.text + '60' }]}>
            {filteredProducts.length} hasil
          </Text>
        </View>
      )}

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        ListEmptyComponent={
          <EmptyState
            iconName="fast-food-outline"
            title={searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk'}
            subtitle={searchQuery ? 'Coba kata kunci lain' : 'Yuk tambahkan produk pertama!'}
            buttonText={!searchQuery ? 'Tambah Produk' : undefined}
            onButtonPress={!searchQuery ? () => router.push('/add-product') : undefined}
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-product')}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginTop: -10,
    marginBottom: 12,
  },
  searchWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categorySection: {
    marginBottom: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activeFilterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  activeFilterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clearFilter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCount: {
    fontSize: 12,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});