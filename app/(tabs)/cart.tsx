import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, EmptyState, PageHeader, QuantitySelector } from '../../components';
import { Colors } from '../../constants/Colors';
import { commonStyles, radius, shadows, spacing } from '../../constants/Styles';
import { useStore } from '../../store/useStore';

export default function CartScreen() {
  const { cart, updateCartItem, removeFromCart, clearCart, createOrderAsync, isDarkMode } = useStore();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      Toast.show({ type: 'info', text1: 'Produk dihapus dari keranjang' });
    } else {
      updateCartItem(id, quantity);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Toast.show({ type: 'error', text1: 'Keranjang kosong!' });
      return;
    }

    Alert.alert(
      'Checkout 🎉',
      `Total ${totalItems} item\nRp ${total.toLocaleString()}\n\nLanjutkan pembayaran?`,
      [
        { text: 'Nanti', style: 'cancel' },
        {
          text: 'Bayar Sekarang',
          onPress: async () => {
            try {
              await createOrderAsync();
              Toast.show({
                type: 'success',
                text1: 'Pesanan berhasil dibuat! 🎂',
                text2: 'Terima kasih telah berbelanja di SweetBite',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Gagal membuat pesanan',
                text2: 'Periksa koneksi internet Anda',
              });
            }
          }
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;

    Alert.alert(
      'Bersihkan Keranjang',
      'Yakin ingin menghapus semua item dari keranjang?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: () => {
            clearCart();
            Toast.show({ type: 'info', text1: 'Keranjang dikosongkan' });
          }
        },
      ]
    );
  };

  if (cart.length === 0) {
    return (
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          iconName="cart-outline"
          title="Keranjang Kosong"
          subtitle="Yuk tambahkan produk lezat ke keranjang belanja!"
          buttonText="Jelajahi Produk"
          onButtonPress={() => router.push('/(tabs)/products')}
        />
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <PageHeader
        title="Keranjang Belanja"
        subtitle={`${totalItems} item • Rp ${total.toLocaleString()}`}
        rightAction={{
          icon: 'trash-outline',
          label: 'Hapus Semua',
          onPress: handleClearCart,
        }}
      />

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        bounces={false}
        overScrollMode="never"
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemEmoji}>{item.product.image}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.product.name}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.primary }]}>
                  Rp {item.product.price.toLocaleString()}
                </Text>
                <Text style={[styles.itemStock, { color: colors.text + '80' }]}>
                  Stok: {item.product.stock}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>

            <View style={styles.quantityContainer}>
              <QuantitySelector
                value={item.quantity}
                max={item.product.stock}
                onIncrement={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                onDecrement={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                size="small"
              />
              <Text style={[styles.subtotal, { color: colors.primary }]}>
                Rp {(item.product.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Checkout Footer */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={commonStyles.rowBetween}>
          <View>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Belanja</Text>
            <Text style={[styles.totalItems, { color: colors.text + '80' }]}>{totalItems} item</Text>
          </View>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>
            Rp {total.toLocaleString()}
          </Text>
        </View>

        <Button
          title="Checkout Sekarang"
          onPress={handleCheckout}
          icon="card"
          size="large"
          fullWidth
          style={{ marginTop: spacing.lg }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.lg,
    paddingBottom: 180,
  },
  cartItem: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  itemEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemStock: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    borderTopWidth: 1,
    ...shadows.medium,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalItems: {
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});