from pathlib import Path
import subprocess

p = Path('es/mi-historia-parte-2.html')
text = p.read_text(encoding='utf-8')


def once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one occurrence, found {count}')
    text = text.replace(old, new, 1)


once('  <!-- Sprung-Inhaltsverzeichnis -->\n', '', 'remove added TOC comment')
once('  <!-- Footer-Navigation: vorige / nächste Seite -->\n', '', 'remove added footer comment')

cfs_block = '''  <a href="../img/cfs-absturz.webp" data-lightbox="La reacción en cadena fatal: el colapso que me llevó al SFC — Dustin Müller" style="cursor: zoom-in; display: block; border-radius: 5px; overflow: hidden; margin: 24px auto;">
    <img src="../img/cfs-absturz.webp" alt="Colapso por agotamiento (SFC) e intentos de tratamiento caros e infructuosos en mi camino" width="1240" height="827" loading="lazy" style="display: block; width: 100%; max-width: 100%; height: auto; border-radius: 5px; border: 1px solid var(--rule); margin: 0;">
  </a>

'''
once(cfs_block, '', 'remove misplaced CFS image')
cfs_anchor = '''  </aside>
  <p>Es extremadamente importante dejar clara una cosa desde el principio:'''
once(
    cfs_anchor,
    '  </aside>\n' + cfs_block.rstrip('\n') + '\n  <p>Es extremadamente importante dejar clara una cosa desde el principio:',
    'restore CFS image position',
)

noise_block = '''  <a href="../img/laermexperiment.webp" data-lightbox="La provocación deliberada — Dustin Müller" style="cursor: zoom-in; display: block; border-radius: 5px; overflow: hidden; margin: 24px auto;">
    <img src="../img/laermexperiment.webp" alt="Imagen simbólica de mi arriesgado experimento personal: la provocación deliberada del segundo episodio de acúfenos" width="1240" height="827" loading="lazy" style="display: block; width: 100%; max-width: 100%; height: auto; border-radius: 5px; border: 1px solid var(--rule); margin: 0;">
  </a>

'''
once(noise_block, '', 'remove misplaced noise image')
noise_heading = '  <h2 class="section-title">La provocación deliberada</h2>\n'
once(noise_heading, noise_heading + noise_block.rstrip('\n') + '\n', 'restore noise image position')

warning = '  <p><strong>⚠️ Aviso importante:</strong> antes de describir este experimento, quiero dejar claro que también podría haber sufrido daños permanentes. No lo hagas bajo ninguna circunstancia.</p>\n'
warning_wrapped = '\n  <div class="callout">\n    <p><strong>⚠️ Aviso importante:</strong> antes de describir este experimento, quiero dejar claro que también podría haber sufrido daños permanentes. No lo hagas bajo ninguna circunstancia.</p>\n  </div>\n'
once(warning, warning_wrapped, 'restore warning callout')

for label in [
    '1. La prueba de mandíbula y cuello (la interconexión cruzada):',
    '2. La prueba del ruido blanco (la prueba contra el enmascaramiento):',
    '3. La prueba de la palmada (el impacto mecánico):',
]:
    once(
        f'<strong>{label}</strong> ',
        f'<strong>{label}</strong><br>',
        f'restore line break after {label}',
    )

p.write_text(text, encoding='utf-8', newline='\n')
actual = subprocess.check_output(['git', 'hash-object', str(p)], text=True).strip()
expected = '320318c3d20f261af269f829c7c398afb6d35765'
if actual != expected:
    raise SystemExit(f'Unexpected final blob: {actual}; expected {expected}')
print('Exact structural restoration passed:', actual)
