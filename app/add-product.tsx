import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { CategoryPicker, EmojiPicker, FormInput, FormSection, HeroHeader } from '../components';
import { Colors } from '../constants/Colors';
import { commonStyles, formStyles } from '../constants/Styles';
import { useStore } from '../store/useStore';
import { ProductForm } from '../types';

export default function AddProductScreen() {
  const { addProductAsync, isDarkMode } = useStore();
  const router = useRouter();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];
  const scrollViewRef = useRef<ScrollView>(null);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<ProductForm>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      image: '🍰',
      category: 'Cake',
      stock: '',
    }
  });

  const selectedEmoji = watch('image');

  const onSubmit = async (data: ProductForm) => {
    try {
      await addProductAsync({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: data.image,
        category: data.category,
        stock: Number(data.stock),
      });

      Toast.show({ type: 'success', text1: 'Produk berhasil ditambahkan!' });
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Gagal menambahkan produk',
        text2: 'Periksa koneksi internet Anda',
      });
    }
  };

  const handleInputFocus = (y: number) => {
    scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
  };

  return (
    <KeyboardAvoidingView
      style={[commonStyles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeroHeader
          title="Tambah Produk"
          subtitle="Tambahkan produk baru ke toko Anda"
          emoji={selectedEmoji}
        />

        <View style={formStyles.formWrapper}>
          <View style={[formStyles.formCard, { backgroundColor: colors.card }]}>

            <FormSection icon="happy-outline" title="Ikon Produk">
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange, value } }) => (
                  <EmojiPicker selectedEmoji={value} onSelect={onChange} />
                )}
              />
            </FormSection>

            <FormSection icon="information-circle-outline" title="Informasi Dasar">
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Nama produk harus diisi' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Nama Produk"
                    icon="cube-outline"
                    placeholder="Masukkan nama produk"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.name?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Deskripsi"
                    placeholder="Deskripsikan produk Anda..."
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={4}
                    error={errors.description?.message}
                  />
                )}
              />
            </FormSection>

            <FormSection icon="pricetag-outline" title="Kategori">
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <CategoryPicker selectedCategory={value} onSelect={onChange} />
                )}
              />
            </FormSection>

            <FormSection icon="cash-outline" title="Harga & Stok">
              <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Controller
                    control={control}
                    name="price"
                    rules={{
                      required: 'Harga harus diisi',
                      pattern: { value: /^\d+$/, message: 'Harus angka' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormInput
                        label="Harga (Rp)"
                        prefix="Rp"
                        placeholder="0"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="numeric"
                        onFocus={() => handleInputFocus(700)}
                        error={errors.price?.message}
                      />
                    )}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    control={control}
                    name="stock"
                    rules={{
                      required: 'Stok harus diisi',
                      pattern: { value: /^\d+$/, message: 'Harus angka' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormInput
                        label="Stok"
                        icon="layers-outline"
                        placeholder="0"
                        suffix="pcs"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType="numeric"
                        onFocus={() => handleInputFocus(700)}
                        error={errors.stock?.message}
                      />
                    )}
                  />
                </View>
              </View>
            </FormSection>
          </View>

          <View style={formStyles.actionButtons}>
            <TouchableOpacity
              style={[formStyles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit(onSubmit)}
            >
              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
              <Text style={formStyles.primaryButtonText}>Tambah Produk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[formStyles.secondaryButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => router.back()}
            >
              <Ionicons name="close-outline" size={20} color={colors.text} />
              <Text style={[formStyles.secondaryButtonText, { color: colors.text }]}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
