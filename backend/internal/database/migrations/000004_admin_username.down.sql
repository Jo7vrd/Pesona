-- Balikkan username menjadi email (nilai asli tidak dipulihkan).
DROP INDEX IF EXISTS admins_username_lower_idx;
ALTER TABLE admins ALTER COLUMN username TYPE VARCHAR(150);
ALTER TABLE admins RENAME COLUMN username TO email;
CREATE UNIQUE INDEX admins_email_lower_idx ON admins (LOWER(email));
