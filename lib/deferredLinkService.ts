import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const DEFERRED_LINK_KEY = 'sweetbite_deferred_link';

/**
 * Service untuk menangani deferred deep linking
 * - Simpan URL tujuan saat app belum install
 * - Retrieve URL saat app pertama kali dibuka
 */

/**
 * Simpan URL untuk deferred navigation
 * Panggil ini dari landing page/web saat user klik link tapi app belum install
 */
export const saveDeferredLink = async (url: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(DEFERRED_LINK_KEY, url);
        console.log('[DeferredLink] Saved:', url);
    } catch (error) {
        console.error('[DeferredLink] Failed to save:', error);
    }
};

/**
 * Ambil dan hapus deferred link (one-time use)
 * Panggil ini saat app startup
 */
export const getDeferredLink = async (): Promise<string | null> => {
    try {
        const url = await AsyncStorage.getItem(DEFERRED_LINK_KEY);
        if (url) {
            await AsyncStorage.removeItem(DEFERRED_LINK_KEY);
            console.log('[DeferredLink] Retrieved:', url);
        }
        return url;
    } catch (error) {
        console.error('[DeferredLink] Failed to get:', error);
        return null;
    }
};

/**
 * Parse deep link URL menjadi route path
 * Contoh: sweetbite2://product-detail?id=123 -> /product-detail?id=123
 */
export const parseDeepLinkUrl = (url: string): string | null => {
    try {
        const parsed = Linking.parse(url);
        if (parsed.path) {
            const queryString = parsed.queryParams
                ? '?' + Object.entries(parsed.queryParams)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&')
                : '';
            return `/${parsed.path}${queryString}`;
        }
        return null;
    } catch (error) {
        console.error('[DeferredLink] Failed to parse:', error);
        return null;
    }
};

/**
 * Check apakah ada deep link saat app startup (dari Linking)
 */
export const getInitialDeepLink = async (): Promise<string | null> => {
    try {
        const url = await Linking.getInitialURL();
        return url;
    } catch (error) {
        console.error('[DeferredLink] Failed to get initial URL:', error);
        return null;
    }
};
