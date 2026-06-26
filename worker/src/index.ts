/**
 * DeepSeek API proxy for ::self
 *
 * Deploy this Worker to Cloudflare, then set DEEPSEEK_API_KEY as a secret:
 *   npx wrangler secret put DEEPSEEK_API_KEY
 *
 * The frontend calls this worker instead of DeepSeek directly,
 * so the API key never touches the browser.
 */

const DEEPSEEK_BASE = 'https://api.deepseek.com';

interface Env {
  DEEPSEEK_API_KEY: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const targetUrl = DEEPSEEK_BASE + url.pathname + url.search;

    // Build proxy request — replace API key, keep everything else
    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.set('Authorization', `Bearer ${env.DEEPSEEK_API_KEY}`);
    proxyHeaders.set('Host', new URL(DEEPSEEK_BASE).host);

    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: proxyHeaders,
      body: request.body,
    });

    // Forward to DeepSeek
    const response = await fetch(proxyRequest);

    // Merge CORS headers into the response
    const responseHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};
