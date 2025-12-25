import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRODUCT_EMOJIS } from '../constants/Categories';
import { Colors } from '../constants/Colors';
import { useStore } from '../store/useStore';

interface EmojiPickerProps {
    selectedEmoji: string;
    onSelect: (emoji: string) => void;
    emojis?: string[];
}

export function EmojiPicker({
    selectedEmoji,
    onSelect,
    emojis = PRODUCT_EMOJIS
}: EmojiPickerProps) {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.grid}>
                {emojis.map((emoji) => (
                    <TouchableOpacity
                        key={emoji}
                        style={[
                            styles.button,
                            {
                                backgroundColor: selectedEmoji === emoji ? colors.primary : colors.background,
                                borderColor: selectedEmoji === emoji ? colors.primary : colors.border,
                            }
                        ]}
                        onPress={() => onSelect(emoji)}
                    >
                        <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 4,
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    emoji: {
        fontSize: 24,
    },
});
