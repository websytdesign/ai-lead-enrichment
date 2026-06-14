-- Supabase Schema for AI Lead Enrichment

create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  contact_name text not null,
  company_name text not null,
  email text not null,
  website text not null,
  status text default 'pending' check (status in ('pending', 'processing', 'ready', 'needs_review', 'approved', 'sent', 'failed')),
  scraped_content text,
  company_summary text,
  industry text,
  target_audience text,
  service_type text,
  confidence_score integer,
  pain_point_1 text,
  pain_point_2 text,
  pain_point_3 text,
  supporting_evidence text,
  email_subject text,
  email_body text,
  personalization_note text,
  error_message text
);

-- Enable Row Level Security
alter table leads enable row level security;

-- Allow all operations (adjust for production)
create policy "Allow all" on leads for all using (true) with check (true);
