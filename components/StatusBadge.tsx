import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useStore } from '../store/useStore';

type StatusType = 'stock' | 'order';

interface StatusBadgeProps {
    type: StatusType;
    // For stock: number of stock
    // For order: 'pending' | 'completed' | 'cancelled'
    value: number | string;
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { color: colors.error, text: 'Stok Habis', icon: 'close-circle' as const };
        if (stock <= 5) return { color: '#FF9800', text: 'Stok Terbatas', icon: 'warning' as const };
        return { color: colors.success, text: 'Tersedia', icon: 'checkmark-circle' as const };
    };

    const getOrderStatus = (status: string) => {
        switch (status) {
            case 'completed':
                return { color: '#4CAF50', text: 'Selesai', icon: 'checkmark-circle' as const };
            case 'cancelled':
                return { color: '#F44336', text: 'Dibatalkan', icon: 'close-circle' as const };
            default:
                return { color: '#FFA000', text: 'Menunggu', icon: 'time' as const };
        }
    };

    const status = type === 'stock'
        ? getStockStatus(value as number)
        : getOrderStatus(value as string);

    return (
        <View style={[styles.badge, { backgroundColor: status.color + '20' }]}>
            <Ionicons name={status.icon} size={16} color={status.color} />
            <Text style={[styles.text, { color: status.color }]}>{status.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    },
});
