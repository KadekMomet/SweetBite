import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useStore } from '../store/useStore';

interface FormSectionProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    children: React.ReactNode;
}

export function FormSection({ icon, title, children }: FormSectionProps) {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Ionicons name={icon} size={20} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
});
