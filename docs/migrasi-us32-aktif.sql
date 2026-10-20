-- Migrasi US-32: Kolom aktif/nonaktif produk
ALTER TABLE produk ADD COLUMN IF NOT EXISTS aktif BOOLEAN DEFAULT true;
