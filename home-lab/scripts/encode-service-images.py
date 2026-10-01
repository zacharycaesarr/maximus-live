from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parents[1] / 'public' / 'products'
results = []
for name in ('camerarig', 'MR-headphones', 'gooey-mrsmooth'):
    source = root / (name + '.png')
    target = root / (name + '.lossless.webp')
    original = Image.open(source)
    pixels = original.convert('RGBA')
    options = dict(lossless=True, quality=100, method=6, exact=True)
    if original.info.get('icc_profile'):
        options['icc_profile'] = original.info['icc_profile']
    pixels.save(target, 'WEBP', **options)
    decoded = Image.open(target).convert('RGBA')
    assert pixels.size == decoded.size and pixels.tobytes() == decoded.tobytes(), name
    results.append(dict(name=name, size=pixels.size, before=source.stat().st_size, after=target.stat().st_size, identical_rgba=True))
print(json.dumps(results))
Path(__file__).with_name('lossless-assets.json').write_text(json.dumps(results, indent=2))
