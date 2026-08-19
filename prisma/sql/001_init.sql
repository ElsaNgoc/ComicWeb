-- ComicWeb initial schema (run in Supabase SQL Editor or any Postgres)
-- Images: store only URLs pointing to Cloudflare R2 — do NOT use Supabase Storage for page images.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS mangas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL UNIQUE,
  cover_image TEXT NOT NULL,
  description TEXT,
  is_nsfw     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mangas_created_at_idx ON mangas (created_at);

CREATE TABLE IF NOT EXISTS chapters (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manga_id               UUID NOT NULL REFERENCES mangas (id) ON DELETE CASCADE,
  chapter_number         DOUBLE PRECISION NOT NULL,
  is_locked              BOOLEAN NOT NULL DEFAULT TRUE,
  password               VARCHAR(255),
  shopee_affiliate_link  TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chapters_manga_id_chapter_number_key UNIQUE (manga_id, chapter_number)
);

CREATE INDEX IF NOT EXISTS chapters_manga_id_idx ON chapters (manga_id);

CREATE TABLE IF NOT EXISTS images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id  UUID NOT NULL REFERENCES chapters (id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  CONSTRAINT images_chapter_id_order_index_key UNIQUE (chapter_id, order_index)
);

CREATE INDEX IF NOT EXISTS images_chapter_id_idx ON images (chapter_id);

-- updated_at trigger for mangas
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS mangas_set_updated_at ON mangas;
CREATE TRIGGER mangas_set_updated_at
  BEFORE UPDATE ON mangas
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
