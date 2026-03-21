ALTER TABLE public."Users"
ADD COLUMN monthly_savings_target numeric,
ADD COLUMN category_limits jsonb;
