import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { ids } = await request.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids array required' }, { status: 400 });
  }

  const results = [];
  for (const id of ids) {
    try {
      const response = await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/leads/${id}/process`, {
        method: 'POST',
      });
      const data = await response.json();
      results.push({ id, success: response.ok, data });
    } catch (e) {
      results.push({ id, success: false, error: e instanceof Error ? e.message : 'Unknown error' });
    }
  }

  return NextResponse.json({ results });
}

export async function DELETE(request: Request) {
  const { ids } = await request.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids array required' }, { status: 400 });
  }

  const { error } = await supabase.from('leads').delete().in('id', ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, deleted: ids.length });
}
