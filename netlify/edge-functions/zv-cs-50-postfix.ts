function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}

function patchBio2(html: string) {
  if (html.includes('data-translation-batch="2026-09-07"')) return html;
  html = replaceAll(html, 'Kolaps na 75&nbsp;%', 'Kolaps na zhruba 50&nbsp;%');
  html = replaceAll(
    html,
    'Jak ale vůbec mohl tinnitus za těchto okolností znovu vystoupat na brutálních 75&nbsp;% původní hlasitosti?',
    'Jak ale vůbec mohl tinnitus za těchto okolností znovu vystoupat na zhruba 50&nbsp;% hlasitosti mého úplně prvního tinnitu?'
  );
  html = replaceAll(
    html,
    'Definitivní kolaps: 75 procent a zvukový chaos',
    'Definitivní kolaps: zhruba 50 procent a zvukový chaos'
  );
  html = replaceAll(
    html,
    'V levém uchu byl určitě ze tří čtvrtin (75&nbsp;%) tak hlasitý jako při mém úplně prvním kolapsu.',
    'V levém uchu dosahoval zhruba poloviny (50&nbsp;%) hlasitosti mého úplně prvního tinnitu.'
  );
  return html;
}

function patchShortBio(html: string) {
  if (html.includes('data-translation-batch="2026-09-07"')) return html;
  html = replaceAll(
    html,
    'Tinnitus se vrátil s brutálními 75&nbsp;% původní hlasitosti',
    'Tinnitus se vrátil na brutální úroveň zhruba 50&nbsp;% hlasitosti mého úplně prvního tinnitu'
  );
  return html;
}

function patchApproach(html: string) {
  if (html.includes('data-translation-batch="2026-09-07"')) return html;
  html = replaceAll(
    html,
    'přibližně 75&nbsp;% intenzity mého úplně prvního případu tinnitu',
    'zhruba 50&nbsp;% hlasitosti mého úplně prvního tinnitu'
  );
  return html;
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;

  let html = await response.text();
  if (url.pathname === '/cs/meine-geschichte-teil-2' || url.pathname === '/cs/meine-geschichte-teil-2.html') {
    html = patchBio2(html);
  } else if (url.pathname === '/cs/tinnitus-geheilt-erfahrungsbericht' || url.pathname === '/cs/tinnitus-geheilt-erfahrungsbericht.html') {
    html = patchShortBio(html);
  } else if (url.pathname === '/cs/mein-loesungsansatz' || url.pathname === '/cs/mein-loesungsansatz.html') {
    html = patchApproach(html);
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-cs-50-postfix', '2026-09-07-v1');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = {
  path: [
    '/cs/meine-geschichte-teil-2',
    '/cs/meine-geschichte-teil-2.html',
    '/cs/tinnitus-geheilt-erfahrungsbericht',
    '/cs/tinnitus-geheilt-erfahrungsbericht.html',
    '/cs/mein-loesungsansatz',
    '/cs/mein-loesungsansatz.html',
  ],
};
