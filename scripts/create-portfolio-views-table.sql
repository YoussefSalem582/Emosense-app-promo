-- Create the portfolio_views table
CREATE TABLE IF NOT EXISTS portfolio_views (
  id BIGSERIAL PRIMARY KEY,
  page_name VARCHAR(100) UNIQUE NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on page_name for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_views_page_name ON portfolio_views(page_name);

-- Insert initial record for EmoSense app
INSERT INTO portfolio_views (page_name, view_count) 
VALUES ('emosense-app', 0)
ON CONFLICT (page_name) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_portfolio_views_updated_at ON portfolio_views;
CREATE TRIGGER update_portfolio_views_updated_at
    BEFORE UPDATE ON portfolio_views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
