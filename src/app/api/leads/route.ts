import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { contact_name, company_name, email, website } = body;

  if (!contact_name || !company_name || !email || !website) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({ contact_name, company_name, email, website, status: 'pending' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
