-- Create the views table if it doesn't exist
CREATE TABLE IF NOT EXISTS portfolio_views (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(50) UNIQUE NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the initial record for EmoSense portfolio
INSERT INTO portfolio_views (page_slug, view_count) 
VALUES ('emosense-app', 0)
ON CONFLICT (page_slug) 
DO NOTHING;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_portfolio_views_updated_at ON portfolio_views;
CREATE TRIGGER update_portfolio_views_updated_at
    BEFORE UPDATE ON portfolio_views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
