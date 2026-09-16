# SAT Prep

A lean, static website for digital SAT practice. There is no server code and nothing to install to use it.

- **Sign-in by name**: no password. Each name keeps its own progress on the device.
- **Practice**: untimed sets of 10 questions by section, domain, or skill, with instant explanations. You can filter by difficulty, show only unseen questions, and redo mistakes.
- **Practice tests**:
  - **Full** (2 h 14 min, 10-minute break) or **half** (67 min). Both are adaptive like the real digital SAT: how you do on Module 1 of each section decides whether Module 2 is harder or easier.
  - Bluebook-style tools: timer, mark for review, answer eliminator, navigator, Desmos calculator, and a reference sheet.
- **Home and Progress**: accuracy by section and skill, recent test scores, and a reset button.

## Question bank: about 44,800 questions

| Section | Hand-written | Generated | Total |
|---|---|---|---|
| Math | 80 | 22,133 | **22,213** |
| Reading & Writing | 90 + 282 hard items | 22,170 | **22,542** |

Every question is original. None are copied or paraphrased from College Board, Khan Academy, or Princeton Review. All follow the digital SAT's published question types and domains.

- **Math**: about 170 generator templates. Each creates new numbers and contexts, computes the answer, and (where practical) re-checks it by substitution. `math_hard.py` adds multi-step hard questions (word-problem models, parameters, two-way tables, radians, scaling) whose wrong answers come from common mistakes.
- **Reading & Writing**, built from original material:
  - Words in Context: word sets.
  - Boundaries and Transitions: tagged clause pairs.
  - Form, Structure, and Sense: grammar atoms plus rule-based agreement, possessive, pronoun, and tense generators.
  - Command of Evidence (textual): hypothesis records.
  - Main idea, structure, inference, and cross-text: passages.
  - Quantitative evidence: generated tables and charts, with every claim checked against the numbers.
  - Rhetorical synthesis: fictional note sets.
  - Hard questions (`rw_hard.py` + `hard_data*.py`): 282 hand-written items in every R&W skill. They use longer academic and literary passages, underlined-sentence questions, and two close answer choices, like the harder digital SAT items.
- People, studies, and data in R&W items are illustrative.

Current R&W mix (including hand-written items): evidence-quant 6.3k, synthesis 5.6k, boundaries 4.3k, form 1.7k, words in context 1.5k, and transitions 1.3k. The passage-based skills have about 300 each.

### Difficulty levels

- Short, formula-built R&W items in boundaries, form/structure, transitions, and synthesis are capped at medium (`MAX_DIFFICULTY` in `build_bank.py`), because they read as medium on the real test. Hard questions in those skills come only from the hand-written set.
- Test modules draw different mixes: Module 1 is 30% easy, 40% medium, 30% hard. The harder Module 2 is 5/30/65, and the easier Module 2 is 45/45/10.

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
- **More hard R&W questions**: add items to a `hard_data*.py` file (format documented at the top of `rw_hard.py`). The build rejects items without exactly one correct and three wrong choices, and explanations that refer to a choice by position (choices are shuffled). Keep the correct answer from being the longest choice more than about a quarter of the time.
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
4. **Size**: the generated bank is about 34 MB across ~340 files, which is fine for static hosting.
5. **Difficulty is rated by the writer, not measured**: question difficulty hasn't been calibrated against real students' results, so the score estimate can still run high or low compared with official or other practice tests.
