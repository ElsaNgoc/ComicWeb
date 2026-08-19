-- Phase 2–5: tags, theme, layout columns on site_settings

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS theme_config JSONB,
  ADD COLUMN IF NOT EXISTS layout_config JSONB;

CREATE TABLE IF NOT EXISTS tags (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS manga_tags (
  manga_id UUID NOT NULL REFERENCES mangas (id) ON DELETE CASCADE,
  tag_id   UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  PRIMARY KEY (manga_id, tag_id)
);
