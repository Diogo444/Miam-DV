-- MCP 2.0: retains whether a weekly message is a proverb or a joke.
-- Existing records are historical proverbs and remain valid with this default.
ALTER TABLE week_proverbes
  ADD COLUMN type VARCHAR(10) NOT NULL DEFAULT 'proverbe' AFTER text;
