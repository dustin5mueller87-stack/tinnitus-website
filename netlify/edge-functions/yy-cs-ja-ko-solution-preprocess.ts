/*
 * Exact solution-page preprocessing for one binding author deletion.
 *
 * The old local CFS-causality aside must be removed with NO replacement, while the
 * surrounding first-episode/energy paragraph must remain intact. This downstream
 * preprocessor also prevents broader language-layer patterns from ever swallowing
 * that surrounding paragraph.
 *
 * Scope: Czech, Japanese and Korean solution pages only.
 * German routes and all FAQ routes are outside this matcher.
 */
const VERSION = '2026-09-07-v1';

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}

function preprocess(pathname: string, html: string) {
  if (pathname.startsWith("/cs/") && html.includes('data-translation-batch="2026-09-07"')) return html;
  if (pathname.startsWith("/ja/") && html.includes('data-translation-batch="2026-09-07-ja"')) return html;
  const p = pathname.replace(/\.html$/, '');

  if (p === '/cs/mein-loesungsansatz') {
    return replaceAll(
      html,
      '(ne náhodou se u mě asi o rok a půl až necelé dva roky později rozvinul těžký chronický únavový syndrom)',
      ''
    );
  }

  if (p === '/ja/mein-loesungsansatz') {
    return replaceAll(
      html,
      '（理由もなく起きたことではありません。約1年半から2年弱後、私は重い慢性疲労症候群を発症しました）',
      ''
    );
  }

  if (p === '/ko/mein-loesungsansatz') {
    return replaceAll(
      html,
      '약 1년 반에서 2년이 채 안 된 뒤 중증 만성 피로 증후군이 찾아온 것도 이유 없는 일이 아니었습니다. ',
      ''
    );
  }

  return html;
}

export default async (request: Request, context: any) => {
  const response = await context.next();
  // These responses must not be reconstructed with a body.
  if (request.method === 'HEAD' || [204, 205, 304].includes(response.status)) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;

  const url = new URL(request.url);
  const original = await response.text();
  const corrected = preprocess(url.pathname, original);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  if (corrected !== original) headers.set('x-tbr-solution-preprocess', VERSION);

  return new Response(corrected, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = {
  path: [
    '/cs/mein-loesungsansatz', '/cs/mein-loesungsansatz.html',
    '/ja/mein-loesungsansatz', '/ja/mein-loesungsansatz.html',
    '/ko/mein-loesungsansatz', '/ko/mein-loesungsansatz.html',
  ],
};

export { preprocess };
