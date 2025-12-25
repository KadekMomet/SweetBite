import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { radius, shadows, spacing } from '../constants/Styles';
import { useStore } from '../store/useStore';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Cari...',
}) => {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <Ionicons name="search" size={20} color={colors.text + '60'} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={placeholder}
                placeholderTextColor={colors.text + '60'}
                value={value}
                onChangeText={onChangeText}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Ionicons name="close-circle" size={20} color={colors.text + '60'} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: radius.md,
        ...shadows.small,
    },
    input: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: 16,
    },
});
