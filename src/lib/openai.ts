import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1',
  apiKey: process.env.AI_API_KEY,
});

const model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

export async function analyzeCompany(scrapedContent: string) {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are a business analyst. Analyze the website content and extract company information. Return JSON only.',
      },
      {
        role: 'user',
        content: `Analyze this website content and return a JSON object with these fields:
- company_summary (2-3 sentences about what the company does)
- industry (their industry)
- target_audience (who they serve)
- service_type (what services/products they offer)
- confidence_score (0-100, how confident you are in the analysis)

Website content:
${scrapedContent}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');
  return JSON.parse(content);
}

export async function analyzePainPoints(scrapedContent: string, companySummary: string) {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are a sales strategist who identifies business pain points from website analysis. Return JSON only.',
      },
      {
        role: 'user',
        content: `Based on this company's website and summary, identify their likely pain points related to their online presence, marketing, or technology needs.

Company Summary: ${companySummary}

Website Content:
${scrapedContent}

Return a JSON object with:
- pain_point_1 (most likely pain point)
- pain_point_2 (second pain point)
- pain_point_3 (third pain point)
- supporting_evidence (brief explanation of why you identified these pain points)`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');
  return JSON.parse(content);
}

export async function generateOutreach(
  contactName: string,
  companyName: string,
  companySummary: string,
  painPoints: { pain_point_1: string; pain_point_2: string; pain_point_3: string }
) {
  const senderName = process.env.SENDER_NAME || 'Sahil';
  const senderCompany = process.env.SENDER_COMPANY || 'WebSyt Design';
  const senderWebsite = process.env.SENDER_WEBSITE || 'https://websyt.com';
  const senderServices = process.env.SENDER_SERVICES || 'web design, development, and digital marketing';
  const senderCTA = process.env.SENDER_CTA || 'a quick 15-minute call';
  const senderFiverr = process.env.SENDER_FIVERR || '';
  const senderUpwork = process.env.SENDER_UPWORK || '';

  let portfolioLinks = '';
  if (senderFiverr) portfolioLinks += `\nFiverr: ${senderFiverr}`;
  if (senderUpwork) portfolioLinks += `\nUpwork: ${senderUpwork}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: `You are an expert cold email copywriter for ${senderCompany}. Write personalized, concise outreach emails that feel human and helpful, not salesy. Keep emails to 3-4 short paragraphs separated by blank lines. Use a conversational but professional tone.`,
      },
      {
        role: 'user',
        content: `Write a personalized cold email to ${contactName} at ${companyName}.

Company Info: ${companySummary}

Their Pain Points:
1. ${painPoints.pain_point_1}
2. ${painPoints.pain_point_2}
3. ${painPoints.pain_point_3}

Our Services: ${senderServices}
Our Website: ${senderWebsite}${portfolioLinks ? '\n' + portfolioLinks : ''}

CTA: ${senderCTA}

IMPORTANT FORMATTING RULES:
- Use \\n\\n between paragraphs (double newline)
- Keep each paragraph to 2-3 sentences max
- Sign off with: Best Wishes,\\n${senderCompany}
- Do NOT use markdown formatting or bullet points in the email body

Example format:
Hi [Name],\\n\\n[Opening paragraph about their business]\\n\\n[Pain point + how we help]\\n\\n[CTA paragraph]\\n\\nBest Wishes,\\n${senderCompany}

Return a JSON object with:
- subject (email subject line, compelling and personalized)
- body (full email body with \\n\\n between paragraphs)
- personalization_note (brief internal note about why this approach was chosen)`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');
  return JSON.parse(content);
}
