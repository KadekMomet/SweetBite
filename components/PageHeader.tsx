import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { radius, spacing } from '../constants/Styles';
import { useStore } from '../store/useStore';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    rightAction?: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        onPress: () => void;
    };
}

export function PageHeader({ title, subtitle, rightAction }: PageHeaderProps) {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <View style={styles.content}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                {rightAction && (
                    <TouchableOpacity style={styles.actionButton} onPress={rightAction.onPress}>
                        <Ionicons name={rightAction.icon} size={18} color="#FFFFFF" />
                        <Text style={styles.actionText}>{rightAction.label}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + spacing.sm : 28,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.xl,
        borderBottomLeftRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});
