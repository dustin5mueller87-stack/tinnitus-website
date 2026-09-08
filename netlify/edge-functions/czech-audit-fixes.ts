/*
 * Collision-safe Czech translation corrections from the completed one-pass audit.
 * Scope is /cs/* only. German source pages and the unfinished FAQ are never changed.
 * Open author/source questions, optional style-only suggestions, image-pixel and live-render
 * checks remain untouched.
 */
const VERSION = "2026-09-07-v1";

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}
function replaceRegex(text: string, pattern: RegExp, replacement: string) {
  return text.replace(pattern, replacement);
}

function commonFixes(html: string) {
  // Where the shared Person description says German "hinter sich gelassen", keep completion explicit.
  html = replaceAll(
    html,
    'a také prodělal těžké onemocnění s chronickým únavovým syndromem (CFS)',
    'a také překonal těžké onemocnění s chronickým únavovým syndromem (CFS)'
  );
  return html;
}

function fixHome(html: string) {
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

function fixBio1(html: string) {
  // Binding chronology: day 3 only left; right first consciously perceived a few days later.
  html = replaceAll(
    html,
    'V pravém jsem už tehdy vnímal slabý pískavý tón.',
    'V pravém uchu jsem v té chvíli ještě žádný tinnitus nevnímal.'
  );
  html = replaceAll(
    html,
    'i už přítomný slabý pískavý tón v pravém uchu byl teď mnohem hlasitější',
    'a o několik dní po prvním tónu vlevo jsem začal vnímat pískání také v pravém uchu'
  );
  html = replaceAll(
    html,
    'zesílilo už přítomný tón v pravém uchu',
    'způsobilo, že se do toho zapojilo i pravé ucho'
  );
  html = replaceAll(
    html,
    'Nedostatek potvrzen, na samém spodním okraji normálního rozmezí.',
    'Ještě v normě, ano, ale úplně dole, těsně nad hranicí nedostatku.'
  );
  html = replaceAll(
    html,
    'Ale ten zvuk přece vznikl fyzicky po návštěvě diskotéky!',
    'Ale ten zvuk přece vznikl fyzicky kvůli návštěvě diskotéky!'
  );
  html = replaceAll(
    html,
    'Nejdřív tón mizel do poledne. Pak až do odpoledne.',
    'Nejdřív byl tón pryč až do poledne. Pak až do odpoledne.'
  );
  html = replaceAll(
    html,
    'Lecitin je hlavním stavebním materiálem myelinové vrstvy (izolace nervů).',
    'Lecitin je jedním z klíčových stavebních materiálů myelinové vrstvy (izolace nervů).'
  );
  html = replaceAll(html, 'Moje tělo se opravilo samo', 'Moje tělo to opravilo samo');
  html = replaceAll(
    html,
    'Při žlučových kamenech vždy vyhledej lékařskou pomoc',
    'Při žlučových kamenech rozhodně vyhledej lékařskou péči'
  );
  return html;
}

function fixBio2(html: string) {
  // Only the personal second-episode comparison is changed; technical anchor absturz-75 remains.
  html = replaceAll(html, '>Kolaps na 75 %<', '>Kolaps na zhruba 50 %<');
  html = replaceAll(
    html,
    'Jak ale vůbec mohl tinnitus za těchto okolností znovu tak brutálně zesílit až na 75 % původní hlasitosti?',
    'Jak ale vůbec mohl tinnitus za těchto okolností znovu tak brutálně zesílit až na zhruba 50 % hlasitosti mého úplně prvního tinnitu?'
  );
  html = replaceAll(html, 'Definitivní kolaps: 75 procent a zvukový chaos', 'Definitivní kolaps: zhruba 50 procent a zvukový chaos');
  html = replaceAll(
    html,
    'V levém uchu byl určitě ze tří čtvrtin (75 %) tak hlasitý jako při mém úplně prvním kolapsu.',
    'V levém uchu dosahoval zhruba poloviny (50 %) hlasitosti mého úplně prvního tinnitu.'
  );
  html = replaceAll(
    html,
    'Otevřeně předkládám existující fyzické doklady: Lékařské audiogramy s propady v jednotlivých frekvencích dokumentují výhradně průběh mého prvního případu tinnitu; pro druhý průběh žádný audiogram neexistuje. K tomu se přidávají laboratorní zprávy, diagnózy a účty z klinik a od terapeutů.',
    'Vlastním každý jednotlivý fyzický důkaz tohoto pekla i tohoto vyléčení: své lékařské audiogramy s masivními propady v jednotlivých frekvencích, laboratorní zprávy, diagnózy a účty z klinik a od terapeutů.'
  );
  html = replaceAll(
    html,
    'Úplně jsem vynechal i lecitin – znal jsem ho už z období prvního případu tinnitu (1. část biografie) a ve svém tehdejším vysvětlujícím modelu ho považoval za absolutní základ myelinové vrstvy.',
    'Úplně jsem vynechal i lecitin, který jsem už z doby svého prvního tinnitu (1. část biografie) znal a používal jako svůj naprostý základ pro myelinovou vrstvu.'
  );
  html = replaceAll(
    html,
    'Nejprve se odmlčelo pravé ucho. Tinnitus v něm už asi po dvou měsících zcela zmizel a ucho znovu úplně ztichlo.',
    'Nejprve se odmlčelo pravé ucho. Už asi po dvou měsících bylo úplně vyléčené a znovu zcela ztichlo.'
  );
  html = replaceAll(
    html,
    'Potom zeslabovala stoupající a klesající siréna.',
    'Pak se vytrácela i siréna, která střídavě zesilovala a slábla.'
  );
  return html;
}

function fixShortBio(html: string) {
  html = replaceAll(
    html,
    'a v pravém slabý pískavý tón',
    'a v pravém uchu jsem ještě žádný tinnitus nevnímal'
  );
  html = replaceAll(
    html,
    'už přítomný slabý tón v pravém uchu',
    'tón, který jsem o několik dní později začal vnímat i v pravém uchu'
  );
  html = replaceAll(html, '75 % hlasitosti', 'zhruba 50 % hlasitosti mého úplně prvního tinnitu');
  html = replaceAll(
    html,
    'Vyzkoušel jsem simulovaný výškový trénink (IHHT), který jsem kvůli panice musel přerušit',
    'Pokusil jsem se zahájit simulovaný výškový trénink (IHHT), ale kvůli panice jsem ho zrušil ještě před zahájením léčby'
  );
  html = replaceAll(
    html,
    'Proces vyléčení trval tři až čtyři měsíce.',
    'Proces vyléčení trval přibližně tři až čtyři měsíce od skutečného obnovení mé rutiny po ukončení testu.'
  );
  return html;
}

function fixApproach(html: string) {
  // Explicit author deletion: remove only the local CFS causal bracket/sentence if present.
  html = replaceRegex(
    html,
    /\s*<p>[^<]*ne bez důvodu[^<]*CFS[^<]*<\/p>/gi,
    ''
  );
  html = replaceAll(html, '75 % intenzity mého prvního tinnitu', 'zhruba 50 % hlasitosti mého úplně prvního tinnitu');
  html = replaceAll(html, '75 % hlasitosti mého prvního tinnitu', 'zhruba 50 % hlasitosti mého úplně prvního tinnitu');
  html = replaceAll(
    html,
    ', audiogramy z mého prvního případu potvrzují zlepšení tohoto případu',
    ''
  );
  html = replaceAll(
    html,
    'surovinu pro buněčné membrány, ve kterých teprve mohou správně fungovat pumpy, receptory a další struktury',
    'surovinu pro buněčné membrány, ve kterých teprve mohou být pumpy, receptory a struktury správně usazené'
  );
  html = replaceAll(
    html,
    'po odstranění těžkých kovů se znovu doplnily vytlačené stopové prvky',
    'znovu doplnit vytlačené stopové prvky, jakmile začne odstraňování těžkých kovů z těla'
  );
  html = replaceAll(
    html,
    'vědomě aktivovat emoci a následné vyřešení nechat probíhat převážně ve spánku a ve snu, místo dalšího vyhýbání',
    'vědomě aktivovat a uvolnit emoci, místo aby se jí člověk dál vyhýbal'
  );
  html = replaceAll(
    html,
    'konfliktů nebo traumat',
    'konfliktů, tedy traumat'
  );
  html = replaceAll(
    html,
    'v krvi nebo v moči',
    'v krvi, v moči nebo v obou'
  );
  // Remove the locally added completion clause in Person data, keep the German-source balance statement.
  html = replaceAll(html, 'tyto konflikty zcela vyřešit a ', '');
  return html;
}

function fixSources(html: string) {
  // Clear local additions about audiogram scope; background remains true but does not belong here.
  html = replaceAll(html, '; existující audiometrické podklady se týkají výhradně prvního průběhu', '');
  html = replaceAll(
    html,
    'Dochované podklady z audiometrických vyšetření se vztahují výhradně k prvnímu průběhu; k druhé epizodě neexistují odpovídající dokumenty. ',
    ''
  );
  // Editorial residue only. Do not remove the real limitation that follows it.
  html = replaceRegex(html, /<strong>Důležité podle(?: pravidla| vodítka| mantinelu)? 8:?<\/strong>\s*/gi, '');
  html = replaceRegex(html, /Důležité podle(?: pravidla| vodítka| mantinelu)? 8:?\s*/gi, '');
  html = replaceAll(
    html,
    'aby vyloučil organické příčiny',
    'aby vyšetřil možné organické příčiny'
  );
  html = replaceAll(
    html,
    'podporuje nebo odlehčuje dýchací řetězec',
    'podporuje nebo znovu uvolňuje dýchací řetězec'
  );
  // Restore the source role for two central-gain review/model passages where Czech had replaced it with my-model counterclaims.
  html = replaceAll(
    html,
    'V mém modelu Central Gain pouze zesiluje již existující aktivní chybný signál; ze samotné ztráty vstupu tinnitusový tón nevzniká.',
    'Podle tohoto modelu centrální sluchový systém při sníženém vstupu zvyšuje svou citlivost a tinnitus vzniká jako zesílený šum.'
  );
  // HPA/source reach remains open. No blanket rewrite of that section here.
  return html;
}

function fixTestimonials(html: string) {
  html = replaceAll(
    html,
    'Jako celek ukazují shromážděné zprávy o tinnitu pozitivní změny v souvislosti s přístupem založeným na živinách; ne každá jednotlivá karta však představuje zkušenost s tinnitem, protože sbírka obsahuje také doplňující příspěvky a zprávy o jiných potížích.',
    'Ukazují, že lidé po celém světě, nezávisle na sobě a aniž by se navzájem znali, popisují podobné zkušenosti s tinnitem a přístupem založeným na živinách.'
  );
  html = replaceAll(
    html,
    'vyhledej otorinolaryngologa (ORL lékaře), aby vyšetřil možné organické příčiny',
    'vyhledej prosím ORL lékaře, aby vyšetřil možné organické příčiny'
  );
  return html;
}

function fixProducts(html: string) {
  html = replaceAll(html, 'hned po probuzení nalačno', 'hned po vstání nalačno');
  html = replaceAll(html, 'Krátce po probuzení užívám většinou nalačno', 'Krátce po vstání užívám většinou nalačno');
  return html;
}
function fixContact(html: string) {
  html = replaceAll(
    html,
    'vyhledej prosím nejdřív otorinolaryngologa (ORL lékaře)',
    'vyhledej prosím nejdřív ORL lékaře'
  );
  return html;
}

function fixNoise(html: string) {
  html = replaceAll(
    html,
    'Aby toho nebylo málo, třetí den se už i v pravém uchu objevil slabý pískavý tón. Krátce nato tento už přítomný tón v pravém uchu výrazně zesílil',
    'Aby toho nebylo málo, o několik dní později, po další zvukové zátěži, jsem začal vnímat slabý pískavý tón také v pravém uchu. Krátce nato tento tón výrazně zesílil'
  );
  html = replaceAll(
    html,
    'právě tím se můj stav zhoršil a už přítomný slabý tón v pravém uchu výrazně zesílil.',
    'právě tím se můj stav zhoršil a zapojilo se i druhé ucho.'
  );
  html = replaceAll(
    html,
    'Tinnitus způsobený hlukem se může projevit přímo po hlukové události, člověk si ho však může vědomě všimnout až po několika hodinách nebo dnech. Já jsem tón zaznamenal až třetí den; proč, to dodnes nevím jistě. Možná vysvětlení popisuji v častých otázkách výslovně jako hypotézy.',
    'U většiny lidí s tinnitem se tinnitus objeví poměrně brzy po hlukové události – během několika minut až několika hodin. Existují však i případy, kdy se objeví až po několika hodinách nebo dokonce dnech.'
  );
  html = replaceAll(
    html,
    'Ani silný kolaps vnitřní podpůrné kostry nemusí být konečným verdiktem.',
    'Ani silný kolaps vnitřní podpůrné kostry není konečným verdiktem.'
  );
  html = replaceAll(
    html,
    'V <a href="/cs/faq">části s častými dotazy</a> najdeš další zajímavá témata týkající se tinnitu způsobeného hlukem – například proč může jeho hlasitost kolísat, proč na krátkou dobu zeslábne, když ho překryješ, a proč se krátce nato znovu ozve hlasitěji. Tyto každodenní jevy jsou tam srozumitelně vysvětleny – na základě stejných fyziologických mechanismů, které byly popsány zde.',
    'V <a href="/cs/faq">části s častými dotazy</a> se budu věnovat dalším tématům kolem tinnitu způsobeného hlukem – například proč může jeho hlasitost kolísat, proč na krátkou dobu zeslábne, když ho překryješ, a proč se krátce nato znovu ozve hlasitěji. Stránku s častými dotazy nyní postupně vytvářím.'
  );
  html = replaceAll(html, 'aby vyloučil organické příčiny', 'aby vyšetřil možné organické příčiny');
  return html;
}

function fixGift(html: string) {
  html = replaceAll(
    html,
    'U mě byl tehdy sice hlavním spouštěčem klasický tinnitus způsobený hlukem (a nikoli akutní příhoda související s lékem)',
    'U mě byl tehdy tinnitus způsoben výhradně hlukem (a nikoli akutní příhodou související s lékem)'
  );
  html = replaceAll(html, 'Demoliční kladivo', 'Demoliční koule');
  html = replaceAll(html, 'Biologické demoliční kladivo', 'Biologická demoliční koule');
  html = replaceAll(html, 'vlásky vadnou, lámou se a blokují', 'vlásky vadnou, podlamují se a blokují');
  html = replaceAll(
    html,
    'vápníkové pumpy už pracují spíše na hranici, respektive buňky pracují těsně na limitu',
    'vápníkové pumpy už pracují spíše směrem k hranici a zároveň celé buňky pracují těsně na limitu'
  );
  return html;
}

function fixStress(html: string) {
  html = replaceAll(
    html,
    'Teprve jeho práce mi velmi výrazně pomohla zcela vyřešit konflikty z období CFS a psychosomatických potíží a znovu uvést autonomní nervový systém do rovnováhy.',
    'Teprve jeho práce mi tehdy pomohla tyto hluboko uložené vnitřní napětí postupně uvolnit.'
  );
  html = replaceAll(
    html,
    'Podle mého vysvětlujícího modelu může tinnitus způsobený stresem vzniknout tehdy, když nevyřešený emoční konflikt udržuje trvale nadměrně aktivní centrální ohnisko konfliktu a spoluaktivuje sluchové dráhy. Jde o mou syntézu Prgometova a Klinghardtova přístupu, případů jiných lidí a vlastní rešerše – nejde o výplod představivosti.',
    'Dnes mohu říct: Tinnitus způsobený stresem není žádné mystérium ani výplod představivosti. Je to slyšitelný důsledek trvalého elektrického stavu v mozku, vyvolaného konflikty, které nikdy nebyly skutečně uzavřeny. Když člověk pochopí, co se tam děje, pochopí také, proč je tón přítomný – a co může sám udělat.'
  );
  // Remove the locally added whole HPA paragraph without deciding the separate source-page HPA question.
  html = replaceRegex(
    html,
    /\s*<p><strong>Důležité rozlišení:<\/strong> Obecný stres osy HPA a kortizolu[^<]*<\/p>/,
    ''
  );
  html = replaceAll(
    html,
    'Jde o připsaný předpoklad modelu, nikoli o proces přímo naměřený u tinnitu způsobeného stresem.',
    'Tato pole jsou malá, ale reálná a mohou skutečně posunout sousední buňky přes práh, takže samy začnou vysílat vzruchy.'
  );
  html = replaceAll(
    html,
    'Skutečnost, že příznak přetrvává i bez akutního stresu, sama o sobě nedokládá žádnou konkrétní příčinu; v rámci tohoto modelu může být jedním z možných vysvětlení trvalá centrální chybná aktivita.',
    'Rozhodujícím vodítkem je trvání: Pokud příznak přetrvává i bez akutního stresu, bývá v nervovém systému přítomná chronická chybná elektrická aktivita.'
  );
  html = replaceAll(
    html,
    'kde stručně a srozumitelně odpovídám na nejčastější otázky',
    'kterou v současnosti postupně vytvářím'
  );
  html = replaceAll(html, 'aby vyloučil organické příčiny', 'aby vyšetřil možné organické příčiny');
  html = replaceAll(html, 'vyřešením konfliktu, respektive zpracováním traumatu', 'vyřešením konfliktu, respektive vyřešením traumatu');
  html = replaceAll(html, 'k tvorbě a aktivnímu zpevňování myelinových vrstev', 'k tvorbě a aktivnímu zhutňování myelinových vrstev');
  // MEG/Penfield source-specific replacements are deliberately not guessed here; those source-form questions remain open.
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  // This batch already contains the reviewed translations and author corrections.
  if (html.includes('data-translation-batch="2026-09-07"')) return html;
  html = commonFixes(html);
  const p = pathname.replace(/\.html$/, '');
  switch (p) {
    case '/cs':
    case '/cs/': return fixHome(html);
    case '/cs/meine-geschichte-teil-1': return fixBio1(html);
    case '/cs/meine-geschichte-teil-2': return fixBio2(html);
    case '/cs/tinnitus-geheilt-erfahrungsbericht': return fixShortBio(html);
    case '/cs/mein-loesungsansatz': return fixApproach(html);
    case '/cs/wissenschaftliche-quellen': return fixSources(html);
    case '/cs/erfahrungsberichte': return fixTestimonials(html);
    case '/cs/produkte': return fixProducts(html);
    case '/cs/kontakt': return fixContact(html);
    case '/cs/laermbedingter-tinnitus': return fixNoise(html);
    case '/cs/medikamente-gifte-tinnitus': return fixGift(html);
    case '/cs/stressbedingter-tinnitus': return fixStress(html);
    default: return html;
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  if (url.pathname === '/cs/faq' || url.pathname === '/cs/faq.html') return context.next();
  const response = await context.next();
  // These responses must not be reconstructed with a body.
  if (request.method === 'HEAD' || [204, 205, 304].includes(response.status)) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  const fixed = applyPathFixes(url.pathname, html);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-cs-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/cs/*' };
export { applyPathFixes };
