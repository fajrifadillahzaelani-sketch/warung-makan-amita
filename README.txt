CARA MENJALANKAN WEBSITE WARUNG MAKAN AMITA

1. Install Node.js di komputer.
2. Buka folder project ini di VS Code.
3. Buka Terminal VS Code pada folder yang berisi package.json.
4. Jalankan:
   npm install
5. Setelah selesai, jalankan:
   npm start
6. Buka browser:
   http://localhost:3000

WEBSITE:
http://localhost:3000

HALAMAN ADMIN:
http://localhost:3000/admin.html

DATABASE:
File warung.db dibuat otomatis saat server pertama kali dijalankan.

Catatan:
- Data pesanan tersimpan di SQLite.
- Admin dapat melihat pesanan yang masuk.
- Admin dapat mengubah status: Baru, Diproses, Selesai, Dibatalkan.
- Halaman admin ini belum memakai login. Untuk penggunaan nyata, tambahkan autentikasi.


LOGIN ADMIN
-----------
Buka http://localhost:3000/admin.html. Jika belum login, otomatis diarahkan ke halaman login.
Username default: admin
Password default: amita123

Untuk mengganti akun sebelum menjalankan server (PowerShell):
$env:ADMIN_USERNAME="adminbaru"
$env:ADMIN_PASSWORD="passwordbaru"
npm start

Catatan: session login disimpan di memory server dan akan berakhir saat server direstart atau setelah 8 jam.


FITUR TERBARU
- 195 menu dalam 14 kategori sesuai jumlah yang diminta.
- Pencarian menu dan filter kategori.
- Admin dapat menandai menu Tersedia/Tidak tersedia; menu tidak tersedia disembunyikan dari pelanggan.
- Admin dapat menambahkan menu baru.
- Pelanggan dapat mengecek status pesanan menggunakan nomor pesanan + nomor HP.
- Admin dapat mengubah status: Baru, Dikonfirmasi, Diproses, Selesai, Dibatalkan.
- Status yang diubah admin dapat dilihat pelanggan melalui fitur Cek Pesanan.


GAMBAR MENU:
- public/assets/menu/ berisi file gambar JPG lokal yang dipakai kartu menu dan hero.
- Gambar tidak bergantung pada emoji atau path dari komputer pengguna.
- Logo tersimpan di public/assets/logo-amita.jpg.
- Jika punya foto makanan sendiri, ganti file JPG di folder tersebut dan pertahankan nama file, atau ubah kolom gambar pada database.
