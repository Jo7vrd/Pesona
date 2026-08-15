-- Bagian hukum "Tujuh Pasal Larvul Ngabal" kini ditampilkan sebagai kartu
-- berdesain (budayaExtra), jadi hapus blok sub-bagian teks yang duplikat.
-- Berbasis judul + jaga urutan; blok lain (termasuk fotonya) tetap utuh.
UPDATE budaya
SET subsections = (
  SELECT COALESCE(jsonb_agg(e ORDER BY ord), '[]'::jsonb)
  FROM jsonb_array_elements(subsections) WITH ORDINALITY AS t(e, ord)
  WHERE e->>'judul' <> 'Tujuh Pasal Larvul Ngabal'
),
    updated_at = now()
WHERE nama = 'Larvul Ngabal';
