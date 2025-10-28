# SweetBite 🎂 - Mobile Bakery App

## 📋 Data Diri

**Nama: I Kadek Momet Dwika Putra**

**NIM:** 2301020037

**Kelas:** IF Pagi 1

**Mata Kuliah:** Pemrograman Mobile

**Institusi:** Primakara University

**Tahun Akademik:** 2025

---

## 🎯 Penjelasan Sistem

SweetBite adalah aplikasi mobile toko kue yang dibangun menggunakan Expo React Native dengan TypeScript yang mengimplementasikan sistem penjualan lengkap dengan tiga modul utama: manajemen produk (CRUD produk dengan validasi form), sistem keranjang belanja (tambah, update, hapus item dengan kalkulasi real-time), dan sistem pemesanan (checkout, riwayat transaksi, dan pengurangan stok otomatis). Aplikasi ini menggunakan Zustand untuk state management, Expo Router untuk navigasi berbasis file, React Hook Form untuk validasi input, dan React Native Toast Message untuk notifikasi, dengan antarmuka yang responsive dan mendukung dark/light mode serta mengoptimalkan performa menggunakan FlatList untuk rendering data yang efisien.

### 🏗️ Arsitektur Sistem

```
SweetBite/
├── app/                   # Routing dengan Expo Router
├── components/            # Komponen reusable
├── store/                 # State management dengan Zustand
├── types/                 # Type definitions
└── constants/             # Warna dan konfigurasi

```

---

## ✨ Fitur Utama

### 🛍️ **Manajemen Produk (CRUD)**

- ✅ **Tambah Produk** - Form dengan validasi lengkap
- ✅ **Edit Produk** - Update informasi produk
- ✅ **Hapus Produk** - Dengan konfirmasi
- ✅ **Lihat Detail** - Informasi lengkap produk
- ✅ **Kategori** - Cake, Cookies, Pastry, Bread, Dessert

### 🛒 **Sistem Keranjang**

- ✅ **Tambah ke Keranjang** - Validasi stok tersedia
- ✅ **Update Quantity** - Tambah/kurang jumlah item
- ✅ **Hapus Item** - Remove dari keranjang
- ✅ **Real-time Calculation** - Total otomatis

### 📦 **Sistem Pesanan**

- ✅ **Checkout** - Konversi keranjang ke pesanan
- ✅ **Status Pesanan** - Pending, Completed, Cancelled
- ✅ **Riwayat Pesanan** - History transaksi
- ✅ **Pengurangan Stok** - Otomatis saat checkout

### 🎨 **User Experience**

- ✅ **Dark/Light Mode** - Support tema gelap & terang
- ✅ **Responsive Design** - Beradaptasi dengan ukuran layar
- ✅ **Form Validation** - Validasi input dengan React Hook Form
- ✅ **Toast Notifications** - Feedback untuk user actions
- ✅ **Search & Filter** - Pencarian dan filter kategori

---

## 📱 Dokumentasi Screens

### 🏠 **Halaman Produk** (`app/(tabs)/index.tsx`)

- **Fungsi**: Menampilkan daftar produk, search, filter kategori
- **Fitur**:
    - Grid layout produk
    - Search bar real-time
    - Filter by kategori
    - Floating Action Button (+)
    - Statistik header

![WhatsApp Image 2025-10-28 at 09 12 34_f0706a62](https://github.com/user-attachments/assets/5829bd75-2493-43d2-ae8f-1ba0bcb4c5e7)
![WhatsApp Image 2025-10-28 at 09 12 29_e50ccc8e](https://github.com/user-attachments/assets/4aaad4b4-fb61-41e8-907f-d4aea1dc9374)
![WhatsApp Image 2025-10-28 at 09 12 29_151e159a](https://github.com/user-attachments/assets/7391215a-f272-4cf7-a551-a5668680d437)




### 🛒 **Halaman Keranjang** (`app/(tabs)/cart.tsx`)

- **Fungsi**: Mengelola item keranjang belanja
- **Fitur**:
    - List item keranjang
    - Quantity controls (+/-)
    - Total calculation
    - Checkout process
    - Empty state handling

![WhatsApp Image 2025-10-28 at 09 12 33_f17f14f3](https://github.com/user-attachments/assets/e4364f0e-4ded-4561-b86a-be3e5e78f514)
![WhatsApp Image 2025-10-28 at 09 12 32_d5a436c8](https://github.com/user-attachments/assets/b0a30fd9-eeb7-4c3c-b615-e61476bd999d)
![WhatsApp Image 2025-10-28 at 09 12 31_f6ab1e86](https://github.com/user-attachments/assets/5d797cc7-7e21-4637-ac65-21c29950cbf4)


### 📦 **Halaman Pesanan** (`app/(tabs)/orders.tsx`)

- **Fungsi**: Melihat riwayat dan status pesanan
- **Fitur**:
    - Order history
    - Status tracking
    - Action buttons (Batalkan/Selesai)
 
  ![WhatsApp Image 2025-10-28 at 09 12 32_07e07069](https://github.com/user-attachments/assets/bb4084f2-f771-4b56-ad43-cf7dc195fe65)
  ![WhatsApp Image 2025-10-28 at 09 12 31_c8349f49](https://github.com/user-attachments/assets/4ddb6709-b968-4315-86d3-65c57ee9280e)
  ![WhatsApp Image 2025-10-28 at 09 12 30_52dacfb5](https://github.com/user-attachments/assets/ca4dc993-2c51-4425-aed0-a818e1807849)




### ➕ **Tambah Produk** (`app/add-product.tsx`)

- **Fungsi**: Form tambah produk baru
- **Fitur**:
    - Input validation
    - Category picker
    - Emoji selector
    - Stock management

  ![WhatsApp Image 2025-10-28 at 09 12 34_a36b4101](https://github.com/user-attachments/assets/4af639d7-e5e9-43fb-951f-b8ae46cad4bf)


### ✏️ **Edit Produk** (`app/edit-product.tsx`)

- **Fungsi**: Form edit produk existing
- **Fitur**:
    - Pre-filled form data
    - Update functionality
    - Delete with confirmation
 
  ![WhatsApp Image 2025-10-28 at 09 12 33_e399b560](https://github.com/user-attachments/assets/63215509-db2b-4ce1-997c-0370d64147e7)


### **Dark Mode**

![WhatsApp Image 2025-10-28 at 16 04 05_fb5772c7](https://github.com/user-attachments/assets/6c2edf07-b0d3-400a-9977-b46a0339af47)


