"""Non-invasieve PTT-RADIO thema-integratie na `npm run build`.

Laat alle originele PTT Direct en WebSpeak3 JavaScript en PTT/audio-motoren intact.
"""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent
DIST = ROOT / 'upstream' / 'web' / 'dist'
INDEX = DIST / 'index.html'
if not INDEX.exists():
    raise SystemExit('FOUT: voer dit uit NA de werkende Windows web-build (npm run build).')

ASSETS = ROOT / 'theme_assets'
for name in ('kerst', 'winter', 'zomer', 'space'):
    src = ASSETS / f'{name}.jpg'
    if not src.is_file() or src.stat().st_size < 4000:
        raise SystemExit(f'Thema-afbeelding ontbreekt of is leeg: {src}')

out = DIST / 'ptt-radio-assets'
out.mkdir(exist_ok=True)
for image in ASSETS.glob('*.jpg'):
    shutil.copy2(image, out / image.name)

for fn in ('ptt-radio-themes.css', 'ptt-radio-themes.js'):
    shutil.copy2(ROOT / fn, DIST / fn)

html = INDEX.read_text(encoding='utf-8')
if '</head>' not in html:
    raise SystemExit('HTML ongeldig: </head> ontbreekt')
if 'ptt-radio-themes.js' not in html:
    tags = ('\n<link rel="stylesheet" href="/ptt-radio-themes.css">'
            '\n<script defer src="/ptt-radio-themes.js"></script>\n')
    html = html.replace('</head>', tags + '</head>', 1)
INDEX.write_text(html, encoding='utf-8')
print('PTT-RADIO: Kerst, Winter, Zomer en Space ingebouwd in bestaande Windows-app.')
print('Radio-engine en PTT Direct broncode zijn niet veranderd.')
