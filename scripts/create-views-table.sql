-- Create a table to store view counts
CREATE TABLE IF NOT EXISTS view_counts (
  id SERIAL PRIMARY KEY,
  page_name VARCHAR(255) UNIQUE NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial record for EmoSense portfolio
INSERT INTO view_counts (page_name, count) 
VALUES ('emosense-portfolio', 0)
ON CONFLICT (page_name) DO NOTHING;

-- Create or replace function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_view_counts_updated_at ON view_counts;
CREATE TRIGGER update_view_counts_updated_at
    BEFORE UPDATE ON view_counts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
