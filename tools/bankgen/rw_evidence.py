"""R&W > Information and Ideas > Command of Evidence: Textual, from hypothesis records (evidence_data*.py).
Each record gives a 'support' question and a 'weaken' question; the opposite finding is always one of the traps."""
import importlib
from .common import mcq_text, from_list, cap

SECTION, DOMAIN = "rw", "info"
DATA_MODULES = ["evidence_data1", "evidence_data2", "evidence_data3"]


def load_records():
    recs = []
    for name in DATA_MODULES:
        try:
            block = importlib.import_module(f".{name}", __package__).RECORDS
        except ModuleNotFoundError:
            continue
        for chunk in block.strip().split("\n\n"):
            rec = {"0": []}
            for line in chunk.strip().splitlines():
                key, val = line.split(":", 1)
                val = val.strip()
                if key == "0":
                    rec["0"].append(val)
                else:
                    rec[key] = val
            who, hyp = [x.strip() for x in rec["H"].split("|", 1)]
            if len(rec["0"]) < 3 or "+" not in rec or "-" not in rec:
                raise ValueError(f"incomplete record in {name}: {rec['H'][:60]}")
            recs.append((f"{name}-{len(recs)}", who, hyp, rec["+"], rec["-"], rec["0"]))
    return recs


def sentence(s):
    s = cap(s)
    return s if s.endswith(".") else s + "."


def build(r):
    out = []
    for rid, who, hyp, sup, weak, neutral in load_records():
        passage = f"<p>{cap(who)} hypothesize that {hyp}.</p>"
        n = r.sample(neutral, 3)
        for kind, correct, trap, diff in (("support", sup, weak, 2), ("weaken", weak, sup, 3)):
            ds = [sentence(trap), sentence(n[0]), sentence(n[1] if kind == "support" else n[2])]
            res = mcq_text(sentence(correct), ds, r)
            expl = (f"The hypothesis predicts a specific pattern, so a finding that {'matches' if kind == 'support' else 'contradicts'} that prediction "
                    f"most directly {'supports' if kind == 'support' else 'weakens'} it. The correct choice does exactly that. "
                    f"One distractor would {'weaken' if kind == 'support' else 'support'} the hypothesis instead, and the other two are unrelated to it: "
                    "they may be true, but they don't bear on whether the hypothesis is correct.")
            out.append({"passage": passage, "prompt": f"Which finding, if true, would most directly {kind} the {who}' hypothesis?",
                        **res, "explanation": expl, "difficulty": diff, "group": f"ev-{rid}"})
    return out


TEMPLATES = [("evidence-textual", 2, from_list(build), 3000)]
