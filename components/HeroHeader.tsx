import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useStore } from '../store/useStore';

interface HeroHeaderProps {
    title: string;
    subtitle?: string;
    emoji?: string;
    children?: React.ReactNode;
}

export function HeroHeader({ title, subtitle, emoji, children }: HeroHeaderProps) {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                {emoji && (
                    <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>{emoji}</Text>
                    </View>
                )}
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                {children}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 60,
        paddingBottom: 50,
        paddingHorizontal: 20,
    },
    content: {
        alignItems: 'center',
    },
    emojiContainer: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emoji: {
        fontSize: 50,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        textAlign: 'center',
    },
});
