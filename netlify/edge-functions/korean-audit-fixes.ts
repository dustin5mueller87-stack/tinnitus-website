/*
 * Collision-safe Korean translation corrections from the completed one-pass audit.
 * Scope is /ko/* only. German source pages and the unfinished FAQ are never changed.
 * Open author/source questions and unverified image/render items remain untouched.
 */
const VERSION = '2026-09-07-v1';

function ra(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}
function rr(text: string, pattern: RegExp, replacement: string) { return text.replace(pattern, replacement); }

function home(html: string) {
  // Keep the German treatment-strength relation, not a generic neutral approach.
  html = ra(html,
    '이명이라고 다 같은 이명은 아닙니다. 제 경험과 조사에 따르면 근본적으로 서로 다른 세 가지 유발 요인이 있으며, 각각 다른 접근이 필요합니다.',
    '이명이라고 다 같은 이명은 아닙니다. 제 경험과 조사에 따르면 근본적으로 서로 다른 세 가지 유발 요인이 있으며, 각각 다르게 다뤄져야 합니다.'
  );
  html = ra(html, '특히 갑자기 생겼다면, 기질적 원인이 있는지 확인받기 위해 이비인후과 진료를 받으세요.', '특히 급성으로 생겼다면, 기질적 원인이 있는지 확인받기 위해 이비인후과 진료를 받아 주세요.');
  return html;
}

function bio1(html: string) {
  // Binding chronology: day 3 only left; right first perceived several days later after more sound.
  html = ra(html,
    '오른쪽 귀에서도 이때 이미 희미한 삐 소리가 들렸습니다. 충격 속에서도 곧 다시 사라질 거라고 생각했습니다.',
    '오른쪽 귀에서는 이때 아직 이명을 전혀 느끼지 못했습니다. 충격 속에서도 왼쪽 소리가 곧 다시 사라질 거라고 생각했습니다.'
  );
  html = ra(html,
    '오른쪽 귀에 이미 있던 희미한 삐 소리도 이제 뚜렷하게 커졌습니다.',
    '그 뒤 며칠 동안 계속 소리에 노출된 뒤 오른쪽 귀에서도 처음으로 희미한 삐 소리를 느끼기 시작했고, 이제 그 소리도 뚜렷하게 커졌습니다.'
  );
  html = ra(html,
    '오른쪽 귀에 이미 있던 소리가 더 커졌습니다.',
    '오른쪽 귀까지 새로 이명에 끌려 들어갔습니다.'
  );
  // Do not turn Dustin's own low-normal B12 into a confirmed deficiency.
  html = ra(html, 'B12 결핍이 확인됐습니다.', 'B12 수치는 아직 정상 범위였지만 맨 아래쪽, 결핍 기준 바로 위였습니다.');
  html = ra(html, '비타민 B12 결핍이 확인됐습니다.', '비타민 B12 수치는 아직 정상 범위였지만 맨 아래쪽, 결핍 기준 바로 위였습니다.');
  // Keep ingestion and injection verbs separate where one verb grammatically swallowed both.
  html = rr(html, /B12 주사와([^<]{0,120})을 먹기 시작했습니다/g, 'B12 주사를 맞고$1을 먹기 시작했습니다');
  return html;
}

function bio2(html: string) {
  // Legacy body corrections; the newer 75% author decision is preserved in the navigation title.
  html = ra(html, '75%에 이른 붕괴', '약 50%에 이른 붕괴');
  html = ra(html, '첫 번째 붕괴 때 음량의 무려 75%', '제 생애 맨 처음 이명 음량의 약 50%');
  html = ra(html, '첫 번째 붕괴 때의 약 4분의 3, 즉 75%까지 올라왔습니다.', '제 생애 맨 처음 이명 음량의 약 절반, 즉 약 50%까지 올라왔습니다.');

  // Restore the local evidence statement. The absence of a second audiogram is true background,
  // but it was not authorized as a replacement for this paragraph.
  html = ra(html,
    '존재하는 물리적 증거를 공개합니다. 특정 주파수대의 청력 저하가 기록된 의학적 청력도는 오직 제 첫 번째 이명 경과만 기록합니다. 두 번째 경과에는 청력도가 없습니다. 여기에 검사실 보고서, 진단서, 클리닉과 치료사의 청구서가 더해집니다.',
    '저는 이 지옥과 회복을 뒷받침하는 물리적 증거를 하나하나 모두 가지고 있습니다. 특정 주파수대의 큰 청력 저하가 기록된 의학적 청력도, 검사실 보고서, 진단서, 클리닉과 치료사의 청구서까지 모두 있습니다.'
  );
  // Old-model lecithin wording must retain that he knew AND used it.
  html = ra(html,
    '그리고 첫 번째 이명 때부터 알고 있었고 당시의 설명 모델에서는 미엘린층을 위한 절대적인 토대라고 여겼던 레시틴도 완전히 끊었습니다.',
    '그리고 첫 번째 이명 때부터 알고 실제로 사용해 왔으며, 당시에는 미엘린층을 위한 절대적인 토대라고 보았던 레시틴도 완전히 끊었습니다.'
  );
  return html;
}

function shortBio(html: string) {
  html = ra(html, '이명은 원래 음량의 무시무시한 75% 수준으로 돌아왔고', '이명은 제 생애 맨 처음 이명 음량의 약 50% 수준으로 돌아왔고');
  // IHHT was abandoned before treatment, not begun and then interrupted.
  html = ra(html,
    '모의 고지대 훈련(IHHT)도 시도했지만 공황 때문에 중단해야 했고, CFS 전문 병원에 입원하기 직전까지 갔습니다.',
    '모의 고지대 훈련(IHHT)도 계획했지만 공황 때문에 실제 치료를 시작하기 전에 포기했고, CFS 전문 병원 입원 계획도 치료 전에 접었습니다.'
  );
  // "Physically dead" means temporarily unable to function/signal, not biologically dead.
  html = ra(html,
    '세포의 배터리는 완전히 방전돼 몇 초 동안 물리적으로 죽고 ‘침묵’합니다(불응기).',
    '세포의 배터리는 완전히 방전돼 몇 초 동안 일시적으로 기능과 신호를 내지 못하고 ‘침묵’합니다(불응기).'
  );
  // Duration is counted from the real restart after ending the experiment.
  html = ra(html,
    '제 회복 과정은 약 3~4개월에 걸쳐 이어졌습니다. 주파수들이 체계적으로 하나씩 꺼지는 과정이었습니다.',
    '실험을 끝내고 영양 루틴을 실제로 다시 시작한 시점부터 완전한 회복까지는 약 3~4개월이 걸렸습니다. 주파수들이 체계적으로 하나씩 꺼지는 과정이었습니다.'
  );
  return html;
}

function approach(html: string) {
  // Explicit author deletion: remove only the local CFS causal bracket/sentence if present.
  html = rr(html, /\s*<p>[^<]*(?:그래서|때문에|괜히)[^<]*CFS[^<]*<\/p>/g, '');
  html = ra(html, '약 75%에 도달해 실험을 끝냈을 때였습니다.', '제 생애 맨 처음 이명 강도의 약 50%에 도달해 실험을 끝냈을 때였습니다.');
  html = ra(html, '75%에 도달해 실험을 끝냈을 때였습니다.', '약 50%에 도달해 실험을 끝냈을 때였습니다.');
  // Remove an added local audiogram-proof clause without weakening the rest of the sentence.
  html = ra(html, '첫 번째 이명이 호전된 과정은 여러 청력도에 기록돼 있으며, ', '');
  // In this process "conflict resolution" and "trauma resolution" are two names for the same process.
  html = ra(html, '갈등 해결 또는 트라우마 해결', '갈등 해결, 즉 트라우마 해결');
  html = ra(html, '갈등 해소 또는 트라우마 해소', '갈등 해소, 즉 트라우마 해소');
  // Mobilization test can show metals in blood and/or urine.
  html = ra(html, '혈액 또는 소변에서', '혈액과 소변 중 한쪽 또는 양쪽에서');
  html = ra(html, '혈액이나 소변에서', '혈액과 소변 중 한쪽 또는 양쪽에서');
  // The trace-element replacement is after mobilization/removal, not during it.
  html = ra(html, '중금속을 제거하는 동안 밀려난 미량 원소를 다시 채웁니다', '중금속을 제거한 뒤 밀려난 미량 원소를 다시 채웁니다');
  return html;
}

function sources(html: string) {
  // True background comments about the second audiogram must not replace the local source text.
  html = ra(html, '이 청력도 자료는 첫 번째 이명 경과에만 해당하며 두 번째 이명에는 청력도가 없습니다. ', '');
  html = ra(html, '두 번째 이명에는 청력도가 없다는 점도 함께 고려해야 합니다. ', '');
  // Editorial residue only.
  html = rr(html, /(?:중요|주의)[^<]{0,20}(?:가이드라인|지침|경계선)\s*8[^<]*:?\s*/g, '');
  // Restore clear source roles where the Japanese/Korean audit found a replacement by own-model counterclaims.
  html = ra(html,
    '제 모델에서는 Central Gain이 이미 존재하는 활성 오류 신호를 증폭할 뿐이며 입력 감소만으로 이명 신호가 생기지는 않습니다.',
    '이 모델에서는 입력이 줄어들면 중추 청각계의 이득이 증가하고, 그 결과 신경계의 자발 활동이 더 크게 지각될 수 있다고 설명합니다.'
  );
  return html;
}

function testimonials(html: string) {
  // Restore worldwide/independent/no-acquaintance relationship from German intro.
  html = ra(html,
    '이 모음에는 이명에 관한 경험뿐 아니라 다른 건강 주제의 보충 사례도 포함되어 있습니다.',
    '세계 여러 곳에서 서로 독립적으로, 서로 알지 못하는 사람들이 비슷한 경험을 이야기합니다.'
  );
  html = ra(html, '특히 갑자기 생긴 경우', '특히 급성으로 생긴 경우');
  return html;
}

function products(html: string) {
  // Historical 3 mg melatonin statement must not become an assertion of the present dose.
  html = ra(html,
    '저는 수년째 저녁에 미네랄 복합제와 함께 멜라토닌 3mg을 꾸준히 추가로 복용하고 있습니다.',
    '저는 여러 해 동안 저녁에 미네랄 복합제와 함께 멜라토닌 3mg을 꾸준히 추가로 복용했습니다.'
  );
  return html;
}

function noise(html: string) {
  // Day 3 only left; right first later after further sound exposure.
  html = ra(html,
    '사흘째에는 오른쪽 귀에서도 이미 희미한 삐 소리가 들렸습니다.',
    '사흘째에는 오른쪽 귀에서 아직 어떤 이명도 느끼지 못했습니다.'
  );
  html = rr(html,
    /사흘째[^<]{0,120}오른쪽 귀[^<]{0,80}(?:삐|이명)[^<]*<\/p>/g,
    '사흘째에는 왼쪽 귀에서만 이명을 느꼈습니다. 오른쪽 귀의 희미한 삐 소리는 그 뒤 며칠 동안 더 소리에 노출된 뒤 처음 느끼기 시작했습니다.</p>'
  );
  // General onset statement was replaced by Dustin-specific speculation.
  html = rr(html,
    /<p>소음으로 인한 이명은[^<]*(?:사흘|3일)[^<]*(?:FAQ|자주 묻는)[^<]*<\/p>/g,
    '<p>대부분의 사람에게서는 소음 사건 뒤 비교적 빠르게, 몇 분에서 몇 시간 안에 이명이 시작됩니다. 다만 몇 시간이나 며칠 뒤에 나타나는 경우도 있습니다.</p>'
  );
  // FAQ is still under construction.
  html = ra(html, '자주 묻는 질문에서 이해하기 쉽게 설명해 두었습니다.', '자주 묻는 질문 페이지는 현재 단계적으로 만들어 가고 있습니다.');
  html = ra(html, '특히 갑자기 생겼다면', '특히 급성으로 생겼다면');
  return html;
}

function gift(html: string) {
  // Dustin's own tinnitus was exclusively noise-induced, not merely mainly so.
  html = ra(html,
    '제 경우에는 당시 주된 원인이 전형적인 소음성 이명이었고',
    '제 경우에는 당시 이명이 전적으로 소음으로 인해 생겼고'
  );
  html = ra(html,
    '제 경우 당시 주된 유발 요인은 전형적인 소음성 이명이었고',
    '제 경우 당시 이명은 전적으로 소음으로 인해 생겼고'
  );
  // Enzyme is specifically the ATP-driven calcium pump, not an alternative entity.
  html = ra(html, '효소 또는 ATP 구동 칼슘 펌프', '효소, 즉 ATP 구동 칼슘 펌프');
  html = ra(html, '효소나 ATP 구동 칼슘 펌프', '효소인 ATP 구동 칼슘 펌프');
  // Perfect storm: pumps approach limit AND the whole cell works at limit.
  html = ra(html,
    '칼슘 펌프나 세포가 이미 한계에 가까워져 있습니다.',
    '칼슘 펌프는 이미 한계에 가까워지고, 동시에 세포 전체도 한계에서 힘겹게 작동하고 있습니다.'
  );
  html = ra(html, '특히 갑자기 생긴 경우', '특히 급성으로 생긴 경우');
  return html;
}

function stress(html: string) {
  // Remove locally added completion where German describes gradual release in the narrative intro.
  html = ra(html,
    '그의 작업 덕분에 CFS와 심신성 증상 시기의 갈등을 완전히 해소하고 자율신경계의 균형을 되찾을 수 있었습니다.',
    '그의 작업 덕분에 당시 깊이 자리 잡은 내적 긴장을 하나씩 풀어 갈 수 있었습니다.'
  );
  // Keep the direct personal core thesis instead of replacing it with a source-origin caveat paragraph.
  html = rr(html,
    /<p>제 설명 모델에 따르면 스트레스로 인한 이명은[^<]*Prgomet[^<]*<\/p>/g,
    '<p>오늘 저는 이렇게 말할 수 있습니다. 스트레스로 인한 이명은 신비도, 상상도 아닙니다. 끝나지 않은 갈등이 만들어 내는 뇌의 지속적인 전기적 상태가 소리로 드러난 결과입니다. 무슨 일이 일어나는지 이해하면 왜 그 소리가 있는지, 그리고 스스로 무엇을 할 수 있는지도 이해할 수 있습니다.</p>'
  );
  // Remove the locally added HPA-as-second-discussion paragraph on this page; HPA source-page reach remains open.
  html = rr(html, /\s*<p><strong>중요한 구분:?<\/strong>[^<]*(?:HPA|코르티솔)[^<]*<\/p>/g, '');
  // Small field effects are a real, small local effect in Dustin's model, not merely a metaphorical possibility.
  html = ra(html,
    '이는 모델에 귀속된 가정이며 스트레스성 이명에서 직접 측정된 과정은 아닙니다.',
    '이 전기장 효과는 작지만 실제이며, 이 모델에서는 주변 세포를 역치 너머로 밀어 실제 발화까지 일으킬 수 있습니다.'
  );
  // Duration clue strength.
  html = rr(html,
    /증상이 급성 스트레스가 없어도 계속된다는 사실만으로[^<]*가능한 설명[^<]*<\/p>/g,
    '증상이 급성 스트레스가 없는데도 계속된다는 지속성은 중요한 단서입니다. 이런 경우에는 대개 신경계에 만성적인 전기적 오류 활동이 남아 있습니다.</p>'
  );
  // FAQ under construction.
  html = ra(html, '가장 자주 묻는 질문에 짧고 이해하기 쉽게 답하고 있습니다.', '현재 자주 묻는 질문 페이지를 단계적으로 만들어 가고 있습니다.');
  html = ra(html, '특히 갑자기 생긴 귀 소리', '특히 급성으로 생긴 귀 소리');
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  const p = pathname.replace(/\.html$/, '');
  switch (p) {
    case '/ko': case '/ko/': return home(html);
    case '/ko/meine-geschichte-teil-1': return bio1(html);
    case '/ko/meine-geschichte-teil-2': return bio2(html);
    case '/ko/tinnitus-geheilt-erfahrungsbericht': return shortBio(html);
    case '/ko/mein-loesungsansatz': return approach(html);
    case '/ko/wissenschaftliche-quellen': return sources(html);
    case '/ko/erfahrungsberichte': return testimonials(html);
    case '/ko/produkte': return products(html);
    case '/ko/laermbedingter-tinnitus': return noise(html);
    case '/ko/medikamente-gifte-tinnitus': return gift(html);
    case '/ko/stressbedingter-tinnitus': return stress(html);
    default: return html;
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  if (url.pathname === '/ko/faq' || url.pathname === '/ko/faq.html') return context.next();
  const response = await context.next();
  // These responses must not be reconstructed with a body.
  if (request.method === 'HEAD' || [204, 205, 304].includes(response.status)) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  const fixed = applyPathFixes(url.pathname, html);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-ko-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/ko/*' };
export { applyPathFixes };
