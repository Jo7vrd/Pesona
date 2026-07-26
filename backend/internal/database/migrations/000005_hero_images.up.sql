-- Foto hero beranda (carousel) yang dikelola operator desa lewat admin.
-- Ditampilkan bergiliran otomatis; kolom urutan menentukan urutannya.
CREATE TABLE hero_images (
    id         BIGSERIAL PRIMARY KEY,
    foto_url   VARCHAR(500) NOT NULL,
    urutan     INTEGER      NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX hero_images_urutan_idx ON hero_images (urutan, id);
