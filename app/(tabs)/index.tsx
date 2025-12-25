import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmptyState, SearchBar, SectionHeader } from '../../components';
import { FILTER_CATEGORIES } from '../../constants/Categories';
import { Colors } from '../../constants/Colors';
import { commonStyles, radius, shadows, spacing } from '../../constants/Styles';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';

export default function HomeScreen() {
  const { products, isDarkMode } = useStore();
  const router = useRouter();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search
  const searchResults = searchQuery.length > 0
    ? products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  // Newest products (first 6 from the list)
  const newestProducts = products.slice(0, 6);

  // Low stock products (stock < 5 and > 0)
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);

  // Get products count by category
  const getCategoryCount = (category: string) => {
    return products.filter(p => p.category === category).length;
  };

  // Mini Product Card for horizontal list
  const MiniProductCard = ({ product }: { product: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/product-detail?id=${product.id}`)}
    >
      <Text style={styles.productEmoji}>{product.image}</Text>
      <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={[styles.productPrice, { color: colors.primary }]}>
        Rp {product.price.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  // Low Stock Card
  const LowStockCard = ({ product }: { product: Product }) => (
    <TouchableOpacity
      style={[styles.lowStockCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/product-detail?id=${product.id}`)}
    >
      <View style={[styles.lowStockBadge, { backgroundColor: colors.error }]}>
        <Text style={styles.lowStockBadgeText}>Sisa {product.stock}</Text>
      </View>
      <Text style={styles.lowStockEmoji}>{product.image}</Text>
      <View style={styles.lowStockInfo}>
        <Text style={[styles.lowStockName, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.lowStockPrice, { color: colors.primary }]}>
          Rp {product.price.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Search Result Card
  const SearchResultCard = ({ product }: { product: Product }) => (
    <TouchableOpacity
      style={[styles.searchResultCard, { backgroundColor: colors.card }]}
      onPress={() => {
        setSearchQuery('');
        router.push(`/product-detail?id=${product.id}`);
      }}
    >
      <Text style={styles.searchResultEmoji}>{product.image}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.searchResultName, { color: colors.text }]}>{product.name}</Text>
        <Text style={[styles.productPrice, { color: colors.primary }]}>
          Rp {product.price.toLocaleString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text + '40'} />
    </TouchableOpacity>
  );

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ backgroundColor: colors.background }}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroTitle}>🧁 SweetBite</Text>
          <Text style={styles.heroSubtitle}>Temukan kue favoritmu!</Text>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari kue..."
          />
        </View>

        {/* Search Results */}
        {searchQuery.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Hasil Pencarian ({searchResults.length})
            </Text>
            {searchResults.length > 0 ? (
              searchResults.slice(0, 5).map(product => (
                <SearchResultCard key={product.id} product={product} />
              ))
            ) : (
              <Text style={[styles.noResults, { color: colors.text }]}>
                Produk tidak ditemukan
              </Text>
            )}
          </View>
        ) : (
          <>
            {/* CTA Button */}
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: colors.secondary }]}
              onPress={() => router.push('/(tabs)/products')}
            >
              <View style={commonStyles.row}>
                <Ionicons name="storefront" size={24} color="#FFFFFF" />
                <View style={{ marginLeft: spacing.md }}>
                  <Text style={styles.ctaTitle}>Jelajahi Semua Produk</Text>
                  <Text style={styles.ctaSubtitle}>{products.length} produk tersedia</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Category Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Kategori</Text>
              <View style={styles.categoryGrid}>
                {FILTER_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[styles.categoryCard, { backgroundColor: colors.card }]}
                    onPress={() => router.push(`/(tabs)/products`)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[styles.categoryLabel, { color: colors.text }]}>
                      {category.label}
                    </Text>
                    <Text style={[styles.categoryCount, { color: colors.primary }]}>
                      {getCategoryCount(category.name)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Produk Terbaru */}
            {newestProducts.length > 0 && (
              <View style={styles.section}>
                <SectionHeader
                  title="✨ Produk Terbaru"
                  onSeeAll={() => router.push('/(tabs)/products')}
                />
                <FlatList
                  horizontal
                  data={newestProducts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <MiniProductCard product={item} />}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            )}

            {/* Stok Terbatas */}
            {lowStockProducts.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="🔥 Stok Terbatas" />
                <View style={styles.lowStockList}>
                  {lowStockProducts.slice(0, 3).map(product => (
                    <LowStockCard key={product.id} product={product} />
                  ))}
                </View>
              </View>
            )}

            {/* Empty State */}
            {products.length === 0 && (
              <EmptyState
                icon="🧁"
                title="Belum ada produk"
                subtitle="Tambahkan produk pertamamu!"
                buttonText="Tambah Produk"
                onButtonPress={() => router.push('/add-product')}
              />
            )}
          </>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: spacing.xl,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.medium,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ctaSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryCard: {
    width: '18%',
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  productCard: {
    width: 130,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  lowStockList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  lowStockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    position: 'relative',
  },
  lowStockBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.sm,
  },
  lowStockBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lowStockEmoji: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  lowStockInfo: {
    flex: 1,
  },
  lowStockName: {
    fontSize: 15,
    fontWeight: '600',
  },
  lowStockPrice: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
  },
  searchResultEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
  },
  noResults: {
    textAlign: 'center',
    padding: spacing.xl,
    opacity: 0.6,
  },
});
