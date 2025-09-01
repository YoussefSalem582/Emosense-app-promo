-- Create a function to safely increment the view count
CREATE OR REPLACE FUNCTION increment_view_count(slug TEXT)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    -- Insert or update the view count
    INSERT INTO portfolio_views (page_slug, view_count)
    VALUES (slug, 1)
    ON CONFLICT (page_slug)
    DO UPDATE SET 
        view_count = portfolio_views.view_count + 1,
        updated_at = NOW()
    RETURNING view_count INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql;
