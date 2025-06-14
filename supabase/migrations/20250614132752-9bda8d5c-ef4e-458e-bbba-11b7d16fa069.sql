
-- Add currency column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN currency text DEFAULT 'EUR';

-- Update existing transactions to have EUR as default currency
UPDATE public.transactions 
SET currency = 'EUR' 
WHERE currency IS NULL;
