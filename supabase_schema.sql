-- Run this in Supabase SQL Editor before starting the API.

create table if not exists public."Users" (
    id text primary key,
    bad_habits_prompt text not null,
    name text,
    monthly_budget numeric,
    financial_personality text,
    spending_weakness text[],
    primary_goal text,
    weekend_vibe text,
    purchase_regret text,
    savings_rate text,
    monthly_savings_target numeric,
    category_limits jsonb
);

create table if not exists public."Transactions" (
    id text primary key,
    user_id text not null references public."Users"(id) on delete cascade,
    amount integer not null,
    category text not null,
    merchant text not null,
    note text,
    timestamp timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public."Transactions"(user_id);
create index if not exists transactions_timestamp_idx on public."Transactions"(timestamp desc);

create table if not exists public."Wishlists" (
    id text primary key,
    user_id text not null references public."Users"(id) on delete cascade,
    name text not null,
    price numeric not null,
    category_id text,
    added_at timestamptz not null default now()
);

create index if not exists wishlists_user_id_idx on public."Wishlists"(user_id);
