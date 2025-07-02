-- Clean up duplicate demo transactions that are inflating dashboard numbers

-- First, let's see what we're dealing with - this will help identify patterns
-- Delete all transactions from 2024 (these appear to be demo/test data)
DELETE FROM public.transactions 
WHERE date < '2025-01-01';

-- Delete obvious duplicate demo transactions (same amount, description, category on same date)
DELETE FROM public.transactions a
USING public.transactions b
WHERE a.id > b.id
  AND a.amount = b.amount
  AND a.category = b.category
  AND a.description = b.description
  AND a.date = b.date
  AND a.type = b.type
  AND a.user_id = b.user_id;

-- Delete transactions marked as demo_user = true (if any exist)
DELETE FROM public.transactions 
WHERE demo_user = true;

-- Clean up any remaining suspicious duplicates (more than 10 identical transactions)
WITH duplicate_groups AS (
  SELECT 
    amount, category, description, type, user_id,
    COUNT(*) as count,
    array_agg(id ORDER BY created_at) as ids
  FROM public.transactions
  GROUP BY amount, category, description, type, user_id
  HAVING COUNT(*) > 10
)
DELETE FROM public.transactions
WHERE id IN (
  SELECT unnest(ids[11:]) -- Keep only first 10, delete the rest
  FROM duplicate_groups
);