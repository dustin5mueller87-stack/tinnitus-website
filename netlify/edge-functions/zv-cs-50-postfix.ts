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

export default (_request: Request, context: any) => context.next();

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
