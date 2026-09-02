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
        raise RuntimeError(f"{label}: expected 1 occurrence in {path}, found {count}")
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
        raise RuntimeError(f"{path}: x-default anchor missing")
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
        raise RuntimeError(f"{path}: Spanish fallback link not found")
    set_text(path, updated)
    CHANGES.append(f"{path}: point ES menu to exact sibling")


def set_manifest(path: str) -> None:
    replace_once(path, '<link rel="manifest" href="/site.webmanifest">', '<link rel="manifest" href="/en/site.webmanifest">', f"{path}: use English PWA manifest")


P = "en/my-story-part-2.html"
set_manifest(P)
add_hreflangs(P, {"es": "/es/mi-historia-parte-2", "ja": "/ja/meine-geschichte-teil-2", "ko": "/ko/meine-geschichte-teil-2", "id": "/id/kisah-tinnitus-saya-bagian-2"})
fix_spanish_menu(P, "/es/mi-historia-parte-2")
add_static_menu_languages(P, {"ja": "/ja/meine-geschichte-teil-2", "ko": "/ko/meine-geschichte-teil-2", "id": "/id/kisah-tinnitus-saya-bagian-2", "hi": "/hi/meine-geschichte-teil-2"})
replace_once(P, '<div class="eyebrow">My Story · Full Version, Part 2</div>', '<div class="eyebrow">My story · full version, part 2</div>', "bio2: apply sentence case to eyebrow")
replace_once(P, "The real collapse of my body—the one that felt like a threat to my very existence—was still waiting for me.", "The real, life-threatening collapse of my body was still waiting for me.", "bio2: preserve direct life-threatening intensity")
replace_once(P, '<li><a href="#crash-75">Tinnitus Back to 75%</a></li>', '<li><a href="#crash-75">The Crash Back to 75%</a></li>', "bio2: retain crash character in table of contents")
replace_once(P, "The Decision to Put It to the Test (The Experiment)", "The Decision to Run the Stress Test (The Experiment)", "bio2: preserve stress-test character in chapter heading")
replace_once(P, "Some time later, two things came together.", "Several years after recovering from CFS, two things came together.", "bio2: restore multi-year interval before deliberate provocation")
replace_once(P, "I had beaten CFS, I was working again, I was fully engaged in life, and I was back in the swing of things.", "My recovery from CFS was already several years behind me, I was working again, I was fully engaged in life, and I was back in the swing of things.", "bio2: restore multi-year interval in life-hunger paragraph")
old_model = """(My explanation at the time: Why did the repair and rebuilding work this time even WITHOUT the bitter amino acid powder I had needed the first time? To me at the time, the answer was a brilliant bit of systems biology. When I first had tinnitus, I had been suffering from severe chronic gastritis. Back then, I could not break down proteins from normal food, so I had to supplement with pure, predigested amino acids. But now, years later? Restoring my gut health had brought my digestion back to perfect working order. I believed my healthy gastrointestinal tract could easily extract the amino acids needed for the myelin sheath from my normal diet. Today, I see cellular energy (ATP) as the main driver of cellular repair, with a particular focus on hair cells, their stereocilia, and cell membranes. I still think involvement of the auditory nerve or myelin is possible, but I cannot prove it in my case. Lecithin’s role also remains an open question: it may have supported cell membranes and other phospholipid-dependent repair processes, or choline from lecithin could have served as a building block for acetylcholine and in that way supported the parasympathetic nervous system, deep sleep, and regeneration—or several of these pathways may have mattered at once.)"""
new_model = """(My biological explanation at the time was this: Why did the rebuilding process I assumed work this time even WITHOUT the bitter amino acid powder I had needed the first time? When I first had tinnitus, I had been suffering from severe chronic gastritis. Back then, I could not break down proteins from normal food, so I had to supplement with pure, predigested amino acids. With my second episode of tinnitus, years later, my digestion had recovered after I restored my gut health. So at the time, I assumed that my gastrointestinal tract could provide the amino acids I needed from normal food on its own. Today, I focus on the stereocilia and cell membranes. Whether the auditory nerve or myelin was involved in my episodes, I cannot say for certain.)"""
replace_once(P, old_model, new_model, "bio2: remove unauthorized medical mini-treatise and restore source scope")
replace_once(P, "From the point when I restarted the stack after the 75% peak, the recovery process took roughly three to four months.", "The recovery process was gradual and took roughly three to four months.", "bio2: remove locally unlicensed recovery start anchor")
old_evidence = """But that is exactly why I am putting all my cards on the table here. This is not a made-up recovery story; it is not a marketing gimmick, and it certainly is not unfounded mysticism. This is a cold, hard truth of physics and cell biology. I have every single piece of physical evidence of this hell and this recovery: my medical audiograms with the massive dips at specific frequencies, the lab reports, the diagnoses, and the invoices from clinics and therapists."""
new_evidence = """But that is exactly why I am putting all my cards on the table here. This is not a made-up recovery story; it is not a marketing gimmick, and it certainly is not unfounded mysticism. This is a cold, hard truth of physics and cell biology. I am openly putting the physical evidence that does exist on the table: the medical audiograms showing the frequency dips document only my first episode of tinnitus; there is no audiogram from the second episode. In addition, there are the laboratory reports, diagnoses, and invoices from clinics and therapists."""
replace_once(P, old_evidence, new_evidence, "bio2: restore exact audiogram scope and remove total-evidence claim")

P = "en/noise-induced-tinnitus.html"
set_manifest(P)
add_hreflangs(P, {"ja": "/ja/laermbedingter-tinnitus", "ko": "/ko/laermbedingter-tinnitus", "id": "/id/tinnitus-akibat-kebisingan"})
add_static_menu_languages(P, {"ja": "/ja/laermbedingter-tinnitus", "ko": "/ko/laermbedingter-tinnitus", "id": "/id/tinnitus-akibat-kebisingan", "hi": "/hi/laermbedingter-tinnitus"})
replace_once(P, '<div class="eyebrow">Causes · Noise</div>', '<div class="eyebrow">Causes · noise</div>', "noise: apply sentence case to eyebrow")
replace_once(P, "Last updated: June 2026", "Last updated: September 2026", "noise: update visible content date after synchronization")
old_right_1 = """What I experienced back then was mainly a loud, piercing, high-frequency tone in my left ear, accompanied by a rushing sound far in the background. It was the worst thing I could imagine at that point. At first, I did not consciously perceive any tinnitus in my right ear. A faint tone may already have been below my perception threshold or masked by the much louder tone on the left—but I cannot say for certain."""
new_right_1 = """What I experienced back then was mainly a loud, piercing, high-frequency tone in my left ear, accompanied by a rushing sound far in the background. It was the worst thing I could imagine at that point. My right ear was already strained too: I had pressure and other symptoms there, but no tinnitus was perceptible on that side at the time."""
replace_once(P, old_right_1, new_right_1, "noise: remove invented hidden right-ear tone and restore pre-existing strain")
old_right_2 = """Those “instructions” essentially amounted to masking the tone with more sound—for example, by listening to music through headphones at a higher volume or by playing noise continuously. In reality, however, that meant my ears were being exposed to even more sound even though they were already massively overloaded. Looking back, that was one of my biggest mistakes, because it made my condition worse. After that further sound exposure, tinnitus in my right ear became clearly perceptible for the first time. I cannot say whether the exposure caused a completely new right-side tone or brought a previously masked or subthreshold tone into the foreground."""
new_right_2 = """Those “instructions” essentially amounted to masking the tone with more sound—for example, by listening to music through headphones at a higher volume or by playing noise continuously. In reality, however, that meant my ears were being exposed to even more sound even though they were already massively overloaded. Looking back, that was one of my biggest mistakes, because it made my condition worse. A few days after that further sound exposure, I perceived tinnitus in my right ear for the first time. My retrospective view is that the additional sound pushed an already strained right ear past the point at which the tinnitus became perceptible there; this is my personal interpretation, not an objectively proven causal mechanism."""
replace_once(P, old_right_2, new_right_2, "noise: restore right-ear chronology and personal interpretation boundary")
terms_paragraph = """<p>Before we dive in, here is a quick clarification of terms so that we understand one another correctly throughout this page: the inner ear contains what are known as <strong>hair cells</strong>—the actual sensory cells for hearing. On the surface of each individual hair cell is a bundle of tiny, finger-like projections—the <strong>stereocilia</strong>. Depending on its position in the cochlea, each hair cell has about 50–300 of them, arranged in rows from short to long like organ pipes. Each individual stereocilium has its own internal support framework made of actin proteins. In everyday language and in research, these stereocilia are often simply called “hairs” or “sensory hairs”—and that is exactly how I use the term on this page. The important point is this: when I speak of “hairs,” I always mean the stereocilia on the hair cell, not the hair cell itself.</p>"""
terms_with_clarification = terms_paragraph + """
  <p><strong>Important for the signal chain:</strong> When I describe the release of glutamate at the synapse and the signal sent along the auditory nerve, I am specifically referring to the <strong>inner hair cell</strong>.</p>"""
replace_once(P, terms_paragraph, terms_with_clarification, "noise: restore explicit inner-hair-cell signal clarification")
replace_once(P, "This influx of potassium changes the hair cell’s electrical voltage (depolarization). This, in turn, opens calcium channels farther down in the hair cell itself—not in the sensory hairs, but in the cell body below.", "This influx of potassium changes the inner hair cell’s electrical voltage (depolarization). This, in turn, opens calcium channels farther down in the inner hair cell itself—not in the sensory hairs, but in the cell body below.", "noise: name the inner hair cell in activation step")
old_callout = """Before we look at what happens when this system is overloaded, there is one important point to consider: when chronic tinnitus develops after noise trauma, many people affected by it think—and many doctors give the same impression—that the hair cells in the ear have been irreversibly destroyed and the brain now produces the tone on its own from memory. I am convinced that this falls short. A dead inner hair cell no longer sends a signal—it is silent. Precisely because the tone IS THERE, the inner hair cell must still be alive. Tinnitus is not the sign of a dead inner hair cell but the sign of an inner hair cell locked in a fight for survival. Some individual hair cells may indeed be permanently lost as a result of noise damage—but as I understand it, they play no role in the tinnitus process, because no signal comes from them anymore. The tone comes from the inner hair cells that are still there and fighting—and they are stuck in a state of energy-related dysfunction."""
new_callout = """Before we look at what happens when this system is overloaded, there is one important point to consider: when chronic tinnitus develops after noise trauma, many people affected by it think—and many doctors give the same impression—that the hair cells in the ear have been irreversibly destroyed and the brain now produces the tone on its own from memory. I am convinced that this falls short. Precisely because the tone IS THERE, an active false signal must, in my view, be arising somewhere in peripheral tissue that is still capable of excitation. In my main chain, this signal comes from a living but dysregulated inner hair cell. In other peripheral constellations, however, a living auditory nerve that is misfiring because of myelin problems or inflammation could also be the source. Completely dead tissue, by contrast, no longer sends a signal."""
replace_once(P, old_callout, new_callout, "noise: restore open peripheral-source model and dead-tissue boundary")
old_delay = """For most people affected, tinnitus begins relatively soon after the noise event—within minutes to a few hours. There are also cases, however, in which tinnitus does not appear until hours or even days later. I explain in detail in the FAQ section why the timing can vary so much and what role certain structures in the ear play."""
new_delay = """Tinnitus can become consciously noticeable immediately, hours later, or even days after the noise event. In my case, the tone in my left ear did not become consciously noticeable until day 3. To this day, I cannot say for certain why. In the FAQ section, I discuss possible explanations for this timing and the role certain structures in the ear may play—but these remain hypotheses."""
replace_once(P, old_delay, new_delay, "noise: remove unsupported majority claim and restore Day-3 uncertainty")
replace_all(P, '<span class="stage-preview-title">Energy Collapse</span>', '<span class="stage-preview-title">Energy collapse</span>', 1, "noise: stage-preview sentence case 1")
replace_all(P, '<span class="stage-preview-title">Mechanical Collapse</span>', '<span class="stage-preview-title">Mechanical collapse</span>', 1, "noise: stage-preview sentence case 2")
replace_all(P, '<span class="stage-preview-title">Emergency Rescue &amp; Hamster Wheel</span>', '<span class="stage-preview-title">Emergency rescue &amp; hamster wheel</span>', 1, "noise: stage-preview sentence case 3")
replace_all(P, '<div class="stage-title">Energy Collapse</div>', '<div class="stage-title">Energy collapse</div>', 1, "noise: recap sentence case 1")
replace_all(P, '<div class="stage-title">Mechanical Collapse</div>', '<div class="stage-title">Mechanical collapse</div>', 1, "noise: recap sentence case 2")
replace_all(P, '<div class="stage-title">Emergency Rescue &amp; Hamster Wheel</div>', '<div class="stage-title">Emergency rescue &amp; hamster wheel</div>', 1, "noise: recap sentence case 3")
old_conclusion = """I am convinced that this is what chronic noise-induced tinnitus really is physiologically: a living inner hair cell trapped in an energy-related emergency mode, with its repair process largely frozen in Phase 1 because it lacks the energy for Phase 2. The ear is not “broken,” and the brain is not imagining a phantom signal. The tone is the result of a real, peripheral fight for survival that the brain merely amplifies."""
new_conclusion = """In my main model, chronic noise-induced tinnitus is an active false signal arising from peripheral tissue that is still capable of excitation. For my own episodes, I suspect the main source was living inner hair cells trapped in an energy-related emergency mode; I still consider involvement of the auditory nerve or myelin possible, but I cannot establish it with certainty in my own case. The brain does not create the tone out of complete signal silence; it amplifies the false signal that is already there."""
replace_once(P, old_conclusion, new_conclusion, "noise: restore bounded conclusion and remove ear-not-broken addition")
old_faq = """For anyone who would like to go deeper, the <a href="/en/faq">FAQ section</a> covers more fascinating questions about noise-induced tinnitus—for example, why its volume can fluctuate, why it briefly becomes quieter when it is masked, and why it becomes louder again shortly afterward. These everyday phenomena are explained there in clear language—based on the same physiological mechanisms described here."""
new_faq = """For anyone who would like to go deeper, I will cover more questions about noise-induced tinnitus in the <a href="/en/faq">FAQ section</a>—for example, why its volume can fluctuate, why it briefly becomes quieter when it is masked, and why it becomes louder again shortly afterward. I am currently building the FAQ page step by step."""
replace_once(P, old_faq, new_faq, "noise: restore FAQ future and build status")
replace_once(P, "If you have tinnitus or hearing problems, especially if they came on suddenly, please see an ENT doctor to rule out organic causes.", "If you have tinnitus or hearing problems, especially if the symptoms are acute or have appeared recently, please see an ENT doctor to have organic causes checked.", "noise: preserve acute warning scope and neutral diagnostic wording")

for path, text in TEXTS.items():
    if '<html lang="en">' not in text:
        raise RuntimeError(f"{path}: missing English html language marker")
    if '<link rel="manifest" href="/en/site.webmanifest">' not in text:
        raise RuntimeError(f"{path}: English PWA manifest not linked")
    if text.count("<html") != 1 or text.count("</html>") != 1:
        raise RuntimeError(f"{path}: malformed html boundary")
    if text.count("<body") != 1 or text.count("</body>") != 1:
        raise RuntimeError(f"{path}: malformed body boundary")

bio2 = load("en/my-story-part-2.html")
assert "every single piece of physical evidence" not in bio2
assert "there is no audiogram from the second episode" in bio2
assert "a brilliant bit of systems biology" not in bio2
assert "several years behind me" in bio2
assert "The recovery process was gradual" in bio2

noise = load("en/noise-induced-tinnitus.html")
assert "subthreshold" not in noise
assert "may already have been below my perception threshold" not in noise
assert "Important for the signal chain" in noise
assert "For most people affected" not in noise
assert "The ear is not “broken”" not in noise
assert "I am currently building the FAQ page step by step." in noise
assert "Last updated: September 2026" in noise

for path, text in TEXTS.items():
    (ROOT / path).write_text(text, encoding="utf-8")

print(f"Applied {len(CHANGES)} controlled changes:")
for change in CHANGES:
    print(f" - {change}")