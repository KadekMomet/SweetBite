import { Stack } from 'expo-router';
import { useStore } from '../store/useStore';

import { CustomToast } from '../components/CustomToast';

export default function RootLayout() {
  const { isDarkMode } = useStore();


  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FF6B8B',
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
      </Stack>
      <CustomToast />
    </>
  );
}