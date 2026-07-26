-- Akun admin bisa dinonaktifkan tanpa dihapus (akuntabilitas). Akun
-- nonaktif tidak dapat login tetapi jejaknya tetap ada.
ALTER TABLE admins ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
