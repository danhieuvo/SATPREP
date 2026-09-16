"""Hand-written hard Reading & Writing questions (hard_data*.py), modeled on the harder digital SAT items:
longer academic or literary passages, underlined sentences, and two close answer choices.

Format of ITEMS: each item starts with a line "## KIND" (optionally "## KIND d2") followed by lines:
  SRC: intro line shown above the passage ("The following text is from a 1920s short story.")
  P:   a paragraph of the passage (repeatable). [[...]] marks an underlined portion.
  T1: / T2:  the two texts of a cross-text pair
  N:   one bullet of a synthesis note set (repeatable);  G: the student's goal
  Q:   the question (optional when the kind has a standard prompt)
  +    the correct choice (exactly one)
  -    a wrong choice (exactly three)
  W:   explanation
"""
import importlib
import re
from .common import mcq_text, from_list

SECTION, DOMAIN = "rw", "info"
DATA_MODULES = [f"hard_data{i}" for i in range(1, 31)]
CONVENTIONS = "Which choice completes the text so that it conforms to the conventions of Standard English?"
KINDS = {
    "TS": ("text-structure", "craft", "Which choice best describes the function of the underlined sentence in the text as a whole?"),
    "CI": ("central-ideas", "info", "Which choice best states the main idea of the text?"),
    "IN": ("inferences", "info", "Which choice most logically completes the text?"),
    "EV": ("evidence-textual", "info", None),
    "CT": ("cross-text", "craft", "Based on the texts, how would the author of Text 2 most likely respond to the underlined claim in Text 1?"),
    "WC": ("words-in-context", "craft", "Which choice completes the text with the most logical and precise word or phrase?"),
    "TR": ("transitions", "expression", "Which choice completes the text with the most logical transition?"),
    "SY": ("synthesis", "expression", "Which choice most effectively uses relevant information from the notes to accomplish this goal?"),
    "BD": ("boundaries", "conventions", CONVENTIONS),
    "FS": ("form-structure", "conventions", CONVENTIONS),
}
NEEDS_BLANK = {"IN", "WC", "TR", "BD", "FS"}


def underline(t):
    return re.sub(r"\[\[(.+?)\]\]", r"<u>\1</u>", t)


def parse(name, block):
    items = []
    for chunk in re.split(r"^## ", block.strip(), flags=re.M):
        if not chunk.strip():
            continue
        lines = [l.rstrip() for l in chunk.splitlines()]
        head = lines[0].split()
        kind, diff = head[0], int(head[1][1:]) if len(head) > 1 else 3
        it = {"kind": kind, "diff": diff, "src": None, "paras": [], "texts": [], "notes": [], "goal": None,
              "q": None, "right": [], "wrong": [], "why": ""}
        for l in lines[1:]:
            l = l.strip()
            if not l:
                continue
            tag, _, rest = l.partition(":") if l[:1] not in "+-" else (l[0], "", l[1:])
            rest = rest.strip()
            if tag == "+": it["right"].append(rest)
            elif tag == "-": it["wrong"].append(rest)
            elif tag == "SRC": it["src"] = rest
            elif tag == "P": it["paras"].append(rest)
            elif tag in ("T1", "T2"): it["texts"].append(rest)
            elif tag == "N": it["notes"].append(rest)
            elif tag == "G": it["goal"] = rest
            elif tag == "Q": it["q"] = rest
            elif tag == "W": it["why"] = rest
            else:
                raise ValueError(f"{name}: unknown line in {kind} item: {l[:60]}")
        where = f"{name} {kind} item #{len(items) + 1} ({(it['paras'] or it['texts'] or it['notes'] or [''])[0][:50]})"
        if kind not in KINDS:
            raise ValueError(f"unknown kind {where}")
        if len(it["right"]) != 1 or len(it["wrong"]) != 3:
            raise ValueError(f"need 1 '+' and 3 '-' choices: {where}")
        if not it["why"]:
            raise ValueError(f"missing W: {where}")
        # Choices are shuffled, so explanations must never point to a choice by position.
        if re.search(r"\b(first|second|third|fourth|last|final) (choice|option|quotation|answer)\b|\bchoice [A-D]\b", it["why"], re.I):
            raise ValueError(f"explanation refers to a choice by position: {where}")
        body = " ".join(it["paras"] + it["texts"])
        if kind in NEEDS_BLANK and "______" not in body:
            raise ValueError(f"missing blank: {where}")
        if kind in ("TS", "CT") and not it["q"] and "[[" not in body:
            raise ValueError(f"missing underline: {where}")
        if kind == "CT" and len(it["texts"]) != 2:
            raise ValueError(f"cross-text needs T1 and T2: {where}")
        if kind == "SY" and not (it["notes"] and it["goal"]):
            raise ValueError(f"synthesis needs N: and G: lines: {where}")
        if not it["q"] and not KINDS[kind][2]:
            raise ValueError(f"missing Q: {where}")
        items.append(it)
    return items


def render(it):
    out = []
    if it["src"]:
        out.append(f'<p class="src">{it["src"]}</p>')
    if it["texts"]:
        for i, t in enumerate(it["texts"], 1):
            out.append(f"<p><b>Text {i}</b></p><p>{underline(t)}</p>")
    if it["notes"]:
        out.append("<p>While researching a topic, a student has taken the following notes:</p>")
        out.append("<ul>" + "".join(f"<li>{n}</li>" for n in it["notes"]) + "</ul>")
        out.append(f"<p>{it['goal']}</p>")
    out.extend(f"<p>{underline(p)}</p>" for p in it["paras"])
    return "".join(out)


def load_items():
    items = []
    for name in DATA_MODULES:
        try:
            block = importlib.import_module(f".{name}", __package__).ITEMS
        except ModuleNotFoundError:
            continue
        for i, it in enumerate(parse(name, block)):
            it["gid"] = f"hard-{name}-{i}"
            items.append(it)
    return items


def build(r):
    out = []
    for it in load_items():
        skill, domain, prompt = KINDS[it["kind"]]
        res = mcq_text(it["right"][0], it["wrong"], r)
        out.append({"skill": skill, "domain": domain, "difficulty": it["diff"], "group": it["gid"],
                    "passage": render(it), "prompt": it["q"] or prompt, **res, "explanation": it["why"]})
    return out


TEMPLATES = [("central-ideas", 3, from_list(build), 10000)]
