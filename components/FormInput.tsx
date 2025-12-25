import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useStore } from '../store/useStore';

interface FormInputProps extends TextInputProps {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    error?: string;
    prefix?: string;
    suffix?: string;
}

export function FormInput({
    label,
    icon,
    error,
    prefix,
    suffix,
    multiline,
    ...textInputProps
}: FormInputProps) {
    const { isDarkMode } = useStore();
    const colors = Colors[isDarkMode ? 'dark' : 'light'];

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <View style={[
                styles.inputWrapper,
                multiline && styles.textAreaWrapper,
                {
                    backgroundColor: colors.background,
                    borderColor: error ? colors.error : colors.border,
                }
            ]}>
                {icon && <Ionicons name={icon} size={20} color={colors.text + '60'} />}
                {prefix && <Text style={[styles.prefix, { color: colors.primary }]}>{prefix}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.textArea,
                        { color: colors.text }
                    ]}
                    placeholderTextColor={colors.text + '50'}
                    multiline={multiline}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    {...textInputProps}
                />
                {suffix && <Text style={[styles.suffix, { color: colors.text + '60' }]}>{suffix}</Text>}
            </View>
            {error && (
                <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 14,
        gap: 10,
    },
    textAreaWrapper: {
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 14,
    },
    textArea: {
        minHeight: 100,
    },
    prefix: {
        fontSize: 15,
        fontWeight: '600',
    },
    suffix: {
        fontSize: 14,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
});
