# SAT Prep

A lean, static website for digital SAT practice. There is no server code and nothing to install to use it.

- **Sign-in by name**: no password. Each name keeps its own progress on the device.
- **Practice**: untimed sets of 10 questions by section, domain, or skill, with instant explanations. You can filter by difficulty, show only unseen questions, and redo mistakes.
- **Practice tests**:
  - **Full** (2 h 14 min, adaptive Module 2, 10-minute break) or **half** (67 min).
  - Bluebook-style tools: timer, mark for review, answer eliminator, navigator, Desmos calculator, and a reference sheet.
- **Home and Progress**: accuracy by section and skill, recent test scores, and a reset button.

## Question bank: about 43,000 questions

| Section | Hand-written | Generated | Total |
|---|---|---|---|
| Math | 80 | 20,869 | **20,949** |
| Reading & Writing | 90 | 22,170 | **22,260** |

Every question is original. None are copied or paraphrased from College Board, Khan Academy, or Princeton Review. All follow the digital SAT's published question types and domains.

- **Math**: about 150 generator templates. Each creates new numbers and contexts, computes the answer, and (where practical) re-checks it by substitution.
- **Reading & Writing**, built from original material:
  - Words in Context: word sets.
  - Boundaries and Transitions: tagged clause pairs.
  - Form, Structure, and Sense: grammar atoms plus rule-based agreement, possessive, pronoun, and tense generators.
  - Command of Evidence (textual): hypothesis records.
  - Main idea, structure, inference, and cross-text: passages.
  - Quantitative evidence: generated tables and charts, with every claim checked against the numbers.
  - Rhetorical synthesis: fictional note sets.
- People, studies, and data in R&W items are illustrative.

Current R&W mix (including hand-written items): evidence-quant 6.3k, synthesis 5.6k, boundaries 4.3k, form 1.7k, words in context 1.5k (1,518), and transitions 1.3k. The passage-based skills have about 300 each: central ideas (300), text structure (302), inferences (300), cross-text (302), and textual evidence (302).

Behind those passage-based counts: about 330 original passages (each with a main-idea, a structure, and an inference question), 93 paired-text sets (3 cross-text questions each), and 155 hypothesis records (support and weaken questions). Words in context comes from about 380 four-word sets. Each sentence is written so that only its own word fits. When "a" or "an" comes right before the blank and would give away the answer, the article moves into each choice instead.

## Run it

Double-click `index.html`, or serve the folder:

```bash
python -m http.server 8765
```

## Rebuild the generated bank

```bash
python tools/build_bank.py
```

Output is deterministic (fixed seed), so question ids stay stable unless content changes.

- To inspect one module without writing files: `python tools/build_bank.py --sample rw_wic`. The samples go to `tools/samples.txt`.
- Validation runs on every build: 4 distinct choices, valid answers, parseable grid-in answers, balanced math delimiters.

## Layout

```
index.html                page shell (loads hand-written bank + bank/gen/manifest.js)
css/style.css             styles
js/core.js                taxonomy, per-name storage, lazy chunk loading, answer checking, test assembly, scoring
js/practice.js            question renderer + practice mode
js/test.js                test hub, runner, results
js/app.js                 sign-in landing, home, progress, router
bank/*.js                 hand-written questions (170)
bank/gen/manifest.js      chunk counts per section/skill/difficulty
bank/gen/<section>/<skill>/d<difficulty>-<n>.js   generated chunks (~150 questions each)
tools/build_bank.py       builds, validates, and writes the generated bank
tools/bankgen/math_*.py   math generators
tools/bankgen/rw_*.py     R&W builders; *_data*.py hold the authored atoms, sets, records, and passages
```

The browser loads only the chunks it needs. A practice set loads 1–3 small files, and a full test loads a few dozen. A question's chunk is derived from its id (`g.<section>.<skill>.<difficulty>.<hash>`), so saved results can always be reloaded.

## Adding content

- **More passages**: add units to `tools/bankgen/passage_data2.py` (format documented at the top of `passage_data1.py`), then rebuild.
- **More words in context**: add a word set to `wic_data8.py` (format documented at the top of `rw_wic.py`/`wic_data1.py`).
- **More grammar or clause pairs**: `form_data1.py`, or `clause_data4.py`.
- **Hand-written one-offs**: add to `bank/*.js` with `add({...})` (fields: `id`, `skill`, `difficulty`, `passage`, `prompt`, `choices` or grid-in `answer` array, `answer`, `explanation`).

## Scoring

The score is an estimate, not College Board's model:

- Questions are weighted by difficulty.
- Routing to the harder Module 2 requires 50% of Module 1's weighted points.
- The easier route caps below 800.

## Known limits

1. **Content review**: generated items were validated by script and spot-checked by reading samples. They have not been reviewed by a human item writer.
2. **Progress is per browser**: the name sign-in isn't synced across devices. Anyone on the same device can pick any name.
3. **Calculator**: embeds Desmos's public SAT calculator page. Check Desmos's terms before a public launch.
4. **Size**: the generated bank is about 33 MB across ~325 files, which is fine for static hosting.
