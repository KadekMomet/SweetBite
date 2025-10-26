import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useStore } from '../store/useStore';
import { Colors } from '../constants/Colors';

export const CustomToast = () => {
  const { isDarkMode } = useStore();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ 
          borderLeftColor: colors.success,
          backgroundColor: colors.card,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: colors.text
        }}
        text2Style={{
          fontSize: 12,
          color: colors.text
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ 
          borderLeftColor: colors.error,
          backgroundColor: colors.card,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: colors.text
        }}
        text2Style={{
          fontSize: 12,
          color: colors.text
        }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{ 
          borderLeftColor: colors.primary,
          backgroundColor: colors.card,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: colors.text
        }}
        text2Style={{
          fontSize: 12,
          color: colors.text
        }}
      />
    ),
  };

  return <Toast config={toastConfig} />;
};