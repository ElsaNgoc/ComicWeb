-- Site settings for admin-editable UI copy

CREATE TABLE IF NOT EXISTS site_settings (
  id                      TEXT PRIMARY KEY DEFAULT 'default',
  site_name               VARCHAR(255) NOT NULL DEFAULT 'Xà Động',
  tagline                 TEXT,
  banner_title            TEXT,
  banner_subtitle         TEXT,
  welcome_title           TEXT,
  welcome_text            TEXT,
  sidebar_quote           TEXT,
  sidebar_intro           TEXT,
  sidebar_corner_title    TEXT,
  sidebar_corner_caption  TEXT,
  sidebar_notes_title     TEXT,
  sidebar_notes           TEXT,
  footer_text             TEXT,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;
