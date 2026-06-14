import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeWebsite } from '@/lib/scraper';
import { analyzeCompany, analyzePainPoints, generateOutreach } from '@/lib/openai';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mark as processing
  await supabase.from('leads').update({ status: 'processing' }).eq('id', id);

  try {
    // Get lead
    const { data: lead, error } = await supabase.from('leads').select('*').eq('id', id).single();
    if (error || !lead) throw new Error('Lead not found');

    // Step 1: Scrape website
    let scrapedContent: string;
    try {
      scrapedContent = await scrapeWebsite(lead.website);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown scraping error';
      await supabase.from('leads').update({
        status: 'failed',
        error_message: `Scraping failed: ${msg}`,
      }).eq('id', id);
      return NextResponse.json({ error: `Scraping failed: ${msg}` }, { status: 500 });
    }

    // Step 2: Analyze company
    const analysis = await analyzeCompany(scrapedContent);

    // Step 3: Analyze pain points
    const painPoints = await analyzePainPoints(scrapedContent, analysis.company_summary);

    // Step 4: Generate outreach email
    const outreach = await generateOutreach(
      lead.contact_name,
      lead.company_name,
      analysis.company_summary,
      painPoints
    );

    // Determine status based on confidence
    const confidence = analysis.confidence_score || 50;
    const status = confidence >= 60 ? 'ready' : 'needs_review';

    // Update lead with all data
    const { data: updated, error: updateError } = await supabase
      .from('leads')
      .update({
        status,
        scraped_content: scrapedContent.slice(0, 5000),
        company_summary: analysis.company_summary,
        industry: analysis.industry,
        target_audience: analysis.target_audience,
        service_type: analysis.service_type,
        confidence_score: confidence,
        pain_point_1: painPoints.pain_point_1,
        pain_point_2: painPoints.pain_point_2,
        pain_point_3: painPoints.pain_point_3,
        supporting_evidence: painPoints.supporting_evidence,
        email_subject: outreach.subject,
        email_body: outreach.body,
        personalization_note: outreach.personalization_note,
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;
    return NextResponse.json(updated);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Processing failed';
    await supabase.from('leads').update({
      status: 'failed',
      error_message: msg,
    }).eq('id', id);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
