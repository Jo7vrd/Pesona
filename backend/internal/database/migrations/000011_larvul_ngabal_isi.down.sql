-- Kembalikan ringkasan singkat & kosongkan sub-bagian.
UPDATE budaya
SET deskripsi = $larvul_desc$Hukum adat tertua Kepulauan Kei — darah merah dan tombak dari Bali — yang mengatur harmoni sosial, penghormatan pada sesama, dan hak atas tanah. Masih menjadi pegangan hidup masyarakat Kei hingga hari ini.$larvul_desc$,
    subsections = '[]'::jsonb,
    updated_at = now()
WHERE nama = 'Larvul Ngabal';
