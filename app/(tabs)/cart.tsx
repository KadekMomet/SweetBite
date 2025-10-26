import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { Colors } from '../../constants/Colors';
import Toast from 'react-native-toast-message';


export default function CartScreen() {
  const { cart, updateCartItem, removeFromCart, clearCart, createOrder, isDarkMode } = useStore();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];
  
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      Toast.show({
        type: 'info',
        text1: 'Produk dihapus dari keranjang',
      });
    } else {
      updateCartItem(id, quantity);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Keranjang kosong!',
      });
      return;
    }

    Alert.alert(
      'Checkout 🎉',
      `Total ${totalItems} item\nRp ${total.toLocaleString()}\n\nLanjutkan pembayaran?`,
      [
        { text: 'Nanti', style: 'cancel' },
        { 
          text: 'Bayar Sekarang', 
          onPress: () => {
            createOrder();
            Toast.show({
              type: 'success',
              text1: 'Pesanan berhasil dibuat! 🎂',
              text2: `Terima kasih telah berbelanja di SweetBite`,
            });
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
            Toast.show({
              type: 'info',
              text1: 'Keranjang dikosongkan',
            });
          }
        },
      ]
    );
  };

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={100} color={colors.text + '40'} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Keranjang Kosong
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.text }]}>
            Yuk tambahkan produk lezat ke keranjang belanja!
          </Text>
          <TouchableOpacity 
            style={[styles.shopButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="fast-food" size={20} color="#FFFFFF" />
            <Text style={styles.shopButtonText}>Jelajahi Produk</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Summary */}
      <View style={[styles.summaryHeader, { backgroundColor: colors.primary }]}>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryTitle}>Keranjang Belanja</Text>
          <Text style={styles.summarySubtitle}>
            {totalItems} item • Rp {total.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.clearAllButton}
          onPress={handleClearCart}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.clearAllText}>Hapus Semua</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemEmoji}>{item.product.image}</Text>
              <View style={styles.itemInfo}>
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
              <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.quantityContainer}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, { 
                    backgroundColor: item.quantity === 1 ? colors.border : colors.primary 
                  }]}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  <Ionicons 
                    name="remove" 
                    size={16} 
                    color={item.quantity === 1 ? colors.text + '80' : '#FFFFFF'} 
                  />
                </TouchableOpacity>
                
                <View style={[styles.quantityDisplay, { backgroundColor: colors.background }]}>
                  <Text style={[styles.quantityText, { color: colors.text }]}>
                    {item.quantity}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.quantityButton, { 
                    backgroundColor: item.quantity >= item.product.stock ? colors.border : colors.primary 
                  }]}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  <Ionicons 
                    name="add" 
                    size={16} 
                    color={item.quantity >= item.product.stock ? colors.text + '80' : '#FFFFFF'} 
                  />
                </TouchableOpacity>
              </View>
              
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
        <View style={styles.totalContainer}>
          <View>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Belanja</Text>
            <Text style={[styles.totalItems, { color: colors.text + '80' }]}>
              {totalItems} item
            </Text>
          </View>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>
            Rp {total.toLocaleString()}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
          onPress={handleCheckout}
        >
          <Ionicons name="card" size={20} color="#FFFFFF" />
          <Text style={styles.checkoutButtonText}>Checkout Sekarang</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryHeader: {
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  clearAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 160,
  },
  cartItem: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
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
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    padding: 20,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});