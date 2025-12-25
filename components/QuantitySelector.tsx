import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing } from '../constants/Styles';
import { useStore } from '../store/useStore';

interface QuantitySelectorProps {
    value: number;
    min?: number;
    max: number;
    onIncrement: () => void;
    onDecrement: () => void;
    size?: 'small' | 'medium' | 'large';
}

export function QuantitySelector({
    value,
    min = 1,
    max,
    onIncrement,
    onDecrement,
    size = 'medium',
}: QuantitySelectorProps) {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    const isMinReached = value <= min;
    const isMaxReached = value >= max;

    const buttonSize = size === 'small' ? 32 : size === 'large' ? 50 : 40;
    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
    const fontSize = size === 'small' ? 16 : size === 'large' ? 28 : 20;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        width: buttonSize,
                        height: buttonSize,
                        backgroundColor: isMinReached ? colors.border : colors.primary
                    }
                ]}
                onPress={onDecrement}
                disabled={isMinReached}
            >
                <Ionicons
                    name="remove"
                    size={iconSize}
                    color={isMinReached ? colors.text + '40' : '#FFFFFF'}
                />
            </TouchableOpacity>

            <View style={[styles.display, { backgroundColor: colors.background }]}>
                <Text style={[styles.value, { color: colors.text, fontSize }]}>{value}</Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        width: buttonSize,
                        height: buttonSize,
                        backgroundColor: isMaxReached ? colors.border : colors.primary
                    }
                ]}
                onPress={onIncrement}
                disabled={isMaxReached}
            >
                <Ionicons
                    name="add"
                    size={iconSize}
                    color={isMaxReached ? colors.text + '40' : '#FFFFFF'}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    button: {
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    display: {
        minWidth: 50,
        paddingHorizontal: spacing.lg,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    value: {
        fontWeight: 'bold',
    },
});
