-- Login admin beralih dari email ke username. Kolom email dihapus total;
-- username menggantikannya (unik case-insensitive, maks 50 karakter).
ALTER TABLE admins RENAME COLUMN email TO username;
DROP INDEX IF EXISTS admins_email_lower_idx;
-- Admin seed bawaan (email lama) dirapikan menjadi username 'admin'.
UPDATE admins SET username = 'admin' WHERE LOWER(username) = LOWER('admin@keikecil.id');
ALTER TABLE admins ALTER COLUMN username TYPE VARCHAR(50);
CREATE UNIQUE INDEX admins_username_lower_idx ON admins (LOWER(username));
