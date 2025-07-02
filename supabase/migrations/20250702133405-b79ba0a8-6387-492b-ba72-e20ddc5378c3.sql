-- Add currency column to subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN currency text DEFAULT 'EUR';