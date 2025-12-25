import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { PageHeader, StatusBadge } from '../../components';
import { Colors } from '../../constants/Colors';
import { commonStyles, radius, shadows, spacing } from '../../constants/Styles';
import { useStore } from '../../store/useStore';

export default function OrdersScreen() {
  const { orders, isDarkMode, updateOrder, deleteOrder, clearOrderHistory } = useStore();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

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
            updateOrder(orderId, { status: 'cancelled' });
            Toast.show({ type: 'success', text1: 'Pesanan berhasil dibatalkan' });
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
            updateOrder(orderId, { status: 'completed' });
            Toast.show({ type: 'success', text1: 'Pesanan ditandai sebagai selesai! 🎉' });
          }
        },
      ]
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    Alert.alert(
      'Hapus Pesanan',
      'Yakin ingin menghapus pesanan ini dari riwayat?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            deleteOrder(orderId);
            Toast.show({ type: 'success', text1: 'Pesanan berhasil dihapus dari riwayat' });
          }
        },
      ]
    );
  };

  const handleClearHistory = () => {
    const completedOrCancelledOrders = orders.filter(o => o.status !== 'pending');
    if (completedOrCancelledOrders.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Tidak ada riwayat yang bisa dihapus',
        text2: 'Hanya pesanan selesai/dibatalkan yang bisa dihapus',
      });
      return;
    }

    Alert.alert(
      'Bersihkan Riwayat',
      `Hapus ${completedOrCancelledOrders.length} pesanan yang sudah selesai/dibatalkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: () => {
            clearOrderHistory();
            Toast.show({ type: 'success', text1: 'Riwayat pesanan berhasil dibersihkan' });
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
      <View style={[commonStyles.container, commonStyles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="receipt-outline" size={100} color={colors.text + '40'} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Belum Ada Pesanan</Text>
        <Text style={[styles.emptySubtitle, { color: colors.text }]}>Pesanan Anda akan muncul di sini</Text>
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <PageHeader
        title="Riwayat Pesanan"
        subtitle={`${orders.length} pesanan • Total: ${orders.reduce((sum, order) => sum + order.items.length, 0)} item`}
        rightAction={
          orders.filter(o => o.status !== 'pending').length > 0
            ? { icon: 'trash-outline', label: 'Bersihkan', onPress: handleClearHistory }
            : undefined
        }
      />

      <FlatList
        data={orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
        keyExtractor={(item) => item.id}
        bounces={false}
        overScrollMode="never"
        renderItem={({ item }) => (
          <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
            <View style={styles.orderHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.orderId, { color: colors.text }]}>
                  Order #{item.id.slice(-6).toUpperCase()}
                </Text>
                <Text style={[styles.orderDate, { color: colors.text + '80' }]}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
              <View style={styles.orderHeaderRight}>
                <StatusBadge type="order" value={item.status} />
                <TouchableOpacity style={styles.deleteOrderButton} onPress={() => handleDeleteOrder(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.orderItems}>
              {item.items.slice(0, 3).map((cartItem) => (
                <View key={cartItem.id} style={styles.orderItem}>
                  <Text style={styles.itemEmoji}>{cartItem.product.image}</Text>
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
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
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Pesanan</Text>
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
                  <Text style={[styles.actionText, { color: colors.error }]}>Batalkan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.success + '20' }]}
                  onPress={() => handleCompleteOrder(item.id)}
                >
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={[styles.actionText, { color: colors.success }]}>Selesai</Text>
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
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  orderCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteOrderButton: {
    padding: 4,
  },
  orderItems: {
    marginBottom: spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
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
    paddingTop: spacing.md,
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
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});