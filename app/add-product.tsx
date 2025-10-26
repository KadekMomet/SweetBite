import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { Colors } from '../constants/Colors';
import Toast from 'react-native-toast-message';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: string;
}

export default function AddProductScreen() {
  const { addProduct, isDarkMode } = useStore();
  const router = useRouter();
  const colors = Colors[isDarkMode ? 'dark' : 'light'];

  const { control, handleSubmit, formState: { errors } } = useForm<ProductForm>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      image: '🍰',
      category: 'Cake',
      stock: '',
    }
  });

  const categories = ['Cake', 'Cookies', 'Pastry', 'Bread', 'Dessert'];

  const onSubmit = (data: ProductForm) => {
    const productData = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      image: data.image,
      category: data.category,
      stock: Number(data.stock),
    };

    addProduct(productData);
    
    Toast.show({
      type: 'success',
      text1: 'Produk berhasil ditambahkan!',
    });
    
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Nama Produk</Text>
          <Controller
            control={control}
            rules={{
              required: 'Nama produk harus diisi',
              minLength: {
                value: 3,
                message: 'Nama produk minimal 3 karakter'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: errors.name ? colors.error : colors.border
                  }
                ]}
                placeholder="Masukkan nama produk"
                placeholderTextColor={colors.text + '80'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="name"
          />
          {errors.name && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Deskripsi</Text>
          <Controller
            control={control}
            rules={{
              required: 'Deskripsi harus diisi',
              minLength: {
                value: 10,
                message: 'Deskripsi minimal 10 karakter'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input, 
                  styles.textArea,
                  { 
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: errors.description ? colors.error : colors.border
                  }
                ]}
                placeholder="Masukkan deskripsi produk"
                placeholderTextColor={colors.text + '80'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={3}
              />
            )}
            name="description"
          />
          {errors.description && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.description.message}
            </Text>
          )}
        </View>

        {/* Price Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Harga (Rp)</Text>
          <Controller
            control={control}
            rules={{
              required: 'Harga harus diisi',
              pattern: {
                value: /^\d+$/,
                message: 'Harga harus berupa angka'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: errors.price ? colors.error : colors.border
                  }
                ]}
                placeholder="Masukkan harga"
                placeholderTextColor={colors.text + '80'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
            name="price"
          />
          {errors.price && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.price.message}
            </Text>
          )}
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Kategori</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: value === category ? colors.primary : colors.card,
                          borderColor: colors.border,
                        }
                      ]}
                      onPress={() => onChange(category)}
                    >
                      <Text style={[
                        styles.categoryText,
                        { color: value === category ? '#FFFFFF' : colors.text }
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
            name="category"
          />
        </View>

        {/* Stock Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Stok</Text>
          <Controller
            control={control}
            rules={{
              required: 'Stok harus diisi',
              pattern: {
                value: /^\d+$/,
                message: 'Stok harus berupa angka'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: errors.stock ? colors.error : colors.border
                  }
                ]}
                placeholder="Masukkan jumlah stok"
                placeholderTextColor={colors.text + '80'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
            name="stock"
          />
          {errors.stock && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.stock.message}
            </Text>
          )}
        </View>

        {/* Emoji Picker */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Emoji Produk</Text>
          <Controller
            control={control}
            rules={{
              required: 'Emoji harus dipilih'
            }}
            render={({ field: { onChange, value } }) => (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.emojiContainer}>
                  {['🍰', '🍪', '🥐', '🍞', '🎂', '🧁', '🍩', '🥨'].map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                      style={[
                        styles.emojiButton,
                        {
                          backgroundColor: value === emoji ? colors.primary : colors.card,
                          borderColor: colors.border,
                        }
                      ]}
                      onPress={() => onChange(emoji)}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
            name="image"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.submitButtonText}>Tambah Produk</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emojiContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  emojiButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  emojiText: {
    fontSize: 20,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});