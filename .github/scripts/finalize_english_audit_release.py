from __future__ import annotations

from pathlib import Path
import json
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


def add_document_attrs(path: str, href: str, source_id: str, alt: str, expected: int) -> None:
    text = load(path)
    pattern = re.compile(r'<a(?P<attrs>[^>]*\bhref="' + re.escape(href) + r'"[^>]*)>')
    matches = list(pattern.finditer(text))
    if len(matches) != expected:
        if text.count(f'data-lightbox-translation="#{source_id}"') == expected:
            return
        raise RuntimeError(f"{path}: expected {expected} anchors for {href}, found {len(matches)}")

    def repl(match: re.Match[str]) -> str:
        attrs = match.group("attrs")
        if "data-lightbox-translation=" in attrs:
            return match.group(0)
        return (
            '<a' + attrs.rstrip() +
            f' data-lightbox-alt="{alt}"'
            f' data-lightbox-translation="#{source_id}"'
            ' data-translation-show="View English translation"'
            ' data-translation-original="View German original">'
        )

    updated, count = pattern.subn(repl, text)
    if count != expected:
        raise RuntimeError(f"{path}: failed to update all anchors for {href}; updated {count}")
    set_text(path, updated)
    CHANGES.append(f"{path}: add English document translation controls for {source_id}")


P = "en/index.html"
replace_once(P, '<div class="eyebrow" style="margin-top:48px;">Medical Records and Test Results</div>', '<div class="eyebrow" style="margin-top:48px;">Medical records and test results</div>', "start: sentence case records eyebrow")
replace_once(P, '<h2 class="evidence-eyebrow">Documented Evidence</h2>', '<h2 class="evidence-eyebrow">Documented evidence</h2>', "start: sentence case evidence label")
replace_once(P, '<div class="compare-eyebrow">Later · Recovery Phase</div>', '<div class="compare-eyebrow">Later · recovery phase</div>', "start: sentence case recovery-phase label")
replace_once(P, '<div class="term-note-label">In Short: What Is ATP?</div>', '<div class="term-note-label">A quick explanation: What is ATP?</div>', "start: natural sentence-case ATP label")
replace_once(P, '<h3>ATP Value (0.37)</h3>', '<h3>ATP value (0.37)</h3>', "start: sentence case ATP value card")
replace_once(P, '<h3>In-Depth ATP Analysis</h3>', '<h3>In-depth ATP analysis</h3>', "start: sentence case ATP analysis card")
replace_once(P, '<h3>My Whole Story</h3>', '<h3>My whole story</h3>', "start: sentence case story subsection")
replace_once(P, '<h3>Noise-Induced Tinnitus</h3>', '<h3>Noise-induced tinnitus</h3>', "start: sentence case noise subsection")
replace_once(P, '<h3>Stress-Induced / Psychosomatic Tinnitus</h3>', '<h3>Stress-induced / psychosomatic tinnitus</h3>', "start: sentence case stress subsection")
replace_once(P, '<h3>Medication- and Toxin-Induced Tinnitus (Ototoxicity)</h3>', '<h3>Medication- and toxin-induced tinnitus (ototoxicity)</h3>', "start: sentence case medication subsection")
replace_once(P, '<div class="preview-block">\n    <h3>Stress-induced / psychosomatic tinnitus</h3>', '<div class="preview-block" data-nosnippet>\n    <h3>Stress-induced / psychosomatic tinnitus</h3>', "start: restore no-snippet protection on stress preview")
replace_once(P, 'On my <a href="/en/scientific-sources">sources page</a>, I’ve compiled detailed information about how hearing loss, audiometry, and tinnitus are connected.', 'On my <a href="/en/scientific-sources">sources page</a>, I’ve compiled detailed information on the relationships between hearing loss, audiometry, and tinnitus.', "start: restore source-page relationship wording")

add_document_attrs(P, "../img/audiometrie-1.webp", "tr-en-audiometrie-1", "Original German audiogram report dated September 2, 2011", 2)
add_document_attrs(P, "../img/audiometrie-2.webp", "tr-en-audiometrie-2", "Original German audiogram report from an ENT and sleep-medicine specialist", 1)
add_document_attrs(P, "../img/audiometrie-3.webp", "tr-en-audiometrie-3", "Original German pure-tone audiogram from the recovery course", 2)
add_document_attrs(P, "../img/atp-befund-1.webp", "tr-en-atp-befund-1", "Original German medical laboratory report for the ATP profile, page 1", 1)
add_document_attrs(P, "../img/atp-befund-2.webp", "tr-en-atp-befund-2", "Original German medical laboratory report for the ATP profile, page 2", 1)

translation_sources = r'''

  <div class="document-translation-sources" hidden aria-hidden="true">
    <section id="tr-en-audiometrie-1" class="translation-document" lang="en" aria-label="English transcription of the first audiogram report" data-source-asset="img/audiometrie-1.webp" data-source-sha256="fd27ae9590c3f7e519d6b124016e07a5569483a43c022595c66e22be3afe734b">
      <h3>Audiogram 1—transcription of the visible text</h3>
      <p><strong>Header:</strong> ENT group practice of Drs. med. Dieter and Markus <em>[the continuation on the right is cropped]</em>.</p>
      <p><strong>Patient:</strong> Mr. Mueller, Dustin; date of birth shown: October 18, 1987 (18.10.1987 in the original). Form labels: surname, first name, date of birth.</p>
      <p><strong>Examination date and time:</strong> September 2, 2011 (02.09.2011 in the original), 10:48 a.m. Label: examination date.</p>
      <p><strong>Information cropped at the right edge:</strong> “02.09…,” the fragment “Druckda…,” “(c) Ing.-Büro J. Nüß / AU…,” and the brand “AURITEC” are visible; the cropped continuations cannot be read from the file.</p>
      <div>
        <h4>Graph: right ear</h4>
        <p>Horizontal axis: “Frequency in kHz,” with an arrow pointing right. Printed marks as shown: .125; .250; .5; 1; 2; 3; 4; 6; 8; 10.</p>
        <p>Vertical axis: “Hearing level in dB,” with an arrow pointing down. Marks: −10; 0; 10; 20; 30; 40; 50; 60; 70; 80; 90; 100; 110; 120; 130.</p>
      </div>
      <p><strong>Text below the right-ear graph:</strong> “Right ear.” HV (hearing loss): 4% (Rö73); —% (Rö80).</p>
      <div>
        <h4>Graph: left ear</h4>
        <p>Horizontal axis: “Frequency in kHz,” with an arrow pointing right. Fully visible marks: .125; .250; .5; 1; 2; 3; 4; 6. <em>The rest of the axis lies beyond the right edge of the file; marks that are not visible are not reconstructed.</em></p>
        <p>Vertical axis: “Hearing level in dB,” with an arrow pointing down. Marks: −10; 0; 10; 20; 30; 40; 50; 60; 70; 80; 90; 100; 110; 120; 130.</p>
      </div>
      <p><strong>Text below the left-ear graph:</strong> HV (hearing loss): 5% (Rö73); —% (Rö80). “Linkes…” is legible in the original; the end of “Linkes Ohr” (“left ear”) is cropped.</p>
      <p><strong>Graphical data:</strong> The curves, circles, crosses, arrows, and other audiometric symbols do not contain an additional printed numerical table. They remain visually preserved in the original document and are not converted here into approximate values.</p>
    </section>

    <section id="tr-en-audiometrie-2" class="translation-document" lang="en" aria-label="English transcription of the second audiogram report" data-source-asset="img/audiometrie-2.webp" data-source-sha256="5ea7e1544fdb1a97a47a7bb5f7099b97f59f1f5368d51ece21a6e7d82af7c40e">
      <h3>Audiogram 2—transcription of the visible text</h3>
      <p><strong>Information at the top:</strong> first name: Dustin <em>[the beginning of the German label is cropped]</em>; “Born on”: October 18, 1987 (18.10.1987 in the original); “Remarks.” Only part of the “HNOZ…” logo is visible at the upper right.</p>
      <p><strong>Header on the left:</strong> “Right ear” <em>[the first letter of the German phrase is cropped, but the rest of the label is legible]</em>.</p>
      <p><strong>Form fields:</strong> “Air-conduction masking (LL in the original)”; “Bone-conduction masking (KL in the original)”; “SISI.”</p>
      <p><strong>Professional stamp:</strong> “Specialist in ear, nose, and throat medicine”; “Sleep medicine”; “Affiliated physician at Betha… hospital” <em>[the continuation of the hospital name is cropped]</em>.</p>
      <div>
        <h4>Scales on both graphs</h4>
        <p>Horizontal axis printed on both graphs: 0.125; 0.25; 0.5; 1.00; 2.00; 4.00; 8.00 kHz. On the graph at left, the 0.125 mark is partly cropped; the other marks are legible.</p>
        <p>Vertical axis fully legible on the graph at right: −10; 0; 10; 20; 30; 40; 50; 60; 70; 80; 90; 100; 110; 120; 130 dB. The equivalent labels on the graph at left are cropped by the left edge and are not reconstructed from fragments.</p>
      </div>
      <p><strong>Central labels:</strong> “right”; “center”; “left”; “Rinne” (shown in the original as “re.”; “med.”; “li.”; “Rinne”).</p>
      <p><strong>Assessment at the lower center:</strong> “Roeser (1980)”; value on the left: 0; value on the right: 0.</p>
      <p><strong>Graphical data:</strong> The circles and crosses form the audiometric curves. The form does not print a numerical table beside them; to avoid invented values, they remain graphical information in the original image.</p>
      <p><strong>Scan limits:</strong> The left edge crops parts of a field name, the “Right ear” label, the first frequency mark, and the left vertical scale; the right edge crops the hospital name and other parts of the form. No continuation beyond those edges is legible.</p>
    </section>

    <section id="tr-en-audiometrie-3" class="translation-document" lang="en" aria-label="English transcription of the third audiogram report" data-source-asset="img/audiometrie-3.webp" data-source-sha256="bfe130286f76e09c4437da0086cb0286339e11507b6528607a625fbf3c933a64">
      <h3>Audiogram 3—pure-tone audiogram</h3>
      <p><strong>Document title:</strong> “Pure-tone audiogram.”</p>
      <div>
        <h4>Right ear</h4>
        <p>Horizontal axis: 125; 250; 500; 750; 1k; 1.5k; 2k; 3k; 4k; 6k; 8k. Vertical axis: dB HL, with marks −10; 0; 10; 20; 30; 40; 50; 60; 70; 80; 90; 100; 110; 120.</p>
      </div>
      <p><strong>Tinnitus [Hz], right ear:</strong> 1060.</p>
      <div>
        <p><strong>Right-ear table—columns:</strong> 125; 250; 500; 750; 1k; 1.5k; 2k; 3k; 4k; 6k; 8k.</p>
        <p><strong>LL (air conduction):</strong> 125: no value; 250: 10; 500: 10; 750: no value; 1k: 5; 1.5k: no value; 2k: 5; 3k: no value; 4k: 5; 6k: no value; 8k: −5.</p>
      </div>
      <div>
        <h4>Left ear</h4>
        <p>Horizontal axis: 125; 250; 500; 750; 1k; 1.5k; 2k; 3k; 4k; 6k; 8k. Vertical axis: dB HL, with marks −10; 0; 10; 20; 30; 40; 50; 60; 70; 80; 90; 100; 110; 120.</p>
      </div>
      <p><strong>Tinnitus [Hz], left ear:</strong> 8000.</p>
      <div>
        <p><strong>Left-ear table—columns:</strong> 125; 250; 500; 750; 1k; 1.5k; 2k; 3k; 4k; 6k; 8k.</p>
        <p><strong>LL (air conduction):</strong> 125: no value; 250: 5; 500: 5; 750: no value; 1k: 5; 1.5k: no value; 2k: 5; 3k: no value; 4k: 15; 6k: no value; 8k: 15.</p>
      </div>
      <p><strong>Other visible rows:</strong> “KL” (bone conduction), “FF” (sound field), and the beginning of “SISI.” In the visible section, they contain no numerical values. The lower continuation of the table is cropped.</p>
      <p><strong>Graphical data:</strong> The lines, circles, crosses, and dashed strokes remain preserved in the original image. Explicitly printed values are listed above; unlabeled strokes are not converted into approximate values.</p>
    </section>

    <section id="tr-en-atp-befund-1" class="translation-document" lang="en" aria-label="English transcription of the first page of the ATP report" data-source-asset="img/atp-befund-1.webp" data-source-sha256="a01e46f32a2d7667c61c8cb1c9da905a2ed45a4f0f7ef51370260ffdf73db061">
      <h3>ATP profile—medical laboratory report, page 1</h3>
      <p><strong>Laboratory:</strong> MVZ Labor Dr. Kirkamm und Partner.</p>
      <p><strong>Patient:</strong> Müller, Dustin; born October 18, 1987 (18.10.1987 in the original).</p>
      <p><strong>Barcode:</strong> 41542384. <strong>Laboratory number:</strong> 1305290316.</p>
      <p><strong>Sample collected:</strong> May 28, 2013 (28.05.2013 in the original). <strong>Sample received:</strong> May 29, 2013 (29.05.2013 in the original), 08:36. <strong>Issued:</strong> May 29, 2013 (29.05.2013 in the original).</p>
      <p><strong>Practice:</strong> Dr. med. Peter; general practitioner; Dieselstr. 1. <em>No surname after “Peter” is legible in the document.</em></p>
      <p><strong>Document:</strong> “Medical laboratory report.” Final report, page 1 of 4.</p>
      <p><strong>Material required for the test:</strong> lithium-heparin blood; serum.</p>
      <p><strong>Accreditation:</strong> DAkkS—German Accreditation Body. Code: D-ML-13151-01-00.</p>
      <p><strong>Table headings:</strong> examination; result; previous value; reference range.</p>
      <p><strong>Section:</strong> Immunology.</p>
      <p><strong>ATP in granulocytes:</strong> 0.37 nmol/10⁶ cells. Reference range: &gt; 0.4. Scale note: &gt; 1.0, very good energy availability.</p>
      <p><strong>ATP in granulocytes (%):</strong> 100.0%. Printed reference value: 100.</p>
      <p><strong>ATP during blockade (%):</strong> 37.1%.</p>
      <p><strong>ATP after blockade (%):</strong> 22.6%.</p>
      <h4>Overall assessment</h4>
      <p><strong>Immunology summary:</strong> reduced ATP content, with suspected mitochondrial dysfunction.</p>
      <h4>Immunological diagnosis—interpretation of results</h4>
      <h5>ATP in granulocytes</h5>
      <p>The test result shows reduced intracellular ATP content, indicating limited mitochondrial energy availability.</p>
      <div>
        <p>Reduced ATP formation in the context of mitochondrial dysfunction can occur in the following situations:</p>
        <ul>
          <li>inadequate oxygen supply to tissue;</li>
          <li>CFS (chronic fatigue syndrome);</li>
          <li>fibromyalgia;</li>
          <li>nitrosative and oxidative stress;</li>
          <li>chronic inflammatory-degenerative diseases;</li>
          <li>active EBV infection;</li>
          <li>aging processes;</li>
          <li>lack of cofactors.</li>
        </ul>
      </div>
      <aside>
        <p>Reduced ATP formation in the context of mitochondrial dysfunction can occur primarily with aging processes and secondarily because of damage to mitochondrial membranes or an inadequate supply of supporting nutrients.</p>
      </aside>
      <div>
        <p><strong>Report footer:</strong> MVZ Dr. Kirkamm und Partner PartG.</p>
        <p>Tel.: +49 (0) 6131 - 7205-150. Fax: +49 (0) 6131 - 7205-100.</p>
        <p>Hans-Böckler-Straße 109-111, 55128 Mainz. info@ganzimmun.de. www.ganzimmun.de.</p>
      </div>
    </section>

    <section id="tr-en-atp-befund-2" class="translation-document" lang="en" aria-label="English transcription of the second page of the ATP report" data-source-asset="img/atp-befund-2.webp" data-source-sha256="1ec31fc6f92c7c8cb9cee67251e89b70131e46c2dd66494b8eff472a3b60cb33">
      <h3>ATP profile—medical laboratory report, page 2</h3>
      <p>Determining intracellular ATP provides insight into the current state of mitochondrial function. Granulocytes from peripheral blood are particularly suitable for determining intracellular ATP concentration because they contain a high proportion of mitochondria and are readily available as cellular material.</p>
      <p>Our body’s cells continuously perform chemical, osmotic, or mechanical work, for which energy must constantly be made available in a universal form. This is provided by ATP, the general energy carrier of living systems. ATP is present in every living cell, is formed mainly during oxidative phosphorylation at the inner mitochondrial membrane, and plays the central role in energy metabolism.</p>
      <p>Intracellular ATP concentration is carefully regulated and kept at a stable level in all cells. After intensive ATP consumption, increased energy demand, or inhibition of new ATP formation, ATP must be regenerated promptly.</p>
      <h4>ATP during blockade</h4>
      <p>Assessing the mitochondria’s ability to regenerate after exposure to a defined harmful agent provides deeper insight into mitochondrial function. For this purpose, the mitochondria are blocked with thiomersal, a toxic mercury compound, so that new ATP formation drops markedly.</p>
      <h4>ATP after blockade</h4>
      <p>The test assesses the ability of ATP synthesis to recover after the thiomersal blockade is removed. Intact cells can recover quickly and resume ATP production. Mitochondrial dysfunction appears as limited or insufficient recovery capacity.</p>
      <p>ATP production does not resume to the desired extent after the thiomersal blockade is removed. No recovery capacity of the cells is detectable (difference between ATP after blockade and ATP during blockade), which clearly indicates mitochondrial dysfunction. The mitochondrial stress test confirms mitochondrial dysfunction that had already appeared through the low ATP content in granulocytes.</p>
      <h4>Causes of reduced ATP availability</h4>
      <p>Maintaining mitochondrial function is directly linked to an optimal supply of cofactors that are essential for energy availability. NADH, a vitamin B3 derivative known as coenzyme 1, plays a special role. NADH formed in the citric acid cycle reacts with oxygen in the respiratory chain at the inner mitochondrial membranes and thereby contributes to mitochondrial energy production. It is one of the most important coenzymes in oxidation-reduction reactions and is therefore essential for ATP production. Major enzymes that use NADH as a cofactor include dehydrogenases—for example lactate dehydrogenase, alcohol dehydrogenase, and glyceraldehyde-3-phosphate dehydrogenase.</p>
      <p>NADH is essential for DNA repair, antioxidant protection of lipid-containing structures, cellular immune function, and the formation of hormones and neurotransmitters.</p>
      <p>In addition to coenzyme 1, ubiquinone (coenzyme Q10), as an essential component of the mitochondrial respiratory chain, plays a decisive role in cellular energy production. Ubiquinones belong to the group of electron-transporting coenzymes and act as mobile electron carriers between flavoproteins and cytochromes in the respiratory chain. A coenzyme Q10 deficiency of more than 25% leads… <em>[the sentence continues beyond the lower edge of the file and the continuation is not legible]</em>.</p>
      <p><strong>Printed page number:</strong> 2.</p>
    </section>
  </div>'''

anchor = '<p style="font-size:18px;color:var(--muted);margin-top:18px;">These are my personal test results, documented by doctors. They are not a promise of results for anyone else.</p>'
if 'id="tr-en-audiometrie-1"' not in load(P):
    replace_once(P, anchor, anchor + translation_sources, "start: add five English document translation panels")

P = "en/my-story-part-1.html"
replace_once(P, 'What came after the first triumph was the true high-stakes test—and the deliberate, crazy proof that my biological model really works.', 'What came after the first triumph was the real test—and the deliberate, crazy proof that my biological model really works.', "bio1: remove unlicensed high-stakes escalation")

P = "site.js"
replace_once(P, "      next: 'Next image'\n    } : pageLang.indexOf('it') === 0 ? {", "      next: 'Next image',\n      translationRegion: 'English translation of the document'\n    } : pageLang.indexOf('it') === 0 ? {", "runtime: add English translation-region label")
replace_once(P, "    var translationDefaults = pageLang.indexOf('it') === 0 ? {", "    var translationDefaults = pageLang.indexOf('en') === 0 ? {\n      show: 'View English translation',\n      original: 'View German original'\n    } : pageLang.indexOf('it') === 0 ? {", "runtime: add English document-translation controls")

P = "sitemap.xml"
sitemap = load(P)
urls = [
    "https://tinnitusbioregulation.com/en/",
    "https://tinnitusbioregulation.com/en/my-story-part-1",
    "https://tinnitusbioregulation.com/en/my-story-part-2",
    "https://tinnitusbioregulation.com/en/noise-induced-tinnitus",
    "https://tinnitusbioregulation.com/en/stress-related-tinnitus",
    "https://tinnitusbioregulation.com/en/medication-toxin-tinnitus",
    "https://tinnitusbioregulation.com/en/my-approach",
]
for url in urls:
    pattern = re.compile(r'(<loc>' + re.escape(url) + r'</loc>\s*<lastmod>)([^<]+)(</lastmod>)')
    sitemap, count = pattern.subn(r'\g<1>2026-09-02\g<3>', sitemap, count=1)
    if count != 1:
        raise RuntimeError(f"sitemap: expected exactly one lastmod for {url}, found {count}")
set_text(P, sitemap)
CHANGES.append("sitemap: update seven corrected English pages to the actual release date")

for path, text in TEXTS.items():
    if path.endswith('.html'):
        if '<html lang="en">' not in text:
            raise RuntimeError(f"{path}: English html language marker missing")
        if text.count('<html') != 1 or text.count('</html>') != 1:
            raise RuntimeError(f"{path}: malformed html boundary")
        if text.count('<body') != 1 or text.count('</body>') != 1:
            raise RuntimeError(f"{path}: malformed body boundary")

start = load("en/index.html")
assert start.count('data-lightbox-translation="#tr-en-') == 7
for source_id in [
    "tr-en-audiometrie-1", "tr-en-audiometrie-2", "tr-en-audiometrie-3",
    "tr-en-atp-befund-1", "tr-en-atp-befund-2",
]:
    assert start.count(f'id="{source_id}"') == 1
assert '<div class="preview-block" data-nosnippet>' in start
assert "View English translation" in start

site_js = load("site.js")
assert "translationRegion: 'English translation of the document'" in site_js
assert "show: 'View English translation'" in site_js
assert "original: 'View German original'" in site_js

sitemap = load("sitemap.xml")
for url in urls:
    assert re.search(r'<loc>' + re.escape(url) + r'</loc>\s*<lastmod>2026-09-02</lastmod>', sitemap)

for path, text in TEXTS.items():
    (ROOT / path).write_text(text, encoding="utf-8")

print(f"Applied {len(CHANGES)} controlled changes:")
for item in CHANGES:
    print(f" - {item}")