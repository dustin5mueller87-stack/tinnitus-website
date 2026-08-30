from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import base64, gzip, hashlib, subprocess
import cv2, numpy as np

HTML = Path('es/mi-historia-parte-1.html')
HERO = Path('img/es-hero-bio1.webp')
ATP = Path('img/es-atp-wilden-forschung.webp')
TMP = Path('.audit-tmp')

def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def font_path(pattern: str) -> str:
    path = subprocess.check_output(['fc-match', '-f', '%{file}', pattern], text=True).strip()
    if not path or not Path(path).exists():
        raise SystemExit(f'Font not found: {pattern} -> {path!r}')
    return path

before = {
    HTML: 'bc98ce87b36669cb3127f4533bb173a5d244c7fdf3e0e0f2f41e939edf1b4baa',
    HERO: 'd077a9cf8afd8ef8f272848bb6f891583e2020efa07aa4251bbb99f9704e75cf',
    ATP: '06d6fb5d81b6bcf895380f38e20f2d1a145b4cdb9108b95d22758b70022f1142',
}
for path, expected in before.items():
    actual = sha(path)
    if actual != expected:
        raise SystemExit(f'Source drift for {path}: {actual} != {expected}')

encoded = ''.join((TMP / f'es-bio1-patch.part{i}').read_text().strip() for i in range(1, 5))
patch = gzip.decompress(base64.b64decode(encoded)).decode('utf-8')
patch_path = Path('/tmp/es-bio1-final.patch')
patch_path.write_text(patch, encoding='utf-8')
subprocess.run(['git', 'apply', '--unsafe-paths', str(patch_path)], check=True)

regular_font_path = font_path('Noto Sans')
condensed_font_path = font_path('Noto Sans Condensed')
hand_font_path = font_path('Comic Neue')

def inpaint_rect(image: Image.Image, rect: tuple[int, int, int, int], radius: int) -> Image.Image:
    array = np.array(image)
    bgr = cv2.cvtColor(array, cv2.COLOR_RGB2BGR)
    mask = np.zeros(bgr.shape[:2], np.uint8)
    x0, y0, x1, y1 = rect
    cv2.rectangle(mask, (x0, y0), (x1, y1), 255, -1)
    result = cv2.inpaint(bgr, mask, radius, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(result, cv2.COLOR_BGR2RGB))

hero = Image.open(HERO).convert('RGB')
hero = inpaint_rect(hero, (28, 301, 393, 333), 7)
hero = inpaint_rect(hero, (27, 442, 430, 470), 7)
draw = ImageDraw.Draw(hero)
draw.text((33, 302), 'El momento en que todo dio un vuelco.', font=ImageFont.truetype(regular_font_path, 20), fill=(130, 132, 143))
draw.text((33, 441), 'mareo, una desviación hacia la izquierda.', font=ImageFont.truetype(regular_font_path, 18), fill=(238, 238, 236))
hero.save(HERO, 'WEBP', quality=95, method=6)

original = Image.open(ATP).convert('RGB')
array = np.array(original)
bgr = cv2.cvtColor(array, cv2.COLOR_RGB2BGR)
mask = np.zeros(bgr.shape[:2], np.uint8)

def blackhat(rect: tuple[int, int, int, int], kernel_size: tuple[int, int], threshold: int) -> None:
    x0, y0, x1, y1 = rect
    gray = cv2.cvtColor(array[y0:y1, x0:x1], cv2.COLOR_RGB2GRAY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, kernel_size)
    closed = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)
    local = (cv2.subtract(closed, gray) > threshold).astype(np.uint8) * 255
    local = cv2.dilate(local, np.ones((2, 2), np.uint8), 1)
    mask[y0:y1, x0:x1] = np.maximum(mask[y0:y1, x0:x1], local)

blackhat((650, 286, 783, 305), (13, 5), 5)
blackhat((914, 104, 993, 130), (13, 5), 3)
inpainted = cv2.inpaint(bgr, mask, 2, cv2.INPAINT_TELEA)
base_array = cv2.cvtColor(inpainted, cv2.COLOR_BGR2RGB)

x0, y0, x1, y1 = 647, 389, 806, 449
crop = base_array[y0:y1, x0:x1].copy()
background = np.empty_like(crop)
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 11))
for channel in range(3):
    background[:, :, channel] = cv2.morphologyEx(crop[:, :, channel], cv2.MORPH_CLOSE, kernel)
background = cv2.GaussianBlur(background, (9, 9), 0)
height, width = background.shape[:2]
alpha = np.ones((height, width), np.float32)
for index in range(6):
    value = (index + 1) / 6
    alpha[index, :] *= value
    alpha[height - 1 - index, :] *= value
    alpha[:, index] *= value
    alpha[:, width - 1 - index] *= value
base_array[y0:y1, x0:x1] = (crop * (1 - alpha[:, :, None]) + background * alpha[:, :, None]).astype(np.uint8)

base = Image.fromarray(base_array)
layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
draw = ImageDraw.Draw(layer)
font_heading = ImageFont.truetype(condensed_font_path, 11)
font_bullet = ImageFont.truetype(condensed_font_path, 9)
font_hand = ImageFont.truetype(hand_font_path, 20)
draw.text((652, 285), 'Principalmente, la LLLT', font=font_heading, fill=(28, 28, 27, 230))
for y, text in zip([390, 405, 420, 435], ['Aumento del ATP', 'Regeneración celular', 'Reducción de los acúfenos', 'Mejora del riego sanguíneo']):
    draw.ellipse((650, y + 5, 654, y + 9), fill=(22, 22, 21, 235))
    draw.text((661, y), text, font=font_bullet, fill=(28, 28, 27, 225))
handwriting = Image.new('RGBA', (120, 45), (0, 0, 0, 0))
ImageDraw.Draw(handwriting).text((2, 0), 'Curación', font=font_hand, fill=(22, 19, 17, 235))
handwriting = handwriting.rotate(-1.3, resample=Image.Resampling.BICUBIC, expand=True)
layer.alpha_composite(handwriting, (916, 102))
layer = layer.filter(ImageFilter.GaussianBlur(0.25))
Image.alpha_composite(base.convert('RGBA'), layer).convert('RGB').save(ATP, 'WEBP', quality=95, method=6)

expected_html = '607d709e0f7f700251e453deaaaf20da7096a7575cbfa82b12e6d0e57c021986'
if sha(HTML) != expected_html:
    raise SystemExit(f'HTML output mismatch: {sha(HTML)} != {expected_html}')
for image_path in [HERO, ATP]:
    with Image.open(image_path) as image:
        if image.size != (1240, 827) or image.format != 'WEBP':
            raise SystemExit(f'Unexpected image output for {image_path}: {image.format} {image.size}')
    if image_path.stat().st_size < 50000:
        raise SystemExit(f'Unexpectedly small image output for {image_path}: {image_path.stat().st_size}')
(TMP / 'output-hashes.txt').write_text(
    f'html {sha(HTML)}\nhero {sha(HERO)}\natp {sha(ATP)}\n'
    f'Pillow {__import__("PIL").__version__}\nOpenCV {cv2.__version__}\n'
    f'font_regular {regular_font_path}\nfont_condensed {condensed_font_path}\nfont_hand {hand_font_path}\n',
    encoding='utf-8'
)

html = HTML.read_text(encoding='utf-8')
for required in ['<html lang="es">', 'Seis meses de silencio y el estancamiento en el 25 %', 'valor en el límite inferior del intervalo normal', 'justo por encima del valor que habría confirmado una carencia', 'hreflang="cs"']:
    if required not in html:
        raise SystemExit(f'Missing required text: {required}')
for forbidden in ['a todo volumen', 'fotobiomodulación', 'deficiencia masiva de vitamina B12']:
    if forbidden in html:
        raise SystemExit(f'Stale wording remains: {forbidden}')
print('Exact audited Spanish biography part 1 outputs produced.')
