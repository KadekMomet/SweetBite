import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { radius, spacing, typography } from '../constants/Styles';
import { useStore } from '../store/useStore';

interface EmptyStateProps {
    icon?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    buttonText?: string;
    onButtonPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    iconName,
    title,
    subtitle,
    buttonText,
    onButtonPress,
}) => {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <View style={styles.container}>
            {icon ? (
                <Text style={styles.emoji}>{icon}</Text>
            ) : iconName ? (
                <Ionicons name={iconName} size={80} color={colors.text + '40'} />
            ) : null}
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle && (
                <Text style={[styles.subtitle, { color: colors.text }]}>{subtitle}</Text>
            )}
            {buttonText && onButtonPress && (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={onButtonPress}
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
    },
    emoji: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h3,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.6,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
        gap: spacing.sm,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
