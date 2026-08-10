-- Skala foto (zoom) untuk editor pembingkaian ala Instagram. Dipakai
-- bersama foto_posisi: object-position + transform scale saat ditampilkan.
-- Non-destruktif. Default 1 (tanpa perbesaran).
ALTER TABLE makanan     ADD COLUMN foto_zoom REAL NOT NULL DEFAULT 1;
ALTER TABLE budaya      ADD COLUMN foto_zoom REAL NOT NULL DEFAULT 1;
ALTER TABLE destinasi   ADD COLUMN foto_zoom REAL NOT NULL DEFAULT 1;
ALTER TABLE hero_images ADD COLUMN foto_zoom REAL NOT NULL DEFAULT 1;
