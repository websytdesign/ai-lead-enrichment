import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const leads = Array.isArray(body) ? body : [body];

  const results = [];
  for (const lead of leads) {
    const { contact_name, company_name, email, website } = lead;
    if (!contact_name || !company_name || !email || !website) {
      results.push({ error: 'All fields required', lead });
      continue;
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({ contact_name, company_name, email, website, status: 'pending' })
      .select()
      .single();

    if (error) results.push({ error: error.message, lead });
    else results.push(data);
  }

  return NextResponse.json(results);
}
