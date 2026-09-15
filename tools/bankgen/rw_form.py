"""R&W > Standard English Conventions > Form, Structure, and Sense.

Two sources: hand-written atoms (form_data1) and rule-based generators whose answers follow deterministic grammar
rules (agreement with a separated subject, singular/plural possessives, pronoun-antecedent agreement, tense cues)."""
import re
from .common import mcq_text, from_list, pick, cap
from .form_data1 import ITEMS

SECTION, DOMAIN = "rw", "conventions"
PROMPT = "Which choice completes the text so that it conforms to the conventions of Standard English?"

INTRO = {
    "sva": "A verb must agree in number with its subject. Here the subject is {note}; words between the subject and the verb don't change it.",
    "tense": "The verb tense must fit the time frame of the sentence, which is set by {note}.",
    "vform": "Check the verb form: {note}.",
    "pron": "A pronoun must agree with the noun it refers to. Here that noun is {note}.",
    "poss": "Decide between plural and possessive forms: {note}",
    "case": "A pronoun's form depends on its role in the sentence. Here the pronoun is {note}.",
    "contr": "Don't confuse possessive pronouns with contractions. The sentence needs {note}.",
    "mod": "An introductory modifier must be followed immediately by the person or thing it describes, which here is {note}.",
}
DIFF = {"sva": 2, "tense": 1, "vform": 2, "pron": 2, "poss": 1, "case": 2, "contr": 1, "mod": 3}


def build_atoms(r):
    out = []
    for i, line in enumerate(l for l in ITEMS.strip().splitlines() if "##" in l):
        body, meta = line.split("##")
        tag, note = [x.strip() for x in meta.split("|", 1)]
        m = re.search(r"\{([^}]*)\}", body)
        options = m.group(1).split("|")
        before, after = body[:m.start()].rstrip(), body[m.end():].strip()
        correct = options[0]
        passage = f"<p>{before + ' ' if before else ''}______{'' if after[:1] in '.,;:?' or not after else ' '}{after}</p>"
        res = mcq_text(correct, options[1:], r)
        expl = INTRO[tag].format(note=note) + f" The correct choice is “{correct}.”"
        diff = DIFF[tag] + (1 if len(before) > 70 and tag in ("sva", "vform") else 0)
        out.append({"passage": passage, "prompt": PROMPT, **res, "explanation": expl, "difficulty": min(3, diff), "group": f"form-{i}"})
    return out


# ---------------------------------------------------------------- agreement with an intervening phrase
# head (singular noun), plural head, complements, predicates as (singular verb phrase, plural verb phrase, distractors for singular, distractors for plural)
SVA_GROUPS = [
    (["collection", "set", "box", "display", "case", "series"], ["rare coins", "antique clocks", "handwritten letters", "old photographs", "vintage postcards", "botanical drawings", "hand-carved chess pieces", "glass bottles"],
     [("is now on display near the museum's entrance", "are now on display near the museum's entrance"), ("was donated to the library last year", "were donated to the library last year"),
      ("has been moved to a climate-controlled room", "have been moved to a climate-controlled room"), ("belongs to a family that has lived in the town for generations", "belong to a family that has lived in the town for generations")]),
    (["team", "committee", "panel", "group", "crew", "board"], ["engineers", "volunteers", "scientists", "local teachers", "graduate students", "retired nurses", "city planners", "architects"],
     [("meets every Tuesday to review the project", "meet every Tuesday to review the project"), ("expects to finish the report by June", "expect to finish the report by June"),
      ("has already reviewed more than two hundred proposals", "have already reviewed more than two hundred proposals"), ("was praised for its careful work", "were praised for their careful work")]),
    (["flock", "herd", "pack", "colony", "family", "pair"], ["geese", "elephants", "wolves", "bats", "sea otters", "cranes", "bison", "penguins"],
     [("returns to the valley each spring", "return to the valley each spring"), ("travels hundreds of kilometers every year", "travel hundreds of kilometers every year"),
      ("has been studied by researchers for a decade", "have been studied by researchers for a decade"), ("was spotted near the river this morning", "were spotted near the river this morning")]),
    (["list", "schedule", "summary", "report", "record", "catalog"], ["upcoming events", "missing books", "local businesses", "required courses", "rare bird sightings", "new regulations", "volunteer shifts"],
     [("is posted on the community center's website", "are posted on the community center's website"), ("was updated last night", "were updated last night"),
      ("has grown much longer this year", "have grown much longer this year"), ("needs to be checked for errors", "need to be checked for errors")]),
]
VERB_FORMS = {  # singular -> (plural, wrong-number past/perfect alternatives)
    "is": ("are", ["are", "were", "have been"], ["is", "was", "has been"]),
    "was": ("were", ["were", "are", "have been"], ["was", "is", "has been"]),
    "has": ("have", ["have", "are", "were"], ["has", "is", "was"]),
    "meets": ("meet", ["meet", "are meeting", "have met"], ["meets", "is meeting", "has met"]),
    "expects": ("expect", ["expect", "are expecting", "have expected"], ["expects", "is expecting", "has expected"]),
    "returns": ("return", ["return", "are returning", "have returned"], ["returns", "is returning", "has returned"]),
    "travels": ("travel", ["travel", "are traveling", "have traveled"], ["travels", "is traveling", "has traveled"]),
    "belongs": ("belong", ["belong", "are belonging", "have belonged"], ["belongs", "is belonging", "has belonged"]),
    "needs": ("need", ["need", "are needing", "have needed"], ["needs", "is needing", "has needed"]),
}


def build_sva(r):
    out = []
    n = 0
    for heads, comps, preds in SVA_GROUPS:
        for head in heads:
            for comp in comps:
                for sing_pred, plur_pred in preds:
                    verb, rest = sing_pred.split(" ", 1)
                    if verb not in VERB_FORMS:
                        continue
                    plural_verb, sing_distr, plur_distr = VERB_FORMS[verb]
                    rest_plural = plur_pred.split(" ", 1)[1]
                    for number in ("singular", "plural"):
                        if number == "singular":
                            subj = f"The {head} of {comp}"
                            correct, ds, rest_txt = verb, sing_distr, rest
                            note = f"the singular noun “{head},” not “{comp}”"
                        else:
                            plural_head = {"family": "families", "box": "boxes", "series": "series", "case": "cases", "colony": "colonies", "summary": "summaries", "catalog": "catalogs"}.get(head, head + "s")
                            if plural_head == head:
                                continue
                            subj = f"The {plural_head} of {comp}"
                            correct, ds, rest_txt = plural_verb, plur_distr, rest_plural
                            note = f"the plural noun “{plural_head}”"
                        if r.random() > 0.9:   # keep a varied sample, not every combination
                            continue
                        passage = f"<p>{subj} ______ {rest_txt}.</p>"
                        res = mcq_text(correct, [d for d in ds if d != correct][:3], r)
                        out.append({"passage": passage, "prompt": PROMPT, **res, "difficulty": 2, "group": f"sva-{head}-{comp}",
                                    "explanation": INTRO["sva"].format(note=note) + f" The correct choice is “{correct}.”"})
                        n += 1
    return out


# ---------------------------------------------------------------- possessives
OWNERS = [  # singular, plural, owned thing (singular), predicate
    ("student", "students", "science project", "was displayed in the hallway", "were displayed in the hallway", "projects"),
    ("artist", "artists", "painting", "hangs in the lobby", "hang in the lobby", "paintings"),
    ("player", "players", "jersey", "was signed by the coach", "were signed by the coach", "jerseys"),
    ("scientist", "scientists", "finding", "surprised the review committee", "surprised the review committee", "findings"),
    ("farmer", "farmers", "harvest", "was larger than expected", "were larger than expected", "harvests"),
    ("author", "authors", "manuscript", "arrived at the publisher on Monday", "arrived at the publisher on Monday", "manuscripts"),
    ("runner", "runners", "time", "was recorded by the officials", "were recorded by the officials", "times"),
    ("volunteer", "volunteers", "shift", "starts at noon", "start at noon", "shifts"),
    ("musician", "musicians", "instrument", "was tuned before the concert", "were tuned before the concert", "instruments"),
    ("chef", "chefs", "recipe", "won first prize", "won first prize", "recipes"),
    ("architect", "architects", "design", "was chosen for the new library", "were chosen for the new library", "designs"),
    ("photographer", "photographers", "photograph", "appeared in the magazine", "appeared in the magazine", "photographs"),
]
IRREGULAR = [("child", "children", "drawing", "drawings", "covered the classroom walls"), ("person", "people", "vote", "votes", "were counted twice"),
             ("woman", "women", "team", "teams", "practice on Saturdays"), ("man", "men", "choir", "choirs", "rehearse in the chapel"),
             ("goose", "geese", "nest", "nests", "were hidden in the tall grass"), ("mouse", "mice", "tunnel", "tunnels", "ran beneath the barn")]


def build_poss(r):
    out = []
    for i, (s, p, thing, pred_s, pred_p, things) in enumerate(OWNERS):
        variants = [
            (f"The award-winning ______ {thing} {pred_s}.", f"{s}'s", [f"{s}s", f"{s}s'", f"{s}s's"], f"one {s} owns the {thing}, so the singular possessive “{s}'s” is correct"),
            (f"All three ______ {things} {pred_p}.", f"{p}'", [f"{s}'s", p, f"{p}'s"], f"the {things} belong to several {p}, so the plural possessive “{p}'” is correct"),
            (f"The ______ gathered in the lobby before the ceremony.", p, [f"{s}'s", f"{p}'", f"{p}'s"], f"nothing belongs to the {p} in this sentence, so the plain plural “{p}” is correct"),
        ]
        for j, (sent, correct, ds, note) in enumerate(variants):
            res = mcq_text(correct, ds, r)
            out.append({"passage": f"<p>{sent}</p>", "prompt": PROMPT, **res, "difficulty": 1 if j in (0, 2) else 2, "group": f"poss-{i}",
                        "explanation": INTRO["poss"].format(note=note) + "."})
    for i, (s, p, thing, things, pred) in enumerate(IRREGULAR):
        sent = f"The ______ {things} {pred}."
        correct = f"{p}'s"
        ds = [f"{p}s'", f"{p}'", f"{s}s'"]
        note = f"“{p}” is already plural, so it becomes possessive by adding ’s: “{p}'s”"
        out.append({"passage": f"<p>{sent}</p>", "prompt": PROMPT, **mcq_text(correct, ds, r), "difficulty": 2, "group": f"possi-{i}",
                    "explanation": INTRO["poss"].format(note=note) + "."})
    return out


# ---------------------------------------------------------------- pronoun agreement
ORGS = ["company", "museum", "school board", "city council", "library", "orchestra", "hospital", "university", "newspaper", "zoo", "club", "committee"]
PLURALS = ["employees", "residents", "board members", "students", "volunteers", "scientists", "musicians", "council members", "coaches", "nurses"]
THINGS = [("annual budget", "would be released next week"), ("new schedule", "had been approved"), ("plan for the summer", "included several community events"),
          ("decision", "surprised many observers"), ("latest report", "was available online"), ("goals for the year", "were ambitious")]


def build_pron(r):
    out = []
    for i, org in enumerate(ORGS):
        for thing, pred in r.sample(THINGS, 4):
            sent = f"The {org} announced that ______ {thing} {pred}."
            res = mcq_text("its", ["their", "it's", "they're"], r)
            out.append({"passage": f"<p>{sent}</p>", "prompt": PROMPT, **res, "difficulty": 2, "group": f"pron-o-{i}",
                        "explanation": INTRO["pron"].format(note=f"“the {org},” which is singular") + " The singular possessive pronoun is “its” (“it's” means “it is”)."})
    for i, grp in enumerate(PLURALS):
        for thing, pred in r.sample(THINGS, 4):
            sent = f"The {grp} explained that ______ {thing} {pred}."
            res = mcq_text("their", ["its", "there", "it's"], r)
            out.append({"passage": f"<p>{sent}</p>", "prompt": PROMPT, **res, "difficulty": 1, "group": f"pron-p-{i}",
                        "explanation": INTRO["pron"].format(note=f"“the {grp},” which is plural") + " The plural possessive pronoun is “their” (“there” refers to a place)."})
    return out


# ---------------------------------------------------------------- tense cues
# subject, (base, past, past participle, 3rd-person present), singular object, plural object
LEXEMES = [
    ("the city", ("open", "opened", "opened", "opens"), "a new public library", "three new public libraries"),
    ("the museum", ("acquire", "acquired", "acquired", "acquires"), "a rare painting", "several rare paintings"),
    ("the school", ("add", "added", "added", "adds"), "a robotics club", "four new clubs"),
    ("the company", ("hire", "hired", "hired", "hires"), "a new director", "dozens of new engineers"),
    ("the orchestra", ("perform", "performed", "performed", "performs"), "a free concert in the park", "several free concerts in the park"),
    ("the farm", ("plant", "planted", "planted", "plants"), "an apple orchard", "hundreds of apple trees"),
    ("the author", ("publish", "published", "published", "publishes"), "a collection of short stories", "four novels"),
    ("the team", ("win", "won", "won", "wins"), "the regional championship", "three regional championships"),
    ("the town", ("host", "hosted", "hosted", "hosts"), "an international film festival", "several international festivals"),
    ("the researcher", ("discover", "discovered", "discovered", "discovers"), "a new species of beetle", "two new species of beetle"),
    ("the bakery", ("introduce", "introduced", "introduced", "introduces"), "a gluten-free bread", "several new pastries"),
    ("the park service", ("build", "built", "built", "builds"), "a new visitor center", "miles of new trails"),
    ("the library", ("launch", "launched", "launched", "launches"), "a summer reading program", "several reading programs"),
    ("the university", ("award", "awarded", "awarded", "awards"), "a major research grant", "hundreds of scholarships"),
]
CUES = [
    ("past", ["Last year,", "In 2012,", "Two weeks ago,", "Earlier this month,", "Yesterday,"], "a completed past time, so the simple past is needed"),
    ("future", ["Next year,", "Next month,", "In the coming weeks,", "Tomorrow,"], "a future time, so “will” plus the base verb is needed"),
    ("perfect", ["Since 2015,", "Over the past decade,", "In recent years,", "So far this year,"], "a period that continues up to the present, so the present perfect (“has” plus the past participle) is needed"),
]


def build_tense(r):
    out = []
    for i, (subj, (base, past, pp, pres3), obj_s, obj_p) in enumerate(LEXEMES):
        forms = {"past": past, "future": f"will {base}", "perfect": f"has {pp}", "pastperf": f"had {pp}"}
        for kind, cues, why in CUES:
            for cue in r.sample(cues, 2):
                obj = obj_p if kind == "perfect" else obj_s
                correct = forms[kind]
                ds = [forms[k] for k in forms if k != kind]
                sent = f"{cue} {subj} ______ {obj}."
                out.append({"passage": f"<p>{sent}</p>", "prompt": PROMPT, **mcq_text(correct, ds, r), "difficulty": 1 if kind != "perfect" else 2,
                            "group": f"tense-{i}", "explanation": INTRO["tense"].format(note=f"“{cue[:-1]},” {why}") + f" The correct choice is “{correct}.”"})
    return out


TEMPLATES = [
    ("form-structure", 2, from_list(build_atoms), 1000),
    ("form-structure", 2, from_list(build_sva), 2000),
    ("form-structure", 1, from_list(build_poss), 500),
    ("form-structure", 2, from_list(build_pron), 500),
    ("form-structure", 1, from_list(build_tense), 500),
]
