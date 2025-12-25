import { StyleSheet } from 'react-native';

/**
 * Shared Styles - Common styles used across the app
 */

// Shadow presets
export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
};

// Spacing values
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
};

// Border radius presets
export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
};

// Common styles
export const commonStyles = StyleSheet.create({
    // Flex containers
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Cards
    card: {
        borderRadius: radius.md,
        padding: spacing.lg,
        ...shadows.small,
    },

    // Input styles
    input: {
        fontSize: 16,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
    },

    // Button base
    button: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
});

// Typography styles
export const typography = StyleSheet.create({
    h1: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    h3: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    body: {
        fontSize: 16,
    },
    bodySmall: {
        fontSize: 14,
    },
    caption: {
        fontSize: 12,
        opacity: 0.7,
    },
});

// Form styles - shared across add/edit product pages
export const formStyles = StyleSheet.create({
    formWrapper: {
        marginTop: -30,
        paddingHorizontal: 16,
    },
    formCard: {
        borderRadius: 24,
        padding: 20,
        ...shadows.large,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButtons: {
        marginTop: 20,
        gap: 12,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 16,
        gap: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
