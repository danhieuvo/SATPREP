"""Shared helpers for question generators.

A generator is a function (rng) -> dict | None. It returns a question without id/section/domain/skill,
or None when the random parameters are unsuitable (the runner simply tries again).
"""
import hashlib
import math
import random
import re
from fractions import Fraction as Fr

LETTERS = "ABCD"


class Skip(Exception):
    """Raised when random parameters produce an unusable question; the runner just retries."""


# ---------------------------------------------------------------- templating
def S(template, **kw):
    """Fill [[name]] placeholders. Keeps LaTeX braces readable (no f-string escaping)."""
    def rep(m):
        v = kw[m.group(1)]
        return v if isinstance(v, str) else num(v)
    return re.sub(r"\[\[(\w+)\]\]", rep, template)


# ---------------------------------------------------------------- number formatting (LaTeX, no $)
def num(x):
    if isinstance(x, Fr):
        if x.denominator == 1:
            return str(x.numerator)
        sign = "-" if x < 0 else ""
        return f"{sign}\\frac{{{abs(x.numerator)}}}{{{x.denominator}}}"
    if isinstance(x, float):
        if abs(x - round(x)) < 1e-9:
            return str(int(round(x)))
        return f"{x:.10g}"
    return str(x)


def money(x):
    """LaTeX money inside math: \\$1{,}250.50"""
    x = Fr(x)
    if x.denominator == 1:
        s = f"{int(x):,}"
    else:
        s = f"{float(x):,.2f}"
    return "\\$" + s.replace(",", "{,}")


def big(n):
    """Thousands separators for LaTeX."""
    return f"{n:,}".replace(",", "{,}")


def term(coef, var, first=False):
    """Format coef*var as a polynomial term with sign handling."""
    coef = Fr(coef)
    if coef == 0:
        return ""
    sign = "-" if coef < 0 else "+"
    a = abs(coef)
    body = ("" if (a == 1 and var) else num(a)) + var
    if first:
        return ("-" if coef < 0 else "") + body
    return f" {sign} {body}"


def poly(coefs, var="x"):
    """poly([3, -2, 5]) -> 3x^2 - 2x + 5 (highest degree first)."""
    deg = len(coefs) - 1
    out = ""
    for i, c in enumerate(coefs):
        p = deg - i
        v = "" if p == 0 else (var if p == 1 else f"{var}^{{{p}}}" if p > 9 else f"{var}^{p}")
        t = term(c, v, first=(out == ""))
        out += t
    return out or "0"


def lin(a, b, var="x"):
    return poly([a, b], var)


def move(b):
    """Words for removing +b from one side of an equation: 'Subtract $5$ from' / 'Add $5$ to'."""
    return f"Subtract ${num(b)}$ from" if b > 0 else f"Add ${num(-b)}$ to"


def paren_num(x):
    """Wrap negatives in parentheses for substitution displays."""
    return f"({num(x)})" if x < 0 else num(x)


# ---------------------------------------------------------------- answer builders
def as_fr(x):
    return x if isinstance(x, Fr) else Fr(x).limit_denominator(10**6)


def mcq_num(correct, distractors, rng, wrap=lambda v: f"${num(v)}$", key=None, pad=True):
    """Numeric multiple choice sorted ascending. Returns dict(choices, answer) or None."""
    vals = [as_fr(correct)]
    for d in distractors:
        d = as_fr(d)
        if d not in vals:
            vals.append(d)
        if len(vals) == 4:
            break
    step = max(1, abs(int(correct)) // 5) if as_fr(correct).denominator == 1 else Fr(1, 2)
    k = 1
    while len(vals) < 4 and pad:
        for cand in (as_fr(correct) + k * step, as_fr(correct) - k * step):
            if cand not in vals and len(vals) < 4:
                vals.append(cand)
        k += 1
    if len(vals) < 4:
        raise Skip()
    order = sorted(vals, key=key or (lambda v: v))
    return {"choices": [wrap(v) for v in order], "answer": LETTERS[order.index(as_fr(correct))]}


def mcq_text(correct, distractors, rng, keep_order=False):
    """Text choices, shuffled unless keep_order. Returns None if not 4 distinct."""
    opts = [correct] + [d for d in distractors if d != correct]
    seen = []
    for o in opts:
        if o not in seen:
            seen.append(o)
    if len(seen) < 4:
        raise Skip()
    seen = seen[:4]
    order = seen[:] if keep_order else rng.sample(seen, 4)
    return {"choices": order, "answer": LETTERS[order.index(correct)]}


def spr(value):
    """Accepted grid-in strings for a numeric answer, or None if it can't be gridded."""
    v = as_fr(value)
    forms = []
    if v.denominator == 1:
        forms.append(str(v.numerator))
    else:
        forms.append(f"{v.numerator}/{v.denominator}")
        dec = v.numerator / v.denominator
        # terminating decimal?
        d = v.denominator
        for p in (2, 5):
            while d % p == 0:
                d //= p
        if d == 1:
            s = f"{dec:.6f}".rstrip("0").rstrip(".")
            if s.startswith("0."):
                s = s[1:]
            elif s.startswith("-0."):
                s = "-" + s[2:]
            forms.append(s)
    ok = [f for f in forms if len(f.lstrip("-")) <= 5 and len(f) <= 6]
    if not ok:
        return None
    return {"answer": ok}


def solve_check(cond, msg="generator self-check failed"):
    if not cond:
        raise AssertionError(msg)


# ---------------------------------------------------------------- runner
def qid(prefix, q):
    h = hashlib.sha1((q["prompt"] + "|".join(q.get("choices", []) or []) + (q.get("passage") or "")).encode()).hexdigest()[:10]
    return f"{prefix}-{h}"


def run(gen, n, rng, max_tries=None):
    """Call gen until n distinct questions (by prompt+choices) or tries exhausted."""
    out, seen = [], set()
    tries = 0
    max_tries = max_tries or n * 40
    while len(out) < n and tries < max_tries:
        tries += 1
        try:
            q = gen(rng)
        except Skip:
            continue
        if not q:
            continue
        sig = q.get("passage", "") + q["prompt"] + "|".join(q.get("choices", []) or [])
        if sig in seen:
            continue
        seen.add(sig)
        out.append(q)
    return out


def from_list(build):
    """Wrap build(rng) -> list[question] as a generator that hands out one question per call."""
    state = {}

    def gen(rng):
        if "items" not in state:
            state["items"] = build(rng)
        return state["items"].pop(0) if state["items"] else None
    gen.__name__ = build.__name__
    return gen


def cap(s):
    return s[:1].upper() + s[1:]


def pick(rng, seq):
    return seq[rng.randrange(len(seq))]


def nz(rng, lo, hi, exclude=(0,)):
    while True:
        v = rng.randint(lo, hi)
        if v not in exclude:
            return v


PY_TRIPLES = [(3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29), (9, 40, 41)]
