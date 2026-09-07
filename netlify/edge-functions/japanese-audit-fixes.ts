/*
 * Collision-safe Japanese translation corrections from the completed one-pass audit.
 * Scope is /ja/* only. German source pages and the unfinished FAQ are never changed.
 * Open author/source questions and unverified image/render items remain untouched.
 */
const VERSION = '2026-09-07-v1';
const STATIC_JA_BATCH = 'data-translation-batch="2026-09-07-ja"';
function ra(text: string, from: string, to: string) { if (!from || from === to) return text; return text.split(from).join(to); }
function rr(text: string, pattern: RegExp, replacement: string) { return text.replace(pattern, replacement); }

function bio1(html: string) {
  // Binding chronology: day 3 only left; right first consciously perceived days later after more sound.
  html = ra(html,
    'この時点で右にも、すでに小さなピー音を感じていました。衝撃のさなかでも、私は思っていました。きっとまた消える。',
    'この時点では、右耳にはまだ耳鳴りをまったく感じていませんでした。衝撃のさなかでも、左の音はきっとまた消えると思っていました。'
  );
  html = ra(html,
    '右耳にすでにあった小さなピー音も、今や明らかに大きくなっていました。',
    'その後さらに音へさらされた数日のうちに、右耳でも初めて小さなピー音を感じるようになり、その音も今や明らかに大きくなっていました。'
  );
  html = ra(html,
    '右耳にすでにあった音も強まっていたのです。',
    '右耳まで新たに耳鳴りへ巻き込まれていたのです。'
  );
  return html;
}

function bio2(html: string) {
  // Binding author correction: approx. 50% of the very first tinnitus, not 75%.
  html = ra(html, '75％までの転落', '約50％までの転落');
  html = ra(html, '元の音量の75％という残酷なレベル', '私が人生で最初に経験した耳鳴りの音量の約50％という残酷なレベル');
  html = ra(html, '最終的な崩壊：75％と音のカオス', '最終的な崩壊：約50％と音のカオス');
  html = ra(html, '最初の崩壊時の4分の3（75％）ほどの音量', '人生で最初に経験した耳鳴りの約半分（約50％）の音量');
  // Restore local evidence statement; no-second-audiogram is true background but not a replacement here.
  html = rr(html,
    /<p>存在する物理的な証拠を[^<]*(?:2回目|第二)[^<]*(?:オージオグラム|聴力図)[^<]*<\/p>/g,
    '<p>私は、この地獄と回復を裏づける物理的な証拠を一つ残らず持っています。特定の周波数帯に大きな低下が記録された医療用オージオグラム、検査報告書、診断書、クリニックや治療家からの請求書まで、すべてです。</p>'
  );
  // Old model: he knew AND used lecithin.
  html = ra(html,
    '最初の耳鳴りのころから知っており、当時の説明モデルではミエリン層の絶対的な土台だと考えていたレシチン',
    '最初の耳鳴りのころから知り、実際に使っており、当時はミエリン層の絶対的な土台だと考えていたレシチン'
  );
  return html;
}

function shortBio(html: string) {
  html = ra(html, '耳鳴りは元の音量の猛烈な75％で戻り', '耳鳴りは、私が人生で最初に経験した耳鳴りの音量の約50％まで戻り');
  // IHHT and specialist-clinic plans were abandoned before treatment.
  html = ra(html,
    '模擬高地トレーニング（IHHT）も試しましたが、パニックで中断せざるを得ず、CFS専門クリニックに入院する寸前でした。',
    '模擬高地トレーニング（IHHT）も計画しましたが、パニックのため実際の治療を始める前に断念し、CFS専門クリニックへの入院計画も治療前に取りやめました。'
  );
  html = ra(html,
    '私の回復過程は約3～4か月にわたりました。',
    '実験を終え、栄養ルーティンを実際に再開した時点から完全に静かになるまで、回復には約3～4か月かかりました。'
  );
  return html;
}

function approach(html: string) {
  // Explicit author deletion of the local CFS causal bracket/sentence only.
  html = rr(html, /\s*<p>[^<]*(?:だからこそ|理由もなく|そのため)[^<]*CFS[^<]*<\/p>/g, '');
  html = ra(html, '約75％', '約50％');
  html = ra(html, '75％', '50％');
  // Same process, two names, not alternatives.
  html = ra(html, '葛藤解消またはトラウマ解消', '葛藤解消、すなわちトラウマ解消');
  html = ra(html, '葛藤の解消かトラウマの解消', '葛藤の解消、すなわちトラウマの解消');
  // Blood and/or urine after mobilization/removal.
  html = ra(html, '血液または尿', '血液、尿、またはその両方');
  html = ra(html, '重金属を除去している間に、押しのけられた微量元素を補います', '重金属を除去した後に、押しのけられた微量元素を補います');
  return html;
}

function sources(html: string) {
  // Remove local audiogram-scope additions without erasing real study limitations.
  html = rr(html, /(?:既存|現在)[^<]{0,80}(?:オージオグラム|聴力図)[^<]{0,120}(?:2回目|第二)[^<]*。\s*/g, '');
  // Editorial residue only.
  html = rr(html, /(?:重要|注意)[:：]?\s*(?:ガイドライン|指針|境界線)\s*8[:：]?\s*/g, '');
  // Restore source role where personal counterclaim replaced the cited central-gain model.
  html = ra(html,
    '私のモデルでは、中枢性ゲインはすでに存在する能動的な誤信号を増幅するだけで、入力の欠如そのものから耳鳴り音が生まれるわけではありません。',
    'このモデルでは、入力が減ると中枢聴覚系が感度を上げ、その結果、神経系の自発活動がより強く知覚されうると説明されます。'
  );
  // HPA/source-page reach and missing-high-dose-study property remain open, therefore untouched.
  return html;
}

function testimonials(html: string) {
  // Restore worldwide, mutually independent, no-acquaintance relationship if the collection caveat replaced it.
  html = ra(html,
    'このコレクションには、耳鳴りだけでなく、ほかの健康テーマに関する補足的な体験談も含まれています。',
    '世界各地で、互いに独立し、互いを知らない人たちが、似たような体験を語っています。'
  );
  return html;
}

function products(html: string) {
  // Historical 3 mg statement must not automatically become present dose.
  html = ra(html,
    '私は何年も、夜にミネラル複合製品と併せて、3 mgのメラトニンを定期的に摂っています。',
    '私は何年もの間、夜にミネラル複合製品と併せて、3 mgのメラトニンを定期的に摂っていました。'
  );
  // Remove locally added "fully resolved" from shared Person data on this page when German only says it helped balance.
  html = ra(html, 'それらの葛藤を完全に解消し、自律神経系のバランスを取り戻す助けになった', '自律神経系のバランスを取り戻す助けになった');
  return html;
}

function noise(html: string) {
  // Correct right-ear chronology together, not piecemeal.
  html = ra(html,
    'そのうえ、3日目には右耳にもすでに弱いピー音が現れていました。その少し後、すでにあったこの右耳の音は明らかに強まりました',
    'そのうえ、その後さらに音へさらされた数日のうちに、右耳でも初めて弱いピー音を感じるようになりました。その少し後、この右耳の音は明らかに強まりました'
  );
  html = ra(html,
    'まさにそれによって私の状態が悪化し、すでにあった右耳の弱い音が明らかに強くなったからです。',
    'まさにそれによって私の状態が悪化し、右耳まで耳鳴りへ巻き込まれたからです。'
  );
  // Restore the general onset statement; do not route it to the unfinished FAQ.
  html = ra(html,
    '騒音性耳鳴りは、騒音にさらされた直後に気づくこともあれば、数時間後または数日後になって初めて意識されることもあります。私の場合、音に気づいたのは3日目でした。なぜなのかは、今でもはっきりとは分かりません。考えられる説明については、FAQで仮説として明確に説明します。',
    '多くの人では、耳鳴りは騒音の出来事から比較的すぐ、数分から数時間以内に始まります。一方で、数時間後、あるいは数日後になって現れるケースもあります。'
  );
  // Restore the concrete Phase-1/Phase-2 conclusion instead of replacing it with a different model paragraph.
  html = rr(html,
    /<p>私の主要モデルにおいて、慢性の騒音性耳鳴りとは生理学的に何なのか。[^<]*<\/p>/,
    '<p>私の確信では、慢性の騒音性耳鳴りとは、生きている細胞がエネルギー面の緊急運転から抜け出せず、フェーズ2の修復に必要なエネルギーが足りないため、修復がフェーズ1の大部分で凍りついている状態です。耳が「壊れて」いるのでも、脳が何もないところから幻の信号を作っているのでもありません。音は、実在する末梢の生存闘争の結果であり、脳はそれを増幅しているのです。</p>'
  );
  return html;
}

function gift(html: string) {
  html = ra(html,
    '私の場合、当時の耳鳴りは典型的な騒音性耳鳴りで、主な引き金は騒音でした（薬剤によって急に起きたものではありません）。',
    '私の場合、当時の耳鳴りは完全に騒音によるものでした（薬剤による急性の出来事で起きたものではありません）。'
  );
  // In the thiol image description, the enzyme is specifically the ATP-driven calcium pump, not an alternative.
  html = ra(html,
    '酵素またはATP駆動型カルシウムポンプにある硫黄を含むチオール結合部位',
    '酵素であるATP駆動型カルシウムポンプにある硫黄を含むチオール結合部位'
  );
  // Avoid strengthening permanent-open to "forever" if present.
  html = ra(html, '永遠に開きっぱなし', '開きっぱなし');
  return html;
}

function stress(html: string) {
  // Narrative intro: gradual resolution, not a new claim of completed conflict resolution at that local point.
  html = rr(html,
    /<p>彼の(?:仕事|取り組み)[^<]*(?:完全に解消|完全に解決)[^<]*(?:自律神経)[^<]*<\/p>/g,
    '<p>彼の取り組みによって、当時の深く根づいた内面的な緊張を、少しずつ解いていくことができました。</p>'
  );
  // Direct core thesis, preserving Dustin's voice.
  html = rr(html,
    /<p>私の説明モデルでは、ストレス性耳鳴り[^<]*(?:Prgomet|Klinghardt)[^<]*<\/p>/g,
    '<p>今では、こう言えます。ストレス性耳鳴りは謎でも、思い込みでもありません。終わっていない葛藤によって生じる、脳内の持続的な電気状態が音として聞こえるものです。そこで何が起きているのかを理解すれば、なぜ音があるのか、そして自分に何ができるのかも分かります。</p>'
  );
  // HPA paragraph added locally on this page is not a second direct source in Dustin's model.
  html = rr(html, /\s*<p><strong>重要な区別[^<]*<\/strong>[^<]*(?:HPA|コルチゾール)[^<]*<\/p>/g, '');
  // Small local field effect remains a real physical effect within the model, not merely metaphor.
  html = ra(html,
    'これはモデルに帰属する仮定であり、ストレス性耳鳴りで直接測定された過程ではありません。',
    'こうした局所的な電場作用は小さいものですが実在し、このモデルでは隣接する細胞を閾値の向こうまで押して、実際に発火させることがあります。'
  );
  // Duration clue strength if local text was weakened to a generic possibility.
  html = rr(html,
    /症状が急性ストレスなしでも続くこと自体[^<]*(?:可能性|説明)[^<]*<\/p>/g,
    '症状が急性ストレスなしでも続くという「持続性」は重要な手がかりです。その場合、多くは神経系に慢性的な電気的誤作動が残っています。</p>'
  );
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  if (html.includes(STATIC_JA_BATCH)) return html;
  const p = pathname.replace(/\.html$/, '');
  switch (p) {
    case '/ja/meine-geschichte-teil-1': return bio1(html);
    case '/ja/meine-geschichte-teil-2': return bio2(html);
    case '/ja/tinnitus-geheilt-erfahrungsbericht': return shortBio(html);
    case '/ja/mein-loesungsansatz': return approach(html);
    case '/ja/wissenschaftliche-quellen': return sources(html);
    case '/ja/erfahrungsberichte': return testimonials(html);
    case '/ja/produkte': return products(html);
    case '/ja/laermbedingter-tinnitus': return noise(html);
    case '/ja/medikamente-gifte-tinnitus': return gift(html);
    case '/ja/stressbedingter-tinnitus': return stress(html);
    default: return html;
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  if (url.pathname === '/ja/faq' || url.pathname === '/ja/faq.html') return context.next();
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  const fixed = applyPathFixes(url.pathname, html);
  const headers = new Headers(response.headers);
  headers.set('x-tbr-ja-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/ja/*' };
export { applyPathFixes };
