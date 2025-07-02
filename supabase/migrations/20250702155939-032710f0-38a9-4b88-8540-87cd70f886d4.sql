-- Add subcategory support to transactions table
ALTER TABLE public.transactions 
ADD COLUMN subcategory TEXT;

-- Add index for better performance on category queries
CREATE INDEX IF NOT EXISTS idx_transactions_category_subcategory 
ON public.transactions(category, subcategory);

-- Update existing transactions with default subcategories based on common patterns
UPDATE public.transactions 
SET subcategory = CASE 
  WHEN category = 'Food' THEN 'Restaurants'
  WHEN category = 'Transport' THEN 'Public Transport'
  WHEN category = 'Shopping' THEN 'General'
  WHEN category = 'Entertainment' THEN 'General'
  WHEN category = 'Bills' THEN 'Utilities'
  WHEN category = 'Health' THEN 'General'
  WHEN category = 'Education' THEN 'General'
  WHEN category = 'Travel' THEN 'General'
  WHEN category = 'Other' THEN 'Miscellaneous'
  ELSE 'General'
END
WHERE subcategory IS NULL;