/*
 * Collision-safe Russian corrections from the completed one-pass translation audit.
 * Scope is /ru/* only. FAQ, shared assets, source-sensitive research questions,
 * open visual/runtime checks and the disputed 50/75 second-episode value stay untouched.
 */
const VERSION = "2026-09-07-v1";

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}
function replaceRegex(text: string, pattern: RegExp, replacement: string) {
  return text.replace(pattern, replacement);
}

function fixBio1(html: string) {
  // Binding chronology: day 3 only left; right first perceived days later after more sound exposure.
  html = replaceAll(
    html,
    'В правом я уже тогда слышал слабый писк.',
    'В правом ухе в тот момент я ещё не воспринимал никакого тиннитуса.'
  );
  html = replaceAll(
    html,
    'слабый писк, уже присутствовавший в правом ухе, стал заметно громче',
    'через несколько дней, после дальнейшего звукового воздействия, я впервые начал слышать слабый писк и в правом ухе'
  );
  html = replaceAll(
    html,
    'усилила уже существовавший тон в правом ухе',
    'привела к тому, что в проблему включилось и правое ухо'
  );

  // Preserve the burden image without leaving the opaque German unit as a literal Russian weight claim.
  html = replaceAll(html, 'Она была ношей весом в центнер.', 'На душе лежала невыносимая тяжесть.');

  // Dustin's own B12 value was still normal, but extremely low and just above the deficiency threshold.
  html = replaceRegex(
    html,
    /Я сдал анализ крови у семейного врача: показатель составил 279 при референсном диапазоне 211–911 — очень низко в пределах нормы, чуть выше порога настоящего дефицита\. Таким образом, настоящий дефицит у меня не подтвердился\. Но тогда я всё равно истолковал этот низкий показатель в пределах нормы как функциональный дефицит\./,
    'Я сдал анализ крови у семейного врача: показатель всё ещё был в пределах нормы, но очень низко — прямо над порогом дефицита.'
  );
  return html;
}

function fixShortBio(html: string) {
  html = replaceAll(
    html,
    'Но на третий день проснулось настоящее чудовище: в левом ухе внезапно появились адские свист и шум, а в правом — тихий писк. Моя система окончательно рухнула.',
    'Но на третий день проснулось настоящее чудовище: в левом ухе внезапно появились адские свист и шум. В правом ухе в тот момент я ещё не воспринимал никакого тиннитуса. Моя система окончательно рухнула.'
  );
  html = replaceAll(
    html,
    'После того как я последовал этому совету и продолжил заглушать тиннитус музыкой и шумом, тихий звук, уже присутствовавший в правом ухе, через несколько дней заметно усилился.',
    'После того как я последовал этому совету и продолжил подвергать себя музыке и шуму, через несколько дней после дальнейшей звуковой нагрузки я впервые начал слышать слабый звук и в правом ухе.'
  );

  // The author cancelled IHHT before treatment began.
  html = replaceRegex(
    html,
    /Я (?:даже )?(?:попробовал|пытался пройти)[^<]*\(IHHT\)[^<]*пришлось прервать из-за паники/,
    'Я планировал пройти имитированную высотную тренировку (IHHT), но из-за паники отказался от неё ещё до начала процедуры'
  );

  // "Physically dead" here means seconds of energetic/functional silence, not biological cell death.
  html = replaceAll(
    html,
    'на несколько секунд клетка физически мертва и «немая»',
    'на несколько секунд клетка полностью выходит из строя и становится «немой» из-за энергетического истощения'
  );
  html = replaceAll(
    html,
    'на несколько секунд она физически мертва и «немая»',
    'на несколько секунд она полностью выходит из строя и становится «немой» из-за энергетического истощения'
  );
  return html;
}

function fixApproach(html: string) {
  // Preserve the explicit solution direction only on surfaces whose German source says Lösungsansatz.
  html = replaceAll(html, '<div class="eyebrow">Мой подход</div>', '<div class="eyebrow">Мой подход к решению</div>');
  html = replaceAll(
    html,
    '<h1>Мой подход: что именно я делал при хроническом тиннитусе?</h1>',
    '<h1>Мой подход к решению: что именно я делал при хроническом тиннитусе?</h1>'
  );
  html = replaceAll(html, '>Мой подход</a>', '>Мой подход к решению</a>');

  // Explicit author deletion: remove only the local CFS causal bracket if it still survives.
  html = replaceRegex(html, /\s*\([^)]*(?:не случайно|не без причины)[^)]*CFS[^)]*\)/gi, '');
  html = replaceAll(html, ' (2016/17)', '');
  html = replaceAll(html, ' (2016–2017)', '');

  // Support begins when elimination starts, not only after it is finished.
  html = replaceAll(
    html,
    'после выведения тяжёлых металлов снова восполнить вытесненные микроэлементы',
    'снова восполнять вытесненные микроэлементы, как только начинается выведение тяжёлых металлов'
  );
  html = replaceAll(
    html,
    'после удаления тяжёлых металлов снова восполнить вытесненные микроэлементы',
    'снова восполнять вытесненные микроэлементы, как только начинается выведение тяжёлых металлов'
  );
  return html;
}

function fixProducts(html: string) {
  // Local Person source retains autonomic balance without the older extra complete-conflict clause.
  html = replaceAll(
    html,
    'как целенаправленная проработка конфликтов помогла ему полностью разрешить эти конфликты и вновь привести свою вегетативную нервную систему в равновесие',
    'как целенаправленная проработка конфликтов помогла ему вновь привести свою вегетативную нервную систему в равновесие'
  );

  // Meaning fixed by the author: no surcharge through Dustin's link, not a market-wide price guarantee.
  html = replaceAll(
    html,
    'Для тебя цена при этом остаётся точно такой же: по моей ссылке продукты стоят столько же, сколько при покупке через другие официальные каналы.',
    'Для тебя цена при этом не увеличивается: при покупке по моей ссылке ты не платишь никакой наценки.'
  );

  // The 3 mg statement is historical, not a verified current dose.
  html = replaceAll(
    html,
    'Я уже много лет регулярно принимаю вечером 3 мг мелатонина в дополнение к минеральному комплексу.',
    'На протяжении многих лет я регулярно принимал вечером 3 мг мелатонина в дополнение к минеральному комплексу.'
  );

  html = replaceAll(html, '>Мой подход</a>', '>Мой подход к решению</a>');
  html = replaceAll(html, 'странице о моём подходе.', 'странице о моём подходе к решению.');
  html = replaceAll(html, '→ На страницу «Мой подход» →', '→ На страницу «Мой подход к решению» →');
  return html;
}

function fixNoise(html: string) {
  // Day 3 right-ear chronology.
  html = replaceRegex(
    html,
    /(?:Как будто этого было мало,\s*)?уже на третий день в правом ухе появился слабый писк\.[^<]*?этот уже существовавший[^<]*?(?:заметно|значительно) усилился\./,
    'Через несколько дней, после дальнейшего звукового воздействия, я впервые начал воспринимать слабый писк и в правом ухе. Вскоре после этого он заметно усилился.'
  );
  html = replaceAll(
    html,
    'уже существовавший слабый тон в правом ухе заметно усилился',
    'в проблему включилось и правое ухо'
  );

  // If an old bundle-tilt caption/alt remains, align it with local misalignment of individual stereocilia.
  html = replaceAll(html, 'наклонённый пучок стереоцилий', 'локально смещённые отдельные стереоцилии');
  html = replaceAll(html, 'пучок сенсорных волосков наклоняется', 'отдельные стереоцилии локально смещаются');
  return html;
}

function fixStress(html: string) {
  // Current German opening: gradual release of deep tensions at this local point.
  html = replaceRegex(
    html,
    /Его работа (?:тогда )?очень сильно помогла мне полностью разрешить конфликты[^<]*?вегетативную нервную систему[^<]*?равновесие\./,
    'Только его работа помогла мне тогда шаг за шагом распутывать эти глубоко укоренившиеся внутренние напряжения.'
  );

  // Restore the locally decided strong author statement instead of a newly inserted research-synthesis frame.
  html = replaceRegex(
    html,
    /Согласно моему объяснительному модел[^<]*?не является выдумкой\./,
    'Сегодня я могу сказать: тиннитус, вызванный стрессом, — не мистерия и не плод воображения. Это слышимое следствие постоянного электрического состояния в мозге, вызванного конфликтами, которые так и не были по-настоящему завершены. Когда понимаешь, что там происходит, понимаешь и почему звук остаётся — и что можно сделать самому.'
  );

  // Remove the locally added HPA/cortisol excursus if present; its model boundary remains documented elsewhere.
  html = replaceRegex(html, /\s*<p><strong>Важно различать:[^<]*HPA[^<]*<\/p>/i, '');
  html = replaceRegex(html, /\s*<p><strong>Важное различие:[^<]*кортизол[^<]*<\/p>/i, '');

  // Duration is a decisive clue in the local German source.
  html = replaceRegex(
    html,
    /Сам по себе тот факт, что симптом сохраняется даже без острого стресса,[^<]*?возможным объяснением\./,
    'Решающая подсказка — длительность: если симптом сохраняется даже без острого стресса, обычно в нервной системе присутствует хроническая ошибочная электрическая активность.'
  );
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  // This batch already contains the reviewed translations and author corrections.
  if (html.includes('data-translation-batch="2026-09-07"')) return html;
  const p = pathname.replace(/\.html$/, '').replace(/\/$/, '');
  switch (p) {
    case '/ru/moya-istoriya-chast-1': return fixBio1(html);
    case '/ru/moya-istoriya-o-tinnituse': return fixShortBio(html);
    case '/ru/moy-podhod': return fixApproach(html);
    case '/ru/moi-produkty': return fixProducts(html);
    case '/ru/tinnitus-ot-shuma': return fixNoise(html);
    case '/ru/tinnitus-ot-stressa': return fixStress(html);
    default: return html;
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const response = await context.next();
  // These responses must not be reconstructed with a body.
  if (request.method === 'HEAD' || [204, 205, 304].includes(response.status)) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;
  const original = await response.text();
  const fixed = applyPathFixes(url.pathname, original);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-ru-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/ru/*' };
export { applyPathFixes };
