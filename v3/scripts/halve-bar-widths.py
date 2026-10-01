import re
from pathlib import Path

path = Path(r"C:\Users\hitso\Projects\mcclure-realty-overhaul\v3\src\components\ui\animated-card.tsx")
text = path.read_text(encoding="utf-8")
start = text.find("export const Layer1")
end = text.find("export const Layer2")
chunk = text[start:end]


def fix_path(d: str) -> str:
    # Shrink top edge: LEFT TOPYH RIGHT C ... TOPY OUTER_R
    def repl(mm: re.Match[str]) -> str:
        left = float(mm.group(1))
        top_y = mm.group(2)
        right = float(mm.group(3))
        mid = mm.group(4)
        outer_r = float(mm.group(5))
        new_w = (right - left) * 0.5
        new_right = left + new_w
        new_outer_r = left + new_w + (outer_r - right)
        return f"{mm.group(1)} {top_y}H{new_right:g}C{mid} {top_y} {new_outer_r:g}"

    return re.sub(
        r"(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)H(\d+(?:\.\d+)?)C([^H]+?) \2 (\d+(?:\.\d+)?)",
        repl,
        d,
    )


def path_repl(mm: re.Match[str]) -> str:
    return 'd="' + fix_path(mm.group(1)) + '"'


new_chunk = re.sub(r'd="([^"]+)"', path_repl, chunk)
path.write_text(text[:start] + new_chunk + text[end:], encoding="utf-8")
print("ok", new_chunk[new_chunk.find("d=") : new_chunk.find("d=") + 140])
