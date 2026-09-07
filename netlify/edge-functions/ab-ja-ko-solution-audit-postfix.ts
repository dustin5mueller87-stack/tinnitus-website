/*
 * Publication post-fixes for clear Package-3 Japanese/Korean audit findings.
 * Runs before the language transformers, then receives their transformed HTML
 * after context.next() returns. Scope is only the two solution pages.
 * German content and FAQ routes cannot match this function.
 */
const VERSION = '2026-09-07-v1';

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}

function fixJapanese(html: string) {
  if (html.includes('data-translation-batch="2026-09-07-ja"')) return html;
  // Conflict resolution / trauma resolution are two names for the same process.
  html = replaceAll(
    html,
    'その後の葛藤やトラウマの解消を、主に夜、眠っている間や夢の中に委ねる方法です。',
    'その後の葛藤解消、つまりトラウマ解消を、主に夜、眠っている間や夢の中に委ねる方法です。'
  );

  // German source says deep-seated tensions were resolved; it does not locally add
  // complete conflict resolution plus autonomic-system restoration here.
  html = replaceAll(
    html,
    '<p><strong>第一に</strong>、私はこの方法を自分の身体で体験しました――ただし、別の文脈です。2013年、私の神経系は心身相関にかかわるストレスによって強い過剰刺激を受け、私は重いCFS症状に苦しんでいました。ハイルプラクティカーで講師でもあり、30年以上にわたってまさにこのアプローチに取り組んできたMichael Prgometは、そのとき、これらの根深い葛藤を完全に解消し、自律神経系のバランスを取り戻すうえで、私を大いに助けてくれました。この方法を受けるとどう感じるのか、そしてこの方法が生物学的にどのような変化をもたらすのかを、私は自分自身の体験から知っています。</p>',
    '<p><strong>第一に</strong>、私はこの方法を自分の身体で体験しました――ただし、別の文脈です。2013年、私の神経系は心身相関にかかわるストレスによって強い過剰刺激を受け、私は重いCFS症状に苦しんでいました。ハイルプラクティカーで講師でもあり、30年以上にわたってまさにこのアプローチに取り組んできたMichael Prgometは、そのとき、これらの根深い内的な緊張を解きほぐすのを助けてくれました。この方法を受けるとどう感じるのか、そしてこの方法が生物学的にどのような変化をもたらすのかを、私は自分自身の体験から知っています。</p>'
  );

  // Keep "witnessed in practice" distinct from merely seeing/hearing reports.
  html = replaceAll(
    html,
    '<p><strong>第二に</strong>、私はPrgometの実践現場の症例や体験談を見聞きしました。その中では、さまざまな心身症状を抱えるほかの患者たちが、この取り組みを通して明らかに改善していました――その中には、ストレス性耳鳴りのケースも数例ありました。</p>',
    '<p><strong>第二に</strong>、私は実際の現場で、この取り組みによってほかの患者たちが明らかに改善していくのを目の当たりにしました。症状はさまざまな心身症状で、その中にはストレス性耳鳴りの人も数人いました。</p>'
  );

  // This local audiogram proof sentence is an added statement and is not in the German paragraph.
  html = replaceAll(html, '最初の経過のオージオグラムは、その改善を裏づけています。', '');

  return html;
}

function fixKorean(html: string) {
  // Conflict resolution / trauma resolution are two names for one process.
  html = replaceAll(
    html,
    '실제 갈등 또는 트라우마 해소가 주로 밤에 잠과 꿈속에서 이루어지도록 하는 방법입니다.',
    '실제 갈등 해소, 즉 트라우마 해소가 주로 밤에 잠과 꿈속에서 이루어지도록 하는 방법입니다.'
  );

  // Restore the local German meaning: deep-seated tensions, not an added complete
  // conflict-resolution + autonomic-balance success claim at this point.
  html = replaceAll(
    html,
    '<p><strong>첫째,</strong> 이 방법을 제 몸으로 직접 경험했습니다. 다만 맥락은 달랐습니다. 2013년에는 심신성 스트레스로 신경계가 극도로 과자극돼 심각한 CFS 증상에 시달렸습니다. 30년 넘게 바로 이 접근법으로 일해 온 하일프락티커(Heilpraktiker)이자 강사인 Michael Prgomet은 당시 깊이 자리 잡은 갈등을 완전히 해소하고 자율신경계가 다시 균형을 찾는 데 제게 큰 도움을 줬습니다. 따라서 이 방법이 어떻게 느껴지고 몸 안에서 어떤 생물학적 변화를 일으키는지는 직접 경험으로 알고 있습니다.</p>',
    '<p><strong>첫째,</strong> 이 방법을 제 몸으로 직접 경험했습니다. 다만 맥락은 달랐습니다. 2013년에는 심신성 스트레스로 신경계가 극도로 과자극돼 심각한 CFS 증상에 시달렸습니다. 30년 넘게 바로 이 접근법으로 일해 온 하일프락티커(Heilpraktiker)이자 강사인 Michael Prgomet은 당시 깊이 자리 잡은 내적 긴장을 풀어 내는 데 제게 큰 도움을 줬습니다. 따라서 이 방법이 어떻게 느껴지고 몸 안에서 어떤 생물학적 변화를 일으키는지는 직접 경험으로 알고 있습니다.</p>'
  );

  // Preserve the distinct evidence source: personally witnessed cases in practice.
  html = replaceAll(
    html,
    '<p><strong>둘째,</strong> Prgomet의 실무에서 이 작업을 통해 다른 환자들이 뚜렷하게 호전된 사례와 경험담을 보고 들었습니다. 매우 다양한 심신성 증상이 있었고, 그중에는 스트레스로 인한 이명을 겪은 사람도 몇 명 있었습니다.</p>',
    '<p><strong>둘째,</strong> 실제 현장에서 이 작업을 통해 다른 환자들이 뚜렷하게 좋아지는 모습을 직접 보았습니다. 매우 다양한 심신성 증상이 있었고, 그중에는 스트레스로 인한 이명을 겪은 사람도 몇 명 있었습니다.</p>'
  );

  // Added local audiogram proof sentence.
  html = replaceAll(html, '첫 번째 이명 경과를 기록한 청력도도 그 호전을 확인해 줍니다.', '');

  // Mobilisation can reveal metals in blood and/or urine.
  html = replaceAll(
    html,
    '그러면 중금속이 혈액 또는 소변으로 이동해 검사실에서 검출될 수 있습니다.',
    '그러면 중금속이 혈액과 소변 중 한쪽 또는 양쪽으로 이동해 검사실에서 검출될 수 있습니다.'
  );

  // German source says trace elements are replenished as elimination begins, not only after it is completed.
  html = replaceAll(
    html,
    '중금속을 배출한 뒤 에너지 대사를 다시 끌어올리고 펌프의 부담을 덜며 밀려난 미량원소를 다시 채우기 위한 것입니다.',
    '중금속이 배출되기 시작하면 에너지 대사를 다시 끌어올리고 펌프의 부담을 덜며 밀려난 미량원소를 다시 채우기 위한 것입니다.'
  );

  return html;
}

export default async (request: Request, context: any) => {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;

  const url = new URL(request.url);
  const original = await response.text();
  const corrected = url.pathname.startsWith('/ja/')
    ? fixJapanese(original)
    : fixKorean(original);

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  if (corrected !== original) headers.set('x-tbr-ja-ko-solution-postfix', VERSION);

  return new Response(corrected, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = {
  path: [
    '/ja/mein-loesungsansatz', '/ja/mein-loesungsansatz.html',
    '/ko/mein-loesungsansatz', '/ko/mein-loesungsansatz.html',
  ],
};
