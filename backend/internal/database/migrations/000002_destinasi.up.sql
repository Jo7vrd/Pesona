-- Modul destinasi wisata (tab admin "Destinasi" + halaman publik).
-- video_youtube opsional dan HANYA menerima tautan YouTube — validasi
-- format dilakukan di lapisan DTO; kolom ini sekadar penyimpan URL.

CREATE TABLE destinasi (
    id            BIGSERIAL PRIMARY KEY,
    nama          VARCHAR(100)     NOT NULL,
    jenis         VARCHAR(20)      NOT NULL
                  CONSTRAINT destinasi_jenis_check
                  CHECK (jenis IN ('Pantai', 'Snorkeling', 'Gua', 'Pulau')),
    deskripsi     TEXT             NOT NULL,
    lat           DOUBLE PRECISION NOT NULL,
    lng           DOUBLE PRECISION NOT NULL,
    foto_url      VARCHAR(500)     NOT NULL,
    video_youtube VARCHAR(500),
    created_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX destinasi_nama_lower_idx ON destinasi (LOWER(nama));
CREATE INDEX destinasi_jenis_idx ON destinasi (jenis);
