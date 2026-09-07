/*
 * Root-route safety net for the Czech and Korean audited home-page fixes.
 * It exists only so /cs/ and /ko/ are corrected even if a wildcard matcher is
 * interpreted narrowly by the runtime. No German route and no FAQ route is touched.
 */
const VERSION = '2026-09-07-v1';

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}

function fixCzechHome(html: string) {
  html = replaceAll(
    html,
    'a také prodělal těžké onemocnění s chronickým únavovým syndromem (CFS)',
    'a také překonal těžké onemocnění s chronickým únavovým syndromem (CFS)'
  );
  html = replaceAll(
    html,
    'Tři hlavní příčiny: hluk, stres a léky – a proč je třeba ke každé přistupovat jinak.',
    'Tři hlavní příčiny: hluk, stres a léky – a proč každá vyžaduje jinou léčbu.'
  );
  html = replaceAll(
    html,
    'Interpretace nálezu a příčin snížené dostupnosti ATP.',
    'Interpretace nálezu a příčiny nedostatku ATP.'
  );
  html = replaceAll(
    html,
    'podrobná interpretace nálezu a příčin snížené dostupnosti ATP',
    'podrobná interpretace nálezu a příčiny snížené dostupnosti ATP'
  );
  html = replaceAll(html, 'Nejsem <strong>lékař</strong>.', '<strong>Nejsem lékař</strong>.');
  html = replaceAll(
    html,
    'zvlášť když vznikly náhle, navštiv otorinolaryngologa (ORL lékaře), aby posoudil možné organické příčiny.',
    'zvlášť když vznikly akutně, navštiv prosím ORL lékaře, aby posoudil možné organické příčiny.'
  );
  html = replaceAll(
    html,
    '<div class="preview-block">\n    <h3>Tinnitus způsobený stresem',
    '<div class="preview-block" data-nosnippet>\n    <h3>Tinnitus způsobený stresem'
  );
  return html;
}

function fixKoreanHome(html: string) {
  html = replaceAll(
    html,
    '이명이라고 다 같은 이명은 아닙니다. 제 경험과 조사에 따르면 근본적으로 서로 다른 세 가지 유발 요인이 있으며, 각각 다른 접근이 필요합니다.',
    '이명이라고 다 같은 이명은 아닙니다. 제 경험과 조사에 따르면 근본적으로 서로 다른 세 가지 유발 요인이 있으며, 각각 다르게 다뤄져야 합니다.'
  );
  html = replaceAll(
    html,
    '특히 갑자기 생겼다면, 기질적 원인이 있는지 확인받기 위해 이비인후과 진료를 받으세요.',
    '특히 급성으로 생겼다면, 기질적 원인이 있는지 확인받기 위해 이비인후과 진료를 받아 주세요.'
  );
  return html;
}

export default async (request: Request, context: any) => {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;
  const url = new URL(request.url);
  const original = await response.text();
  const corrected = url.pathname.startsWith('/cs/')
    ? fixCzechHome(original)
    : fixKoreanHome(original);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  if (corrected !== original) headers.set('x-tbr-root-audit-fixes', VERSION);
  return new Response(corrected, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = {
  path: ['/cs/', '/ko/'],
};
