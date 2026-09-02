from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
PATH = "en/stress-related-tinnitus.html"
FILE = ROOT / PATH
text = FILE.read_text(encoding="utf-8")
changes: list[str] = []


def replace_once(old: str, new: str, label: str) -> None:
    global text
    if old not in text:
        if new in text:
            print(f"ALREADY: {label}")
            return
        raise RuntimeError(f"{label}: expected old text not found: {old[:180]!r}")
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly 1 occurrence, found {count}")
    text = text.replace(old, new, 1)
    changes.append(label)


def replace_all(old: str, new: str, expected: int, label: str) -> None:
    global text
    count = text.count(old)
    if count == 0 and text.count(new) >= expected:
        print(f"ALREADY: {label}")
        return
    if count != expected:
        raise RuntimeError(f"{label}: expected {expected} occurrences, found {count}")
    text = text.replace(old, new)
    changes.append(label)


def add_hreflangs(routes: dict[str, str]) -> None:
    global text
    lines = []
    for code, route in routes.items():
        if f'hreflang="{code}"' not in text:
            lines.append(f'  <link rel="alternate" hreflang="{code}" href="https://tinnitusbioregulation.com{route}">')
    if not lines:
        return
    anchor = '  <link rel="alternate" hreflang="x-default"'
    idx = text.find(anchor)
    if idx < 0:
        raise RuntimeError("x-default hreflang anchor not found")
    text = text[:idx] + "\n".join(lines) + "\n" + text[idx:]
    changes.append("add static JA/KO/ID hreflang partners")


def add_static_menu_languages(routes: dict[str, str]) -> None:
    global text
    match = re.search(r'(<div class="lang-menu">\s*)(.*?)(\n\s*</div>)', text, flags=re.S)
    if not match:
        raise RuntimeError("language menu block not found")
    body = match.group(2)
    specs = [("JA", "ja", "日本語"), ("KO", "ko", "한국어"), ("ID", "id", "Bahasa Indonesia"), ("HI", "hi", "हिन्दी")]
    lines = []
    for display, lang, name in specs:
        if f'<span class="lang-code">{display}</span>' in body:
            continue
        lines.append(f'        <a href="{routes[lang]}" hreflang="{lang}"><span class="lang-code">{display}</span><span class="lang-name" lang="{lang}">{name}</span></a>')
    if not lines:
        return
    new_body = body.rstrip() + "\n" + "\n".join(lines)
    text = text[:match.start()] + match.group(1) + new_body + match.group(3) + text[match.end():]
    changes.append("add static JA/KO/ID/HI language-menu links")


replace_once('<link rel="manifest" href="/site.webmanifest">', '<link rel="manifest" href="/en/site.webmanifest">', "use English PWA manifest")
add_hreflangs({"ja": "/ja/stressbedingter-tinnitus", "ko": "/ko/stressbedingter-tinnitus", "id": "/id/tinnitus-akibat-stres"})
add_static_menu_languages({"ja": "/ja/stressbedingter-tinnitus", "ko": "/ko/stressbedingter-tinnitus", "id": "/id/tinnitus-akibat-stres", "hi": "/hi/stressbedingter-tinnitus"})

old_description = "Not all tinnitus comes from the ear. I explain how inner conflicts keep the nervous system under constant tension—and what helped me calm my nervous system."
new_description = "Not all tinnitus comes from the ear. I explain how inner conflicts keep the nervous system under constant tension—and how fully resolving those conflicts during my CFS and psychosomatic phase brought my autonomic nervous system back into balance."
replace_all(old_description, new_description, 4, "restore complete SEO and Article description")

old_person = "Someone with firsthand experience of tinnitus who independently publishes his own work. He has completely overcome chronic, noise-induced tinnitus on two separate occasions—the first recovery documented by audiometry—and has also recovered from a severe case of chronic fatigue syndrome (CFS). He has also experienced firsthand just how much persistent inner stress and unresolved conflicts can strain the nervous system—and how targeted work on those conflicts helped him bring his autonomic nervous system back into balance. He is not a doctor and shares only his personal experience and information he has researched."
new_person = "Someone with firsthand experience of tinnitus who independently publishes his own work. He has completely overcome two separate episodes of chronic, noise-induced tinnitus—the improvement during the first episode is documented by several audiograms—and has also recovered from a severe case of chronic fatigue syndrome (CFS). He has also experienced firsthand just how much persistent inner stress and unresolved conflicts can strain the nervous system—and how targeted work on those conflicts helped him fully resolve them during his CFS and psychosomatic phase and bring his autonomic nervous system back into balance. He is not a doctor and shares only his personal experience and information he has researched."
replace_once(old_person, new_person, "restore Person JSON-LD evidence and conflict-resolution scope")

replace_once('<div class="eyebrow">Causes · Stress</div>', '<div class="eyebrow">Causes · stress</div>', "apply sentence case to page eyebrow")
replace_once("Last updated: June 2026", "Last updated: September 2026", "update visible content date")
replace_once(
    'This is <strong>my own explanation</strong>, based on years of research and my personal experience with a severe state of exhaustion and nervous-system distress that I overcame by working through conflicts—not a standard medical explanation.',
    'This is <strong>my own explanation</strong>, based on years of research and my personal experience with a severe state of exhaustion and nervous-system distress during my CFS and psychosomatic phase, which I overcame through conflict work—not on personal experience of stress-induced tinnitus, and not a standard medical explanation.',
    "restore CFS/psychosomatic context and no-own-stress-tinnitus boundary in lede",
)
replace_once(
    'If you have tinnitus or hearing problems, especially if they came on suddenly, please see an ENT doctor to rule out organic causes.',
    'If you have tinnitus or hearing problems, especially if the symptoms are acute or have appeared recently, please see an ENT doctor to have organic causes checked.',
    "preserve acute warning scope in opening warning",
)
replace_once(
    'It was his work that helped me gradually resolve these deep-seated inner tensions. And that personal experience is exactly why I am writing this article—not because I am quoting a medical textbook, but because I felt firsthand just how much inner pressure exists in the nervous system without a person being aware of it in everyday life.',
    'It was his work that helped me enormously to fully resolve the conflicts of my CFS and psychosomatic phase and bring my autonomic nervous system back into balance. And that personal experience is exactly why I am writing this article—not because I am quoting a medical textbook, but because I felt firsthand just how much inner pressure exists in the nervous system without a person being aware of it in everyday life.',
    "restore full personal result of Prgomet work in opening",
)
replace_once(
    'Today I can say this: Stress-induced tinnitus is neither a mystery nor imaginary. It is the audible result of a persistent electrical state in the brain, triggered by conflicts that were never truly resolved. Once people understand what is happening, they also understand why the sound is there—and what they themselves can do.',
    'According to my explanatory model, stress-induced tinnitus can arise when an unresolved emotional conflict sustains a persistently overactive central conflict focus and co-activates auditory-processing pathways. This is my synthesis of Prgomet’s and Klinghardt’s approaches, cases involving other people, and my own research—not something imaginary.',
    "restore model status, causal chain, provenance, and remove added self-help claim",
)
replace_once('The Scientific Proof: Electricity Produces Sound Perceptions', 'What Electrical Brain Stimulation Can Show', "correct evidence-strength heading in table of contents")

old_summary = 'My explanatory model: If an emotional conflict is not truly processed, the affected area of the brain can remain active in the unconscious. Under this model, a sustained voltage builds up there, comparable to the buildup of static charge on a Van de Graaff sphere. According to the idea, this energy can look for an outlet and discharge onto neighboring neural pathways. If auditory-processing nerve centers are involved, this model says persistent tinnitus can result. Penfield’s brain-stimulation experiments showed as early as the 1950s that electrical stimulation of certain areas of the brain <em>can trigger perceptions of sound</em>.'
new_summary = 'My explanatory model: If an emotional conflict is not truly processed, the affected area of the brain can remain active outside conscious awareness. Under this model, a sustained electrical potential builds up there, comparable to the static charge on a Van de Graaff sphere. According to this idea, that energy can seek an outlet and discharge onto neighboring neural pathways. If auditory-processing pathways are involved, this can, under my model and according to the cases and experience reports from Prgomet’s practice that I have seen and heard, result in persistent tinnitus. Penfield and Perot reported in 1963 that electrical cortical stimulation produced auditory experiences without an external sound source in some patients. This supports only that narrow point, not the full conflict-to-tinnitus chain.'
replace_once(old_summary, new_summary, "restore cases, Penfield and Perot, 1963, and narrow evidence limit in summary")
replace_once(
    '<strong>My personal impression from my own psychosomatic experience:</strong> If an underlying conflict can be resolved, the tension field loses its primary energy source. A stable body (sleep, B vitamins, minerals) can support this process.',
    '<strong>My personal impression from my CFS and psychosomatic phase:</strong> If an underlying conflict can be resolved, the tension field loses its most important energy source. A stable body (sleep, B vitamins, minerals) can support this process.',
    "restore CFS context in summary",
)

old_meg = 'Many people know that the brain works with electricity. But in everyday life, hardly anyone thinks about how this electrical activity relates to phenomena such as tinnitus. Yet this knowledge is by no means new: Back in the 1990s, researchers at specialized epilepsy centers used exceptionally rare, highly sophisticated instruments (such as so-called MEG scanners) to visualize exactly that: Measurements there clearly show active tension fields in certain regions of the brain when unresolved conflicts are present.'
new_meg = 'The idea of small local voltage and field effects comes from the approaches of Michael Prgomet and Dr. Klinghardt, which I combine with my own research. I am not claiming direct MEG evidence for the complete chain “unresolved conflict → local tension field → tinnitus.”'
replace_once(old_meg, new_meg, "remove invented direct MEG proof and restore model provenance")
replace_once(
    'One expert who has spent more than 30 years working intensively with precisely these mechanisms as a practitioner and lecturer is Michael Prgomet. I mention him here for a reason: In 2013, psychosomatic stress overstimulated my own nervous system so severely that I suffered from extreme physical problems in everyday life—including severe CFS symptoms (chronic fatigue syndrome). It was his work that helped me resolve these deep-seated tensions back then.',
    'One expert who has spent more than 30 years working intensively with precisely these mechanisms as a practitioner and lecturer is Michael Prgomet. I mention him here for a reason: In 2013, psychosomatic stress overstimulated my own nervous system so severely that I suffered from extreme physical problems in everyday life—including severe CFS symptoms (chronic fatigue syndrome). His work helped me enormously to fully resolve these deep-seated conflicts and bring my autonomic nervous system back into balance.',
    "restore personal result in Prgomet expert paragraph",
)
old_provenance = 'That is why I am sharing his approach to tinnitus originating in the brain here. My own very positive experience was with his method during my psychosomatic phase—not with stress-induced tinnitus itself. Its application to stress-induced tinnitus comes from Prgomet’s practical experience and the model described here. He refers to these phenomena as <strong>electrostatic tension fields</strong>: overactive, autonomous nerve centers that constantly draw current like small islands of energy and send electrical stimuli into neural pathways. Depending on which pathways are affected, this manifests as completely different symptoms throughout the body—from the stomach to the ear. This is not a general recommendation—I am sharing what personally helped me in that context, together with what I learned from his practice and my own research.'
new_provenance = 'That is why I am also presenting his approach to tinnitus originating in the brain here. My own very positive experience with his work concerns the complete resolution of my conflicts during my CFS and psychosomatic phase—not the treatment of stress-induced tinnitus in myself. The tinnitus-related statements are based on cases and experience reports from his practice that I have seen and heard, his decades of practical experience, and my own research and synthesis. He refers to these phenomena as <strong>electrostatic tension fields</strong>: overactive, autonomous nerve centers that constantly draw current like small islands of energy and send electrical stimuli into neural pathways. Depending on which pathways are affected, this manifests as completely different symptoms throughout the body—from the stomach to the ear. This is not a general recommendation, but a presentation of my model and the experiential basis just described.'
replace_once(old_provenance, new_provenance, "restore complete experiential provenance and personal scope")
old_context = '<strong>Important context:</strong> Both of my tinnitus episodes were entirely noise-induced; stress was neither a cause nor a component. I have never had stress-induced tinnitus myself and have no firsthand experience of its sound. I am sharing a model here that is based on Prgomet’s decades of practical experience, my own experience with the method (during my CFS/psychosomatic phase), and intensive research.'
new_context = '<strong>Important context:</strong> Both of my tinnitus episodes were noise-induced. I had neither stress-induced tinnitus nor a stress component in either episode. My own experience with Prgomet’s method is limited to my CFS and psychosomatic phase in 2013. The tinnitus model I share here is based on the cases and experience reports from his practice that I have seen and heard, Prgomet’s decades of practical experience, and my own research and synthesis.'
replace_once(old_context, new_context, "restore cases, reports, and synthesis in important context")

old_field = '<strong>Fourth, through small electrical field effects.</strong> When many nerve cells in a small area are active simultaneously and in sync, local electrical fields form. These fields are small—but they are real, and they can actually push neighboring cells past the threshold, causing those cells to fire too.'
new_field = '<strong>Fourth, through small electrical field effects.</strong> In the part of my model adopted from Michael Prgomet and Dr. Klinghardt, small, real local field and charge effects play a role. According to this idea, synchronously active nerve cells can also stimulate neighboring cells. This is an attributed model assumption, not a process directly measured in stress-induced tinnitus.'
replace_once(old_field, new_field, "restore attribution and model status of electrical field effects")
old_analogy = 'This electrical mechanism can be pictured roughly as a small Van de Graaff sphere in the nervous system (of course, only as an analogy—the actual voltages are much lower than in a real high-voltage sphere, but the operating principle is the same): As long as the conflict is only mildly active, not much happens. But when a trigger is added—or several factors come together, such as lack of sleep, exhaustion, and intense inner tension—the field charges up further. At some point, the voltage is high enough, and it discharges like a small bolt of lightning onto a neighboring, sensitive neural pathway. That pathway then fires as well.'
new_analogy = 'In this model, the Van de Graaff sphere and the “small bolt of lightning” illustrate an assumed small physical process—not high voltage, not a visible spark, and not a process directly measured in stress-induced tinnitus. If a trigger is added, or if factors such as lack of sleep, exhaustion, and intense inner tension act together, the assumed field can become stronger and, under this model, stimulate a neighboring, sensitive neural pathway.'
replace_once(old_analogy, new_analogy, "restore bounded Van de Graaff analogy")
replace_once('The Scientific Proof: Electrical Stimulation Produces Sound Perceptions', 'What Electrical Brain Stimulation Can Show', "correct evidence-strength section heading")
old_history_1 = 'As early as the 1950s, researchers such as Wilder Penfield in Montreal conducted experiments in which patients’ brains were electrically stimulated. Many of them heard tones, music, or voices even though no acoustic source was present. These experiments provided proof: When certain areas of the brain or auditory nerves are electrically stimulated, a tone is perceived—even without an acoustic source.'
new_history_1 = 'Penfield and Perot reported in 1963 that electrical cortical stimulation produced auditory experiences without an external sound source in some patients. This supports the narrow point that electrical brain stimulation can trigger sound perceptions. It proves neither an unresolved conflict focus nor the assumed field-and-discharge pathway.'
replace_once(old_history_1, new_history_1, "restore historical evidence facts and narrow scope")
old_history_2 = 'This exact principle also applies to stress-induced tinnitus. The only difference is that here the stimulation is triggered not externally by electrodes, but internally by persistent electrical activity resulting from unresolved conflicts.'
new_history_2 = 'The transfer to stress-induced tinnitus is part of my explanatory model, not direct experimental proof. In this model, the stimulation comes not from external electrodes but from persistent central activity associated with unresolved conflicts.'
replace_once(old_history_2, new_history_2, "restore model boundary for transfer to stress-induced tinnitus")

external_stress = '<p>Many people automatically associate stress with external pressures—such as work, family, or everyday life. But this situational stress is usually not the cause of this type of tinnitus. The crucial factor is the <strong>internal, stored stress</strong> that persists in the nervous system because of unresolved emotional conflicts and continually generates electrical activity.</p>'
hpa = external_stress + '\n\n  <p><strong>Important distinction:</strong> General HPA-axis/cortisol stress is not a second direct route to stress-induced tinnitus. Through sympathetic activation, chronic stress can reduce cochlear microcirculation and constrict blood vessels in the region of the stria vascularis. This can make the inner ear more vulnerable to noise, infections, or other influences. It is a vulnerability pathway, not an independent source of the tone. It did not play a causal role in either of my episodes.</p>'
replace_once(external_stress, hpa, "restore HPA/cortisol vulnerability distinction")

replace_once('aria-label="Sketch: a charged brain region as a Van de Graaff sphere that discharges like lightning onto a neighboring neural pathway (auditory nerve)."', 'aria-label="Sketch of my explanatory model: a charged brain region, pictured as a Van de Graaff sphere, can discharge onto a neighboring auditory-processing pathway."', "correct SVG ARIA referent and model qualification")
replace_once('>Auditory nerve</text>', '>Auditory pathway</text>', "correct visible SVG pathway label")
replace_once('<div class="stage-title">Discharge onto the auditory nerve</div>', '<div class="stage-title">Discharge onto an auditory-processing pathway</div>', "correct recap pathway referent")
replace_once(
    'A crucial clue is duration: If a symptom persists even without acute stress, chronic abnormal electrical activity is usually present in the nervous system.',
    'The fact that a symptom persists even without acute stress does not, by itself, demonstrate any particular cause; within this model, persistent abnormal central activity may be one possible explanation.',
    "restore non-diagnostic duration boundary",
)
old_filter = 'The primary focus should be on reducing inner conflicts as much as possible or resolving them completely, thereby reducing the underlying stress-induced tinnitus. How far this succeeds in any given case is highly individual and depends on many factors. In my case, during my CFS/psychosomatic phase, this path helped me largely resolve deep-seated inner tensions; I did not have stress-induced tinnitus myself. But it is equally important for the body itself to be in a stable state, because it forms the foundation on which these psychological processes take place. An exhausted or unbalanced nervous system responds more strongly to inner tensions, while a well-supplied body can regulate them better.'
new_filter = 'The primary focus should be on reducing inner conflicts as much as possible or resolving them completely, thereby reducing the underlying stress-induced tinnitus. How far this succeeds in any given case is highly individual and depends on many factors. In my case, this path fully resolved the deep-seated conflicts of my CFS and psychosomatic phase and brought my autonomic nervous system back into balance; there was no stress component to my tinnitus. For the central stress-tinnitus pathway, conflict work remains the main lever in this model; sleep, adequate nourishment, and physical stability can support the process. An exhausted or unbalanced nervous system responds more strongly to inner tension, while a well-supported body can regulate it better.'
replace_once(old_filter, new_filter, "restore full personal result and main-lever hierarchy")
replace_once(
    'When it comes to tinnitus, the thalamus is—in my experience and opinion—not an on/off switch. It therefore does not simply turn tinnitus off, but, in my estimation, it can soften it when the nervous system has enough energy.',
    'When it comes to tinnitus, the thalamus is—according to my model and assessment—not an on/off switch. It therefore does not simply turn tinnitus off, but, in my assessment, it can soften it when the nervous system has enough energy.',
    "restore model and assessment as statement source in thalamus note",
)
old_big_picture = 'Both main forms—inner-ear-related and stress-induced tinnitus—ultimately produce the same symptoms because they converge on the same endpoint: chronic overstimulation of the auditory nerves. In one, the cause is physical (for example excess calcium in the hair cells); in the other, it is emotional (abnormal electrical activity caused by inner conflicts).'
new_big_picture = 'According to my model, both main pathways end in excessive electrical activity in auditory-processing structures. In the inner-ear pathway, it comes from an active peripheral false signal; in the stress pathway, it comes from the central conflict focus.'
replace_once(old_big_picture, new_big_picture, "restore both causal pathways and shared endpoint")
old_callout = 'In summary: Stress-induced tinnitus is not imaginary, but a real neurophysiological process. The source of the stimulus lies in the brain—triggered by unresolved emotional tensions and intensified by lack of energy, sleep deficits, and nutrient deficiencies.'
new_callout = 'In summary: Stress-induced tinnitus is not imaginary but, according to my model, a real neurophysiological process. The central source is an unresolved emotional conflict focus in the brain that co-activates auditory-processing pathways. Lack of energy, sleep deficits, and nutrient deficiencies can make the nervous system more vulnerable and intensify perception, but they are not the actual source of this tinnitus pathway.'
replace_once(old_callout, new_callout, "restore conflict focus, co-activation, vulnerability, and non-source boundary")
old_resolution = 'One possible path to improvement is to bring these conflicts into conscious awareness and resolve them at the root (for example with Michael Prgomet’s method). I followed this path with Prgomet’s method during my CFS/psychosomatic phase, not to treat stress-induced tinnitus in myself. According to my practitioner’s experience, no tension field like this simply arises out of nowhere. As a rule, for each of these unresolved conflicts, there is a very specific situation in the past that originally started this program. If this original situation is reprocessed in the nervous system—in other words, if the actual trigger is reprocessed—the brain can dial the persistent electrostatic current back down.'
new_resolution = 'One possible path to improvement under this model is to bring the underlying conflict into conscious awareness and resolve it at the root (for example with Michael Prgomet’s method). I followed this path during my CFS and psychosomatic phase, not to treat stress-induced tinnitus in myself. Prgomet calls this process <strong>conflict resolution</strong> or <strong>trauma resolution</strong>; in his approach, the actual reprocessing takes place predominantly during sleep and in dreams. According to his practical experience, no such tension field simply arises out of nowhere. As a rule, each unresolved conflict can be traced to a specific situation in the past that originally started this program. If this original situation is reprocessed in the nervous system—in other words, if the actual trigger is reprocessed—the brain can dial the persistent electrostatic current back down.'
replace_once(old_resolution, new_resolution, "restore Prgomet terminology and sleep/dream reprocessing")
old_action = 'On a separate page, I describe what can be done specifically to counter stress-induced tinnitus. There, I explain which steps I believe can be most effective in addressing these inner tension fields, based on methods my practitioner has used in his work with stress-induced tinnitus for more than 30 years. If the underlying emotional conflict is resolved, then, under this model, the electrical activity in the affected area can decrease—and, based on what my practitioner has seen in his practice, tinnitus can decrease with it, to varying degrees depending on the individual circumstances.'
new_action = 'On a separate page, I describe what can be done specifically to counter stress-induced tinnitus. There, I explain which steps I believe—and based on methods my practitioner has used in his practice with stress-induced tinnitus for more than 30 years—may be most effective in addressing these inner tension fields. If the underlying emotional conflict is resolved, then, under this model, the electrical activity in the affected area can decrease—and with it, according to the cases and experience reports from Prgomet’s practice that I have seen and heard, tinnitus can also decrease, to varying degrees depending on the individual circumstances.'
replace_once(old_action, new_action, "restore Dustin as source witness and full experiential basis before CTA")
replace_once('The conflict-work steps that helped me during my psychosomatic phase—a personal account.', 'My complete approach—with all steps and background.', "restore full CTA scope")
replace_once(
    'And of course, a few questions are bound to remain unanswered—so I created an <a href="/en/faq">FAQ subpage</a> where I answer the most common questions briefly and in plain language.',
    'And of course, a few questions are bound to remain unanswered—so I created an <a href="/en/faq">FAQ subpage</a> that I am currently building step by step.',
    "restore FAQ build status",
)
replace_once(
    'I write this article with all my heart and stand 100% behind the approaches discussed here: the conflict work that helped me with my own exhaustion and nervous-system problems, and the stress-tinnitus application described on the basis of my practitioner’s experience and my research. Since 2012, I have taught myself the general medical knowledge included here through literally thousands of hours of hard work and in-depth research. Even so, for legal reasons, I am required to make the following clear:',
    'I write this article with all my heart and stand 100% behind the approaches that have helped me and many others. Since 2012, I have taught myself the general medical knowledge included here through literally thousands of hours of hard work and in-depth research. Even so, for legal reasons, I am required to make the following clear:',
    "restore original personal scope in final disclaimer introduction",
)
replace_once(
    'If you have health problems, especially sudden-onset noises in your ears, please always consult a qualified doctor (for example an ENT doctor) first to have organic causes ruled out.',
    'If you have health problems, especially acute sounds in your ears, please always consult a qualified doctor (for example an ENT doctor) first to have organic causes checked.',
    "preserve acute warning scope in final disclaimer",
)

assert '<link rel="manifest" href="/en/site.webmanifest">' in text
assert 'The Scientific Proof' not in text
assert 'MEG scanners' not in text
assert 'Penfield and Perot reported in 1963' in text
assert 'not a process directly measured in stress-induced tinnitus' in text
assert 'It proves neither an unresolved conflict focus' in text
assert 'Important distinction:</strong> General HPA-axis/cortisol stress' in text
assert 'does not, by itself, demonstrate any particular cause' in text
assert 'Auditory nerve</text>' not in text
assert 'Discharge onto the auditory nerve' not in text
assert 'My complete approach—with all steps and background.' in text
assert 'currently building step by step' in text
assert text.count('<html') == 1 and text.count('</html>') == 1
assert text.count('<body') == 1 and text.count('</body>') == 1

FILE.write_text(text, encoding="utf-8")
print(f"Applied {len(changes)} controlled changes:")
for item in changes:
    print(f" - {item}")