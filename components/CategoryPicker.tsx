import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FILTER_CATEGORIES } from '../constants/Categories';
import { Colors } from '../constants/Colors';
import { useStore } from '../store/useStore';

interface CategoryPickerProps {
    selectedCategory: string;
    onSelect: (category: string) => void;
}

export function CategoryPicker({ selectedCategory, onSelect }: CategoryPickerProps) {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <View style={styles.grid}>
            {FILTER_CATEGORIES.map((category) => (
                <TouchableOpacity
                    key={category.name}
                    style={[
                        styles.button,
                        {
                            backgroundColor: selectedCategory === category.name ? colors.primary : colors.background,
                            borderColor: selectedCategory === category.name ? colors.primary : colors.border,
                        }
                    ]}
                    onPress={() => onSelect(category.name)}
                >
                    <Text style={styles.icon}>{category.icon}</Text>
                    <Text style={[
                        styles.label,
                        { color: selectedCategory === category.name ? '#FFFFFF' : colors.text }
                    ]}>
                        {category.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        gap: 6,
    },
    icon: {
        fontSize: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
});
