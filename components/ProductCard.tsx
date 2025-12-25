import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useStore } from '../store/useStore';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

export function ProductCard({ product }: ProductCardProps) {
    const { isDarkMode, cart } = useStore();
    const router = useRouter();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock <= 5 && product.stock > 0;

    // Check cart quantity
    const cartItem = cart.find(item => item.product.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const canAddMore = quantityInCart < product.stock;

    const handlePress = () => {
        router.push(`/product-detail?id=${product.id}`);
    };

    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        if (!isOutOfStock && canAddMore) {
            router.push(`/add-to-cart?id=${product.id}`);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, width: CARD_WIDTH }]}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            {/* Image Section with Gradient Overlay */}
            <View style={styles.imageSection}>
                <LinearGradient
                    colors={[colors.primary + '20', colors.secondary + '30']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBg}
                >
                    <Text style={styles.emoji}>{product.image}</Text>
                </LinearGradient>

                {/* Stock Badge */}
                {isOutOfStock && (
                    <View style={[styles.stockBadge, styles.outOfStock]}>
                        <Text style={styles.stockBadgeText}>Habis</Text>
                    </View>
                )}
                {isLowStock && (
                    <View style={[styles.stockBadge, styles.lowStock]}>
                        <Text style={styles.stockBadgeText}>Sisa {product.stock}</Text>
                    </View>
                )}

                {/* Cart Quantity Badge */}
                {quantityInCart > 0 && (
                    <View style={[styles.cartBadge, { backgroundColor: colors.secondary }]}>
                        <Text style={styles.cartBadgeText}>{quantityInCart}</Text>
                    </View>
                )}
            </View>

            {/* Product Info */}
            <View style={styles.infoSection}>
                {/* Category */}
                <Text style={[styles.category, { color: colors.primary }]} numberOfLines={1}>
                    {product.category}
                </Text>

                {/* Name */}
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                    {product.name}
                </Text>

                {/* Price & Cart Button Row */}
                <View style={styles.priceRow}>
                    <View style={styles.priceContainer}>
                        <Text style={[styles.price, { color: colors.text }]}>
                            Rp {product.price.toLocaleString()}
                        </Text>
                        <Text style={[styles.stockText, { color: colors.text + '50' }]}>
                            Stok: {product.stock}
                        </Text>
                    </View>

                    {/* Cart Button */}
                    <TouchableOpacity
                        style={[
                            styles.cartButton,
                            {
                                backgroundColor: isOutOfStock || !canAddMore ? colors.border : colors.primary,
                            }
                        ]}
                        onPress={handleAddToCart}
                        disabled={isOutOfStock || !canAddMore}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="cart-outline"
                            size={16}
                            color={isOutOfStock || !canAddMore ? colors.text + '40' : '#FFFFFF'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    imageSection: {
        height: 100,
        position: 'relative',
    },
    gradientBg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 42,
    },
    stockBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    outOfStock: {
        backgroundColor: '#EF4444',
    },
    lowStock: {
        backgroundColor: '#F59E0B',
    },
    stockBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '700',
    },
    cartBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    infoSection: {
        padding: 10,
    },
    category: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    name: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 17,
        marginBottom: 6,
        height: 34, // Fixed height for 2 lines
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flex: 1,
    },
    price: {
        fontSize: 13,
        fontWeight: '800',
    },
    stockText: {
        fontSize: 9,
        marginTop: 1,
    },
    cartButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
