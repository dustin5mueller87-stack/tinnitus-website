/*
 * Response guard for the Czech, Japanese and Korean audit layers.
 * It runs after the language-specific functions and removes the origin content-length
 * before those upstream functions replace HTML text. This prevents a stale byte length
 * from surviving a changed response body. German routes and the unfinished FAQ are excluded.
 */
const VERSION = '2026-09-07-v1';

export default async (_request: Request, context: any) => {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-audit-response-guard', VERSION);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = {
  path: ['/cs/*', '/ja/*', '/ko/*'],
  excludedPath: [
    '/cs/faq', '/cs/faq.html',
    '/ja/faq', '/ja/faq.html',
    '/ko/faq', '/ko/faq.html',
  ],
};
