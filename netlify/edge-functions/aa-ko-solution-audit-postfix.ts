/*
 * Korean solution-page post-processing for one exact sentence join.
 *
 * This function intentionally sorts before korean-audit-fixes.ts. It therefore
 * receives the already transformed Korean response after context.next() returns
 * and removes a duplicated comparison phrase created by the local 75 -> 50
 * correction. Scope is one Korean page only. No German or FAQ route can match.
 */
const VERSION = '2026-09-07-v1';

function postfix(html: string) {
  return html.split(
    '제가 생애 처음 겪은 이명의 강도의 제 생애 맨 처음 이명 강도의 약 50%에 도달해 실험을 끝냈을 때였습니다.'
  ).join(
    '제가 생애 처음 겪은 이명의 강도의 약 50%에 도달해 실험을 끝냈을 때였습니다.'
  );
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
