# Ruang Belajar — Website Materi Kuliah

Website statis untuk menyimpan materi kuliah per mata kuliah dan pertemuan. Dibuat menggunakan HTML, CSS, dan JavaScript murni, sehingga ringan, cepat, dan tidak memerlukan instalasi framework atau database.

## Fitur Utama

- **Tipografi Lebih Jelas & Nyaman Dibaca**: Ukuran font telah disesuaikan agar lebih proporsional, nyaman untuk membaca materi panjang di desktop maupun ponsel.
- **Dua Mata Kuliah Aktif**:
  1. **Customer Relationship Management (CRM)**
  2. **Data Warehousing & Data Mining (DW & DM)**
- **Alur Belajar Tiga Langkah**:
  1. *Baca ringkasan* (konsep inti & definisi ahli).
  2. *Lihat infografik* (visualisasi sistem, arsitektur, dan alur alir data).
  3. *Kerjakan kuis* (evaluasi pemahaman interaktif dengan skor instan).
- **Akses Dokumen Sumber**: Setiap pertemuan menyediakan tautan langsung ke PDF dokumen asli dari dosen.
- **Penyimpanan Progres Lokal**: Status penyelesaian materi dan preferensi tema (terang/gelap) tersimpan otomatis di browser (`localStorage`).

## Cara Menjalankan

1. Buka folder `materi-kuliah`.
2. Klik ganda file `index.html` menggunakan browser apa saja (Chrome, Edge, Firefox, Safari).
3. Pilih mata kuliah yang ingin dipelajari:
   - **Customer Relationship Management** → Pertemuan 1
   - **Data Warehousing & Data Mining** → Pertemuan 1
4. Gunakan navigasi submateri, klik infografik untuk memperbesar (modal zoom), tandai bagian selesai, dan kerjakan kuis.

*Tips pengembangan: Untuk pengujian lokal dengan auto-reload, buka folder ini di VS Code dan jalankan dengan ekstensi Live Server.*

## Struktur Berkas

- `index.html` — Beranda dengan kartu mata kuliah, pencarian instan (Ctrl/Cmd + K), dan ringkasan progres belajar.
- `mata-kuliah/crm/`
  - `index.html` — Daftar 16 pertemuan mata kuliah CRM.
  - `pertemuan-1/index.html` — Materi Pengantar CRM, 5 infografik, studi kasus, model implementasi, dan kuis.
- `mata-kuliah/data-warehousing-data-mining/`
  - `index.html` — Daftar 16 pertemuan mata kuliah Data Warehousing & Data Mining.
  - `pertemuan-1/index.html` — Materi Bab 1: Konsep Dasar dan Rancangan Data Warehousing (William H. Inmon, komparasi OLTP vs OLAP, arsitektur 3 tingkat, ODS, alur ETL, kategori metadata, infografik, dan kuis).
- `assets/css/styles.css` — Desain responsif, tipografi nyaman (font size diperbesar), dark mode, tabel komparasi, dan kartu visual.
- `assets/js/app.js` — Logika tema, pencarian, progres lokal multi-mata kuliah, modal perbesar gambar, dan koreksi kuis otomatis.
- `assets/images/`
  - Infografik edukatif CRM (`crm-01` hingga `crm-05`).
  - Infografik edukatif Data Warehousing utuh (`dw-01-konsep-dasar.png`).
  - Infografik potongan per poin Data Warehousing (`dw-01` hingga `dw-10` untuk Sub-CPMK, Karakteristik, OLTP vs OLAP, Tabel Komparasi, Alasan Pemisahan, Arsitektur 3 Tingkat, Proses ETL, ODS, Metadata, dan Banner Kesimpulan).
- `assets/dokumen/`
  - `materi-crm-pertemuan-1.pdf` — Dokumen slide materi CRM Pertemuan 1.
  - `materi-data-warehouse-mining-pertemuan-1.pdf` — Dokumen Lecturer Note resmi Data Warehousing & Data Mining Bab 1.

## Menambahkan Pertemuan Berikutnya

1. Duplikasi folder pertemuan sebelumnya (misal `pertemuan-1/` menjadi `pertemuan-2/`).
2. Perbarui judul, ringkasan, isi submateri, dan tautan gambar/dokumen pada `index.html` baru tersebut.
3. Di `mata-kuliah/<nama-matkul>/index.html`, aktifkan kartu pertemuan terkait dan arahkan tautannya ke folder baru.
4. Simpan gambar ke `assets/images/` dan PDF sumber ke `assets/dokumen/`.
# materi-kuliah
