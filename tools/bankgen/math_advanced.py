"""Math > Advanced Math generators. Answers are built from roots/factors, then verified numerically."""
import math
from fractions import Fraction as Fr
from .common import S, num, money, big, lin, poly, term, paren_num, mcq_num, mcq_text, spr, pick, nz, solve_check

SECTION, DOMAIN = "math", "advanced"


def p_eval(coefs, x):
    v = Fr(0)
    for c in coefs:
        v = v * x + c
    return v


def expand(*factors):
    """Multiply polynomials given as coefficient lists (highest first)."""
    out = [Fr(1)]
    for f in factors:
        res = [Fr(0)] * (len(out) + len(f) - 1)
        for i, a in enumerate(out):
            for j, b in enumerate(f):
                res[i + j] += a * b
        out = res
    return out


def factor_str(a, b, var="x"):
    """(ax + b)"""
    return f"({lin(a, b, var)})"


# ======================================================== equivalent expressions
def add_polys(r):
    p = [nz(r, -6, 7), r.randint(-9, 9), r.randint(-9, 9)]
    q = [nz(r, -6, 7), r.randint(-9, 9), r.randint(-9, 9)]
    sub = r.random() < 0.5
    res = [a - b if sub else a + b for a, b in zip(p, q)]
    if res[0] == 0:
        return None
    op = "-" if sub else "+"
    correct = f"${poly(res)}$"
    if sub:
        ds = [f"${poly([p[0] - q[0], p[1] + q[1], p[2] + q[2]])}$", f"${poly([p[0] + q[0], p[1] + q[1], p[2] + q[2]])}$", f"${poly([p[0] - q[0], p[1] - q[1], p[2] + q[2]])}$"]
    else:
        ds = [f"${poly([p[0] + q[0], p[1] - q[1], p[2] + q[2]])}$", f"${poly([p[0] * q[0], p[1] + q[1], p[2] + q[2]])}$", f"${poly([p[0] + q[0], p[1] + q[1], p[2] - q[2]])}$"]
    res_ = mcq_text(correct, ds, r)
    if not res_:
        return None
    qd = {"prompt": S(r"Which expression is equivalent to $([[p]]) [[op]] ([[q]])$?", p=poly(p), op=op, q=poly(q)), **res_}
    qd["explanation"] = ("Distribute the negative sign to every term of the second polynomial, then combine like terms: " if sub else "Combine like terms: ") + correct + "."
    return qd


def distribute_combine(r):
    a, b, c = nz(r, -5, 6), nz(r, -9, 9), nz(r, -12, 12)
    res = [a, a * b + c]
    if res[1] == 0:
        return None
    correct = f"${poly([a, a * b + c, 0])}$"
    ds = [f"${poly([a, b + c, 0])}$", f"${poly([a, a * b - c, 0])}$", f"${poly([a + c, a * b, 0])}$"]
    res_ = mcq_text(correct, ds, r)
    if not res_:
        return None
    q = {"prompt": S(r"Which expression is equivalent to $[[a]]x([[inner]]) [[ct]]$?", a=a if a not in (1, -1) else ("" if a == 1 else "-"), inner=lin(1, b), ct=term(c, "x").strip() if c < 0 else "+ " + term(c, "x").strip().lstrip("+ ")), **res_}
    q["prompt"] = S(r"Which expression is equivalent to $[[a]]x([[inner]])[[ct]]$?", a=a if a not in (1, -1) else ("" if a == 1 else "-"), inner=lin(1, b), ct=term(c, "x"))
    q["explanation"] = S(r"Distribute: $[[d]]$. Then combine the $x$-terms to get $[[res]]$.", d=poly([a, a * b, 0]) + term(c, "x"), res=poly([a, a * b + c, 0]))
    return q


def diff_squares(r):
    a, b = r.choice([1, 1, 2, 3, 4, 5]), r.randint(2, 12)
    if math.gcd(a, b) != 1:
        return None
    sq = f"{a * a}x^2" if a != 1 else "x^2"
    correct = f"$({lin(a, -b)})({lin(a, b)})$"
    ds = [f"$({lin(a, -b)})^2$", f"$({lin(a, b)})^2$", f"$({lin(a * a, -b)})({lin(1, b)})$"]
    q = {"prompt": S(r"Which expression is equivalent to $[[sq]] - [[b2]]$?", sq=sq, b2=b * b), **mcq_text(correct, ds, r)}
    q["difficulty"] = 1 if a == 1 else 2
    q["explanation"] = S(r"This is a difference of squares, $u^2 - v^2 = (u - v)(u + v)$, with $u = [[u]]$ and $v = [[b]]$.", u=f"{a}x" if a != 1 else "x", b=b)
    return q


def square_binomial_coef(r):
    p, qq = nz(r, -7, 7), nz(r, -9, 9)
    ask = r.choice(["b", "c", "a"])
    coefs = expand([p, qq], [p, qq])
    val = {"a": coefs[0], "b": coefs[1], "c": coefs[2]}[ask]
    q = {"prompt": S(r"The expression $([[l]])^2$ is equivalent to $ax^2 + bx + c$, where $a$, $b$, and $c$ are constants. What is the value of $[[ask]]$?", l=lin(p, qq), ask=ask)}
    q.update(spr(val))
    q["explanation"] = S(r"$([[l]])^2 = ([[l]])([[l]]) = [[e]]$, so $[[ask]] = [[v]]$. The middle term is $2 \cdot [[pp]]x \cdot [[pq]]$, which is easy to forget.",
                         l=lin(p, qq), e=poly(coefs), ask=ask, v=val, pp=paren_num(p), pq=paren_num(qq))
    return q


def binomial_product_k(r):
    a, b, c, d = nz(r, 1, 6), nz(r, -9, 9), nz(r, 1, 6), nz(r, -9, 9)
    coefs = expand([a, b], [c, d])
    if coefs[1] == 0:
        return None
    q = {"prompt": S(r"The expression $[[a2]]x^2 + kx[[ct]]$ is equivalent to $([[f1]])([[f2]])$, where $k$ is a constant. What is the value of $k$?",
                     a2=coefs[0] if coefs[0] != 1 else "", ct=term(coefs[2], ""), f1=lin(a, b), f2=lin(c, d))}
    q.update(spr(coefs[1]))
    q["explanation"] = S(r"Expand: $[[ex]] = [[e]]$. The $x$-terms $[[ad]]x$ and $[[bc]]x$ combine to $[[k]]x$, so $k = [[k]]$.",
                         ex=poly([a * c, a * d, 0]).replace(" + 0", "") + term(b * c, "x") + term(b * d, ""), e=poly(coefs), ad=a * d, bc=b * c, k=coefs[1])
    return q


def which_factor(r):
    r1, r2 = nz(r, -9, 9), nz(r, -9, 9)
    a = r.choice([1, 1, 1, 2, 3])
    if r1 == r2 or r1 == -r2:
        return None
    coefs = expand([a], [1, -r1], [1, -r2])
    correct = f"${lin(1, -r1)}$"
    ds = [f"${lin(1, r1)}$", f"${lin(1, -r1 - r2)}$", f"${lin(1, r2)}$"]
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q = {"prompt": S(r"Which of the following is a factor of $[[p]]$?", p=poly(coefs)), **res}
    q["explanation"] = S(r"$[[p]] = [[a]](x [[t1]])(x [[t2]])$. Check: the constant term is $[[a]] \cdot [[pr1]] \cdot [[pr2]] = [[c]]$.",
                         p=poly(coefs), a=a if a != 1 else "", t1=term(-r1, "").strip(), t2=term(-r2, "").strip(), pr1=paren_num(-r1), pr2=paren_num(-r2), c=coefs[2])
    q["explanation"] = q["explanation"].replace("$1 \\cdot", "$").replace("$ \\cdot", "$")
    q["difficulty"] = 2 if a == 1 else 3
    return q


def rational_simplify(r):
    r1, r2 = nz(r, -9, 9), nz(r, -9, 9)
    if r1 == r2:
        return None
    coefs = expand([1, r1], [1, r2])
    correct = f"${lin(1, r2)}$"
    ds = [f"${lin(1, r1)}$", f"${lin(1, r1 + r2)}$", f"${poly([1, 0, r2])}$"]
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q = {"prompt": S(r"Which expression is equivalent to $\dfrac{[[p]]}{[[d]]}$, for $x > [[bound]]$?", p=poly(coefs), d=lin(1, r1), bound=max(abs(r1), abs(r2))), **res}
    q["explanation"] = S(r"Factor the numerator: $[[p]] = ([[f1]])([[f2]])$. Cancel the common factor $[[f1]]$ to get $[[f2]]$.", p=poly(coefs), f1=lin(1, r1), f2=lin(1, r2))
    return q


def add_rational(r):
    a, b, c = nz(r, 1, 7), nz(r, 1, 7), nz(r, -6, 6)
    op = r.choice(["+", "-"])
    s = 1 if op == "+" else -1
    num_c = [a + s * b, a * c]  # a(x+c) ± b x
    correct = S(r"$\dfrac{[[n]]}{[[d]]}$", n=lin(*num_c) if num_c[0] != 0 else num(num_c[1]), d=poly([1, c, 0]))
    ds = [S(r"$\dfrac{[[n]]}{[[d]]}$", n=num(a + s * b), d=lin(2, c) if c else "2x"),
          S(r"$\dfrac{[[n]]}{[[d]]}$", n=lin(a + s * b, c), d=poly([1, c, 0])),
          S(r"$\dfrac{[[n]]}{[[d]]}$", n=num(a * s * b) if a * s * b else "1", d=poly([1, c, 0]))]
    res = mcq_text(correct, ds, r)
    if not res or num_c[0] == 0:
        return None
    for x in (7, 11):
        solve_check(Fr(a, x) + s * Fr(b, x + c) == Fr(num_c[0] * x + num_c[1], x * x + c * x))
    q = {"prompt": S(r"Which expression is equivalent to $\dfrac{[[a]]}{x} [[op]] \dfrac{[[b]]}{[[xc]]}$, for $x > [[bd]]$?", a=a, op=op, b=b, xc=lin(1, c), bd=abs(c)), **res}
    q["explanation"] = S(r"Use the common denominator $x([[xc]])$: $\dfrac{[[a]]([[xc]]) [[op]] [[b]]x}{x([[xc]])} = [[ans]]$. You can't add fractions by adding numerators and denominators separately.",
                         xc=lin(1, c), a=a, op=op, b=b, ans=correct.strip("$"))
    return q


def rational_exponent(r):
    base_root, k = r.choice([(16, 4), (81, 4), (8, 3), (27, 3), (64, 3), (25, 2), (36, 2), (49, 2), (32, 5), (125, 3)])
    root_val = round(base_root ** (1 / k))
    solve_check(root_val ** k == base_root)
    m = r.choice([2, 3]) if k > 2 else r.choice([3, 5])
    if math.gcd(m, k) != 1:
        return None
    xe = k * r.choice([2, 3, 4])
    coef = root_val ** m
    xpow = xe * m // k
    correct = f"${coef}x^{{{xpow}}}$"
    ds = [f"${base_root * m // k if (base_root * m) % k == 0 else coef + 1}x^{{{xpow}}}$", f"${coef}x^{{{xe + m}}}$", f"${root_val * m}x^{{{xpow}}}$"]
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q = {"prompt": S(r"Which expression is equivalent to $([[b]]x^{[[xe]]})^{\frac{[[m]]}{[[k]]}}$, for $x > 0$?", b=base_root, xe=xe, m=m, k=k), **res}
    q["explanation"] = S(r"Apply the exponent to each factor. $[[b]]^{\frac{[[m]]}{[[k]]}} = \left(\sqrt[[[k]]]{[[b]]}\right)^{[[m]]} = [[rv]]^{[[m]]} = [[c]]$, and $(x^{[[xe]]})^{\frac{[[m]]}{[[k]]}} = x^{[[xp]]}$.",
                         b=base_root, m=m, k=k, rv=root_val, c=coef, xe=xe, xp=xpow)
    return q


def radical_to_exponent(r):
    n, m = r.choice([(3, 2), (4, 3), (5, 2), (3, 4), (5, 3), (4, 5), (7, 2), (2, 5)])
    correct = f"$x^{{\\frac{{{m}}}{{{n}}}}}$"
    ds = [f"$x^{{\\frac{{{n}}}{{{m}}}}}$", f"$x^{{{m * n}}}$", f"$x^{{{m - n}}}$" if m != n + 1 else f"$x^{{{m + n}}}$"]
    rad = f"\\sqrt[{n}]{{x^{{{m}}}}}" if n != 2 else f"\\sqrt{{x^{{{m}}}}}"
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q = {"prompt": S(r"For $x > 0$, which expression is equivalent to $[[rad]]$?", rad=rad), **res}
    q["explanation"] = S(r"An $n$th root is the exponent $\frac{1}{n}$: $\sqrt[n]{x^m} = x^{\frac{m}{n}}$. So $[[rad]] = x^{\frac{[[m]]}{[[n]]}}$.", rad=rad, m=m, n=n)
    return q


FORMULAS = [
    (r"A = \frac{1}{2}bh", "h", r"h = \frac{2A}{b}", [r"h = \frac{A}{2b}", r"h = 2Ab", r"h = \frac{b}{2A}"], "the area of a triangle with base $b$ and height $h$"),
    (r"V = \pi r^2 h", "h", r"h = \frac{V}{\pi r^2}", [r"h = V\pi r^2", r"h = \frac{\pi r^2}{V}", r"h = \frac{V}{2\pi r}"], "the volume of a cylinder"),
    (r"F = \frac{9}{5}C + 32", "C", r"C = \frac{5}{9}(F - 32)", [r"C = \frac{9}{5}(F - 32)", r"C = \frac{5}{9}F - 32", r"C = \frac{5F - 32}{9}"], "the relationship between Fahrenheit and Celsius temperatures"),
    (r"d = rt", "t", r"t = \frac{d}{r}", [r"t = dr", r"t = \frac{r}{d}", r"t = d - r"], "distance traveled at a constant rate"),
    (r"P = 2\ell + 2w", "w", r"w = \frac{P - 2\ell}{2}", [r"w = \frac{P}{2} - 2\ell", r"w = P - \ell", r"w = \frac{P + 2\ell}{2}"], "the perimeter of a rectangle"),
    (r"I = Prt", "r", r"r = \frac{I}{Pt}", [r"r = IPt", r"r = \frac{Pt}{I}", r"r = I - Pt"], "simple interest"),
    (r"KE = \frac{1}{2}mv^2", "m", r"m = \frac{2KE}{v^2}", [r"m = \frac{KE}{2v^2}", r"m = 2KEv^2", r"m = \frac{v^2}{2KE}"], "kinetic energy"),
    (r"y = mx + b", "x", r"x = \frac{y - b}{m}", [r"x = \frac{y}{m} - b", r"x = m(y - b)", r"x = \frac{y + b}{m}"], "a linear relationship"),
    (r"A = P(1 + r)", "r", r"r = \frac{A}{P} - 1", [r"r = \frac{A - 1}{P}", r"r = A - P - 1", r"r = \frac{A}{P + 1}"], "the value of an investment after one year"),
    (r"S = 4\pi r^2", "r", r"r = \sqrt{\frac{S}{4\pi}}", [r"r = \frac{S}{4\pi}", r"r = \sqrt{4\pi S}", r"r = \frac{\sqrt{S}}{4\pi}"], "the surface area of a sphere"),
    (r"V = \frac{1}{3}\pi r^2 h", "h", r"h = \frac{3V}{\pi r^2}", [r"h = \frac{V}{3\pi r^2}", r"h = 3V\pi r^2", r"h = \frac{\pi r^2}{3V}"], "the volume of a cone"),
    (r"a = \frac{v - u}{t}", "v", r"v = at + u", [r"v = at - u", r"v = \frac{a}{t} + u", r"v = a(t + u)"], "constant acceleration"),
    (r"p = \frac{m}{V}", "V", r"V = \frac{m}{p}", [r"V = mp", r"V = \frac{p}{m}", r"V = m - p"], "density"),
    (r"T = \frac{2x + y}{3}", "y", r"y = 3T - 2x", [r"y = \frac{3T}{2x}", r"y = 3T + 2x", r"y = \frac{T - 2x}{3}"], "the weighted average of two scores"),
    (r"E = \frac{k}{d^2}", "d", r"d = \sqrt{\frac{k}{E}}", [r"d = \frac{k}{E^2}", r"d = \sqrt{kE}", r"d = \frac{\sqrt{k}}{E}"], "light intensity at a distance"),
]


def formula_rearrange(r):
    f, var, ans, ds, desc = pick(r, FORMULAS)
    q = {"prompt": S(r"The formula $[[f]]$ gives [[desc]]. Which equation correctly expresses $[[v]]$ in terms of the other variables?", f=f, desc=desc, v=var)}
    q.update(mcq_text(f"${ans}$", [f"${d}$" for d in ds], r))
    q["explanation"] = S(r"Isolate $[[v]]$ by undoing the operations on it in reverse order. The result is $[[ans]]$. Check by substituting it back into the original formula.", v=var, ans=ans)
    return q


# ======================================================== nonlinear equations
def factorable_solutions(r):
    r1, r2 = nz(r, -9, 9), nz(r, -9, 9)
    if r1 == r2:
        return None
    coefs = [1, -(r1 + r2), r1 * r2]
    lo, hi = sorted([r1, r2])
    correct = f"${lo}$ and ${hi}$"
    ds = [f"${-hi}$ and ${-lo}$", f"${lo}$ and ${-hi}$" if lo != -hi else f"${lo - 1}$ and ${hi}$", f"${-lo}$ and ${hi}$" if -lo != hi else f"${lo}$ and ${hi + 1}$"]
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q = {"prompt": S(r"What are the solutions to $[[p]] = 0$?", p=poly(coefs)), **res}
    q["explanation"] = S(r"Find two numbers that multiply to $[[c]]$ and add to $[[b]]$. The quadratic factors as $(x [[t1]])(x [[t2]]) = 0$, so $x = [[lo]]$ or $x = [[hi]]$.",
                         c=coefs[2], b=coefs[1], t1=term(-lo, "").strip(), t2=term(-hi, "").strip(), lo=lo, hi=hi)
    return q


def square_isolate(r):
    a, x = r.choice([1, 2, 3, 4, 5]), r.randint(2, 12)
    b = nz(r, -30, 30)
    c = a * x * x + b
    q = {"prompt": S(r"If $[[l]] = [[c]]$ and $x > 0$, what is the value of $x$?", l=poly([a, 0, b]), c=c)}
    q.update(spr(x))
    q["explanation"] = S(r"[[mv]] both sides: $[[ax2]] = [[r1]]$. Then $x^2 = [[x2]]$, and since $x > 0$, $x = [[x]]$.", mv=(f"Subtract ${b}$ from" if b > 0 else f"Add ${-b}$ to"), ax2=f"{a}x^2" if a != 1 else "x^2", r1=c - b, x2=x * x, x=x)
    return q


def radical_simple(r):
    a, b = r.randint(-9, 12), r.randint(2, 9)
    x = b * b - a
    q = {"prompt": S(r"If $\sqrt{[[inner]]} = [[b]]$, what is the value of $x$?", inner=lin(1, a), b=b)}
    q.update(mcq_num(x, [b - a, b * b + a, b * b], r) or {})
    q["explanation"] = S(r"Square both sides: $[[inner]] = [[b2]]$, so $x = [[x]]$. Check: $\sqrt{[[b2]]} = [[b]]$ ✓.", inner=lin(1, a), b2=b * b, x=x, b=b)
    return q if "choices" in q else None


def radical_extraneous(r):
    # sqrt(x + a) = x - c, with one valid and one extraneous root
    s = r.randint(1, 8)            # valid: x - c = s
    t = r.randint(1, 8)            # extraneous: x - c = -t
    c = r.randint(-5, 6)
    x1, x2 = c + s, c - t
    # (x - c)^2 = x + a must hold at both roots: sum of roots = 2c + 1
    if x1 + x2 != 2 * c + 1:
        return None
    a = (x1 - c) ** 2 - x1
    solve_check((x2 - c) ** 2 == x2 + a)
    if x1 + a < 0:
        return None
    q = {"prompt": S(r"What is the solution to the equation $\sqrt{[[inner]]} = [[rhs]]$?", inner=lin(1, a), rhs=lin(1, -c))}
    q.update(spr(x1))
    q["explanation"] = S(r"Square both sides: $[[inner]] = ([[rhs]])^2$, which gives $x = [[x1]]$ or $x = [[x2]]$. Check both in the original equation. $x = [[x2]]$ makes the right side $[[neg]]$, which is negative, but a square root can't be negative, so it is extraneous. The only solution is $[[x1]]$.",
                         inner=lin(1, a), rhs=lin(1, -c), x1=x1, x2=x2, neg=x2 - c)
    return q


def sum_product_roots(r):
    a, b = nz(r, 1, 4), nz(r, -12, 12)
    c, d = nz(r, 1, 4), nz(r, -12, 12)
    ra, rb = Fr(-b, a), Fr(-d, c)
    if ra == rb:
        return None
    ask = r.choice(["sum", "product"])
    val = ra + rb if ask == "sum" else ra * rb
    q = {"prompt": S(r"What is the [[ask]] of the solutions to $([[f1]])([[f2]]) = 0$?", ask=ask, f1=lin(a, b), f2=lin(c, d))}
    q.update(mcq_num(val, [-val, Fr(b + d) if ask == "sum" else Fr(b * d), (-ra + rb) if ask == "sum" else -ra * rb], r) or {})
    q["explanation"] = S(r"Set each factor equal to zero: $x = [[ra]]$ or $x = [[rb]]$. Their [[ask]] is $[[val]]$.", ra=ra, rb=rb, ask=ask, val=val)
    return q if "choices" in q else None


def discriminant_count(r):
    a = nz(r, -4, 4)
    kind = r.choice(["zero", "one", "two"])
    if kind == "one":
        h = nz(r, -6, 6)
        coefs = [a, -2 * a * h, a * h * h]
    else:
        b, c = r.randint(-10, 10), nz(r, -15, 15)
        coefs = [a, b, c]
    D = coefs[1] ** 2 - 4 * coefs[0] * coefs[2]
    real = {True: None}
    k = 0 if D < 0 else 1 if D == 0 else 2
    if {"zero": 0, "one": 1, "two": 2}[kind] != k:
        return None
    labels = ["Zero", "Exactly one", "Exactly two", "Infinitely many"]
    q = {"prompt": S(r"How many distinct real solutions does the equation $[[p]] = 0$ have?", p=poly(coefs)), "choices": labels, "answer": "ABCD"[k]}
    q["explanation"] = S(r"Use the discriminant $b^2 - 4ac = ([[b]])^2 - 4([[a]])([[c]]) = [[D]]$. [[why]]", b=coefs[1], a=coefs[0], c=coefs[2], D=D,
                         why={0: "A negative discriminant means no real solutions.", 1: "A discriminant of zero means exactly one real solution.", 2: "A positive discriminant means two distinct real solutions."}[k])
    return q


def parabola_line_intersection(r):
    r1, r2 = r.sample(range(-6, 8), 2)
    m, b = nz(r, -4, 4), r.randint(-6, 6)
    # x^2 + p x + q = m x + b  has roots r1, r2
    p = -(r1 + r2) + m
    qc = r1 * r2 + b
    coefs = [1, p, qc]
    ask = pick(r, [r1, r2])
    other = r2 if ask == r1 else r1
    q = {"prompt": S(r"$$y = [[par]]$$ $$y = [[line]]$$ The graphs of the equations above intersect at two points. Which of the following is the $x$-coordinate of one of the points?", par=poly(coefs), line=lin(m, b))}
    q.update(mcq_num(ask, [-ask, -other, ask + other], r) or {})
    if q.get("choices") and f"${other}$" in q["choices"]:
        return None
    q["explanation"] = S(r"Set the expressions equal: $[[par]] = [[line]]$, so $[[diff]] = 0$. That factors as $(x [[t1]])(x [[t2]]) = 0$, giving $x = [[r1]]$ or $x = [[r2]]$.",
                         par=poly(coefs), line=lin(m, b), diff=poly([1, p - m, qc - b]), t1=term(-r1, "").strip(), t2=term(-r2, "").strip(), r1=r1, r2=r2)
    return q if "choices" in q else None


def one_solution_k(r):
    kind = r.choice(["b", "c"])
    if kind == "b":
        h = r.randint(1, 9)
        c = h * h
        q = {"prompt": S(r"In the equation $x^2 + kx + [[c]] = 0$, $k$ is a positive constant. If the equation has exactly one real solution, what is the value of $k$?", c=c)}
        q.update(spr(2 * h))
        q["explanation"] = S(r"Exactly one real solution means the discriminant is zero: $k^2 - 4(1)([[c]]) = 0$, so $k^2 = [[k2]]$ and $k = [[k]]$.", c=c, k2=4 * c, k=2 * h)
    else:
        a, h = r.choice([1, 2, 3, 4]), nz(r, -6, 6)
        b = -2 * a * h
        c = a * h * h
        q = {"prompt": S(r"The equation $[[l]] + c = 0$, where $c$ is a constant, has exactly one real solution. What is the value of $c$?", l=poly([a, b, 0]))}
        q.update(spr(c))
        q["explanation"] = S(r"Set the discriminant to zero: $([[b]])^2 - 4([[a]])c = 0$, so $[[b2]] = [[a4]]c$ and $c = [[c]]$.", b=b, a=a, b2=b * b, a4=4 * a, c=c)
    return q


def rational_equation_roots(r):
    a, b = nz(r, 1, 6), r.choice([1, 2, 3, 4])
    # a/(x - b) = x/k  ->  x(x - b) = a k  -> x^2 - b x - a k = 0
    k = r.choice([2, 3, 4, 5, 6])
    prod = -a * k
    disc = b * b + 4 * a * k
    s = math.isqrt(disc)
    if s * s != disc:
        return None
    x1, x2 = Fr(b + s, 2), Fr(b - s, 2)
    if b in (x1, x2) or 0 in (x1, x2):
        return None
    for x in (x1, x2):
        solve_check(Fr(a) / (x - b) == x / k)
    ask = r.choice(["product", "sum"])
    val = x1 * x2 if ask == "product" else x1 + x2
    q = {"prompt": S(r"What is the [[ask]] of all solutions to the equation $\dfrac{[[a]]}{[[d]]} = \dfrac{x}{[[k]]}$?", ask=ask, a=a, d=lin(1, -b), k=k)}
    q.update(mcq_num(val, [-val, Fr(a * k) if ask == "product" else Fr(-b), val + 1 if ask == "sum" else val - 1], r) or {})
    q["explanation"] = S(r"Cross-multiply: $[[ak]] = x([[d]])$, so $[[p]] = 0$. The solutions are $[[x1]]$ and $[[x2]]$ (neither makes a denominator zero), and their [[ask]] is $[[val]]$.",
                         ak=a * k, d=lin(1, -b), p=poly([1, -b, -a * k]), x1=x1, x2=x2, ask=ask, val=val)
    return q if "choices" in q else None


def circle_line_system(r):
    trip = r.choice([(3, 4, 5), (6, 8, 10), (5, 12, 13), (0, 5, 5)])
    rad = trip[2]
    pts = [(x, y) for x in range(-rad, rad + 1) for y in range(-rad, rad + 1) if x * x + y * y == rad * rad]
    p1 = pick(r, pts)
    others = [p for p in pts if p != p1 and p[0] != p1[0]]
    if not others:
        return None
    p2 = pick(r, others)
    m = Fr(p2[1] - p1[1], p2[0] - p1[0])
    if m.denominator != 1:
        return None
    b = p1[1] - m * p1[0]
    target = max([p1, p2], key=lambda p: p[0])
    if target[0] <= 0 or min(p1[0], p2[0]) > 0:
        return None
    q = {"prompt": S(r"$$x^2 + y^2 = [[r2]]$$ $$y = [[line]]$$ If $(x, y)$ is a solution to the system of equations above and $x > 0$, what is the value of $x$?", r2=rad * rad, line=lin(m, b))}
    q.update(spr(target[0]))
    q["explanation"] = S(r"Substitute $y = [[line]]$ into the circle equation and solve the resulting quadratic. The solutions are $([[x1]], [[y1]])$ and $([[x2]], [[y2]])$. The one with $x > 0$ gives $x = [[t]]$.",
                         line=lin(m, b), x1=p1[0], y1=p1[1], x2=p2[0], y2=p2[1], t=target[0])
    return q


def quadratic_formula_choice(r):
    a, b, c = r.choice([1, 1, 2]), r.randint(-8, 8), nz(r, -9, 9)
    D = b * b - 4 * a * c
    s = math.isqrt(D) if D > 0 else 0
    if D <= 0 or s * s == D:
        return None
    correct = S(r"$\dfrac{[[mb]] + \sqrt{[[D]]}}{[[a2]]}$", mb=-b, D=D, a2=2 * a)
    ds = [S(r"$\dfrac{[[b]] + \sqrt{[[D]]}}{[[a2]]}$", b=b, D=D, a2=2 * a), S(r"$\dfrac{[[mb]] + \sqrt{[[D2]]}}{[[a2]]}$", mb=-b, D2=b * b + 4 * a * c, a2=2 * a),
          S(r"$[[mb]] + \dfrac{\sqrt{[[D]]}}{[[a2]]}$", mb=-b, D=D, a2=2 * a)]
    if b * b + 4 * a * c <= 0 or b == 0:
        return None
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q = {"prompt": S(r"Which of the following is a solution to $[[p]] = 0$?", p=poly([a, b, c])), **res}
    q["explanation"] = S(r"The quadratic doesn't factor nicely, so use $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ with $a = [[a]]$, $b = [[b]]$, $c = [[c]]$: $b^2 - 4ac = [[D]]$, so $x = \dfrac{[[mb]] \pm \sqrt{[[D]]}}{[[a2]]}$.",
                         a=a, b=b, c=c, D=D, mb=-b, a2=2 * a)
    return q


def exponential_equation(r):
    base = r.choice([2, 3, 5])
    k = r.randint(2, 6)
    val = base ** k
    if val > 5000:
        return None
    m, n = r.choice([1, 2, 3]), r.randint(-4, 4)
    x = Fr(k - n, m)
    q = {"prompt": S(r"What value of $x$ satisfies the equation $[[b]]^{[[e]]} = [[v]]$?", b=base, e=lin(m, n), v=big(val))}
    ans = spr(x)
    if not ans:
        return None
    q.update(ans)
    q["explanation"] = S(r"Write $[[v]]$ as a power of $[[b]]$: $[[v]] = [[b]]^{[[k]]}$. Set the exponents equal: $[[e]] = [[k]]$, so $x = [[x]]$.", v=big(val), b=base, k=k, e=lin(m, n), x=x)
    return q


def absolute_value(r):
    a, b = r.randint(-9, 9), r.randint(1, 12)
    ask = r.choice(["sum", "greater", "product"])
    s1, s2 = a + b, a - b
    val = {"sum": s1 + s2, "greater": s1, "product": s1 * s2}[ask]
    what = {"sum": "the sum of the solutions", "greater": "the greater of the two solutions", "product": "the product of the solutions"}[ask]
    q = {"prompt": S(r"The equation $|[[inner]]| = [[b]]$ has two solutions. What is [[what]]?", inner=lin(1, -a), b=b, what=what)}
    q.update(spr(val))
    q["explanation"] = S(r"$[[inner]] = [[b]]$ or $[[inner]] = -[[b]]$, so $x = [[s1]]$ or $x = [[s2]]$. The answer is $[[val]]$.", inner=lin(1, -a), b=b, s1=s1, s2=s2, val=val)
    return q


# ======================================================== nonlinear functions
def eval_quadratic(r):
    a, b, c, x = nz(r, -3, 4), r.randint(-8, 8), r.randint(-10, 10), nz(r, -5, 5)
    v = a * x * x + b * x + c
    q = {"prompt": S(r"The function $f$ is defined by $f(x) = [[p]]$. What is the value of $f([[x]])$?", p=poly([a, b, c]), x=x)}
    q.update(mcq_num(v, [a * (-x * -x if False else -(x * x)) + b * x + c, a * x * x - b * x + c, v + 2 * c if c else v + 4], r) or {})
    q["explanation"] = S(r"Substitute $x = [[x]]$: $f([[x]]) = [[a]]([[px]])^2 + [[b]]([[px]]) + [[pc]] = [[v]]$. Remember that $([[px]])^2 = [[x2]]$ is positive.",
                         x=x, a=a, px=num(x), b=b, pc=paren_num(c), v=v, x2=x * x)
    return q if "choices" in q else None


GROWTH = [("A colony of bacteria starts with [[n]] bacteria and doubles every [[p]] hours.", 2, "hours", "P(t)", "the number of bacteria"),
          ("A town's population is [[n]] and triples every [[p]] years.", 3, "years", "P(t)", "the population"),
          ("A sample of a substance has a mass of [[n]] grams and loses half of its mass every [[p]] days.", Fr(1, 2), "days", "M(t)", "the mass, in grams,"),
          ("The number of followers of a new account is [[n]] and doubles every [[p]] weeks.", 2, "weeks", "F(t)", "the number of followers")]


def growth_function(r):
    text, factor, unit, fn, what = pick(r, GROWTH)
    n, p = r.choice([100, 200, 250, 400, 500, 800, 1000, 1200]), r.choice([2, 3, 4, 5, 6, 8, 10])
    f = num(factor) if factor != Fr(1, 2) else r"\frac{1}{2}"
    fvar = fn[0]
    correct = f"${fn} = {n}({f})^{{\\frac{{t}}{{{p}}}}}$"
    ds = [f"${fn} = {n}({f})^{{{p}t}}$", f"${fn} = {n} + {f}\\left(\\frac{{t}}{{{p}}}\\right)$" if factor != Fr(1, 2) else f"${fn} = {n} - \\frac{{t}}{{{2 * p}}}$",
          f"${fn} = {f}({n})^{{\\frac{{t}}{{{p}}}}}$"]
    q = {"prompt": S(text, n=f"{n:,}", p=str(p)) + f" Which function gives {what} ${fn}$ after $t$ {unit}?", **mcq_text(correct, ds, r)}
    q["explanation"] = S(r"The starting amount is $[[n]]$, and it is multiplied by $[[f]]$ once every $[[p]]$ [[u]], so after $t$ [[u]] there have been $\frac{t}{[[p]]}$ multiplications.", n=n, f=f, p=p, u=unit)
    return q


def vertex_min_max(r):
    a, h, k = nz(r, -4, 4), nz(r, -8, 8), r.randint(-12, 12)
    kind = "minimum" if a > 0 else "maximum"
    q = {"prompt": S(r"The function $g$ is defined by $g(x) = [[a]](x [[ht]])^2 [[kt]]$. What is the [[kind]] value of $g(x)$?",
                     a=a if a not in (1, -1) else ("" if a == 1 else "-"), ht=term(-h, "").strip(), kt=term(k, "").strip() if k else "", kind=kind)}
    q.update(mcq_num(k, [h, -h, a + k], r) or {})
    q["explanation"] = S(r"$(x [[ht]])^2 \ge 0$ and equals $0$ when $x = [[h]]$. Because the coefficient $[[a]]$ is [[sign]], the graph opens [[dir]], so the [[kind]] is $g([[h]]) = [[k]]$. The vertex is $([[h]], [[k]])$.",
                         ht=term(-h, "").strip(), h=h, a=a, sign="positive" if a > 0 else "negative", dir="up" if a > 0 else "down", kind=kind, k=k)
    return q if "choices" in q else None


def percent_base_interp(r):
    kind = r.choice(["decay", "growth"])
    pct = r.choice([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30])
    base = Fr(100 - pct, 100) if kind == "decay" else Fr(100 + pct, 100)
    b = f"{float(base):.2f}".rstrip("0").rstrip(".")
    things = [("The value $V$, in dollars, of a car $t$ years after it was purchased is modeled by $V(t) = [[n]](" + b + ")^t$.", "value", "year"),
              ("The number of users $U$ of an app $t$ months after launch is modeled by $U(t) = [[n]](" + b + ")^t$.", "number of users", "month"),
              ("The mass $M$, in grams, of a substance $t$ hours after an experiment begins is modeled by $M(t) = [[n]](" + b + ")^t$.", "mass", "hour")]
    text, what, unit = pick(r, things)
    n = r.choice(["24{,}000", "18{,}500", "3{,}200", "950", "12{,}000"])
    up = "increases" if kind == "growth" else "decreases"
    down = "decreases" if kind == "growth" else "increases"
    correct = f"The {what} {up} by {pct}% each {unit}."
    ds = [f"The {what} {up} by {100 - pct if kind == 'decay' else 100 + pct}% each {unit}.", f"The {what} {down} by {pct}% each {unit}.", f"The {what} {up} by ${b}$ each {unit}."]
    q = {"prompt": S(text, n=n) + S(r" Which statement is the best interpretation of $[[b]]$ in this context?", b=b), **mcq_text(correct, ds, r)}
    q["explanation"] = S(r"Each [[u]] the [[w]] is multiplied by $[[b]]$, which is $[[p100]]\%$ of the previous amount. That is a [[pct]]% [[dir]] each [[u]].",
                         u=unit, w=what, b=b, p100=int(base * 100), pct=pct, dir="increase" if kind == "growth" else "decrease")
    return q


def projectile_max(r):
    v = r.choice([16, 32, 48, 64, 80, 96, 112, 128])
    h0 = r.randint(0, 40)
    t = Fr(v, 32)
    hmax = -16 * t * t + v * t + h0
    ask = r.choice(["height", "time"])
    q = {"prompt": S(r"The height $h$, in feet, of a ball $t$ seconds after it is thrown upward is modeled by $h(t) = -16t^2 + [[v]]t[[h0]]$. [[ask]]",
                     v=v, h0=term(h0, "") if h0 else "", ask="What is the maximum height, in feet, that the ball reaches?" if ask == "height" else "How many seconds after it is thrown does the ball reach its maximum height?")}
    ans = spr(hmax if ask == "height" else t)
    if not ans:
        return None
    q.update(ans)
    q["explanation"] = S(r"The vertex is at $t = -\dfrac{b}{2a} = -\dfrac{[[v]]}{2(-16)} = [[t]]$. [[more]]", v=v, t=t,
                         more=S(r"Then $h([[t]]) = -16([[t]])^2 + [[v]]([[t]]) + [[h0]] = [[hm]]$.", t=t, v=v, h0=h0, hm=hmax) if ask == "height" else "That is when the ball is highest.")
    return q


def vertex_from_factored(r):
    r1, r2 = r.sample(range(-9, 10), 2)
    if (r1 + r2) % 2:
        return None
    a = r.choice([1, -1, 2, -2, 3])
    h = (r1 + r2) // 2
    q = {"prompt": S(r"The function $f$ is defined by $f(x) = [[a]](x [[t1]])(x [[t2]])$. What is the $x$-coordinate of the vertex of the graph of $y = f(x)$?",
                     a=a if a not in (1, -1) else ("" if a == 1 else "-"), t1=term(-r1, "").strip(), t2=term(-r2, "").strip())}
    q.update(mcq_num(h, [-h, r1 - r2 if r1 != r2 else h + 3, r1 + r2], r) or {})
    q["explanation"] = S(r"The zeros are $[[r1]]$ and $[[r2]]$. A parabola's vertex is halfway between its zeros: $\dfrac{[[r1]] + [[pr2]]}{2} = [[h]]$.", r1=r1, r2=r2, pr2=paren_num(r2), h=h)
    return q if "choices" in q else None


def exp_from_two_values(r):
    a = r.choice([10, 20, 40, 50, 80, 100, 200, 250, 500])
    b = r.choice([Fr(6, 5), Fr(3, 2), 2, 3, Fr(4, 5), Fr(1, 2), Fr(11, 10), Fr(9, 10)])
    k = r.choice([2, 3])
    fk = a * b ** k
    if fk.denominator != 1:
        return None
    bs = lambda v: f"{float(v):g}"
    correct = f"$f(x) = {a}({bs(b)})^x$"
    ds = [f"$f(x) = {a}({bs(b ** k)})^x$", f"$f(x) = {num(fk)}({bs(b)})^x$", f"$f(x) = {a}({bs(b + Fr(1, 10) if b.denominator != 1 else b + 1)})^x$"]
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q = {"prompt": S(r"An exponential function $f$ satisfies $f(0) = [[a]]$ and $f([[k]]) = [[fk]]$. Which equation could define $f$?", a=a, k=k, fk=fk), **res}
    q["explanation"] = S(r"Write $f(x) = a \cdot b^x$. Then $f(0) = a = [[a]]$, and $[[a]]b^{[[k]]} = [[fk]]$ gives $b^{[[k]]} = [[bk]]$, so $b = [[b]]$.", a=a, k=k, fk=fk, bk=bs(b ** k), b=bs(b))
    return q


def min_value_k(r):
    a = r.choice([1, 2, 3, 4, -1, -2, -3])
    h = nz(r, -6, 6)
    target = r.randint(-15, 15)
    b = -2 * a * h
    k = target - (a * h * h + b * h)
    kind = "minimum" if a > 0 else "maximum"
    q = {"prompt": S(r"The function $f$ is defined by $f(x) = [[p]] + k$, where $k$ is a constant. If the [[kind]] value of $f(x)$ is $[[t]]$, what is the value of $k$?", p=poly([a, b, 0]), kind=kind, t=target)}
    q.update(spr(k))
    solve_check(a * h * h + b * h + k == target)
    q["explanation"] = S(r"The vertex occurs at $x = -\dfrac{b}{2a} = [[h]]$. Then $f([[h]]) = [[a]]([[ph]])^2 + [[pb]]([[ph]]) + k = [[val]] + k$. Setting this equal to $[[t]]$ gives $k = [[k]]$.",
                         h=h, a=a, ph=paren_num(h), pb=paren_num(b), val=a * h * h + b * h, t=target, k=k)
    return q


def exp_values_predict(r):
    a = r.choice([3, 4, 5, 6, 8, 10, 12])
    b = r.choice([2, 3, 4])
    n = r.choice([3, 4])
    val = a * b ** n
    q = {"prompt": S(r"For the exponential function $f$, $f(0) = [[a]]$ and $f(1) = [[f1]]$. What is the value of $f([[n]])$?", a=a, f1=a * b, n=n)}
    q.update(spr(val))
    q["explanation"] = S(r"Each time $x$ increases by 1, $f$ is multiplied by $\frac{[[f1]]}{[[a]]} = [[b]]$. So $f([[n]]) = [[a]] \cdot [[b]]^{[[n]]} = [[v]]$.", f1=a * b, a=a, b=b, n=n, v=val)
    return q if q.get("answer") else None


def x_intercepts_poly(r):
    roots = r.sample(range(-7, 8), 3)
    a = r.choice([1, 2, -1])
    good = pick(r, roots)
    correct = f"$({good}, 0)$"
    ds = [f"$({-good}, 0)$" if -good not in roots else f"$({good + 10}, 0)$", f"$(0, {good})$", f"$(0, {-a * roots[0] * roots[1] * roots[2]})$"]
    res = mcq_text(correct, ds, r)
    if not res or good == 0:
        return None
    fac = "".join(f"(x {term(-x, '').strip()})" if x else "x" for x in roots)
    q = {"prompt": S(r"The function $p$ is defined by $p(x) = [[a]][[fac]]$. Which of the following is an $x$-intercept of the graph of $y = p(x)$?", a="" if a == 1 else ("-" if a == -1 else a), fac=fac), **res}
    q["explanation"] = S(r"An $x$-intercept occurs where $p(x) = 0$, which happens when a factor equals zero: $x = [[r0]]$, $x = [[r1]]$, or $x = [[r2]]$. So $([[g]], 0)$ is an $x$-intercept. Note the sign flip: the factor $(x - c)$ gives the zero $x = c$.",
                         r0=roots[0], r1=roots[1], r2=roots[2], g=good)
    return q


def transformation_eval(r):
    a, b, c = nz(r, -3, 3), r.randint(-6, 6), r.randint(-8, 8)
    h, k = nz(r, -5, 5), nz(r, -9, 9)
    x0 = r.randint(-4, 5)
    f = lambda x: a * x * x + b * x + c
    val = f(x0 - h) + k
    q = {"prompt": S(r"The function $f$ is defined by $f(x) = [[p]]$. The function $g$ is defined by $g(x) = f([[inner]])[[kt]]$. What is the value of $g([[x0]])$?",
                     p=poly([a, b, c]), inner=lin(1, -h), kt=term(k, ""), x0=x0)}
    q.update(spr(val))
    q["explanation"] = S(r"$g([[x0]]) = f([[x0]] [[ht]])[[kt]] = f([[xi]])[[kt]]$. Since $f([[xi]]) = [[fv]]$, $g([[x0]]) = [[val]]$.",
                         x0=x0, ht=term(-h, "").strip(), kt=term(k, ""), xi=x0 - h, fv=f(x0 - h), val=val)
    return q


def compound_growth_value(r):
    p0 = r.choice([500, 800, 1000, 1500, 2000, 2500, 4000, 5000])
    rate = r.choice([2, 3, 4, 5, 6, 8, 10])
    n = r.choice([2, 3])
    val = p0 * (1 + Fr(rate, 100)) ** n
    rounded = int(val + Fr(1, 2))
    ctx = pick(r, [("An investment of [[p]] dollars earns [[r]]% interest compounded annually.", "the value of the investment, in dollars, after [[n]] years"),
                   ("A town with a population of [[p]] grows by [[r]]% each year.", "the population of the town after [[n]] years"),
                   ("A savings account opens with [[p]] dollars and grows by [[r]]% each year.", "the account balance, in dollars, after [[n]] years")])
    q = {"prompt": S(ctx[0], p=f"{p0:,}", r=str(rate)) + " " + S("To the nearest whole number, what is " + ctx[1] + "?", n=str(n))}
    ans = spr(rounded)
    if not ans:
        return None
    q.update(ans)
    q["explanation"] = S(r"Multiply by $1 + [[rd]] = [[m]]$ once per year: $[[p]]([[m]])^{[[n]]} \approx [[v]]$, which rounds to $[[rr]]$. Adding $[[rate]]\%$ of the original amount each year would ignore compounding.",
                         rd=f"{rate / 100:g}", m=f"{1 + rate / 100:g}", p=p0, n=n, v=f"{float(val):.2f}", rr=rounded, rate=rate)
    return q


def composition_numeric(r):
    a, b = nz(r, -4, 5), r.randint(-6, 6)
    c, d = nz(r, -3, 3), r.randint(-6, 6)
    x0 = r.randint(-3, 4)
    f = lambda x: a * x + b
    g = lambda x: c * x * x + d
    order = r.choice(["fg", "gf"])
    val = f(g(x0)) if order == "fg" else g(f(x0))
    q = {"prompt": S(r"The functions $f$ and $g$ are defined by $f(x) = [[fe]]$ and $g(x) = [[ge]]$. What is the value of $[[o1]]([[o2]]([[x0]]))$?",
                     fe=lin(a, b), ge=poly([c, 0, d]), o1=order[0], o2=order[1], x0=x0)}
    q.update(spr(val))
    inner = g(x0) if order == "fg" else f(x0)
    q["explanation"] = S(r"Work from the inside out: $[[o2]]([[x0]]) = [[inner]]$. Then $[[o1]]([[inner]]) = [[val]]$.", o2=order[1], x0=x0, inner=inner, o1=order[0], val=val)
    return q


TEMPLATES = [
    ("equivalent-expressions", 1, add_polys, 70), ("equivalent-expressions", 1, distribute_combine, 60), ("equivalent-expressions", 1, diff_squares, 45),
    ("equivalent-expressions", 2, square_binomial_coef, 70), ("equivalent-expressions", 2, binomial_product_k, 70), ("equivalent-expressions", 2, which_factor, 60),
    ("equivalent-expressions", 2, rational_simplify, 60), ("equivalent-expressions", 3, add_rational, 60), ("equivalent-expressions", 3, rational_exponent, 50),
    ("equivalent-expressions", 2, radical_to_exponent, 24), ("equivalent-expressions", 2, formula_rearrange, 15),
    ("nonlinear-equations", 1, factorable_solutions, 70), ("nonlinear-equations", 1, square_isolate, 60), ("nonlinear-equations", 1, radical_simple, 50),
    ("nonlinear-equations", 3, radical_extraneous, 50), ("nonlinear-equations", 2, sum_product_roots, 60), ("nonlinear-equations", 2, discriminant_count, 60),
    ("nonlinear-equations", 2, parabola_line_intersection, 60), ("nonlinear-equations", 3, one_solution_k, 50), ("nonlinear-equations", 3, rational_equation_roots, 50),
    ("nonlinear-equations", 3, circle_line_system, 30), ("nonlinear-equations", 3, quadratic_formula_choice, 60), ("nonlinear-equations", 2, exponential_equation, 50),
    ("nonlinear-equations", 2, absolute_value, 60),
    ("nonlinear-functions", 1, eval_quadratic, 60), ("nonlinear-functions", 1, growth_function, 60), ("nonlinear-functions", 1, vertex_min_max, 60),
    ("nonlinear-functions", 2, percent_base_interp, 60), ("nonlinear-functions", 2, projectile_max, 50), ("nonlinear-functions", 2, vertex_from_factored, 50),
    ("nonlinear-functions", 3, exp_from_two_values, 50), ("nonlinear-functions", 3, min_value_k, 60), ("nonlinear-functions", 2, exp_values_predict, 40),
    ("nonlinear-functions", 2, x_intercepts_poly, 50), ("nonlinear-functions", 3, transformation_eval, 60), ("nonlinear-functions", 2, compound_growth_value, 50),
    ("nonlinear-functions", 2, composition_numeric, 60),
]
