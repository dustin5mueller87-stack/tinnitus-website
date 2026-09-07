/*
 * Japanese Package-2 publication post-fixes for clear, already-audited findings.
 *
 * This function sorts before japanese-audit-fixes.ts. It calls context.next(),
 * receives the already-transformed Japanese HTML, and then fixes only the few
 * Package-2 phrases whose current wording does not match the more general
 * language-transform patterns.
 *
 * Scope: Japanese long biography part 2 and Japanese short biography only.
 * German routes, shared German content and FAQ routes cannot match this function.
 */
const VERSION = '2026-09-07-v1';

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}

function fixLongBio2(html: string) {
  // Local evidence paragraph: the second-audiogram fact is true background, but it
  // was an unauthorized rewrite of this particular German evidence paragraph.
  html = replaceAll(
    html,
    '現存する物理的な証拠を、包み隠さず示します。周波数の落ち込みを記録した医療機関のオージオグラムが示しているのは、私の最初の耳鳴りの経過だけです。2度目の経過については、オージオグラムがありません。さらに、検査報告書、診断結果、クリニックとセラピストの請求書があります。',
    '私は、この地獄とこの回復を裏づける物理的な証拠を一つ残らず持っています。周波数帯の大きな落ち込みが記録された医療機関のオージオグラム、検査報告書、診断結果、クリニックとセラピストの請求書です。'
  );

  // Old-model passage says Dustin knew AND used lecithin.
  html = replaceAll(
    html,
    'さらに、最初の耳鳴りの時期（自伝・第1部）から知っており、当時の説明モデルではミエリン層の絶対的な土台だと見なしていたレシチンも、完全にやめました。',
    'さらに、最初の耳鳴りの時期（自伝・第1部）から知り、実際に使っており、当時はミエリン層の絶対的な土台だと考えていたレシチンも、完全にやめました。'
  );

  return html;
}

function fixShortBio(html: string) {
  // Binding chronology: day 3 only left; right first consciously perceived days later
  // after further sound exposure.
  html = replaceAll(
    html,
    'けれど3日目、本当の怪物が目を覚ましたのです。突然、左耳に地獄のような甲高い音とザーッという音が現れ、右耳にも小さなピー音がありました。私のシステムは完全に崩壊しました。',
    'けれど3日目、本当の怪物が目を覚ましたのです。突然、左耳に地獄のような甲高い音とザーッという音が現れました。右耳には、この時点ではまだ耳鳴りを感じていませんでした。私のシステムは完全に崩壊しました。'
  );
  html = replaceAll(
    html,
    'その助言に従い、さらに音楽とノイズを耳に流し続けたところ、すでに右耳にあった小さな音が数日後には明らかに悪化しました。',
    'その助言に従い、さらに音楽とノイズを耳に流し続けたところ、数日後には右耳でも初めて小さなピー音を感じるようになり、その後その音も明らかに悪化しました。'
  );

  // Nährstoff-Karenz means stopping the supplement routine, not food/nutrition deprivation.
  html = replaceAll(
    html,
    '栄養補給を完全に断ち（摂取停止）、FitLineセットとレシチンを意図的にやめたのです。',
    'サプリメントのルーティンを完全に止め、FitLineセットとレシチンを意図的に中断したのです。'
  );

  // "Hundertprozentig beeinflussen" expresses certainty, not a 100% magnitude change.
  html = replaceAll(
    html,
    '音の種類と音量を100％変えられました！',
    '音の種類と音量の両方に、間違いなく影響を与えることができました！'
  );

  // Doctors recommended white-noise masking as a method, not Dustin's extreme volume.
  html = replaceAll(
    html,
    '私は2～3分間、極端に大きなホワイトノイズを自分に浴びせました（まさに医師がマスキングとして勧めるものです）。',
    '私は2～3分間、極端に大きなホワイトノイズを自分に浴びせました（医師が勧めていたのはホワイトノイズを使うマスキングという方法であって、この極端な音量ではありません）。'
  );

  // Recovery duration is counted from the actual restart after ending the experiment.
  html = replaceAll(
    html,
    '回復には約3～4か月かかりました。周波数が一つずつ、体系的に消えていく過程でした。',
    '実験を終えて回復用スタックを実際に再開した時点から、完全な静けさに戻るまで約3～4か月かかりました。周波数が一つずつ、体系的に消えていく過程でした。'
  );

  return html;
}

export default async (request: Request, context: any) => {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;

  const url = new URL(request.url);
  const original = await response.text();
  const p = url.pathname.replace(/\.html$/, '');
  const corrected = p === '/ja/meine-geschichte-teil-2'
    ? fixLongBio2(original)
    : fixShortBio(original);

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  if (corrected !== original) headers.set('x-tbr-ja-package2-postfix', VERSION);

  return new Response(corrected, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = {
  path: [
    '/ja/meine-geschichte-teil-2', '/ja/meine-geschichte-teil-2.html',
    '/ja/tinnitus-geheilt-erfahrungsbericht', '/ja/tinnitus-geheilt-erfahrungsbericht.html',
  ],
};
