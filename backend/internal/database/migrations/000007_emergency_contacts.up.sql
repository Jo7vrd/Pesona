-- Kontak darurat yang dikelola operator desa lewat admin (sebelumnya
-- statis di kode). Ditampilkan di halaman Kedaruratan publik.
CREATE TABLE emergency_contacts (
    id         BIGSERIAL PRIMARY KEY,
    nama       VARCHAR(100) NOT NULL,
    peran      VARCHAR(150) NOT NULL,
    telepon    VARCHAR(30)  NOT NULL,
    ikon       VARCHAR(20)  NOT NULL DEFAULT 'phone',
    urutan     INTEGER      NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX emergency_contacts_urutan_idx ON emergency_contacts (urutan, id);
