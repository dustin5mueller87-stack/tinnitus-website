from __future__ import annotations

from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
CHANGES: list[str] = []
TEXTS: dict[str, str] = {}


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
        raise RuntimeError(f"{label}: expected old text not found in {path}: {old[:160]!r}")
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


def replace_nth(path: str, old: str, new: str, occurrence: int, label: str) -> None:
    text = load(path)
    starts = [m.start() for m in re.finditer(re.escape(old), text)]
    if len(starts) < occurrence:
        if new in text:
            print(f"ALREADY: {label}")
            return
        raise RuntimeError(f"{label}: occurrence {occurrence} not found in {path}; total {len(starts)}")
    pos = starts[occurrence - 1]
    set_text(path, text[:pos] + new + text[pos + len(old):])
    CHANGES.append(label)


def add_hreflangs(path: str, routes: dict[str, str]) -> None:
    text = load(path)
    additions: list[str] = []
    for code, route in routes.items():
        marker = f'hreflang="{code}"'
        if marker not in text:
            additions.append(
                f'  <link rel="alternate" hreflang="{code}" '
                f'href="https://tinnitusbioregulation.com{route}">'
            )
    if not additions:
        return
    anchor = '  <link rel="alternate" hreflang="x-default"'
    idx = text.find(anchor)
    if idx < 0:
        raise RuntimeError(f"{path}: x-default hreflang anchor not found")
    set_text(path, text[:idx] + "\n".join(additions) + "\n" + text[idx:])
    CHANGES.append(f"{path}: add static hreflang JA/KO/ID")


def add_static_menu_languages(path: str, routes: dict[str, str]) -> None:
    text = load(path)
    match = re.search(r'(<div class="lang-menu">\s*)(.*?)(\n\s*</div>)', text, flags=re.S)
    if not match:
        raise RuntimeError(f"{path}: language menu block not found")
    body = match.group(2)
    specs = [
        ("JA", "ja", "日本語"),
        ("KO", "ko", "한국어"),
        ("ID", "id", "Bahasa Indonesia"),
        ("HI", "hi", "हिन्दी"),
    ]
    lines: list[str] = []
    for display_code, lang, name in specs:
        if f'<span class="lang-code">{display_code}</span>' in body:
            continue
        route = routes[lang]
        lines.append(
            f'        <a href="{route}" hreflang="{lang}"><span class="lang-code">{display_code}</span>'
            f'<span class="lang-name" lang="{lang}">{name}</span></a>'
        )
    if not lines:
        return
    new_body = body.rstrip() + "\n" + "\n".join(lines)
    set_text(path, text[:match.start()] + match.group(1) + new_body + match.group(3) + text[match.end():])
    CHANGES.append(f"{path}: add static JA/KO/ID/HI menu links")


def fix_spanish_menu(path: str, route: str) -> None:
    text = load(path)
    pattern = re.compile(
        r'<a href="/es/" hreflang="es"[^>]*>'
        r'(<span class="lang-code">ES</span><span class="lang-name" lang="es">Español</span>)</a>'
    )
    if route in text:
        return
    text2, count = pattern.subn(rf'<a href="{route}" hreflang="es">\1</a>', text, count=1)
    if count != 1:
        raise RuntimeError(f"{path}: Spanish homepage fallback anchor not found")
    set_text(path, text2)
    CHANGES.append(f"{path}: point ES menu to exact sibling page")


def set_english_manifest(path: str) -> None:
    replace_once(
        path,
        '<link rel="manifest" href="/site.webmanifest">',
        '<link rel="manifest" href="/en/site.webmanifest">',
        f"{path}: use language-preserving English PWA manifest",
    )


manifest = {
    "name": "Tinnitus Bioregulation",
    "short_name": "Tinnitus",
    "start_url": "/en/",
    "scope": "/en/",
    "lang": "en",
    "display": "standalone",
    "background_color": "#f3ecdc",
    "theme_color": "#2f4364",
    "icons": [
        {
            "src": "/favicon.svg",
            "sizes": "any",
            "type": "image/svg+xml",
            "purpose": "any",
        }
    ],
}
manifest_path = ROOT / "en/site.webmanifest"
manifest_text = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
if not manifest_path.exists() or manifest_path.read_text(encoding="utf-8") != manifest_text:
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(manifest_text, encoding="utf-8")
    CHANGES.append("create en/site.webmanifest")

P = "en/index.html"
set_english_manifest(P)
add_hreflangs(P, {"ja": "/ja/", "ko": "/ko/", "id": "/id/"})
add_static_menu_languages(P, {"ja": "/ja/", "ko": "/ko/", "id": "/id/", "hi": "/hi/"})
replace_once(P, "Audiometry documented clear improvements during my recovery, by which point my tinnitus was already about 80% gone.", "The audiograms document clear improvements over the course of my recovery; by the third audiogram shown here, my tinnitus was already about 80% gone.", "start: restore explicit third-audiogram reference")
replace_once(P, '<div class="compare-label">Tinnitus already about 80% gone</div>', '<div class="compare-label">Tinnitus about 80% gone</div>', "start: remove unlicensed already from compact image label")
replace_once(P, "I never had stress-related tinnitus myself.", "I never had stress-induced tinnitus myself.", "start: use project term stress-induced tinnitus")
replace_once(P, "the fuel your body uses for strength, stamina, and physical capacity.", "the fuel your body uses for strength, stamina, and fitness.", "start: restore fitness")
replace_nth(P, "What You’ll Find on This Site", "What You’ll Find on This Page", 1, "start: distinguish first overview heading")
replace_nth(P, "What You’ll Find on This Site", "What to Expect on This Page", 1, "start: distinguish second overview heading")
replace_once(P, '<p><strong>Important:</strong> If you have tinnitus or hearing problems, please see an ENT specialist to rule out possible underlying physical causes—especially if the symptoms began suddenly.</p>', '<p><strong>Important note:</strong> If you have tinnitus or hearing problems—especially if the symptoms are acute or have appeared recently—please see an ENT doctor to have organic causes checked.</p>', "start: remove defensive medical padding and preserve acute warning scope")
replace_all(P, "Go to the Explanation Page:", "Read more:", 3, "start: naturalize three explanation-page links")
replace_once(P, "works against the ear’s actual recovery.", "works against the ear’s actual regeneration.", "start: preserve cellular regeneration term")
replace_once(P, "Record 2—Follow-up hearing test by an ENT and sleep-medicine specialist", "Record 2—Hearing test later in the course by an ENT and sleep-medicine specialist", "start: avoid implying a formal follow-up-care relationship in lightbox")
replace_once(P, "ENT and sleep-medicine specialist—follow-up hearing test.", "ENT and sleep-medicine specialist—hearing test later in the course.", "start: avoid implying a formal follow-up-care relationship in card text")
replace_once(P, "These are my own measurements, documented by doctors.", "These are my personal test results, documented by doctors.", "start: clarify ownership versus measurement agency")

P = "en/my-story-part-1.html"
set_english_manifest(P)
add_hreflangs(P, {"es": "/es/mi-historia-parte-1", "ja": "/ja/meine-geschichte-teil-1", "ko": "/ko/meine-geschichte-teil-1", "id": "/id/kisah-tinnitus-saya-bagian-1"})
fix_spanish_menu(P, "/es/mi-historia-parte-1")
add_static_menu_languages(P, {"ja": "/ja/meine-geschichte-teil-1", "ko": "/ko/meine-geschichte-teil-1", "id": "/id/kisah-tinnitus-saya-bagian-1", "hi": "/hi/meine-geschichte-teil-1"})
replace_once(P, '<div class="eyebrow">My Story · Full Version, Part 1</div>', '<div class="eyebrow">My story · full version, part 1</div>', "bio1: apply sentence case to eyebrow")
replace_once(P, "My system was already cooked long before the club bass hit.", "My system had already been softened up long before the club bass hit.", "bio1: preserve weakened-before-impact meaning in margin note")
replace_once(P, "My system was already “cooked,” without me knowing it.", "My system had already been “softened up,” without me knowing it.", "bio1: preserve weakened-before-impact meaning in body")
replace_once(P, "my balance system was shot; my body kept lurching violently to the left.", "my balance system was shot, and a violent physical pull kept dragging me to the left.", "bio1: restore physical quality of leftward pull")
replace_once(P, "Listen to some music to mask the sounds.", "Listen to some music to drown out the sounds.", "bio1: preserve doctor’s colloquial wording rather than normalize it")
replace_once(P, "(Today I know: the continued sound exposure on medical advice—with music, and at night with white noise—had brought my cells to their knees again and dragged my right ear into it too.)", "(Looking back, I believe the continued sound exposure on medical advice—with music, and at night with white noise—had brought my cells to their knees again and pushed my already strained right ear past the point at which the tinnitus became perceptible there too.)", "bio1: align right-ear relation with authoritative chronology")
replace_once(P, "He prescribed ginkgo and recommended enough sleep and exercise.", "He prescribed ginkgo and recommended plenty of sleep and exercise.", "bio1: naturalize enough sleep and exercise")
replace_once(P, "If the symptoms remain, I’ll gladly prescribe antidepressants.", "If the symptoms persist, I’ll gladly prescribe antidepressants.", "bio1: naturalize quoted medical speech")
replace_once(P, "Your problem is that you focus too much on your hearing problems, thereby perpetuating the tinnitus.", "Your problem is that you focus too much on your hearing problems, and that’s what keeps the tinnitus going.", "bio1: restore spoken register in doctor quote")
replace_once(P, "The First Defining Experience: Proof the “Phantom Sound” Was a Lie", "The First Key Experience: Proof the “Phantom Sound” Was a Lie", "bio1: keep Schlüsselerlebnis distinct from turning point")
replace_once(P, "I had the defining experience:", "I had the key experience:", "bio1: keep Schlüsselerlebnis terminology consistent")
replace_once(P, "with thick gauze bandages in both ears", "with thick gauze packing in both ear canals", "bio1: use the correct object term for material inside the ear canals")
replace_once(P, "I stuck rigidly to both regimens while still maintaining silence.", "I followed both regimens rigorously while still maintaining silence.", "bio1: preserve disciplined rather than rigidly negative tone")
replace_once(P, "Vitamin B12—The Most Important Turning Point (By Chance)", "Vitamin B12—The Most Important Key Experience (By Chance)", "bio1: keep key experience distinct from the later true turning point")
replace_once(P, "A vegetarian since age 15 plus chronic gastritis—the perfect blueprint for a B12 deficiency. The blood test confirmed it: at the lower limit of normal.", "A vegetarian since age 15 plus chronic gastritis—the perfect setup for a very low B12 level. The blood test showed it at the lower end of the normal range, just short of a confirmed deficiency.", "bio1: correct B12 margin note without inventing a deficiency diagnosis")
replace_once(P, "I had a blood test at my family doctor’s office: deficiency confirmed, at the very bottom of the normal range.", "I had a blood test at my family doctor’s office: my B12 level was at the very bottom of the normal range, just short of a confirmed deficiency.", "bio1: correct B12 diagnosis in body")
replace_once(P, "Oh man—so I didn’t just need ATP; I needed BUILDING MATERIALS too!", "Oh man—so I don’t just need ATP; I need BUILDING MATERIALS too!", "bio1: preserve live inner-monologue present tense")
replace_once(P, "Today, I see this mechanism as an open question:", "Today, I take a more open view of this mechanism:", "bio1: preserve less-dogmatic stance rather than recast as an open question")
replace_once(P, "Another possibility is an indirect pathway: choline from lecithin could serve as a building block for acetylcholine and in that way support the parasympathetic nervous system, deep sleep, and regeneration—or lecithin may have accelerated cellular repair in several ways at once.", "Another possibility is an indirect pathway: choline from lecithin could serve as a building block for acetylcholine and in that way support the parasympathetic nervous system, deep sleep, and regeneration—or lecithin accelerated cellular repair in several ways at once.", "bio1: remove duplicated possibility marker")
replace_once(P, "Because I still trusted the doctor’s advice, I made a disastrous mistake on the way: I played my favorite song very loudly on the car stereo.", "Because I still trusted the doctor’s advice, I made a disastrous mistake on the way: Favorite song on the car stereo, cranked way up.", "bio1: restore telegraphic fragment and direct voice")
replace_once(P, "B-vitamin injections twice a week, 30 g of lecithin three to four times a week,", "B-vitamin injections 2 times a week, 30 g of lecithin 3–4 times a week,", "bio1: preserve source numeral choices")

for path, text in TEXTS.items():
    if '<html lang="en">' not in text:
        raise RuntimeError(f"{path}: lost English html language marker")
    if '<link rel="manifest" href="/en/site.webmanifest">' not in text:
        raise RuntimeError(f"{path}: English manifest link missing after patch")
    if text.count("<html") != 1 or text.count("</html>") != 1:
        raise RuntimeError(f"{path}: malformed document boundary")
    if text.count("<body") != 1 or text.count("</body>") != 1:
        raise RuntimeError(f"{path}: malformed body boundary")

start = load("en/index.html")
assert "by the third audiogram shown here" in start
assert "stress-related tinnitus myself" not in start
assert "rule out possible underlying" not in start
assert start.count("Go to the Explanation Page:") == 0

bio1 = load("en/my-story-part-1.html")
assert "deficiency confirmed, at the very bottom" not in bio1
assert "just short of a confirmed deficiency" in bio1
assert "At that point, I wasn’t aware of any tinnitus in my right ear." in bio1
assert "for the first time, I could hear it in my right ear too." in bio1
assert "dragged my right ear into it too" not in bio1
assert "The First Key Experience" in bio1
assert "The Most Important Key Experience" in bio1

for path, text in TEXTS.items():
    (ROOT / path).write_text(text, encoding="utf-8")

print(f"Applied {len(CHANGES)} controlled changes:")
for item in CHANGES:
    print(f" - {item}")