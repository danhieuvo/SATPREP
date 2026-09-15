"""R&W > Expression of Ideas > Transitions, built from the tagged clause pairs.

Distractors come only from relationships that are clearly incompatible with the correct one
(for example, a result sentence never gets "Additionally" as a distractor, since that can be defensible)."""
from .common import mcq_text, from_list, cap
from .rw_boundaries import all_clause_pairs

SECTION, DOMAIN = "rw", "expression"
PROMPT = "Which choice completes the text with the most logical transition?"

WORDS = {
    "c": ["However,", "In contrast,", "On the other hand,"],
    "r": ["Therefore,", "As a result,", "Consequently,", "For this reason,"],
    "a": ["Additionally,", "Moreover,", "In addition,", "Furthermore,"],
    "e": ["For example,", "For instance,"],
    "s": ["Afterward,", "Later,", "Next,", "Subsequently,"],
    "m": ["Similarly,", "Likewise,"],
}
# Relationships whose words are safe distractors for each correct relationship.
SAFE = {"c": "rea", "r": "cem", "a": "crs", "e": "crs", "s": "cem", "m": "cre"}
NAMES = {"c": "a contrast with", "r": "a result of", "a": "an additional point related to", "e": "an example of",
         "s": "an event that follows", "m": "a situation similar to"}
DIFF = {"c": 1, "r": 1, "a": 2, "e": 2, "s": 2, "m": 3}

# "In contrast"/"On the other hand" fit direct contrasts; concessive pairs ("looked easy ... took a week") read best with "However".
CONCESSIVE_ONLY = True


def build(r):
    out = []
    for gid, c1, c2, rel, original_batch in all_clause_pairs():
        if original_batch and rel == "a":
            continue  # the first batch's "addition" pairs are often elaborations, where an additive transition is debatable
        correct = "However," if rel == "c" and CONCESSIVE_ONLY else r.choice(WORDS[rel])
        pool = [w for k in SAFE[rel] for w in WORDS[k]]
        distractors = []
        for k in r.sample(SAFE[rel], len(SAFE[rel])):
            w = r.choice(WORDS[k])
            if w not in distractors:
                distractors.append(w)
            if len(distractors) == 3:
                break
        while len(distractors) < 3:
            w = r.choice(pool)
            if w not in distractors:
                distractors.append(w)
        res = mcq_text(correct, distractors, r)
        passage = f"<p>{c1}. ______ {c2}.</p>"
        expl = (f"The second sentence presents {NAMES[rel]} the first: “{c1}” → “{cap(c2)}.” "
                f"“{correct[:-1]}” signals that relationship. The other choices signal relationships that don't match: "
                + ", ".join(f"“{d[:-1]}”" for d in distractors) + ".")
        out.append({"passage": passage, "prompt": PROMPT, **res, "explanation": expl, "difficulty": DIFF[rel], "group": f"pair-{gid}"})
    return out


TEMPLATES = [("transitions", 2, from_list(build), 3000)]
