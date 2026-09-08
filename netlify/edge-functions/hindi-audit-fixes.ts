/*
 * Collision-safe Hindi translation corrections from the completed one-pass audit.
 * Scope is /hi/* only. German source pages and the unfinished FAQ are never changed.
 * Second-episode loudness remains the author-confirmed 75 percent.
 */
const VERSION = "2026-09-07-v2";

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}
function replaceRegex(text: string, pattern: RegExp, replacement: string) {
  return text.replace(pattern, replacement);
}

function fixBio1(html: string) {
  // Latest author clarification: right-ear tinnitus was already extremely quiet at onset.
  // Dustin's B12 value was still within the normal range, just above the deficiency threshold.
  html = replaceAll(
    html,
    'मैंने फैमिली डॉक्टर से रक्त-जाँच कराई: कमी की पुष्टि हुई, मान सामान्य सीमा के बिल्कुल निचले हिस्से में था।',
    'मैंने फैमिली डॉक्टर से रक्त-जाँच कराई: मान सामान्य सीमा के बिल्कुल निचले हिस्से में था, कमी की सीमा से ठीक ऊपर।'
  );
  // Keep the burden metaphor understandable rather than leaving an opaque German unit word.
  html = replaceAll(html, 'ज़ेंटनर जितना भारी बोझ।', 'एक असहनीय भारी बोझ।');
  return html;
}

function fixShortBio(html: string) {
  // Source says Dustin achieved 100 -> 0, not merely fought for it.
  html = replaceAll(
    html,
    'अपने टिनिटस को 100% से 0% तक नीचे लाने के लिए कैसे लड़ाई लड़ी।',
    'अपने टिनिटस को 100% से 0% तक कैसे नीचे लाया।'
  );
  // IHHT was cancelled before treatment started, not interrupted during a running treatment.
  html = replaceAll(
    html,
    'मैंने कृत्रिम ऊँचाई प्रशिक्षण (IHHT) भी आज़माया, जिसे दहशत के कारण बीच में रोकना पड़ा,',
    'मैंने कृत्रिम ऊँचाई प्रशिक्षण (IHHT) शुरू करने की कोशिश भी की, लेकिन दहशत के कारण उपचार शुरू होने से पहले ही उसे रद्द कर दिया,'
  );
  // This was a supplement pause, not abstinence from nutrients/food in general.
  html = replaceAll(
    html,
    'मैंने पोषक-तत्त्वों से पूरी तरह दूरी बना ली (पूर्ण परहेज़) और जान-बूझकर अपना FitLine सेट तथा लेसिथिन लेना बंद कर दिया।',
    'मैंने सप्लीमेंट्स लेना पूरी तरह बंद कर दिया और जान-बूझकर अपना FitLine सेट तथा लेसिथिन लेना बंद कर दिया।'
  );
  return html;
}

function fixApproach(html: string) {
  // Explicit author deletion: remove the old causal bridge from first tinnitus to later CFS if present.
  html = replaceRegex(
    html,
    /\s*<p>[^<]*(?:डेढ़|एक-डेढ़|लगभग दो)[^<]*(?:CFS|क्रॉनिक फ़टीग सिंड्रोम)[^<]*<\/p>/,
    ''
  );
  // Local Person source on this page does not contain an extra complete-conflict-resolution clause.
  html = replaceAll(html, 'उन टकरावों को पूरी तरह सुलझाने तथा अपने स्वायत्त तंत्रिका तंत्र को फिर संतुलन में लाने', 'अपने स्वायत्त तंत्रिका तंत्र को फिर संतुलन में लाने');
  // Where source says heavy-metal removal is beginning, do not move the replenishment to only after completion.
  html = replaceAll(html, 'भारी धातुओं को बाहर निकाल दिए जाने के बाद', 'जैसे ही भारी धातुओं को बाहर निकालना शुरू होता है');
  // Conflict resolution and trauma resolution are two names for the same process here.
  html = replaceAll(html, 'टकराव या ट्रॉमा का समाधान', 'टकराव का समाधान, यानी ट्रॉमा का समाधान');
  // The diagnostic sample may be blood and/or urine.
  html = replaceAll(html, 'रक्त या मूत्र में', 'रक्त, मूत्र या दोनों में');
  return html;
}

function fixProducts(html: string) {
  // Local Person source retains autonomic-balance restoration without the extra complete-conflict clause.
  html = replaceAll(
    html,
    'उन्हें उन टकरावों को पूरी तरह सुलझाने तथा अपने स्वायत्त तंत्रिका तंत्र को फिर संतुलन में लाने में कैसे मदद मिली',
    'उन्हें अपने स्वायत्त तंत्रिका तंत्र को फिर संतुलन में लाने में कैसे मदद मिली'
  );
  // German source describes a historical multi-year use, not necessarily a current 3 mg regimen.
  html = replaceAll(
    html,
    'मैं वर्षों से शाम को खनिज कॉम्प्लेक्स के साथ नियमित रूप से अतिरिक्त 3 mg मेलाटोनिन लेता आ रहा हूँ।',
    'मैंने वर्षों तक शाम को खनिज कॉम्प्लेक्स के साथ नियमित रूप से अतिरिक्त 3 mg मेलाटोनिन लिया।'
  );
  return html;
}

function fixNoise(html: string) {
  // Preserve the author-approved early right-ear tone and later worsening.
  // If the page-local onset paragraph rewrites the general source around Dustin's day 3, restore the general distribution.
  html = replaceRegex(
    html,
    /<p>शोर के कारण होने वाला टिनिटस[^<]*तीसरे दिन[^<]*FAQ[^<]*<\/p>/,
    '<p>अधिकांश प्रभावित लोगों में टिनिटस शोर की घटना के अपेक्षाकृत जल्दी बाद शुरू होता है — कुछ मिनटों से लेकर कुछ घंटों के भीतर। हालांकि ऐसे मामले भी होते हैं, जिनमें टिनिटस कई घंटों या यहाँ तक कि कई दिनों बाद शुरू होता है। यह अंतर क्यों हो सकता है और कान की कुछ संरचनाएँ इसमें क्या भूमिका निभा सकती हैं, यह मैं FAQ भाग में विस्तार से समझाता हूँ।</p>'
  );
  return html;
}

function fixGift(html: string) {
  // The local enzyme and ATP-driven calcium pump are one and the same object.
  html = replaceAll(
    html,
    'किसी एंज़ाइम या ATP-नियंत्रित कैल्शियम पंप',
    'एक एंज़ाइम — यानी ATP-नियंत्रित कैल्शियम पंप'
  );
  // Part and whole are simultaneous, not alternatives.
  html = replaceAll(
    html,
    'कैल्शियम पंप पहले ही अपनी सीमा के करीब काम कर रहे होते हैं या कोशिकाएँ अपनी सीमा पर कड़ी मेहनत कर रही होती हैं',
    'कैल्शियम पंप पहले ही अपनी सीमा के करीब काम कर रहे होते हैं और पूरी कोशिकाएँ भी अपनी सीमा पर कड़ी मेहनत कर रही होती हैं'
  );
  return html;
}

function fixStress(html: string) {
  // Restore gradual early progress; full conflict resolution remains in later German-source passages where it belongs.
  html = replaceAll(
    html,
    '<p>मैं इतना निराश था कि कोई भी कोशिश बाकी नहीं छोड़ना चाहता था। उस समय मेरी मदद किसी दवा या पारंपरिक थेरेपी ने नहीं, बल्कि Michael Prgomet नाम के एक Heilpraktiker और व्याख्याता के साथ किए गए काम ने की। वह 30 वर्षों से अधिक समय से ठीक उन्हीं तंत्रों पर काम कर रहे हैं जिनकी चर्चा इस पेज पर है। उनके काम ने ही तब मेरी CFS और मनोदैहिक अवस्था के टकरावों को पूरी तरह सुलझाने और मेरे स्वायत्त तंत्रिका तंत्र को फिर संतुलन में लाने में मेरी बहुत अधिक मदद की।</p>',
    '<p>मैं इतना निराश था कि कोई भी कोशिश बाकी नहीं छोड़ना चाहता था। उस समय मेरी मदद किसी दवा या पारंपरिक थेरेपी ने नहीं, बल्कि Michael Prgomet नाम के एक Heilpraktiker और व्याख्याता के साथ किए गए काम ने की। वह 30 वर्षों से अधिक समय से ठीक उन्हीं तंत्रों पर काम कर रहे हैं जिनकी चर्चा इस पेज पर है।</p>\n  <p>उनके काम ने ही तब इन गहराई में जमे अंदरूनी तनावों को धीरे-धीरे सुलझाने में मेरी मदद की।</p>'
  );
  html = replaceAll(
    html,
    'मेरे व्याख्यात्मक मॉडल के अनुसार तनाव के कारण होने वाला टिनिटस तब उत्पन्न हो सकता है, जब कोई अनसुलझा भावनात्मक टकराव लगातार अति-सक्रिय केंद्रीय टकराव-केंद्र को सक्रिय बनाए रखता है और श्रवण-प्रसंस्करण पथों को भी साथ सक्रिय करता है। यह Prgomet और Klinghardt के दृष्टिकोणों, दूसरे लोगों के मामलों और मेरी अपनी रिसर्च को मिलाकर बनाई गई मेरी समेकित व्याख्या है—यह कल्पना मात्र नहीं है।',
    'आज मैं कह सकता हूँ: तनाव के कारण होने वाला टिनिटस कोई रहस्य नहीं है और न ही कोई कल्पना। यह मस्तिष्क में लगातार बनी विद्युत अवस्था का सुनाई देने वाला परिणाम है, जो ऐसे टकरावों से पैदा होती है जो कभी सचमुच समाप्त नहीं हुए। अगर समझ लिया जाए कि वहाँ क्या होता है, तो यह भी समझ में आता है कि टोन क्यों है—और खुद क्या किया जा सकता है।'
  );
  // Restore the source's field-effect statement instead of added model-attribution/measurement caveats.
  html = replaceAll(
    html,
    '<p><strong>चौथा, छोटे विद्युत-क्षेत्र प्रभावों के रास्ते।</strong> मेरे मॉडल के उस हिस्से में, जिसे मैंने Michael Prgomet और Dr. Klinghardt से ग्रहण किया है, छोटे, वास्तविक और स्थानीय विद्युत-क्षेत्र तथा आवेश के प्रभाव भूमिका निभाते हैं। इस धारणा के अनुसार एक साथ सक्रिय तंत्रिका कोशिकाएँ पड़ोसी कोशिकाओं को भी उत्तेजित कर सकती हैं। यह Michael Prgomet और Dr. Klinghardt से ली गई मॉडल की एक मान्यता है, तनाव के कारण होने वाले टिनिटस में सीधे मापी गई प्रक्रिया नहीं।</p>',
    '<p><strong>चौथा, छोटे विद्युत-क्षेत्र प्रभावों के रास्ते।</strong> जब किसी छोटे क्षेत्र में बहुत-सी तंत्रिका कोशिकाएँ एक साथ और समकालिक रूप से सक्रिय होती हैं, तो स्थानीय विद्युत क्षेत्र बनते हैं। ये क्षेत्र छोटे होते हैं—लेकिन वास्तविक होते हैं, और वे पड़ोसी कोशिकाओं को सचमुच सीमा से ऊपर धकेल सकते हैं, जिससे वे खुद फ़ायर करने लगती हैं।</p>'
  );
  html = replaceAll(
    html,
    '<p>इस मॉडल में वैन-डे-ग्राफ़ गोला और “बिजली की छोटी-सी चमक” एक ऐसी छोटी भौतिक प्रक्रिया को समझाते हैं, जिसे इस मॉडल में माना गया है—यह न तो उच्च वोल्टेज है, न दिखाई देने वाली चिंगारी और न ही तनाव के कारण होने वाले टिनिटस में सीधे मापी गई कोई प्रक्रिया। जब कोई ट्रिगर जुड़ता है, या नींद की कमी, थकावट और बहुत अधिक अंदरूनी तनाव जैसे कारक मिलकर काम करते हैं, तो इस मॉडल में माना गया यह क्षेत्र अधिक शक्तिशाली हो सकता है और इस मॉडल के अनुसार पड़ोस के किसी संवेदनशील तंत्रिका-मार्ग को भी उत्तेजित कर सकता है।</p>',
    '<p>इस विद्युत तंत्र की कल्पना तंत्रिका तंत्र में एक छोटी वैन-डे-ग्राफ़ गेंद की तरह की जा सकती है (बेशक केवल एक चित्र के रूप में—वास्तविक वोल्टेज असली हाई-वोल्टेज गेंद की तुलना में बहुत कम होते हैं, लेकिन कार्य-सिद्धांत वही है): जब टकराव केवल हल्का सक्रिय होता है, तो बहुत कुछ नहीं होता। लेकिन कोई ट्रिगर जुड़ जाए—या नींद की कमी, थकावट और भारी अंदरूनी तनाव जैसे कई कारक साथ आएँ—तो क्षेत्र और अधिक आवेशित होता जाता है। किसी बिंदु पर वोल्टेज पर्याप्त बड़ा हो जाता है और वह पड़ोसी संवेदनशील तंत्रिका-पथ पर छोटी बिजली की तरह डिस्चार्ज होता है। फिर वह पथ भी साथ फ़ायर करता है।</p>'
  );
  // Remove the locally added HPA/cortisol excursus.
  html = replaceRegex(
    html,
    /\s*<p><strong>अंतर स्पष्ट करने के लिए महत्वपूर्ण:<\/strong> सामान्य HPA\/कॉर्टिसोल तनाव[^<]*<\/p>/,
    ''
  );
  html = replaceAll(
    html,
    'केवल यह तथ्य कि कोई लक्षण तीव्र तनाव के बिना भी बना रहता है, अपने आप में किसी निश्चित कारण को नहीं दर्शाता; इस मॉडल के भीतर लगातार बनी केंद्रीय गलत सक्रियता एक संभावित व्याख्या हो सकती है।',
    'एक निर्णायक संकेत इसकी अवधि है: यदि कोई लक्षण तीव्र तनाव के बिना भी बना रहता है, तो आम तौर पर तंत्रिका तंत्र में लंबे समय से बनी विद्युत गलत सक्रियता मौजूद होती है।'
  );
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  const p = pathname.replace(/\.html$/, '');
  switch (p) {
    case '/hi/meine-geschichte-teil-1': return fixBio1(html);
    case '/hi/tinnitus-geheilt-erfahrungsbericht': return fixShortBio(html);
    case '/hi/mein-loesungsansatz': return fixApproach(html);
    case '/hi/produkte': return fixProducts(html);
    case '/hi/laermbedingter-tinnitus': return fixNoise(html);
    case '/hi/medikamente-gifte-tinnitus': return fixGift(html);
    case '/hi/stressbedingter-tinnitus': return fixStress(html);
    default: return html;
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  if (url.pathname === '/hi/faq' || url.pathname === '/hi/faq.html') return context.next();
  const response = await context.next();
  // These responses must not be reconstructed with a body.
  if (request.method === 'HEAD' || [204, 205, 304].includes(response.status)) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  const fixed = applyPathFixes(url.pathname, html);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-hi-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/hi/*' };
export { applyPathFixes };
