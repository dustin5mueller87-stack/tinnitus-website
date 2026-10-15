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

export default (_request: Request, context: any) => context.next();

export const config = {
  path: ['/ko/mein-loesungsansatz', '/ko/mein-loesungsansatz.html'],
};

export { postfix };
