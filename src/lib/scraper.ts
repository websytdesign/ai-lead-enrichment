export async function scrapeWebsite(url: string): Promise<string> {
  const strategies = [
    () => fetchWithUA(url, 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
    () => fetchGoogleCache(url),
    () => fetchAlternativePages(url),
  ];

  for (const strategy of strategies) {
    try {
      const content = await strategy();
      if (content && content.length > 100) return content;
    } catch {
      continue;
    }
  }

  throw new Error('All scraping strategies failed');
}

async function fetchWithUA(url: string, ua: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': ua },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  return extractTextFromHTML(html);
}

async function fetchGoogleCache(url: string): Promise<string> {
  const cacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`;
  return fetchWithUA(cacheUrl, 'Mozilla/5.0 (compatible; Googlebot/2.1)');
}

async function fetchAlternativePages(url: string): Promise<string> {
  const baseUrl = new URL(url);
  const altPaths = ['/about', '/about-us', '/company', '/services'];
  
  for (const path of altPaths) {
    try {
      const altUrl = `${baseUrl.origin}${path}`;
      const content = await fetchWithUA(altUrl, 'Mozilla/5.0 (compatible; Googlebot/2.1)');
      if (content && content.length > 100) return content;
    } catch {
      continue;
    }
  }
  
  throw new Error('No alternative pages found');
}

function extractTextFromHTML(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  text = text.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&#\d+;/g, '');
  
  // Clean whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Limit to 3000 chars
  return text.slice(0, 3000);
}
