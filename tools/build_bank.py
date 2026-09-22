"""Build the generated question bank.

    python tools/build_bank.py            # build everything, validate, write bank/gen/*.js
    python tools/build_bank.py --sample   # also print one sample per template to tools/samples.txt

Output is deterministic (fixed seed), so question ids stay stable between builds unless content changes.
"""
import hashlib
import importlib
import json
import math
import shutil
import random
import re
import sys
from collections import Counter, defaultdict
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from bankgen.common import qid, run  # noqa: E402

MODULES = [
    "math_algebra", "math_advanced", "math_data", "math_geometry", "math_hard",
    "rw_boundaries", "rw_form", "rw_wic", "rw_transitions", "rw_quant", "rw_synthesis", "rw_passages", "rw_evidence",
    "rw_hard",
]
# Short, formula-built items in these skills read as medium on the real test, whatever their template says.
# Hard questions in these skills come only from the hand-written rw_hard module.
MAX_DIFFICULTY = {("rw_boundaries", "boundaries"): 2, ("rw_form", "form-structure"): 2,
                  ("rw_transitions", "transitions"): 2, ("rw_synthesis", "synthesis"): 2,
                  ("rw_wic", "words-in-context"): 2}
SEED = 20260914
# Multiply each module's per-template counts. Templates with a small parameter space simply cap out.
SCALE = {"math_algebra": 3.6, "math_advanced": 3.9, "math_data": 2.9, "math_geometry": 3.3}


def parse_num(s):
    s = s.strip()
    if re.fullmatch(r"-?\d+/\d+", s):
        n, d = s.split("/")
        return Fraction(int(n), int(d))
    return Fraction(s)


CHUNK_SIZE = 150
FIELD_ORDER = ["id", "section", "domain", "skill", "difficulty", "tmpl", "group", "passage", "prompt", "choices", "answer", "explanation"]


def content_hash(q):
    text = (q.get("passage") or "") + q["prompt"] + "|".join(q.get("choices") or [])
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:10]


def write_chunks(out_dir, by_key):
    """One folder per section/skill; each difficulty split into chunks. js/core.js finds a question's
    chunk as int(hash[:8], 16) % chunk_count, so this assignment must stay in sync with it."""
    # Clear old output file by file (OneDrive can refuse to remove the folder itself).
    out_dir.mkdir(parents=True, exist_ok=True)
    for p in out_dir.rglob("*.js"):
        p.unlink()
    for d in sorted((p for p in out_dir.rglob("*") if p.is_dir()), key=lambda p: -len(p.parts)):
        shutil.rmtree(d, ignore_errors=True)
    manifest = {"chunks": {}, "counts": {}}
    n_files = 0
    for (sec, skill, diff), qs in sorted(by_key.items()):
        n = max(1, math.ceil(len(qs) / CHUNK_SIZE))
        key = f"{sec}/{skill}/{diff}"
        manifest["chunks"][key] = n
        manifest["counts"][key] = len(qs)
        buckets = defaultdict(list)
        for q in qs:
            buckets[int(q["id"].split(".")[-1][:8], 16) % n].append(q)
        folder = out_dir / sec / skill
        folder.mkdir(parents=True, exist_ok=True)
        for k in range(n):
            rows = [json.dumps({f: q[f] for f in FIELD_ORDER if f in q}, ensure_ascii=False, separators=(",", ":")) for q in buckets[k]]
            (folder / f"d{diff}-{k}.js").write_text(f'SAT_CHUNK("{key}/{k}",[\n' + ",\n".join(rows) + "\n]);\n", encoding="utf-8")
            n_files += 1
    (out_dir / "manifest.js").write_text("window.SAT_MANIFEST = " + json.dumps(manifest, separators=(",", ":")) + ";\n", encoding="utf-8")
    return n_files


def validate(q, errors):
    where = q.get("id", "?")
    for k in ("id", "section", "domain", "skill", "difficulty", "prompt", "explanation", "answer"):
        if k not in q or q[k] in (None, ""):
            errors.append(f"{where}: missing {k}")
    if q.get("choices") is not None:
        ch = q["choices"]
        if len(ch) != 4 or len(set(ch)) != 4:
            errors.append(f"{where}: choices must be 4 distinct")
        if q["answer"] not in list("ABCD"):
            errors.append(f"{where}: bad answer {q['answer']}")
    else:
        if not isinstance(q["answer"], list) or not q["answer"]:
            errors.append(f"{where}: spr answer must be a non-empty list")
        else:
            vals = set()
            for a in q["answer"]:
                try:
                    vals.add(parse_num(a))
                except Exception:
                    errors.append(f"{where}: unparseable spr answer {a}")
            if len(vals) > 1:
                errors.append(f"{where}: spr answers disagree {q['answer']}")
    text = (q.get("passage") or "") + q["prompt"] + q["explanation"] + "".join(q.get("choices") or [])
    if "[[" in text or "]]" in text:
        errors.append(f"{where}: unfilled placeholder")
    if q["section"] == "math" and text.replace("\\$", "").count("$") % 2:
        errors.append(f"{where}: odd number of $ delimiters")


def main():
    sample = "--sample" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    rng = random.Random(SEED)
    by_file = defaultdict(list)
    samples = []
    counts = Counter()
    errors = []
    ids = set()

    for name in MODULES:
        if only and name not in only:
            continue
        try:
            mod = importlib.import_module(f"bankgen.{name}")
        except ModuleNotFoundError as e:
            if e.name == f"bankgen.{name}":
                print(f"  (skipping {name}: not written yet)")
                continue
            raise
        for entry in mod.TEMPLATES:
            skill, diff, gen, n = entry[:4]
            n = round(n * SCALE.get(name, 1))
            local = random.Random(f"{SEED}-{name}-{gen.__name__}")
            qs = run(gen, n, local)
            if len(qs) < n:
                print(f"  note: {name}.{gen.__name__} produced {len(qs)}/{n}")
            for q in qs:
                q.setdefault("difficulty", diff)
                q["difficulty"] = min(q["difficulty"], MAX_DIFFICULTY.get((name, skill), 3))
                full = {"section": mod.SECTION, "domain": mod.DOMAIN, "skill": skill, **q}
                sk = full["skill"]  # a builder may set skill per question (rw_hard does)
                # Which generator made it; test assembly uses this to avoid near-identical questions in one module.
                full.setdefault("tmpl", f"{name}.{gen.__name__}")
                full["id"] = f"g.{mod.SECTION}.{sk}.{full['difficulty']}.{content_hash(full)}"
                if full["id"] in ids:
                    continue
                ids.add(full["id"])
                validate(full, errors)
                by_file[(mod.SECTION, sk, full["difficulty"])].append(full)
                counts[(mod.SECTION, full["domain"], sk)] += 1
            if sample and qs:
                samples.append(f"### {gen.__name__} ({skill}, d{diff}) x{len(qs)}\nP: {qs[0]['prompt']}\nC: {' | '.join(qs[0].get('choices') or [])}\nA: {qs[0]['answer']}\nE: {qs[0]['explanation']}")

    out_dir = ROOT / "bank" / "gen"
    total = sum(counts.values())
    n_files = 0
    if only:
        print("\n(partial build: files not written; run without module names to write the bank)")
    else:
        n_files = write_chunks(out_dir, by_file)
        index = ROOT / "index.html"
        html = index.read_text(encoding="utf-8")
        block = '  <script src="bank/gen/manifest.js"></script>'
        html = re.sub(r"(<!-- GENERATED:START -->\n).*?(\n?\s*<!-- GENERATED:END -->)", lambda m: m.group(1) + block + "\n  <!-- GENERATED:END -->", html, flags=re.S)
        index.write_text(html, encoding="utf-8")

    print(f"\nGenerated {total} questions into {n_files} chunk files")
    sec_tot = Counter()
    for (sec, dom, skill), c in sorted(counts.items()):
        sec_tot[sec] += c
        print(f"  {sec:5} {dom:12} {skill:24} {c}")
    print("  totals:", dict(sec_tot))
    if not only:
        size = sum(p.stat().st_size for p in out_dir.rglob("*.js"))
        print(f"  size: {size / 1e6:.2f} MB")
    if errors:
        print(f"\n{len(errors)} VALIDATION ERRORS (first 30):")
        for e in errors[:30]:
            print("  ", e)
    if sample:
        (ROOT / "tools" / "samples.txt").write_text("\n\n".join(samples), encoding="utf-8")
        print("samples -> tools/samples.txt")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
