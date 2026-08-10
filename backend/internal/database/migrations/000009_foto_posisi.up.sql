-- Titik fokus foto (object-position CSS, mis. "50% 30%") agar admin bisa
-- mengatur bagian foto mana yang tetap terlihat saat dipotong di kartu/hero.
-- Non-destruktif: foto asli tidak diubah. Default tengah ("50% 50%").
ALTER TABLE makanan     ADD COLUMN foto_posisi VARCHAR(20) NOT NULL DEFAULT '50% 50%';
ALTER TABLE budaya      ADD COLUMN foto_posisi VARCHAR(20) NOT NULL DEFAULT '50% 50%';
ALTER TABLE destinasi   ADD COLUMN foto_posisi VARCHAR(20) NOT NULL DEFAULT '50% 50%';
ALTER TABLE hero_images ADD COLUMN foto_posisi VARCHAR(20) NOT NULL DEFAULT '50% 50%';
