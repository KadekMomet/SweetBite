import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, QuantitySelector } from '../components';
import { Colors } from '../constants/Colors';
import { commonStyles, radius, spacing } from '../constants/Styles';
import { useStore } from '../store/useStore';

export default function AddToCartScreen() {
    const { id } = useLocalSearchParams();
    const { products, addToCart, isDarkMode, cart } = useStore();
    const router = useRouter();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    const product = products.find(p => p.id === id);

    const cartItem = cart.find(item => item.product.id === id);
    const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
    const availableStock = product ? product.stock - currentQuantityInCart : 0;

    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <SafeAreaView style={[commonStyles.container, commonStyles.center, { backgroundColor: colors.background }]}>
                <Ionicons name="alert-circle-outline" size={64} color={colors.text + '40'} />
                <Text style={[styles.errorText, { color: colors.text }]}>Produk tidak ditemukan</Text>
            </SafeAreaView>
        );
    }

    const totalPrice = product.price * quantity;
    const isDisabled = availableStock === 0;

    const handleAddToCart = () => {
        if (quantity > availableStock) {
            Toast.show({ type: 'error', text1: 'Stok tidak mencukupi!' });
            return;
        }

        addToCart(product, quantity);
        Toast.show({
            type: 'success',
            text1: `${quantity}x ${product.name} ditambahkan!`,
            text2: `Total: Rp ${totalPrice.toLocaleString()}`,
        });
        router.back();
    };

    return (
        <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + spacing.md : spacing.md }]}>
                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: colors.card }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Tambah ke Keranjang</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Product Info */}
            <View style={styles.productSection}>
                <View style={[styles.emojiContainer, { backgroundColor: colors.card }]}>
                    <Text style={styles.emoji}>{product.image}</Text>
                </View>
                <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                <Text style={[styles.productCategory, { color: colors.primary }]}>{product.category}</Text>
                <Text style={[styles.productPrice, { color: colors.text }]}>
                    Rp {product.price.toLocaleString()} / pcs
                </Text>
                <Text style={[styles.stockInfo, { color: colors.text }]}>
                    Stok tersedia: {availableStock} buah
                    {currentQuantityInCart > 0 && ` (${currentQuantityInCart} sudah di keranjang)`}
                </Text>
            </View>

            {/* Quantity Selector */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <Text style={[styles.sectionLabel, { color: colors.text }]}>Jumlah Pesanan</Text>
                <View style={styles.quantityWrapper}>
                    <QuantitySelector
                        value={quantity}
                        max={availableStock}
                        onIncrement={() => setQuantity(q => q + 1)}
                        onDecrement={() => setQuantity(q => q - 1)}
                        size="large"
                    />
                </View>
            </View>

            {/* Total Section */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
                <View style={commonStyles.rowBetween}>
                    <Text style={[styles.totalLabel, { color: colors.text }]}>Harga Satuan</Text>
                    <Text style={[styles.totalValue, { color: colors.text }]}>Rp {product.price.toLocaleString()}</Text>
                </View>
                <View style={commonStyles.rowBetween}>
                    <Text style={[styles.totalLabel, { color: colors.text }]}>Jumlah</Text>
                    <Text style={[styles.totalValue, { color: colors.text }]}>x{quantity}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={commonStyles.rowBetween}>
                    <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Total Harga</Text>
                    <Text style={[styles.grandTotalValue, { color: colors.primary }]}>
                        Rp {totalPrice.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* Add to Cart Button */}
            <View style={[styles.bottomSection, { paddingBottom: Platform.OS === 'android' ? 40 : 32 }]}>
                <Button
                    title={isDisabled ? 'Stok Habis' : `Tambah ke Keranjang - Rp ${totalPrice.toLocaleString()}`}
                    onPress={handleAddToCart}
                    icon="cart"
                    size="large"
                    disabled={isDisabled}
                    fullWidth
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productSection: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.lg,
    },
    emojiContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    emoji: {
        fontSize: 64,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    productCategory: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    stockInfo: {
        fontSize: 14,
        opacity: 0.7,
    },
    section: {
        marginHorizontal: spacing.lg,
        padding: spacing.xl,
        borderRadius: radius.lg,
        marginBottom: spacing.lg,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    quantityWrapper: {
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: spacing.sm,
    },
    totalValue: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: spacing.sm,
    },
    divider: {
        height: 1,
        marginVertical: spacing.md,
    },
    grandTotalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    grandTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.lg,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
    },
});
