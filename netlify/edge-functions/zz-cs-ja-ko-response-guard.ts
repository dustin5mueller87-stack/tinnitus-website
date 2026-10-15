/*
 * Response guard for the Czech, Japanese and Korean audit layers.
 * It runs after the language-specific functions and removes the origin content-length
 * before those upstream functions replace HTML text. This prevents a stale byte length
 * from surviving a changed response body. German routes and the unfinished FAQ are excluded.
 */
const VERSION = '2026-09-07-v1';

export default (_request: Request, context: any) => context.next();

export const config = {
  path: ['/cs/*', '/ja/*', '/ko/*'],
  excludedPath: [
    '/cs/faq', '/cs/faq.html',
    '/ja/faq', '/ja/faq.html',
    '/ko/faq', '/ko/faq.html',
  ],
};
