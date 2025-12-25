import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { radius, shadows, spacing } from '../constants/Styles';
import { useStore } from '../store/useStore';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle,
}) => {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    const getBackgroundColor = () => {
        if (disabled) return colors.border;
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.secondary;
            case 'danger': return colors.error;
            case 'outline': return 'transparent';
            default: return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.text + '60';
        if (variant === 'outline') return colors.primary;
        return '#FFFFFF';
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'large':
                return { paddingVertical: 18, paddingHorizontal: 28 };
            default:
                return { paddingVertical: 14, paddingHorizontal: 22 };
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'small': return 13;
            case 'large': return 17;
            default: return 15;
        }
    };

    const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getSizeStyles(),
                {
                    backgroundColor: getBackgroundColor(),
                    borderWidth: variant === 'outline' ? 1.5 : 0,
                    borderColor: colors.primary,
                    opacity: disabled ? 0.6 : 1,
                    alignSelf: fullWidth ? 'stretch' : 'auto',
                },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <Ionicons name={icon} size={iconSize} color={getTextColor()} />
                    )}
                    <Text
                        style={[
                            styles.text,
                            { color: getTextColor(), fontSize: getFontSize() },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <Ionicons name={icon} size={iconSize} color={getTextColor()} />
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        gap: spacing.sm,
        ...shadows.small,
    },
    text: {
        fontWeight: 'bold',
    },
});
