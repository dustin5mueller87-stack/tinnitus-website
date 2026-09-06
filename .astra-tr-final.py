from pathlib import Path


def rep(path, old, new, expected=1, label=''):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    n = text.count(old)
    if n != expected:
        raise SystemExit(f'{label}: expected {expected}, found {n} in {path}')
    p.write_text(text.replace(old, new), encoding='utf-8')
    print(f'OK {label}: {path}')

rep(
    'tr/tinnitus-iyilesme-hikayem.html',
    'Bunun arkasındaki biyoloji beni büyülemişti. Bunun arkasındaki biyoloji beni büyülemişti:',
    'Bunun arkasındaki biyoloji beni büyülemişti:',
    label='remove accidental duplicated sentence'
)
rep(
    'tr/tinnitus-iyilesme-hikayem.html',
    'Benim bedenimde bu, hücrelerime kendilerini onarmak için tam olarak ihtiyaç duydukları şeyi verdiğimde ortaya çıkan mantıksal ve kaçınılmaz sonuçtu — üstelik normal hayatın tam ortasında.',
    'Benim için bu, hücrelerime kendilerini onarmak için tam olarak ihtiyaç duydukları şeyi verdiğimde ortaya çıkan mantıksal ve kaçınılmaz sonuçtu — üstelik normal hayatın tam ortasında.',
    label='TR-KURZ-004b current wording'
)
rep(
    'tr/cozum-yaklasimim.html',
    '<a class="cta-card" href="/tr/urunler" aria-label="Ürünlerim">',
    '<a class="cta-card" href="/tr/urunler">',
    label='TR-LOESUNG-T03a current markup'
)
rep(
    'tr/gurultuye-bagli-tinnitus.html',
    'Beyaz gürültü uygulamaları neden yapılabilecek en kötü şeydir?',
    'Gürültü uygulamaları neden yapılabilecek en kötü şeydir?',
    label='TR-LAERM-003a remaining TOC'
)
rep(
    'tr/gurultuye-bagli-tinnitus.html',
    'Yıkıcı maskeleme tuzağı: Gürültü sesi uygulamaları neden yapılabilecek en kötü şeydir?',
    'Yıkıcı maskeleme tuzağı: Gürültü uygulamaları neden yapılabilecek en kötü şeydir?',
    label='TR-LAERM-003b idiomatic cleanup'
)
rep(
    'tr/gurultuye-bagli-tinnitus.html',
    'gürültü sesiyle maskeleme durumu ağırlaştırır',
    'gürültüyle maskeleme durumu ağırlaştırır',
    label='TR-LAERM-003c idiomatic cleanup'
)
