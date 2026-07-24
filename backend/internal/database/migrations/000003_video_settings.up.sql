-- Video YouTube opsional untuk modul Kuliner & Budaya (setara Destinasi).
-- Validasi format tautan dilakukan di lapisan DTO; kolom ini penyimpan URL.
ALTER TABLE makanan ADD COLUMN video_youtube VARCHAR(500);
ALTER TABLE budaya  ADD COLUMN video_youtube VARCHAR(500);

-- Setelan tingkat-situs (key-value). Saat ini: "bahasa_video" — satu
-- tautan YouTube yang di-embed di halaman Bahasa Kei.
CREATE TABLE settings (
    key        VARCHAR(50)  PRIMARY KEY,
    value      TEXT         NOT NULL,
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
