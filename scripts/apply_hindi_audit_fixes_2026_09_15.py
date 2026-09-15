from pathlib import Path

CHANGES = []


def change(path, old, new, label):
    CHANGES.append((Path(path), old, new, label))


# Start page: Audiometry 2 unit attribution.
change(
    "hi/index.html",
    '<p data-unit="AUD2-C03">Roeser (1980) · 0 · 0 · dB</p>',
    '<p data-unit="AUD2-C03">Roeser (1980) · 0 · 0</p>',
    "start-audiometry-roeser-db",
)

# Short story: B12 wording, timeline, IHHT timing, audiogram meaning.
change(
    "hi/tinnitus-geheilt-erfahrungsbericht.html",
    'मेरी रक्त-जाँच: मान कमी की सीमा से बस ज़रा-सा ऊपर था, पैमाने के सबसे निचले सिरे पर।',
    'मेरी रक्त-जाँच: कमी, पैमाने के सबसे निचले सिरे पर।',
    "short-b12-local-german",
)
change(
    "hi/tinnitus-geheilt-erfahrungsbericht.html",
    '<li><strong>लगभग 2 साल बाद:</strong>',
    '<li><strong>दो साल पूरे होने से कुछ पहले:</strong>',
    "short-just-under-two-years",
)
change(
    "hi/tinnitus-geheilt-erfahrungsbericht.html",
    'मैंने कृत्रिम ऊँचाई प्रशिक्षण (IHHT) शुरू करने की कोशिश भी की, लेकिन दहशत के कारण उपचार शुरू होने से पहले ही उसे रद्द कर दिया, और मैं CFS-विशेषज्ञ क्लिनिक में भर्ती होने के करीब था।',
    'मैंने कृत्रिम ऊँचाई प्रशिक्षण (IHHT) आज़माने की कोशिश की, लेकिन दहशत के कारण उसे रोकना पड़ा, और मैं CFS-विशेषज्ञ क्लिनिक में भर्ती होने के करीब था।',
    "short-ihht-remove-unapproved-timing",
)
change(
    "hi/tinnitus-geheilt-erfahrungsbericht.html",
    'फ़्रीक्वेंसी में भारी गिरावट दर्ज करने वाले मेरे चिकित्सीय ऑडियोग्राम',
    'कुछ आवृत्तियों पर सुनने की क्षमता में भारी गिरावट दर्ज करने वाले मेरे चिकित्सीय ऑडियोग्राम',
    "short-audiogram-hearing-drops",
)

# Long biography part 1: local B12 wording follows German source.
change(
    "hi/meine-geschichte-teil-1.html",
    'नतीजा: मेरा मान कमी की सीमा से बस थोड़ा ऊपर था।',
    'नतीजा: कमी की पुष्टि हुई।',
    "bio1-b12-deficiency-confirmed",
)

# Long biography part 2: keep dramatic metaphor and restore evidence statement.
change(
    "hi/meine-geschichte-teil-2.html",
    'भरी थालियों के बावजूद कोशिकीय भूख',
    'भरी थालियों के बावजूद कोशिकीय स्तर पर भूख से मरना',
    "bio2-starvation-margin",
)
change(
    "hi/meine-geschichte-teil-2.html",
    'भरी थालियों के बावजूद मैं कोशिकीय स्तर पर भूखा था।',
    'भरी थालियों के बावजूद मैं कोशिकीय स्तर पर भूख से मर रहा था।',
    "bio2-starvation-body",
)
change(
    "hi/meine-geschichte-teil-2.html",
    'मैं मौजूद भौतिक प्रमाण खुलकर मेज़ पर रख रहा हूँ: फ़्रीक्वेंसी में गिरावट वाले चिकित्सीय ऑडियोग्राम केवल मेरे पहले टिनिटस के घटनाक्रम को दर्ज करते हैं; दूसरे घटनाक्रम के लिए कोई ऑडियोग्राम नहीं है। इसके साथ लैब रिपोर्ट, निदान और क्लिनिकों तथा थेरेपिस्टों के बिल भी हैं।',
    'इस नर्क और इस ठीक होने का हर एक भौतिक प्रमाण मेरे पास है: कुछ आवृत्तियों पर सुनने की क्षमता में भारी गिरावट दर्ज करने वाले मेरे चिकित्सीय ऑडियोग्राम, लैब रिपोर्ट, निदान और क्लिनिकों तथा थेरेपिस्टों के बिल।',
    "bio2-restore-evidence-statement",
)

# My approach: restore experiment chronology and preserve transport relationship in mobilization test.
change(
    "hi/mein-loesungsansatz.html",
    '<p>वर्षों बाद जब मुझे दूसरी बार टिनिटस का सामना करना पड़ा, तब पहली बार मेरे हाथ में एक वास्तविक, आज़माया हुआ तंत्र था। मुझे साफ़ था कि टिनिटस और CFS में कोशिकीय स्तर पर एक ही बाधा थी: ATP ऊर्जा की भारी कमी, जो यहाँ क्षतिग्रस्त स्टीरियोसिलिया की मरम्मत रोक रही थी। इसलिए प्रयोग समाप्त करने के बाद इस बार मैंने अपना पूरा प्रोटोकॉल तुरंत शुरू किया, बिना पहले प्रयोग के तौर पर और इंतज़ार किए। मैंने ठीक इसी पोषक-तत्त्व तंत्र को फिर अपने व्यक्तिगत “बाइपास” की तरह इस्तेमाल किया, इस बार खास तौर पर अपने कानों के लिए।</p>',
    '<p>वर्षों बाद जब मुझे दूसरी बार टिनिटस का सामना करना पड़ा, तब पहली बार मेरे हाथ में एक वास्तविक, आज़माया हुआ तंत्र था। मुझे साफ़ था: टिनिटस और CFS के पैदा होने की कहानियाँ अलग थीं, लेकिन बाद में जो अड़चन आई, वह दोनों में एक ही थी—ATP ऊर्जा की भारी कमी, जो यहाँ क्षतिग्रस्त स्टीरियोसिलिया की मरम्मत रोक रही थी। अपने जानबूझकर किए गए आत्म-प्रयोग के दौरान मैंने पोषक सप्लीमेंट्स लेना बंद कर दिया था। प्रयोग रोकने के बाद मैंने अपना पूरा प्रोटोकॉल तुरंत फिर से शुरू कर दिया। मैंने ठीक इसी पोषक-तत्त्व तंत्र को फिर अपने व्यक्तिगत “बाइपास” की तरह इस्तेमाल किया, इस बार खास तौर पर अपने कानों के लिए।</p>',
    "approach-restore-stop-restart-sequence",
)
change(
    "hi/mein-loesungsansatz.html",
    'इससे वे रक्त और/या मूत्र में पहुँचती हैं और वहाँ लैब तकनीक से उनका पता लगाया जा सकता है।',
    'इस तरह वे रक्त में पहुँचती हैं और रक्तप्रवाह के रास्ते मूत्र में भी पहुँच सकती हैं; प्रयोगशाला जाँच से उनका पता लगाया जा सकता है।',
    "approach-mobilization-blood-urine-relationship",
)

# Noise-induced tinnitus: local German text governs; remove additions and restore conclusion.
change(
    "hi/laermbedingter-tinnitus.html",
    '<p>उस समय मुझे मुख्य रूप से बाएँ कान में एक तेज़, तीखा, ऊँची फ़्रीक्वेंसी वाला टोन सुनाई देता था, जिसके साथ बहुत दूर पृष्ठभूमि में साँय-साँय की आवाज़ थी। उस समय मैं इससे बुरा कुछ कल्पना भी नहीं कर सकता था। मुसीबत और बढ़ाते हुए, तीसरे दिन दाएँ कान में भी पहले से ही एक हल्की बीप उभर चुकी थी। उसके कुछ ही समय बाद दाएँ कान का यह पहले से मौजूद टोन साफ़ तौर पर अधिक तेज़ हो गया—डॉक्टरों के उन निर्देशों के सीधे परिणामस्वरूप, जो मेरे अपने मामले में पूरी तरह गलत साबित हुए।</p>',
    '<p>उस समय मुझे मुख्य रूप से बाएँ कान में एक तेज़, तीखा, ऊँची फ़्रीक्वेंसी वाला टोन सुनाई देता था, जिसके साथ बहुत दूर पृष्ठभूमि में साँय-साँय की आवाज़ थी। उस समय मैं इससे बुरा कुछ कल्पना भी नहीं कर सकता था, क्योंकि मुसीबत और बढ़ाते हुए थोड़े ही समय बाद दायाँ कान भी जुड़ गया—डॉक्टरों के उन निर्देशों के सीधे परिणामस्वरूप, जो मेरे अपने मामले में पूरी तरह गलत साबित हुए।</p>',
    "noise-right-ear-chronology-1",
)
change(
    "hi/laermbedingter-tinnitus.html",
    '<p>इन “निर्देशों” का मूल मतलब टोन को दूसरी आवाज़ों से ढकना था—मिसाल के लिए, हेडफ़ोन पर अधिक तेज़ आवाज़ में संगीत सुनना या लगातार शोर चलाए रखना। लेकिन वास्तव में इसका मतलब था कि मेरे कानों पर और भी अधिक ध्वनि-उत्तेजनाएँ पड़ रही थीं, जबकि वे पहले ही बहुत ज़्यादा बोझ में थे। पीछे मुड़कर देखता हूँ तो यह सबसे बड़ी गलतियों में से एक थी, क्योंकि ठीक इसी वजह से मेरी हालत बिगड़ी और दाएँ कान का पहले से मौजूद हल्का टोन साफ़ तौर पर और अधिक तेज़ हो गया।</p>',
    '<p>इन “निर्देशों” का मूल मतलब टोन को दूसरी आवाज़ों से ढकना था—मिसाल के लिए, हेडफ़ोन पर अधिक तेज़ आवाज़ में संगीत सुनना या लगातार शोर चलाए रखना। लेकिन वास्तव में इसका मतलब था कि मेरे कानों पर और भी अधिक ध्वनि-उत्तेजनाएँ पड़ रही थीं, जबकि वे पहले ही बहुत ज़्यादा बोझ में थे। पीछे मुड़कर देखता हूँ तो यह सबसे बड़ी गलतियों में से एक थी, क्योंकि ठीक इसी वजह से मेरी हालत बिगड़ी और दूसरा कान भी इसकी चपेट में आ गया।</p>',
    "noise-right-ear-chronology-2",
)
change(
    "hi/laermbedingter-tinnitus.html",
    '  <p><strong>संकेत-शृंखला के लिए महत्वपूर्ण:</strong> जब मैं सिनैप्स पर ग्लूटामेट के स्राव और श्रवण तंत्रिका तक जाने वाले संकेत का वर्णन करता हूँ, तो उसका स्पष्ट अर्थ <strong>भीतरी हेयर सेल</strong> है।</p>\n\n',
    '',
    "noise-remove-added-inner-hair-cell-paragraph",
)
change(
    "hi/laermbedingter-tinnitus.html",
    '<p>शोर के कारण होने वाला टिनिटस शोर की घटना के तुरंत बाद ध्यान में आ सकता है, लेकिन कभी-कभी घंटों या दिनों बाद ही सचेत रूप से महसूस होता है। मेरे मामले में टोन पहली बार 3वें दिन ध्यान में आया; क्यों, यह मैं आज तक निश्चित रूप से नहीं जानता। संभावित व्याख्याओं को मैं FAQ में स्पष्ट रूप से परिकल्पनाओं के रूप में बताऊँगा।</p>',
    '<p>ज़्यादातर प्रभावित लोगों में शोर की घटना के काफ़ी जल्दी बाद टिनिटस शुरू हो जाता है—कुछ मिनटों से लेकर कुछ घंटों के भीतर। लेकिन ऐसे मामले भी होते हैं, जिनमें टिनिटस घंटों या यहाँ तक कि दिनों बाद शुरू होता है। यह अलग-अलग तरह से क्यों हो सकता है और इसमें कान की कुछ संरचनाओं की क्या भूमिका होती है, इसे मैं FAQ खंड में विस्तार से समझाता हूँ।</p>',
    "noise-onset-general-statement",
)
change(
    "hi/laermbedingter-tinnitus.html",
    '<p>मेरे मुख्य मॉडल में क्रॉनिक, शोर के कारण होने वाला टिनिटस शारीरिक रूप से यह है: अब भी उत्तेजनीय परिधीय ऊतक से आने वाला एक सक्रिय गलत संकेत। अपने दोनों दौरों के लिए मेरा अनुमान है कि मुख्य स्रोत जीवित भीतरी हेयर सेल्स थीं, जो ऊर्जा-संबंधी आपात मोड में फँसी थीं; श्रवण तंत्रिका या माइलिन की भागीदारी को मैं संभव मानता हूँ, लेकिन अपने मामले में इसे निश्चित रूप से पुष्ट नहीं कर सकता। मस्तिष्क टोन को संकेत के पूरी तरह अभाव से नहीं बनाता, बल्कि मौजूद गलत संकेत को बढ़ाता है।</p>',
    '<p>मेरे विश्वास के अनुसार क्रॉनिक, शोर के कारण होने वाला टिनिटस शारीरिक स्तर पर असल में यह है: एक जीवित कोशिका, जो ऊर्जा के आपात मोड में फँसी है और जिसकी मरम्मत काफ़ी हद तक चरण 1 में ही अटकी हुई है, क्योंकि चरण 2 के लिए ऊर्जा नहीं है। कान “खराब” नहीं है और मस्तिष्क कोई काल्पनिक संकेत गढ़ नहीं रहा है। यह टोन परिधीय स्तर पर चल रहे जीवित रहने के एक वास्तविक संघर्ष का नतीजा है, जिसे मस्तिष्क केवल बढ़ाता है।</p>',
    "noise-restore-conclusion",
)

# Stress-related tinnitus: exact labels and degree of control.
change(
    "hi/stressbedingter-tinnitus.html",
    'थैलेमस अधिक उत्तेजनाओं को आगे जाने देता है और प्रीफ्रंटल कॉर्टेक्स अपना नियंत्रण खो देता है।',
    'थैलेमस अधिक उत्तेजनाओं को आगे जाने देता है और प्रीफ्रंटल कॉर्टेक्स की नियंत्रण क्षमता कम हो जाती है।',
    "stress-control-degree",
)
change(
    "hi/stressbedingter-tinnitus.html",
    'aria-label="रेखाचित्र: वैन-डे-ग्राफ़ गोले के रूप में आवेशित मस्तिष्क-क्षेत्र, जो बिजली की चमक की तरह पड़ोसी श्रवण-प्रसंस्करण पथ पर डिस्चार्ज होता है।"',
    'aria-label="रेखाचित्र: वैन-डे-ग्राफ़ गोले के रूप में आवेशित मस्तिष्क-क्षेत्र, जो बिजली की चमक की तरह पड़ोसी तंत्रिका-पथ (श्रवण तंत्रिका) पर डिस्चार्ज होता है।"',
    "stress-a11y-hearing-nerve-label",
)
change(
    "hi/stressbedingter-tinnitus.html",
    '<div class="stage-title">श्रवण-प्रसंस्करण पथ पर डिस्चार्ज</div>',
    '<div class="stage-title">श्रवण तंत्रिका पर डिस्चार्ज</div>',
    "stress-card-hearing-nerve-title",
)

# Medication/toxin page: preserve general enzyme scope in accessible alt text.
change(
    "hi/medikamente-gifte-tinnitus.html",
    'alt="पारे द्वारा एंज़ाइम अवरोध का योजनात्मक चित्रण: पारे का एक परमाणु एक एंज़ाइम — यानी ATP-नियंत्रित कैल्शियम पंप की सल्फ़र-युक्त थायोल संयोजन-स्थल से जुड़ता है और उसकी संरचना को मोड़ देता है, जिससे वह काम करना बंद कर देता है—तथाकथित थायोल हैक"',
    'alt="पारे द्वारा एंज़ाइम अवरोध का योजनात्मक चित्रण: पारे का एक परमाणु किसी एंज़ाइम, जैसे ATP-नियंत्रित कैल्शियम पंप, के सल्फ़र-युक्त थायोल संयोजन-स्थल से जुड़ता है और उसकी संरचना को मोड़ देता है, जिससे वह काम करना बंद कर देता है—तथाकथित थायोल हैक"',
    "toxin-thiol-alt-enzyme-scope",
)

# Products: follow current German price scope; restore missing emphasis only.
change(
    "hi/produkte.html",
    'आपके लिए कीमत बिल्कुल वही रहती है— मेरे लिंक से उत्पादों की कीमत उतनी ही है जितनी FitLine के किसी दूसरे आधिकारिक माध्यम से खरीदने पर होती है।',
    'आपके लिए कीमत बिल्कुल वही रहती है— मेरे लिंक से उत्पादों की कीमत उतनी ही है जितनी कहीं और होती है।',
    "products-price-scope",
)
change(
    "hi/produkte.html",
    'यह नियासिन पर होने वाली एक जानी-पहचानी, अच्छी तरह दर्ज प्रतिक्रिया है',
    'यह <strong>नियासिन पर होने वाली एक जानी-पहचानी, अच्छी तरह दर्ज प्रतिक्रिया</strong> है',
    "products-niacin-emphasis",
)

# FAQ: remove unrequested rewrites/additions and restore German content and tone.
change(
    "hi/faq.html",
    '<p style="font-size:1.15rem;font-weight:600;">🛠️ इस हिस्से पर अभी काम चल रहा है— और यह जल्द उपलब्ध होगा।</p>',
    '<p style="font-size:1.15rem;font-weight:600;">इस पृष्ठ पर अभी काम चल रहा है।</p>',
    "faq-build-note",
)
change(
    "hi/faq.html",
    '<p>आप यहाँ जल्दी आ गए हैं— और यह अच्छी बात है। मैं अभी यह पृष्ठ तैयार कर रहा हूँ। यहाँ मैं धीरे-धीरे ठीक वे सवाल इकट्ठे कर रहा हूँ, जो मेरे अपने सफ़र में मेरे मन में आए थे, और उनके जवाब वैसे ही दे रहा हूँ, जैसे मैंने उन्हें समझा है: अपने अनुभव के आधार पर, सामान्य भाषा में और भारी-भरकम तकनीकी शब्दजाल के बिना। अगले कुछ हफ़्तों में यहाँ दोबारा आना फायदेमंद रहेगा।</p>',
    '<p>यहाँ मैं धीरे-धीरे उन सवालों को इकट्ठा कर रहा हूँ, जो उस समय खुद मुझे रातों को जगाए रखते थे — और उनके जवाब वैसे ही दे रहा हूँ, जैसे मैं उन्हें आज समझता हूँ।</p>',
    "faq-personal-intro",
)
change(
    "hi/faq.html",
    '<li>… और रोज़मर्रा के ऐसे कई और सवाल, जिन्हें मेरे कारण-पृष्ठों पर बताए गए उन्हीं तंत्रों के आधार पर आसानी से समझ आने वाली भाषा में समझाया जाएगा।</li>',
    '<li>… और रोज़मर्रा के अन्य सवाल।</li>',
    "faq-open-list-item",
)
change(
    "hi/faq.html",
    '<p>यहाँ आने के लिए धन्यवाद— फिर जल्द मिलते हैं। 🙌</p>',
    '<p>यहाँ आने के लिए धन्यवाद।</p>',
    "faq-signoff",
)

# Shared Voiceflow UI: change only the privacy consent primary button, not generic submit/send.
change(
    "site.js",
    """          var sendButton = shadowRoot.querySelector('.vfrc-chat-input__send');
          setAttributeIfChanged(sendButton, 'title', 'भेजें');
          setAttributeIfChanged(sendButton, 'aria-label', 'भेजें');

          var scrollIcon = shadowRoot.querySelector('[title=\"scroll\"], [title=\"Scroll down\"], [title=\"नीचे स्क्रॉल करें\"]');""",
    """          var sendButton = shadowRoot.querySelector('.vfrc-chat-input__send');
          setAttributeIfChanged(sendButton, 'title', 'भेजें');
          setAttributeIfChanged(sendButton, 'aria-label', 'भेजें');

          var privacyPrimary = shadowRoot.querySelector('.vfrc-privacy__primary-button');
          if (privacyPrimary) {
            var privacyText = (privacyPrimary.textContent || '').trim();
            if (!privacyPrimary.children.length &&
                (privacyText === 'Submit' || privacyText === 'सबमिट करें') &&
                privacyPrimary.textContent !== 'स्वीकार करें और आगे बढ़ें') {
              privacyPrimary.textContent = 'स्वीकार करें और आगे बढ़ें';
            }
            setAttributeIfChanged(privacyPrimary, 'aria-label', 'स्वीकार करें और आगे बढ़ें');
          }

          var scrollIcon = shadowRoot.querySelector('[title=\"scroll\"], [title=\"Scroll down\"], [title=\"नीचे स्क्रॉल करें\"]');""",
    "shared-hindi-privacy-accept",
)


def apply_change(path: Path, old: str, new: str, label: str) -> bool:
    text = path.read_text(encoding="utf-8")
    count = text.count(old)
    if count == 0:
        if new and new in text:
            print(f"SKIP already applied: {label} ({path})")
            return False
        if not new:
            print(f"SKIP deletion already absent: {label} ({path})")
            return False
        raise RuntimeError(f"Anchor not found for {label} in {path}")
    if count != 1:
        raise RuntimeError(f"Expected exactly one anchor for {label} in {path}, found {count}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")
    print(f"APPLY {label}: {path}")
    return True


def main():
    changed = 0
    for path, old, new, label in CHANGES:
        if apply_change(path, old, new, label):
            changed += 1
    print(f"Applied {changed} targeted Hindi audit fixes.")

    # Guardrails for the author's explicit 15 Sep 2026 clarification.
    for path in [Path("hi/tinnitus-geheilt-erfahrungsbericht.html"), Path("hi/meine-geschichte-teil-2.html")]:
        text = path.read_text(encoding="utf-8")
        if "75%" not in text and "75 %" not in text:
            raise RuntimeError(f"75% guardrail failed for {path}")
    # Rauschtest must remain functional/still, not biological cell death.
    for path in [Path("hi/tinnitus-geheilt-erfahrungsbericht.html"), Path("hi/meine-geschichte-teil-2.html")]:
        text = path.read_text(encoding="utf-8")
        if 'शारीरिक रूप से ठप और “मूक”' not in text:
            raise RuntimeError(f"Functional-noise-test wording guardrail failed for {path}")


if __name__ == "__main__":
    main()
