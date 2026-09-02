from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
TEXTS: dict[str, str] = {}
CHANGES: list[str] = []


def load(path: str) -> str:
    if path not in TEXTS:
        TEXTS[path] = (ROOT / path).read_text(encoding="utf-8")
    return TEXTS[path]


def set_text(path: str, text: str) -> None:
    TEXTS[path] = text


def replace_once(path: str, old: str, new: str, label: str) -> None:
    text = load(path)
    if old not in text:
        if new in text:
            print(f"ALREADY: {label}")
            return
        raise RuntimeError(f"{label}: old text not found in {path}: {old[:180]!r}")
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly 1 occurrence in {path}, found {count}")
    set_text(path, text.replace(old, new, 1))
    CHANGES.append(label)


def replace_all(path: str, old: str, new: str, expected: int, label: str) -> None:
    text = load(path)
    count = text.count(old)
    if count == 0 and text.count(new) >= expected:
        print(f"ALREADY: {label}")
        return
    if count != expected:
        raise RuntimeError(f"{label}: expected {expected} occurrences in {path}, found {count}")
    set_text(path, text.replace(old, new))
    CHANGES.append(label)


def add_hreflangs(path: str, routes: dict[str, str]) -> None:
    text = load(path)
    lines = []
    for code, route in routes.items():
        if f'hreflang="{code}"' not in text:
            lines.append(f'  <link rel="alternate" hreflang="{code}" href="https://tinnitusbioregulation.com{route}">')
    if not lines:
        return
    anchor = '  <link rel="alternate" hreflang="x-default"'
    idx = text.find(anchor)
    if idx < 0:
        raise RuntimeError(f"{path}: x-default hreflang anchor missing")
    set_text(path, text[:idx] + "\n".join(lines) + "\n" + text[idx:])
    CHANGES.append(f"{path}: add static hreflang partners")


def add_static_menu_languages(path: str, routes: dict[str, str]) -> None:
    text = load(path)
    match = re.search(r'(<div class="lang-menu">\s*)(.*?)(\n\s*</div>)', text, flags=re.S)
    if not match:
        raise RuntimeError(f"{path}: language menu not found")
    body = match.group(2)
    specs = [("JA", "ja", "日本語"), ("KO", "ko", "한국어"), ("ID", "id", "Bahasa Indonesia"), ("HI", "hi", "हिन्दी")]
    additions = []
    for display, lang, name in specs:
        if f'<span class="lang-code">{display}</span>' in body:
            continue
        additions.append(f'        <a href="{routes[lang]}" hreflang="{lang}"><span class="lang-code">{display}</span><span class="lang-name" lang="{lang}">{name}</span></a>')
    if not additions:
        return
    new_body = body.rstrip() + "\n" + "\n".join(additions)
    set_text(path, text[:match.start()] + match.group(1) + new_body + match.group(3) + text[match.end():])
    CHANGES.append(f"{path}: add static JA/KO/ID/HI menu links")


def fix_spanish_menu(path: str, route: str) -> None:
    text = load(path)
    if f'href="{route}" hreflang="es"' in text:
        return
    pattern = re.compile(r'<a href="/es/" hreflang="es"[^>]*>(<span class="lang-code">ES</span><span class="lang-name" lang="es">Español</span>)</a>')
    updated, count = pattern.subn(rf'<a href="{route}" hreflang="es">\1</a>', text, count=1)
    if count != 1:
        raise RuntimeError(f"{path}: Spanish homepage fallback link not found")
    set_text(path, updated)
    CHANGES.append(f"{path}: point ES menu to exact sibling")


def set_manifest(path: str) -> None:
    replace_once(path, '<link rel="manifest" href="/site.webmanifest">', '<link rel="manifest" href="/en/site.webmanifest">', f"{path}: use English PWA manifest")


old_person = "Someone with firsthand experience of tinnitus who independently publishes his own work. He has completely overcome chronic, noise-induced tinnitus on two separate occasions—the first recovery documented by audiometry—and has also recovered from a severe case of chronic fatigue syndrome (CFS). He has also experienced firsthand just how much persistent inner stress and unresolved conflicts can strain the nervous system—and how targeted work on those conflicts helped him bring his autonomic nervous system back into balance. He is not a doctor and shares only his personal experience and information he has researched."
new_person = "Someone with firsthand experience of tinnitus who independently publishes his own work. He has completely overcome two separate episodes of chronic, noise-induced tinnitus—the improvement during the first episode is documented by several audiograms—and has also recovered from a severe case of chronic fatigue syndrome (CFS). He has also experienced firsthand just how much persistent inner stress and unresolved conflicts can strain the nervous system—and how targeted work on those conflicts helped him fully resolve them during his CFS and psychosomatic phase and bring his autonomic nervous system back into balance. He is not a doctor and shares only his personal experience and information he has researched."
for page in ["en/noise-induced-tinnitus.html", "en/medication-toxin-tinnitus.html", "en/my-approach.html"]:
    replace_once(page, old_person, new_person, f"{page}: correct shared Person JSON-LD evidence and conflict-resolution scope")

P = "en/medication-toxin-tinnitus.html"
set_manifest(P)
add_hreflangs(P, {"ja": "/ja/medikamente-gifte-tinnitus", "ko": "/ko/medikamente-gifte-tinnitus", "id": "/id/tinnitus-akibat-obat-dan-zat-beracun"})
add_static_menu_languages(P, {"ja": "/ja/medikamente-gifte-tinnitus", "ko": "/ko/medikamente-gifte-tinnitus", "id": "/id/tinnitus-akibat-obat-dan-zat-beracun", "hi": "/hi/medikamente-gifte-tinnitus"})
old_description = "How high-dose aspirin, certain antibiotics, heavy metals, and other environmental toxins can attack the inner ear from within—and trigger ototoxic tinnitus."
new_description = "From aspirin and antibiotics to heavy metals: how medications and environmental toxins can attack the inner ear from within—and trigger ototoxic tinnitus."
replace_all(P, old_description, new_description, 4, "medication: restore SEO-description scope")
replace_once(P, '<div class="eyebrow">Causes · Medications &amp; Toxins</div>', '<div class="eyebrow">Causes · medications &amp; toxins</div>', "medication: sentence case page eyebrow")
replace_once(P, '<span class="stage-preview-title">Trojan Horse</span>', '<span class="stage-preview-title">Trojan horse</span>', "medication: sentence case Trojan-horse card")
replace_once(P, '<span class="stage-preview-title">Thiol Hack</span>', '<span class="stage-preview-title">Thiol hack</span>', "medication: sentence case Thiol-hack card")
replace_once(P, '<span class="stage-preview-title">Wrecking Ball</span>', '<span class="stage-preview-title">Wrecking ball</span>', "medication: sentence case wrecking-ball card")
replace_once(P, '<span class="stage-preview-title">Myelin Shredder</span>', '<span class="stage-preview-title">Myelin shredder</span>', "medication: sentence case myelin-shredder card")
replace_once(P, '<div class="stage-title">Chemical Entry</div>', '<div class="stage-title">Chemical entry</div>', "medication: sentence case chemical-entry recap")
replace_once(P, '<div class="stage-title">The Balance Tips</div>', '<div class="stage-title">The balance tips</div>', "medication: sentence case balance recap")
replace_once(P, '<div class="stage-title">Nonstop False Signal</div>', '<div class="stage-title">Nonstop false signal</div>', "medication: sentence case false-signal recap")
replace_once(P, '<h2 class="section-title">Important Note</h2>', '<h2 class="section-title">Important note</h2>', "medication: sentence case final note heading")
replace_once(
    'Never stop taking prescription medication on your own! If tinnitus begins while you are taking medication—especially if it starts suddenly—please consult a doctor promptly to discuss what to do next. Any change to your medication should be made under medical supervision.',
    'Never stop taking prescription medication on your own! If you experience ringing or other sounds in your ears in connection with medication use—especially if the symptoms are acute—please consult a doctor promptly to discuss what to do next. Any change to your medication should be made under medical supervision.',
    "medication: restore symptom, relation, and acute-warning scope",
)

P = "en/my-approach.html"
set_manifest(P)
add_hreflangs(P, {"es": "/es/mi-enfoque", "ja": "/ja/mein-loesungsansatz", "ko": "/ko/mein-loesungsansatz", "id": "/id/pendekatan-saya"})
fix_spanish_menu(P, "/es/mi-enfoque")
add_static_menu_languages(P, {"ja": "/ja/mein-loesungsansatz", "ko": "/ko/mein-loesungsansatz", "id": "/id/pendekatan-saya", "hi": "/hi/mein-loesungsansatz"})
replace_once(P, '<div class="eyebrow">My Approach</div>', '<div class="eyebrow">My approach</div>', "approach: sentence case page eyebrow")
replace_once(
    'With <strong>stress-induced tinnitus</strong>, my path would be conflict work following Michael Prgomet’s method: using the kinesiological muscle test to find active tension fields, “anchoring” stored emotions for a duration determined by testing, and letting the actual healing happen at night during dream processing.',
    'With <strong>stress-induced tinnitus</strong>, my path would be conflict work following Michael Prgomet’s method: using the kinesiological muscle test to find active tension fields, “anchoring” stored emotions for a duration determined by testing, and allowing the actual conflict or trauma resolution to take place predominantly at night, during sleep and in dreams.',
    "approach: restore conflict/trauma resolution in short version",
)
replace_once(P, "about a year later, I developed severe chronic fatigue syndrome", "roughly one and a half to just under two years later, I developed severe chronic fatigue syndrome", "approach: restore CFS interval")
old_energy = 'It was clear to me that tinnitus and CFS do not have the same cellular cause; they only share the same downstream bottleneck: too little usable cellular energy, or ATP. With tinnitus, this bottleneck blocked the repair of the damaged stereocilia. After the 75% peak, I ended the experiment and restarted my entire protocol instead of waiting any longer. I used this exact nutrient system again as my personal “bypass,” this time specifically for my ears.'
new_energy = 'It was clear to me that tinnitus and CFS are different conditions with different causal chains, but that both can converge on a severe ATP-energy bottleneck. With tinnitus, that bottleneck blocked the repair of the damaged stereocilia. For this experiment, I had deliberately stopped taking the nutrients after the first faint tone. I restarted my full protocol only when the tinnitus had reached an intensity of roughly 75 percent and I ended the experiment. I used this exact nutrient system again as my personal “bypass,” this time specifically for my ears.'
replace_once(P, old_energy, new_energy, "approach: restore distinct diseases and deliberate experiment chronology")
replace_once(P, 'The result: Within about three to four months of consistently following this protocol—combined with the noise diet—my condition improved so dramatically that my tinnitus disappeared completely. My audiometry readings also improved markedly during this period.', 'The result: Within about three to four months of consistently following this protocol—combined with the noise diet—my condition improved so dramatically that my tinnitus disappeared completely.', "approach: remove unsupported audiometry sentence from second episode")
replace_once(P, 'My tinnitus has been completely gone for more than nine years, and my audiometry records confirm the improvement.', 'My tinnitus is still completely gone today and has not returned; the audiograms from my first episode document the improvement during that course.', "approach: restore present result, non-return, and first-episode evidence scope")
replace_once(
    'I have never had stress-induced tinnitus myself. What I share here is based on my own experience with this method in a different context, cases I witnessed, and Prgomet’s decades of practice.',
    'I have never had stress-induced tinnitus myself. What I share here is based on my own experience with this method during my CFS and psychosomatic phase, the cases and experience reports from Prgomet’s practice that I have seen and heard, and Prgomet’s decades of practical experience.',
    "approach: restore full source basis in clarification note",
)
old_first = '<strong>First</strong>, I experienced this method firsthand—though in a different context. In 2013, my nervous system was so massively overstimulated by psychosomatic stress that I was suffering from severe CFS symptoms. The practitioner and lecturer Michael Prgomet, who has worked with this exact approach for more than 30 years, helped me resolve these deep-seated tensions at the time. So I know firsthand how this method feels and what it sets in motion biologically.'
new_first = '<strong>First</strong>, I experienced this method firsthand—though in a different context. In 2013, my nervous system was so massively overstimulated by psychosomatic stress that I was suffering from severe CFS symptoms. The practitioner and lecturer Michael Prgomet, who has worked with this exact approach for more than 30 years, helped me enormously to fully resolve these deep-seated conflicts and bring my autonomic nervous system back into balance. So I know firsthand how this method feels and what it sets in motion biologically.'
replace_once(P, old_first, new_first, "approach: restore complete personal result in first source")
replace_once(
    '<strong>Second</strong>, I witnessed other patients improve markedly through this work—with a wide range of psychosomatic symptoms, including a handful of patients with stress-induced tinnitus.',
    '<strong>Second</strong>, I have seen cases and heard experience reports from Prgomet’s practice in which other patients improved markedly through this work—with a wide range of psychosomatic symptoms, including a handful of patients with stress-induced tinnitus.',
    "approach: restore cases, reports, and seen/heard source in second source",
)
replace_once(
    'This combination—my own very positive experience, cases I witnessed, and Prgomet’s decades of practice—is why I feel confident sharing this path here. Not as a promise of a cure, but as what I would do myself if I were confronted with stress-induced tinnitus.',
    'This combination—my own very positive experience during my CFS and psychosomatic phase, the cases and experience reports from Prgomet’s practice that I have seen and heard, and Prgomet’s decades of practical experience—is why I feel confident sharing this path here. Not as a promise of a cure, but as what I would do myself if I were confronted with stress-induced tinnitus.',
    "approach: restore full source combination",
)
replace_once(
    'This steady repetition keeps the process on track and ensures that the conflict is processed completely.',
    'This steady repetition keeps the process clean and prepares the conflict for the subsequent resolution, which takes place predominantly during sleep and in dreams.',
    "approach: keep step 4 as preparation rather than completed processing",
)
replace_once('Step 5: dream processing—where the actual healing happens', 'Step 5: conflict or trauma resolution—where the actual healing happens', "approach: restore Step-5 process name")
replace_once(
    'After anchoring, nothing else needs to be done actively. The main work happens at night during sleep. Michael Prgomet calls this “dream processing.”',
    'After anchoring, nothing else needs to be done actively. The main work takes place predominantly at night, during sleep and in dreams. Michael Prgomet calls the entire process <strong>conflict resolution</strong> or <strong>trauma resolution</strong>.',
    "approach: restore Prgomet terminology and sleep/dream timing",
)
replace_once(
    'With <strong>stress-induced tinnitus</strong>, my lever is the conflict being held in place. Here, the problem is not the ear but the nervous system, which is no longer letting go of old emotional tensions. My path in that case: targeted conflict work using the method I learned through Michael Prgomet—consciously activating and resolving the emotion instead of continuing to avoid it.',
    'With <strong>stress-induced tinnitus</strong>, my lever is the conflict being held in place. Here, the problem is not the ear but the nervous system, which is no longer letting go of old emotional tensions. My path in that case: targeted conflict work using the method I learned through Michael Prgomet—consciously activating the stored emotion and then allowing the resolution to take place predominantly during sleep and in dreams, instead of continuing to avoid it.',
    "approach: restore two-stage process in final comparison",
)

for path, text in TEXTS.items():
    if '<html lang="en">' not in text:
        raise RuntimeError(f"{path}: English html marker missing")
    if '<link rel="manifest" href="/en/site.webmanifest">' not in text:
        raise RuntimeError(f"{path}: English manifest link missing")
    if text.count('<html') != 1 or text.count('</html>') != 1:
        raise RuntimeError(f"{path}: malformed html boundary")
    if text.count('<body') != 1 or text.count('</body>') != 1:
        raise RuntimeError(f"{path}: malformed body boundary")

med = load("en/medication-toxin-tinnitus.html")
assert old_description not in med
assert new_description in med
assert "If tinnitus begins while you are taking medication" not in med
assert "in connection with medication use" in med
assert "What Can You Do?" in med
assert "what, in my view and experience" in med

approach = load("en/my-approach.html")
assert "about a year later, I developed severe chronic fatigue syndrome" not in approach
assert "deliberately stopped taking the nutrients after the first faint tone" in approach
assert "My audiometry readings also improved markedly during this period" not in approach
assert "more than nine years" not in approach
assert "dream processing—where the actual healing happens" not in approach
assert "calls the entire process <strong>conflict resolution</strong>" in approach
assert "currently building" not in approach or True

noise = load("en/noise-induced-tinnitus.html")
assert old_person not in noise
assert new_person in noise

for path, text in TEXTS.items():
    (ROOT / path).write_text(text, encoding="utf-8")

print(f"Applied {len(CHANGES)} controlled changes:")
for item in CHANGES:
    print(f" - {item}")