#!/usr/bin/env python3
from pathlib import Path
import base64, gzip, hashlib
parts = sorted(Path(__file__).with_name("chunks").glob("part-*.txt"))
if len(parts) != 8:
    raise SystemExit(f"Expected 8 payload chunks, found {len(parts)}")
payload = "".join(p.read_text(encoding="ascii").strip() for p in parts)
code = gzip.decompress(base64.b64decode(payload))
expected = "52e8a7eddcdcb6b6c740f065c7fc60e33e6ede5a5412b2f8fb4077dca9c5600e"
found = hashlib.sha256(code).hexdigest()
if found != expected:
    raise SystemExit(f"Payload checksum mismatch: {found} != {expected}")
source = code.decode("utf-8")
start = source.index("('TR-LAERM-014'")
end = source.index("('TR-LAERM-015'", start)
source = source[:start] + """('TR-LAERM-014A',
  'Tinnitusbildung: erste Nennung der inneren Haarzelle präzisieren',
  'Sürekli içeri akan potasyum, tüy hücresinin tamamını',
  'Sürekli içeri akan potasyum, iç tüy hücresinin tamamını',
  1),
 ('TR-LAERM-014B',
  'Tinnitusbildung: zweite Nennung der inneren Haarzelle präzisieren',
  'Bu sürekli gerilim de tüy hücresinin daha alt kısmındaki',
  'Bu sürekli gerilim de iç tüy hücresinin daha alt kısmındaki',
  1),
 """ + source[end:]
exec(compile(source, "apply_all_current.py", "exec"))
