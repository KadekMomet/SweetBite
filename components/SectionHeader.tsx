import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { spacing, typography } from '../constants/Styles';
import { useStore } from '../store/useStore';

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
    seeAllText?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    onSeeAll,
    seeAllText = 'Lihat Semua',
}) => {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {onSeeAll && (
                <TouchableOpacity onPress={onSeeAll}>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>
                        {seeAllText}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h3,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
});
