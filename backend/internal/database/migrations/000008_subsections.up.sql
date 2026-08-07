-- Sub-bagian bertajuk opsional untuk memperkaya deskripsi konten
-- (mis. "Tujuh Pasal Larvul Ngabal"). Disimpan sebagai JSON array
-- [{ "judul": "...", "isi": "..." }].
ALTER TABLE makanan   ADD COLUMN subsections JSONB NOT NULL DEFAULT '[]';
ALTER TABLE budaya    ADD COLUMN subsections JSONB NOT NULL DEFAULT '[]';
ALTER TABLE destinasi ADD COLUMN subsections JSONB NOT NULL DEFAULT '[]';
