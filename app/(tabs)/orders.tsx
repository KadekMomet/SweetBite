import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants/Colors';
import { useStore } from '../../store/useStore';

export default function OrdersScreen() {
  const { orders, isDarkMode, updateOrder } = useStore();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#FFA000';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'cancelled': return 'close-circle';
      default: return 'time';
    }
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Batalkan Pesanan',
      'Yakin ingin membatalkan pesanan ini?',
      [
        { text: 'Tidak', style: 'cancel' },
        { 
          text: 'Ya, Batalkan', 
          style: 'destructive',
          onPress: () => {
            // Update status pesanan menjadi cancelled
            // Anda perlu menambahkan fungsi updateOrder di store
            updateOrder(orderId, { status: 'cancelled' });
            
            Toast.show({
              type: 'success',
              text1: 'Pesanan berhasil dibatalkan',
            });
          }
        },
      ]
    );
  };

   const handleCompleteOrder = (orderId: string) => {
    Alert.alert(
      'Selesaikan Pesanan',
      'Tandai pesanan sebagai selesai?',
      [
        { text: 'Nanti', style: 'cancel' },
        { 
          text: 'Ya, Selesai', 
          onPress: () => {
            // Update status pesanan menjadi completed
            updateOrder(orderId, { status: 'completed' });
            
            Toast.show({
              type: 'success',
              text1: 'Pesanan ditandai sebagai selesai! 🎉',
            });
          }
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={100} color={colors.text + '40'} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Belum Ada Pesanan
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.text }]}>
            Pesanan Anda akan muncul di sini
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
          <Text style={styles.headerSubtitle}>
            {orders.length} pesanan • Total: {orders.reduce((sum, order) => sum + order.items.length, 0)} item
          </Text>
        </View>
      </View>

      <FlatList
        data={orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={[styles.orderId, { color: colors.text }]}>
                  Order #{item.id.slice(-6).toUpperCase()}
                </Text>
                <Text style={[styles.orderDate, { color: colors.text + '80' }]}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Ionicons 
                  name={getStatusIcon(item.status)} 
                  size={16} 
                  color={getStatusColor(item.status)} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status === 'pending' ? 'Menunggu' : 
                   item.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                </Text>
              </View>
            </View>

            <View style={styles.orderItems}>
              {item.items.slice(0, 3).map((cartItem, index) => (
                <View key={cartItem.id} style={styles.orderItem}>
                  <Text style={styles.itemEmoji}>{cartItem.product.image}</Text>
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: colors.text }]} 
                          numberOfLines={1}>
                      {cartItem.product.name}
                    </Text>
                    <Text style={[styles.itemQuantity, { color: colors.text + '80' }]}>
                      {cartItem.quantity} x Rp {cartItem.product.price.toLocaleString()}
                    </Text>
                  </View>
                  <Text style={[styles.itemTotal, { color: colors.primary }]}>
                    Rp {(cartItem.product.price * cartItem.quantity).toLocaleString()}
                  </Text>
                </View>
              ))}
              {item.items.length > 3 && (
                <Text style={[styles.moreItems, { color: colors.text + '80' }]}>
                  +{item.items.length - 3} item lainnya...
                </Text>
              )}
            </View>

            <View style={styles.orderFooter}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total Pesanan
              </Text>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>
                Rp {item.total.toLocaleString()}
              </Text>
            </View>

            {item.status === 'pending' && (
              <View style={styles.orderActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
                  onPress={() => handleCancelOrder(item.id)}
                >
                  <Ionicons name="close-circle" size={16} color={colors.error} />
                  <Text style={[styles.actionText, { color: colors.error }]}>
                    Batalkan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.success + '20' }]}
                  onPress={() => handleCompleteOrder(item.id)}
                >
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={[styles.actionText, { color: colors.success }]}>
                    Selesai
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemEmoji: {
    fontSize: 20,
    marginRight: 8,
    width: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 12,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
  },
  moreItems: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});