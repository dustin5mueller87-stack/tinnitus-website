/*
 * Retained Korean solution-page response wrapper.
 *
 * The former sentence deduplication served an obsolete percentage replacement.
 * The author reconfirmed approximately 75% on 2026-09-09, so this wrapper now
 * preserves the body. Scope is one Korean page only. No German or FAQ route can match.
 */
const VERSION = '2026-09-07-v1';

function postfix(html: string) {
  return html;
}

export default async (_request: Request, context: any) => {
  const response = await context.next();
  // These responses must not be reconstructed with a body.
  if (_request.method === 'HEAD' || [204, 205, 304].includes(response.status)) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;

  const original = await response.text();
  const corrected = postfix(original);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  if (corrected !== original) headers.set('x-tbr-ko-solution-postfix', VERSION);

  return new Response(corrected, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = {
  path: ['/ko/mein-loesungsansatz', '/ko/mein-loesungsansatz.html'],
};

export { postfix };
