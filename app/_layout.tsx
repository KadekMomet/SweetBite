import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Colors } from '../constants/Colors';
import { useDeepLink } from '../hooks/useDeepLink';
import { useStore } from '../store/useStore';

import { CustomToast } from '../components/CustomToast';

export default function RootLayout() {
  const { isDarkMode, fetchProducts } = useStore();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  // Initialize deep link handling (including deferred deep links)
  useDeepLink();

  // Fetch products from Supabase on app startup
  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="add-product"
          options={{
            title: 'Tambah Produk',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="product-detail"
          options={{ title: 'Detail Produk' }}
        />
        <Stack.Screen
          name="edit-product"
          options={{
            title: 'Edit Produk',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="add-to-cart"
          options={{
            title: 'Tambah ke Keranjang',
            presentation: 'modal',
            headerShown: false
          }}
        />
      </Stack>
      <CustomToast />
    </>
  );
}
