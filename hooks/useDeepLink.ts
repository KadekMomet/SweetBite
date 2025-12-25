import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

const DEFERRED_LINK_KEY = 'sweetbite_deferred_link';

interface DeepLinkData {
    path: string | null;
    productId: string | null;
    queryParams?: Record<string, string>;
}

export const useDeepLink = () => {
    const router = useRouter();
    const [pendingDeepLink, setPendingDeepLink] = useState<DeepLinkData | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Parse deep link URL
    const parseDeepLink = (url: string): DeepLinkData => {
        try {
            const parsed = Linking.parse(url);
            const path = parsed.path;
            const queryParams = parsed.queryParams as Record<string, string> || {};

            // Handle product deep link: sweetbite2://product/[id] or product-detail?id=xxx
            if (path?.startsWith('product/')) {
                const productId = path.replace('product/', '');
                return { path: 'product-detail', productId, queryParams };
            }

            if (path === 'product-detail' && queryParams.id) {
                return { path: 'product-detail', productId: queryParams.id, queryParams };
            }

            // Handle other routes
            if (path === 'cart') {
                return { path: '(tabs)/cart', productId: null, queryParams };
            }

            if (path === 'orders') {
                return { path: '(tabs)/orders', productId: null, queryParams };
            }

            if (path === 'products') {
                return { path: '(tabs)/products', productId: null, queryParams };
            }

            if (path === 'add-product') {
                return { path: 'add-product', productId: null, queryParams };
            }

            if (path === 'add-to-cart' && queryParams.id) {
                return { path: 'add-to-cart', productId: queryParams.id, queryParams };
            }

            if (path === 'edit-product' && queryParams.id) {
                return { path: 'edit-product', productId: queryParams.id, queryParams };
            }

            return { path: null, productId: null };
        } catch (error) {
            console.error('Error parsing deep link:', error);
            return { path: null, productId: null };
        }
    };

    // Handle navigation based on deep link
    const handleDeepLink = (data: DeepLinkData) => {
        if (!data.path) return;

        console.log('[DeepLink] Navigating to:', data.path, data.productId);

        if (data.path === 'product-detail' && data.productId) {
            router.push(`/product-detail?id=${data.productId}`);
        } else if (data.path === 'add-to-cart' && data.productId) {
            router.push(`/add-to-cart?id=${data.productId}`);
        } else if (data.path === 'edit-product' && data.productId) {
            router.push(`/edit-product?id=${data.productId}`);
        } else if (data.path === '(tabs)/cart') {
            router.push('/(tabs)/cart');
        } else if (data.path === '(tabs)/orders') {
            router.push('/(tabs)/orders');
        } else if (data.path === '(tabs)/products') {
            router.push('/(tabs)/products');
        } else if (data.path === 'add-product') {
            router.push('/add-product');
        }
    };

    // Mark as ready after app is fully loaded
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    // Handle pending deep link when app becomes ready
    useEffect(() => {
        if (isReady && pendingDeepLink) {
            handleDeepLink(pendingDeepLink);
            setPendingDeepLink(null);
        }
    }, [isReady, pendingDeepLink]);

    useEffect(() => {
        // ============================
        // 1. Check SAVED deferred link (from AsyncStorage)
        //    This handles: click link → app not installed → install → open
        // ============================
        const checkSavedDeferredLink = async () => {
            try {
                const savedUrl = await AsyncStorage.getItem(DEFERRED_LINK_KEY);
                if (savedUrl) {
                    console.log('[DeepLink] Found saved deferred link:', savedUrl);
                    await AsyncStorage.removeItem(DEFERRED_LINK_KEY);
                    const data = parseDeepLink(savedUrl);

                    if (isReady) {
                        handleDeepLink(data);
                    } else {
                        setPendingDeepLink(data);
                    }
                }
            } catch (error) {
                console.error('[DeepLink] Error checking saved deferred link:', error);
            }
        };

        // ============================
        // 2. Check INITIAL URL (app opened via link)
        // ============================
        const handleInitialURL = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl) {
                    console.log('[DeepLink] Initial URL:', initialUrl);
                    const data = parseDeepLink(initialUrl);

                    if (isReady) {
                        handleDeepLink(data);
                    } else {
                        setPendingDeepLink(data);
                    }
                }
            } catch (error) {
                console.error('[DeepLink] Error getting initial URL:', error);
            }
        };

        // Run checks
        checkSavedDeferredLink();
        handleInitialURL();

        // ============================
        // 3. Listen for INCOMING links while app is running
        // ============================
        const subscription = Linking.addEventListener('url', ({ url }) => {
            console.log('[DeepLink] Received:', url);
            const data = parseDeepLink(url);

            if (isReady) {
                handleDeepLink(data);
            } else {
                setPendingDeepLink(data);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [isReady]);

    return { isReady };
};

// ============================
// Helper functions for saving deferred links
// (Call these from a web page or landing page)
// ============================

/**
 * Save a deferred link to AsyncStorage
 * Use this when you want to save a link for later navigation
 */
export const saveDeferredLink = async (url: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(DEFERRED_LINK_KEY, url);
        console.log('[DeepLink] Saved deferred link:', url);
    } catch (error) {
        console.error('[DeepLink] Failed to save deferred link:', error);
    }
};

/**
 * Clear any saved deferred link
 */
export const clearDeferredLink = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(DEFERRED_LINK_KEY);
    } catch (error) {
        console.error('[DeepLink] Failed to clear deferred link:', error);
    }
};
