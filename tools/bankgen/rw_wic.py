"""R&W > Craft and Structure > Words in Context, from word sets (wic_data*.py).
Every sentence in a set is written so only its own word fits; the set's other words are the distractors."""
import importlib
import re
from .common import mcq_text, from_list

SECTION, DOMAIN = "rw", "craft"
PROMPT = "Which choice completes the text with the most logical and precise word or phrase?"
DATA_MODULES = ["wic_data1", "wic_data2", "wic_data3", "wic_data4", "wic_data5", "wic_data6", "wic_data7", "wic_data8"]


def load_sets():
    sets = []
    for name in DATA_MODULES:
        try:
            block = importlib.import_module(f".{name}", __package__).SETS
        except ModuleNotFoundError:
            continue
        for chunk in block.strip().split("\n\n"):
            lines = [l.strip() for l in chunk.strip().splitlines() if l.strip()]
            head = lines[0]
            level = int(head[1])
            glosses = {}
            for part in head.split(":", 1)[1].split(";"):
                w, g = [x.strip() for x in part.split("=", 1)]
                glosses[w] = g
            items = [tuple(x.strip() for x in l.split("|", 1)) for l in lines[1:]]
            for w, s in items:
                if w not in glosses or "______" not in s:
                    raise ValueError(f"bad WIC item in {name}: {l}")
            sets.append((f"{name}-{len(sets)}", level, glosses, items))
    return sets


ARTICLE_BLANK = re.compile(r"(?<![\w'])([Aa]n?) ______")


def article(w):
    lw = w.lower()
    if lw.startswith(("uni", "use", "usu", "uti", "eu", "one")):
        return "a"
    if lw.startswith(("hour", "hon", "heir")):
        return "an"
    return "an" if lw[:1] in "aeiou" else "a"


def build(r):
    out = []
    for sid, level, glosses, items in load_sets():
        words = list(glosses)
        for word, sentence in items:
            others = [w for w in words if w != word]
            if len(others) < 3:
                continue
            ds = r.sample(others, 3)
            m = ARTICLE_BLANK.search(sentence)
            if m and len({article(w) for w in [word] + ds}) > 1:
                # "a ______" would give away the answer: move the article into each choice
                sentence = sentence[:m.start()] + "______" + sentence[m.end():]
                word_fmt = lambda w: f"{article(w)} {w}"
            else:
                word_fmt = lambda w: w
            at_start = sentence.startswith("______")
            cap = (lambda w: w[:1].upper() + w[1:]) if at_start else (lambda w: w)
            fix = lambda w: cap(word_fmt(w))
            res = mcq_text(fix(word), [fix(d) for d in ds], r)
            expl = (f"The context calls for “{word},” meaning {glosses[word]}. "
                    + " ".join(f"“{d[:1].upper() + d[1:]}” ({glosses[d]}) doesn't fit." for d in ds))
            out.append({"passage": f"<p>{sentence}</p>", "prompt": PROMPT, **res, "explanation": expl, "difficulty": level, "group": f"wic-{sid}"})
    return out


TEMPLATES = [("words-in-context", 2, from_list(build), 5000)]
