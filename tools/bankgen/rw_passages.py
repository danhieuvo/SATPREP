"""R&W passage-based questions (central ideas, text structure, inferences, cross-text) from passage_data*.py units."""
import importlib
from .common import mcq_text, from_list

SECTION, DOMAIN = "rw", "info"
DATA_MODULES = ["passage_data1", "passage_data2", "passage_data3", "passage_data4", "passage_data5", "passage_data6",
                "passage_data7", "passage_data8", "passage_data9", "passage_data10", "passage_data11", "passage_data12", "passage_data13",
                "crosstext_data1", "crosstext_data2", "crosstext_data3", "crosstext_data4"]
KINDS = {
    "CI": ("central-ideas", "info", "Which choice best states the main idea of the text?"),
    "TS": ("text-structure", "craft", "Which choice best states the main purpose of the text?"),
    "IN": ("inferences", "info", "Which choice most logically completes the text?"),
    "CT": ("cross-text", "craft", "Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1?"),
}


def load_units():
    units = []
    for name in DATA_MODULES:
        try:
            block = importlib.import_module(f".{name}", __package__).UNITS
        except ModuleNotFoundError:
            continue
        for chunk in block.strip().split("\n\n"):
            lines = [l.strip() for l in chunk.strip().splitlines() if l.strip()]
            texts, qs = [], []
            for line in lines:
                if line.startswith("P:") or line.startswith("P2:"):
                    texts.append(line.split(":", 1)[1].strip())
                else:
                    kind, rest = line.split(":", 1)
                    rest = rest.lstrip(":").strip() if rest.startswith(":") else rest.strip()
                    default = line[len(kind) + 1:].startswith(":")
                    body, _, reason = rest.partition(">>")
                    parts = [p.strip() for p in body.split("||")]
                    if default:
                        prompt, options = None, parts[1:] if parts[0] == "" else parts
                    else:
                        prompt, options = parts[0], parts[1:]
                    if len(options) != 4:
                        raise ValueError(f"{name}: need 4 options in: {line[:80]}")
                    qs.append((kind, prompt, options, reason.strip()))
            units.append((f"{name}-{len(units)}", texts, qs))
    return units


def render_passage(texts):
    src_prefix = "The following text is "
    out = []
    if len(texts) == 2:
        for i, t in enumerate(texts, 1):
            out.append(f"<p><b>Text {i}</b></p><p>{t}</p>")
        return "".join(out)
    t = texts[0]
    if t.startswith(src_prefix):
        src, _, body = t.partition(". ")
        return f'<p class="src">{src}.</p><p>{body}</p>'
    return f"<p>{t}</p>"


def build_kind(kind):
    skill, domain, default_prompt = KINDS[kind]

    def build(r):
        out = []
        for uid, texts, qs in load_units():
            for k, prompt, options, reason in qs:
                if k != kind:
                    continue
                res = mcq_text(options[0], options[1:], r)
                expl = (reason + " " if reason else "") + "The other choices either go beyond what the text says, contradict it, or focus on a detail rather than the point the question asks about."
                out.append({"passage": render_passage(texts), "prompt": prompt or default_prompt, **res, "explanation": expl,
                            "difficulty": 2 if kind in ("CI", "TS") else 3 if kind == "CT" else 2, "group": f"psg-{uid}", "domain": domain})
        return out
    build.__name__ = f"build_{kind}"
    return build


TEMPLATES = [(KINDS[k][0], 2, from_list(build_kind(k)), 5000) for k in KINDS]
