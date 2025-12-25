import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, HeroHeader, StatusBadge } from '../components';
import { Colors } from '../constants/Colors';
import { commonStyles, radius, shadows, spacing } from '../constants/Styles';
import { useStore } from '../store/useStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { products, deleteProductAsync, isDarkMode, cart } = useStore();
  const router = useRouter();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <View style={[commonStyles.container, commonStyles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={80} color={colors.text + '40'} />
        <Text style={[styles.errorText, { color: colors.text }]}>Produk tidak ditemukan</Text>
      </View>
    );
  }

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isStockLimitReached = quantityInCart >= product.stock;
  const isOutOfStock = product.stock === 0;
  const isDisabled = isOutOfStock || isStockLimitReached;
  const availableStock = product.stock - quantityInCart;

  const handleAddToCart = () => {
    router.push(`/add-to-cart?id=${product.id}`);
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
          onPress: async () => {
            try {
              await deleteProductAsync(product.id);
              Toast.show({ type: 'success', text1: 'Produk berhasil dihapus!' });
              router.back();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Gagal menghapus produk',
                text2: 'Periksa koneksi internet Anda',
              });
            }
          }
        },
      ]
    );
  };

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
        <HeroHeader title="" emoji={product.image}>
          <View style={[styles.categoryBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <Text style={styles.categoryBadgeText}>{product.category}</Text>
          </View>
        </HeroHeader>

        {/* Product Info Card */}
        <View style={styles.infoWrapper}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                <Text style={[styles.productPrice, { color: colors.primary }]}>
                  Rp {product.price.toLocaleString()}
                </Text>
              </View>
              <StatusBadge type="stock" value={product.stock} />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.descriptionSection}>
              <Text style={[styles.sectionLabel, { color: colors.text }]}>Deskripsi</Text>
              <Text style={[styles.description, { color: colors.text }]}>{product.description}</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="layers-outline" size={20} color={colors.primary} />
                <Text style={[styles.statLabel, { color: colors.text + '80' }]}>Stok</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{product.stock} pcs</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                <Text style={[styles.statLabel, { color: colors.text + '80' }]}>Kategori</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{product.category}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="cart-outline" size={20} color={colors.primary} />
                <Text style={[styles.statLabel, { color: colors.text + '80' }]}>Di Keranjang</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{quantityInCart} pcs</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
              onPress={() => router.push(`/edit-product?id=${product.id}`)}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
              <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: colors.error + '15', borderColor: colors.error }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={[styles.deleteButtonText, { color: colors.error }]}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Footer */}
      <View style={[styles.floatingFooter, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.footerInfo}>
          <Text style={[styles.footerLabel, { color: colors.text + '80' }]}>
            {isOutOfStock ? 'Stok Habis' : isStockLimitReached ? 'Sudah di keranjang' : `Tersedia ${availableStock} pcs`}
          </Text>
          <Text style={[styles.footerPrice, { color: colors.primary }]}>
            Rp {product.price.toLocaleString()}
          </Text>
        </View>
        <Button
          title={isDisabled ? 'Tidak Tersedia' : 'Tambah ke Keranjang'}
          onPress={handleAddToCart}
          icon="cart"
          disabled={isDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 16,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: spacing.md,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoWrapper: {
    marginTop: -30,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  infoCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.medium,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  descriptionSection: {},
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
    opacity: 0.7,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  floatingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    ...shadows.medium,
  },
  footerInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  footerLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});