-- Skema awal sesuai PRD §8.3.
-- Unik nama bersifat case-insensitive (FR-014) via indeks LOWER().

CREATE TABLE makanan (
    id          BIGSERIAL PRIMARY KEY,
    nama        VARCHAR(100) NOT NULL,
    kategori    VARCHAR(20)  NOT NULL
                CONSTRAINT makanan_kategori_check
                CHECK (kategori IN ('makanan', 'minuman', 'kudapan')),
    deskripsi   TEXT         NOT NULL,
    foto_url    VARCHAR(500) NOT NULL,
    is_unggulan BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX makanan_nama_lower_idx ON makanan (LOWER(nama));
CREATE INDEX makanan_unggulan_idx ON makanan (is_unggulan) WHERE is_unggulan;
CREATE INDEX makanan_kategori_idx ON makanan (kategori);

CREATE TABLE budaya (
    id          BIGSERIAL PRIMARY KEY,
    nama        VARCHAR(100) NOT NULL,
    kategori    VARCHAR(50)  NOT NULL,
    deskripsi   TEXT         NOT NULL,
    foto_url    VARCHAR(500) NOT NULL,
    is_unggulan BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX budaya_nama_lower_idx ON budaya (LOWER(nama));
CREATE INDEX budaya_unggulan_idx ON budaya (is_unggulan) WHERE is_unggulan;

CREATE TABLE bahasa_lokal (
    id               BIGSERIAL PRIMARY KEY,
    bahasa_indonesia VARCHAR(150) NOT NULL,
    bahasa_kei       VARCHAR(150) NOT NULL,
    catatan          TEXT,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX bahasa_indonesia_lower_idx
    ON bahasa_lokal (LOWER(bahasa_indonesia));

CREATE TABLE admins (
    id            BIGSERIAL PRIMARY KEY,
    nama          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'admin'
                  CONSTRAINT admins_role_check
                  CHECK (role IN ('super_admin', 'admin')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX admins_email_lower_idx ON admins (LOWER(email));
