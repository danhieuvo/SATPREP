"""Math > Algebra generators. Every answer is computed, then re-checked by substitution."""
from fractions import Fraction as Fr
from .common import move, S, num, money, big, lin, poly, term, paren_num, mcq_num, mcq_text, spr, pick, nz, solve_check

SECTION, DOMAIN = "math", "algebra"


# ======================================================== linear equations in one variable
def solve_axb(r):
    a, x, b = nz(r, 2, 9), r.randint(-9, 14), nz(r, -25, 25)
    c = a * x + b
    q = {"prompt": S(r"If $[[e]] = [[c]]$, what is the value of $x$?", e=lin(a, b), c=c)}
    q.update(mcq_num(x, [Fr(c + b, a), c - b, Fr(c, a) - b], r) or {})
    q["explanation"] = S(r"[[mv]] both sides: $[[a]]x = [[cb]]$. Divide by $[[a]]$: $x = [[x]]$.",
                         mv=move(b), a=a, cb=c - b, x=x)
    return q if "choices" in q else None


def solve_distribute(r):
    a, b, c = nz(r, 2, 8), nz(r, -9, 9), nz(r, -9, 9)
    x = r.randint(-8, 12)
    if c == a:
        return None
    d = a * (x + b) - c * x
    wrong = Fr(d - b, a - c)  # forgot to distribute
    q = {"prompt": S(r"What value of $x$ is the solution to the equation $[[a]]([[inner]]) = [[rhs]]$?",
                     a=a, inner=lin(1, b), rhs=lin(c, d))}
    q.update(mcq_num(x, [wrong, -x, x + 2], r) or {})
    q["explanation"] = S(r"Distribute: $[[l]] = [[rhs]]$. Collect $x$-terms: $[[ac]]x = [[k]]$, so $x = [[x]]$.",
                         l=lin(a, a * b), rhs=lin(c, d), ac=a - c, k=d - a * b, x=x)
    return q if "choices" in q else None


def scaled_expression(r):
    a, b = nz(r, 2, 9), nz(r, -15, 15)
    x = Fr(r.randint(-10, 15))
    c = a * x + b
    k = r.choice([2, 3, 4, 5])
    target = k * c
    q = {"prompt": S(r"If $[[e]] = [[c]]$, what is the value of $[[e2]]$?", e=lin(a, b), c=c, e2=lin(k * a, k * b))}
    q.update(mcq_num(target, [c, x, k * c + (k - 1) * b], r) or {})
    q["explanation"] = S(r"Notice that $[[e2]] = [[k]]([[e]])$. So its value is $[[k]] \times [[c]] = [[t]]$. There is no need to solve for $x$.",
                         e2=lin(k * a, k * b), k=k, e=lin(a, b), c=c, t=target)
    return q if "choices" in q else None


FEE_CONTEXTS = [
    ("A plumber charges a flat fee of [[f]] for a visit plus [[r]] per hour of work. A customer's bill was [[t]].", "For how many hours did the plumber work?", "hours"),
    ("A gym charges a one-time sign-up fee of [[f]] plus [[r]] per month. Dana has paid [[t]] in total.", "For how many months has Dana been a member?", "months"),
    ("An electrician charges [[f]] to come to a house plus [[r]] per hour. The total charge for one job was [[t]].", "How many hours did the job take?", "hours"),
    ("A bike rental shop charges [[f]] plus [[r]] per hour. A rental cost [[t]].", "For how many hours was the bike rented?", "hours"),
    ("A moving company charges a base price of [[f]] plus [[r]] per mile. A move cost [[t]].", "How many miles long was the move?", "miles"),
    ("A caterer charges a setup fee of [[f]] plus [[r]] per guest. The bill for an event was [[t]].", "How many guests attended?", "guests"),
    ("A phone plan costs [[f]] per month plus [[r]] per gigabyte of data used. One month's bill was [[t]].", "How many gigabytes of data were used that month?", "gigabytes"),
]


def fee_word(r):
    ctx, ask, unit = pick(r, FEE_CONTEXTS)
    f, rate = r.choice(range(15, 125, 5)), r.choice([4, 6, 8, 12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 55])
    h = r.choice([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 1.5, 2.5, 3.5, 4.5]) if unit == "hours" else r.randint(2, 40)
    h = Fr(h).limit_denominator(4)
    t = f + rate * h
    ans = spr(h)
    if not ans:
        return None
    q = {"prompt": S(ctx, f=f"${money(f)}$", r=f"${money(rate)}$", t=f"${money(t)}$") + " " + ask}
    q.update(ans)
    q["explanation"] = S(r"Set up $[[f]] + [[r]]n = [[t]]$. Subtract: $[[r]]n = [[d]]$, so $n = [[h]]$.",
                         f=f, r=rate, t=num(Fr(t)) if Fr(t).denominator == 1 else f"{float(t):.2f}", d=num(Fr(t - f)) if Fr(t - f).denominator == 1 else f"{float(t - f):.2f}", h=num(h) if h.denominator == 1 else f"{float(h):g}")
    return q


def identity_constant(r):
    """k(px + q) = rx + s ; no solution or infinitely many."""
    p, q_, k = nz(r, 1, 6), nz(r, -9, 9), nz(r, -6, 6, exclude=(0, 1))
    rr = k * p
    mode = r.choice(["none", "many"])
    s = k * q_ if mode == "many" else k * q_ + nz(r, -12, 12)
    if mode == "many":
        q = {"prompt": S(r"In the equation $[[k]]([[inner]]) = [[rx]] + c$, $c$ is a constant. If the equation has infinitely many solutions, what is the value of $c$?",
                         k=k, inner=lin(p, q_), rx=poly([rr, 0]).replace(" + 0", ""))}
        q.update(spr(s) or {})
        q["explanation"] = S(r"Distribute: $[[l]]$. For infinitely many solutions the two sides must be identical, so $c = [[s]]$.",
                             l=lin(rr, k * q_), s=s)
        return q if "answer" in q else None
    q = {"prompt": S(r"In the equation $a([[inner]]) = [[rhs]]$, $a$ is a constant. If the equation has no solution, what is the value of $a$?",
                     inner=lin(p, q_), rhs=lin(rr, s))}
    q.update(mcq_num(k, [-k, Fr(s, q_), rr], r) or {})
    q["explanation"] = S(r"Distribute: $[[ap]]x [[aq]] = [[rhs]]$. No solution means equal $x$-coefficients but different constants. $[[p]]a = [[rr]]$ gives $a = [[k]]$; then the constants are $[[kq]]$ and $[[s]]$, which differ.",
                         ap=f"{p}a" if p != 1 else "a", aq=("+ " if q_ > 0 else "- ") + (f"{abs(q_)}a"), rhs=lin(rr, s), p=p, rr=rr, k=k, kq=k * q_, s=s)
    return q if "choices" in q else None


def fraction_sum(r):
    a, b = r.choice([(2, 3), (3, 4), (2, 5), (3, 6), (4, 6), (4, 5), (5, 10), (6, 3), (2, 6), (3, 5)])
    x = a * b * r.randint(1, 4) // 1
    c = Fr(x, a) + Fr(x, b)
    if c.denominator != 1:
        return None
    q = {"prompt": S(r"What is the solution to the equation $\frac{x}{[[a]]} + \frac{x}{[[b]]} = [[c]]$?", a=a, b=b, c=c)}
    q.update(spr(x))
    q["explanation"] = S(r"Multiply both sides by $[[l]]$ to clear the fractions: $[[ca]]x + [[cb]]x = [[rhs]]$, so $[[s]]x = [[rhs]]$ and $x = [[x]]$.",
                         l=a * b, ca=b, cb=a, rhs=c * a * b, s=a + b, x=x)
    return q


def cross_fraction(r):
    b, d = r.randint(2, 9), r.randint(2, 9)
    if b == d:
        return None
    a, c = nz(r, -9, 9), nz(r, -9, 9)
    x = Fr(-b * c - d * a, d - b)
    if x.denominator != 1 or abs(x) > 60:
        return None
    solve_check(Fr(x + a, b) == Fr(x - c, d))
    q = {"prompt": S(r"What is the solution to the equation $\dfrac{[[n1]]}{[[b]]} = \dfrac{[[n2]]}{[[d]]}$?", n1=lin(1, a), b=b, n2=lin(1, -c), d=d)}
    q.update(spr(x) or {})
    q["explanation"] = S(r"Cross-multiply: $[[d]]([[n1]]) = [[b]]([[n2]])$, so $[[l]] = [[rt]]$. Then $[[k]]x = [[m]]$ and $x = [[x]]$.",
                         d=d, n1=lin(1, a), b=b, n2=lin(1, -c), l=lin(d, d * a), rt=lin(b, -b * c), k=d - b, m=-b * c - d * a, x=x)
    return q if "answer" in q else None


# ======================================================== linear functions
def eval_linear(r):
    m, b, x = nz(r, -9, 9), nz(r, -20, 20), nz(r, -8, 10)
    v = m * x + b
    q = {"prompt": S(r"The function $f$ is defined by $f(x) = [[e]]$. What is the value of $f([[x]])$?", e=lin(m, b), x=x)}
    q.update(mcq_num(v, [m * x - b, m + x + b, -v], r) or {})
    q["explanation"] = S(r"Substitute: $f([[x]]) = [[m]][[px]] [[bs]] = [[v]]$.", x=x, m=m, px=paren_num(x), bs=term(b, "").strip() if b else "", v=v)
    q["explanation"] = S(r"Substitute $x = [[x]]$: $f([[x]]) = [[m]] \cdot [[px]] + [[pb]] = [[v]]$.", x=x, m=paren_num(m), px=paren_num(x), pb=paren_num(b), v=v)
    return q if "choices" in q else None


def slope_two_points(r):
    x1, y1 = r.randint(-9, 9), r.randint(-9, 9)
    x2, y2 = r.randint(-9, 9), r.randint(-9, 9)
    if x1 == x2 or y1 == y2:
        return None
    m = Fr(y2 - y1, x2 - x1)
    q = {"prompt": S(r"A line in the $xy$-plane passes through the points $([[x1]], [[y1]])$ and $([[x2]], [[y2]])$. What is the slope of the line?",
                     x1=x1, y1=y1, x2=x2, y2=y2)}
    q.update(mcq_num(m, [1 / m, -m, Fr(x2 - x1, y2 - y1) * -1], r) or {})
    q["explanation"] = S(r"Slope $= \dfrac{y_2 - y_1}{x_2 - x_1} = \dfrac{[[dy]]}{[[dx]]} = [[m]]$.", dy=y2 - y1, dx=x2 - x1, m=m)
    return q if "choices" in q else None


INTERP_CONTEXTS = [
    # (function statement, var meaning, slope meaning, intercept meaning, wrong1, wrong2)
    ("The total cost $C$, in dollars, of renting a kayak for $h$ hours is given by $C(h) = [[m]]h + [[b]]$.",
     "the additional cost, in dollars, for each hour of rental", "the fixed cost, in dollars, charged for any rental",
     "the total number of hours the kayak was rented", "the total cost, in dollars, of a 1-hour rental"),
    ("The amount of money $A$, in dollars, in Jordan's savings account $w$ weeks after opening it is given by $A(w) = [[m]]w + [[b]]$.",
     "the amount, in dollars, Jordan adds to the account each week", "the amount, in dollars, in the account when it was opened",
     "the number of weeks Jordan has saved", "the amount, in dollars, in the account after 1 week"),
    ("The height $H$, in centimeters, of a plant $d$ days after it was measured is modeled by $H(d) = [[m]]d + [[b]]$.",
     "the predicted increase in height, in centimeters, per day", "the height, in centimeters, of the plant when it was first measured",
     "the number of days the plant has grown", "the height, in centimeters, of the plant after 1 day"),
    ("The number of pages $P$ in a printed report is given by $P(n) = [[m]]n + [[b]]$, where $n$ is the number of chapters.",
     "the number of pages added for each chapter", "the number of pages in the report that are not part of any chapter",
     "the total number of chapters", "the number of pages in a report with 1 chapter"),
    ("The total fee $F$, in dollars, for a delivery of $m$ miles is given by $F(m) = [[m]]m + [[b]]$.",
     "the additional fee, in dollars, for each mile", "the fee, in dollars, charged before any miles are driven",
     "the number of miles driven", "the total fee, in dollars, for a 1-mile delivery"),
]


def interpret_linear(r):
    stmt, slope_m, int_m, w1, w2 = pick(r, INTERP_CONTEXTS)
    m, b = r.choice([2, 3, 4, 5, 6, 8, 12, 15, 25]), r.choice([10, 20, 25, 30, 40, 45, 50, 60, 75])
    ask_slope = r.random() < 0.5
    ask = m if ask_slope else b
    correct = slope_m if ask_slope else int_m
    others = [int_m if ask_slope else slope_m, w1, w2]
    q = {"prompt": S(stmt, m=m, b=b) + S(r" What is the best interpretation of $[[v]]$ in this context?", v=ask)}
    q.update(mcq_text(correct[0].upper() + correct[1:], [o[0].upper() + o[1:] for o in others], r))
    q["explanation"] = ("In a linear model, the coefficient of the variable is the rate of change (the amount added per unit), and the constant term is the starting value when the variable is 0. "
                        + S(r"Here $[[v]]$ is ", v=ask) + ("the coefficient, so it is " if ask_slope else "the constant term, so it is ") + correct + ".")
    return q


def two_values_find(r):
    m, b = nz(r, -6, 8), nz(r, -15, 15)
    p1, p2 = r.sample(range(-6, 10), 2)
    k = r.randint(-8, 15)
    target = m * k + b
    q = {"prompt": S(r"For the linear function $g$, $g([[p1]]) = [[v1]]$ and $g([[p2]]) = [[v2]]$. If $g(k) = [[t]]$, what is the value of $k$?",
                     p1=p1, v1=m * p1 + b, p2=p2, v2=m * p2 + b, t=target)}
    q.update(spr(k) or {})
    q["explanation"] = S(r"The slope is $\dfrac{[[v2]] - [[pv1]]}{[[p2]] - [[pp1]]} = [[m]]$. Using $g([[p1]]) = [[v1]]$ gives $g(x) = [[e]]$. Then $[[e2]] = [[t]]$ gives $k = [[k]]$.",
                         v2=m * p2 + b, pv1=paren_num(m * p1 + b), p2=p2, pp1=paren_num(p1), m=m, p1=p1, v1=m * p1 + b, e=lin(m, b), e2=lin(m, b, "k"), t=target, k=k)
    return q if "answer" in q else None


def table_to_equation(r):
    m, b = nz(r, -7, 9), r.randint(-12, 15)
    xs = sorted(r.sample(range(0, 8), 3))
    rows = "".join(S(r"<tr><td>$[[x]]$</td><td>$[[y]]$</td></tr>", x=x, y=m * x + b) for x in xs)
    correct = f"$y = {lin(m, b)}$"
    ds = [f"$y = {lin(b, m)}$" if b not in (0,) else f"$y = {lin(m, m)}$", f"$y = {lin(m, -b)}$", f"$y = {lin(m + 1, b - xs[0])}$"]
    table = f"<table><tr><th>$x$</th><th>$y$</th></tr>{rows}</table>"
    q = {"prompt": table + "<p>The table shows three values of $x$ and their corresponding values of $y$. There is a linear relationship between $x$ and $y$. Which equation represents this relationship?</p>"}
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q.update(res)
    q["explanation"] = S(r"The slope is the change in $y$ over the change in $x$: $\dfrac{[[dy]]}{[[dx]]} = [[m]]$. Substituting $([[x0]], [[y0]])$ into $y = [[m]]x + b$ gives $b = [[b]]$.",
                         dy=m * (xs[1] - xs[0]), dx=xs[1] - xs[0], m=m, x0=xs[0], y0=m * xs[0] + b, b=b)
    return q


def drain_model(r):
    things = [("A water tank contains [[v]] gallons of water. Water drains from the tank at a constant rate of [[k]] gallons per minute.", "gallons of water in the tank", "t", "minutes"),
              ("A phone's battery is at [[v]]% charge and loses [[k]] percentage points of charge per hour of use.", "percent charge remaining", "t", "hours of use"),
              ("A gift card has a balance of [[v]] dollars. Each coffee purchase costs [[k]] dollars.", "balance, in dollars, on the card", "t", "coffee purchases"),
              ("A candle is [[v]] centimeters tall and burns down at a rate of [[k]] centimeters per hour.", "height, in centimeters, of the candle", "t", "hours")]
    text, what, var, unit = pick(r, things)
    v, k = r.choice([60, 80, 90, 100, 120, 150, 200, 240, 300, 500]), r.choice([2, 3, 4, 5, 6, 8, 10])
    correct = f"$f(t) = {v} - {k}t$"
    ds = [f"$f(t) = {k} - {v}t$", f"$f(t) = {v} + {k}t$", f"$f(t) = {v}t - {k}$"]
    q = {"prompt": S(text, v=v, k=k) + f" Which function $f$ gives the {what} after $t$ {unit}?"}
    q.update(mcq_text(correct, ds, r))
    q["explanation"] = S(r"The quantity starts at $[[v]]$ and decreases by $[[k]]$ for each unit of $t$, so $f(t) = [[v]] - [[k]]t$.", v=v, k=k)
    return q


def linear_composition(r):
    a, b, c = nz(r, -6, 7, exclude=(0, 1)), nz(r, -9, 9), r.choice([2, 3, -1, -2])
    correct = f"${lin(a * c, b)}$"
    ds = [f"${lin(c * a, c * b)}$", f"${lin(a, b * c)}$", f"${lin(a + c, b)}$"]
    q = {"prompt": S(r"The function $f$ is defined by $f(x) = [[e]]$. Which expression is equivalent to $f([[cx]])$?", e=lin(a, b), cx=lin(c, 0).replace(" + 0", "") if c != -1 else "-x")}
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q.update(res)
    q["explanation"] = S(r"Replace every $x$ in $f(x)$ with $[[cx]]$: $f([[cx]]) = [[a]]([[cx]])[[bt]] = [[res]]$. Only the input is multiplied, not the constant term.",
                         cx=f"{c}x" if c != -1 else "-x", a=a, bt=term(b, ""), res=lin(a * c, b))
    return q


# ======================================================== linear equations in two variables
def point_on_line(r):
    a, b = nz(r, 1, 7), nz(r, -7, 7)
    x0, y0 = r.randint(-6, 8), r.randint(-6, 8)
    c = a * x0 + b * y0
    pts = [(x0, y0)]
    while len(pts) < 4:
        p = (x0 + r.randint(-3, 3), y0 + r.randint(-3, 3))
        if p not in pts and a * p[0] + b * p[1] != c:
            pts.append(p)
    labels = [f"$({p[0]}, {p[1]})$" for p in pts]
    q = {"prompt": S(r"Which point lies on the line with equation $[[l]] = [[c]]$?", l=poly([a, 0]).replace(" + 0", "") + term(b, "y"), c=c)}
    q.update(mcq_text(labels[0], labels[1:], r))
    q["explanation"] = S(r"Substitute each point. For $([[x]], [[y]])$: $[[a]]([[x]]) + [[pb]]([[y]]) = [[c]]$ ✓. The other points give different values.",
                         x=x0, y=y0, a=a, pb=paren_num(b), c=c)
    return q


def intercept_spr(r):
    a, b = nz(r, -9, 9), nz(r, -9, 9)
    axis = r.choice(["x", "y"])
    k = nz(r, -10, 10)
    c = (a if axis == "x" else b) * k
    eq = poly([a, 0]).replace(" + 0", "") + term(b, "y")
    if axis == "x":
        q = {"prompt": S(r"The graph of $[[eq]] = [[c]]$ in the $xy$-plane crosses the $x$-axis at the point $(a, 0)$. What is the value of $a$?", eq=eq, c=c)}
        q["explanation"] = S(r"On the $x$-axis, $y = 0$, so $[[a]]x = [[c]]$ and $x = [[k]]$.", a=a, c=c, k=k)
    else:
        q = {"prompt": S(r"The graph of $[[eq]] = [[c]]$ in the $xy$-plane crosses the $y$-axis at the point $(0, b)$. What is the value of $b$?", eq=eq, c=c)}
        q["explanation"] = S(r"On the $y$-axis, $x = 0$, so $[[b]]y = [[c]]$ and $y = [[k]]$.", b=b, c=c, k=k)
    q.update(spr(k))
    return q


def slope_standard_form(r):
    a, b, c = nz(r, -9, 9), nz(r, -9, 9), nz(r, -20, 20)
    if abs(a) == abs(b):
        return None
    m = Fr(-a, b)
    q = {"prompt": S(r"What is the slope of the graph of $[[eq]] = [[c]]$ in the $xy$-plane?", eq=poly([a, 0]).replace(" + 0", "") + term(b, "y"), c=c)}
    q.update(mcq_num(m, [-m, Fr(-b, a), Fr(b, a)], r) or {})
    q["explanation"] = S(r"Solve for $y$: $[[b]]y = [[ra]] + [[c]]$, so $y = [[yl]]$. The slope is $[[m]]$.",
                         b=b, ra=poly([-a, 0]).replace(" + 0", ""), c=c, m=m, yl=lin(m, Fr(c, b)))
    return q if "choices" in q else None


def perp_parallel(r):
    p, qd = nz(r, -5, 5), r.randint(1, 5)
    m = Fr(p, qd)
    if m == 0 or abs(m) == 1:
        return None
    x0, y0 = r.randint(-4, 4), r.randint(-6, 6)
    kind = r.choice(["perpendicular", "parallel"])
    mm = -1 / m if kind == "perpendicular" else m
    b = y0 - mm * x0
    def eqn(slope, inter):
        s = "" if slope == 1 else "-" if slope == -1 else num(slope)
        tail = "" if inter == 0 else (" + " if inter > 0 else " - ") + num(abs(inter))
        return f"$y = {s}x{tail}$"
    correct = eqn(mm, b)
    alts = [-mm, 1 / mm, m if kind == "perpendicular" else -1 / m]
    ds = [eqn(s, y0 - s * x0) for s in alts]
    q = {"prompt": S(r"Line $\ell$ is [[k]] to the line $y = [[m]]x + 3$ and passes through the point $([[x0]], [[y0]])$. Which equation defines line $\ell$?",
                     k=kind, m=num(m) if m not in (1, -1) else ("" if m == 1 else "-"), x0=x0, y0=y0)}
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q.update(res)
    rule = "Perpendicular lines have slopes that are negative reciprocals" if kind == "perpendicular" else "Parallel lines have equal slopes"
    q["explanation"] = S(r"[[rule]], so line $\ell$ has slope $[[mm]]$. Substituting $([[x0]], [[y0]])$ into $y = [[mm]]x + b$ gives $b = [[b]]$.",
                         rule=rule, mm=mm, x0=x0, y0=y0, b=b)
    return q


TWO_ITEM = [("At a bake sale, cookies cost [[p]] each and brownies cost [[q]] each.", "$c$ cookies and $b$ brownies", "c", "b"),
            ("A museum charges [[p]] for a child's ticket and [[q]] for an adult's ticket.", "$c$ child tickets and $a$ adult tickets", "c", "a"),
            ("A florist sells roses for [[p]] each and tulips for [[q]] each.", "$r$ roses and $t$ tulips", "r", "t"),
            ("A print shop charges [[p]] per poster and [[q]] per banner.", "$p$ posters and $b$ banners", "p", "b"),
            ("A farm stand sells apples for [[p]] per pound and pears for [[q]] per pound.", "$a$ pounds of apples and $p$ pounds of pears", "a", "p")]


def two_item_equation(r):
    ctx, what, v1, v2 = pick(r, TWO_ITEM)
    p, qq = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15], 2)
    t = p * r.randint(3, 12) + qq * r.randint(3, 12)
    correct = f"${p}{v1} + {qq}{v2} = {t}$"
    ds = [f"${qq}{v1} + {p}{v2} = {t}$", f"${v1} + {v2} = {t}$", f"${p + qq}({v1} + {v2}) = {t}$"]
    q = {"prompt": S(ctx, p=f"${money(p)}$", q=f"${money(qq)}$") + f" The total amount collected from selling {what} was ${money(t)}$. Which equation represents this situation?"}
    q.update(mcq_text(correct, ds, r))
    q["explanation"] = S(r"Each item's revenue is its price times the number sold: $[[p]][[v1]]$ and $[[q]][[v2]]$. Their sum is $[[t]]$.", p=p, v1=v1, q=qq, v2=v2, t=t)
    return q


def line_through_find_k(r):
    m = nz(r, -5, 5)
    x1 = r.randint(-6, 6)
    y1 = r.randint(-9, 9)
    x2 = x1 + r.randint(1, 5)
    y2 = y1 + m * (x2 - x1)
    k = r.randint(-10, 10)
    if k in (x1, x2):
        return None
    yk = y1 + m * (k - x1)
    q = {"prompt": S(r"A line in the $xy$-plane passes through the points $([[x1]], [[y1]])$ and $([[x2]], [[y2]])$. The line also passes through the point $(k, [[yk]])$. What is the value of $k$?",
                     x1=x1, y1=y1, x2=x2, y2=y2, yk=yk)}
    q.update(spr(k))
    q["explanation"] = S(r"The slope is $\dfrac{[[dy]]}{[[dx]]} = [[m]]$. Using point-slope form, $[[yk]] - [[py1]] = [[m]](k - [[px1]])$, so $k = [[k]]$.",
                         dy=y2 - y1, dx=x2 - x1, m=m, yk=yk, py1=paren_num(y1), px1=paren_num(x1), k=k)
    return q


# ======================================================== systems
def elim_simple(r):
    x, y = r.randint(-8, 15), r.randint(-8, 15)
    ask = r.choice(["x", "y"])
    val = x if ask == "x" else y
    q = {"prompt": S(r"$$x + y = [[s]]$$ $$x - y = [[d]]$$ What is the value of $[[v]]$ in the solution to the system of equations above?", s=x + y, d=x - y, v=ask)}
    q.update(mcq_num(val, [y if ask == "x" else x, x + y, x - y], r) or {})
    q["explanation"] = S(r"Add the equations: $2x = [[s2]]$, so $x = [[x]]$. Then $y = [[s]] - [[px]] = [[y]]$.", s2=2 * x, x=x, s=x + y, px=paren_num(x), y=y)
    return q if "choices" in q else None


def substitution_sys(r):
    m, b = nz(r, -4, 5), r.randint(-6, 8)
    a, c = nz(r, 1, 6), nz(r, -5, 6)
    x = r.randint(-6, 8)
    y = m * x + b
    e = a * x + c * y
    if a + c * m == 0:
        return None
    ask = r.choice(["x + y", "x", "y"])
    val = {"x + y": x + y, "x": x, "y": y}[ask]
    q = {"prompt": S(r"$$[[e1]] = [[e]]$$ $$y = [[e2]]$$ If $(x, y)$ is the solution to the system of equations above, what is the value of $[[ask]]$?",
                     e1=poly([a, 0]).replace(" + 0", "") + term(c, "y"), e=e, e2=lin(m, b), ask=ask)}
    q.update(spr(val))
    q["explanation"] = S(r"Substitute $y = [[e2]]$ into the first equation: $[[a]]x + [[pc]]([[e2]]) = [[e]]$, which gives $x = [[x]]$. Then $y = [[y]]$, so $[[ask]] = [[val]]$.",
                         e2=lin(m, b), a=a, pc=paren_num(c) if c != 1 else "", e=e, x=x, y=y, ask=ask, val=val)
    return q


def general_system(r):
    a, b, c, d = nz(r, -7, 7), nz(r, -7, 7), nz(r, -7, 7), nz(r, -7, 7)
    if a * d - b * c == 0:
        return None
    x, y = r.randint(-7, 9), r.randint(-7, 9)
    e, f = a * x + b * y, c * x + d * y
    ask = r.choice(["x - y", "x + y", "y"])
    val = {"x - y": x - y, "x + y": x + y, "y": y}[ask]
    q = {"prompt": S(r"$$[[l1]] = [[e]]$$ $$[[l2]] = [[f]]$$ If $(x, y)$ is the solution to the system of equations above, what is the value of $[[ask]]$?",
                     l1=poly([a, 0]).replace(" + 0", "") + term(b, "y"), e=e, l2=poly([c, 0]).replace(" + 0", "") + term(d, "y"), f=f, ask=ask)}
    q.update(spr(val))
    q["explanation"] = S(r"Use elimination or substitution to solve: $x = [[x]]$ and $y = [[y]]$. Check in both equations: $[[a]]([[x]]) + [[pb]]([[y]]) = [[e]]$ ✓ and $[[c]]([[x]]) + [[pd]]([[y]]) = [[f]]$ ✓. So $[[ask]] = [[val]]$.",
                         x=x, y=y, a=a, pb=paren_num(b), e=e, c=c, pd=paren_num(d), f=f, ask=ask, val=val)
    return q


COUNT_TOTAL = [("A store sells notebooks for [[p]] each and pens for [[q]] each. Maya bought [[n]] notebooks and pens for a total of [[t]].", "How many notebooks did she buy?", "notebooks"),
               ("A theater sold [[n]] tickets for a total of [[t]]. Balcony tickets cost [[p]] each and floor tickets cost [[q]] each.", "How many balcony tickets were sold?", "balcony"),
               ("A class raised [[t]] by selling [[n]] items: T-shirts for [[p]] each and hats for [[q]] each.", "How many T-shirts did the class sell?", "shirts"),
               ("A quiz has [[n]] questions worth a total of [[t]] points. Some questions are worth [[p]] points and the rest are worth [[q]] points.", "How many questions are worth [[p]] points?", "points")]


def count_total_system(r):
    ctx, ask, kind = pick(r, COUNT_TOTAL)
    p, qq = r.sample([2, 3, 4, 5, 6, 8, 10, 12, 15], 2)
    n1, n2 = r.randint(3, 20), r.randint(3, 20)
    n, t = n1 + n2, p * n1 + qq * n2
    fmt = (lambda v: str(v)) if kind == "points" else (lambda v: f"${money(v)}$")
    q = {"prompt": S(ctx, p=fmt(p), q=fmt(qq), n=str(n), t=fmt(t)) + " " + S(ask, p=str(p))}
    q.update(mcq_num(n1, [n2, Fr(t, p + qq), n1 + 2], r) or {})
    q["explanation"] = S(r"Let $a$ be the first kind and $b$ the second: $a + b = [[n]]$ and $[[p]]a + [[q]]b = [[t]]$. Substitute $b = [[n]] - a$: $[[p]]a + [[q]]([[n]] - a) = [[t]]$, so $[[pq]]a = [[rhs]]$ and $a = [[n1]]$.",
                         n=n, p=p, q=qq, t=t, pq=p - qq, rhs=t - qq * n, n1=n1)
    return q if "choices" in q else None


def many_solutions_k(r):
    a, b, e = nz(r, -6, 6), nz(r, -8, 8), nz(r, -12, 12)
    s = r.choice([Fr(3, 2), 2, 3, Fr(1, 2), -2, Fr(5, 2)])
    c, k, f = s * a, s * b, s * e
    if any(Fr(v).denominator != 1 for v in (c, k, f)):
        return None
    q = {"prompt": S(r"$$[[l1]] = [[e]]$$ $$[[l2]] = [[f]]$$ In the system of equations above, $k$ is a constant. If the system has infinitely many solutions, what is the value of $k$?",
                     l1=poly([a, 0]).replace(" + 0", "") + term(b, "y"), e=e, l2=poly([c, 0]).replace(" + 0", "") + " + ky", f=f)}
    q.update(mcq_num(k, [-k, b, Fr(c, a) + b], r) or {})
    q["explanation"] = S(r"For infinitely many solutions, the second equation must be a multiple of the first. Comparing $x$-coefficients, the multiplier is $\frac{[[c]]}{[[a]]} = [[s]]$, and the constants agree: $[[s]] \times [[e]] = [[f]]$. So $k = [[s]] \times [[pb]] = [[k]]$.",
                         c=c, a=a, s=s, e=paren_num(e), f=f, pb=paren_num(b), k=k)
    return q if "choices" in q else None


def no_solution_a(r):
    m, n = nz(r, -5, 5), r.randint(-9, 9)
    c = r.choice([2, -2, 4, -4, 6])
    a = -c * m
    rhs = r.randint(-9, 9)
    if Fr(rhs, c) == n:
        return None
    q = {"prompt": S(r"$$ax[[cy]] = [[rhs]]$$ $$y = [[mn]]$$ In the system of equations above, $a$ is a constant. If the system has no solution, what is the value of $a$?",
                     cy=term(c, "y"), rhs=rhs, mn=lin(m, n))}
    q.update(spr(a))
    q["explanation"] = S(r"No solution means the lines are parallel. The second line has slope $[[m]]$. The first line is $y = -\frac{a}{[[c]]}x[[it]]$, with slope $-\frac{a}{[[c]]}$. Setting $-\frac{a}{[[c]]} = [[m]]$ gives $a = [[a]]$. The $y$-intercepts ($[[i]]$ and $[[n]]$) differ, so there is no solution.",
                         m=m, c=c, i=Fr(rhs, c), it=term(Fr(rhs, c), ""), a=a, n=n)
    return q


def count_solutions(r):
    a, b, e = nz(r, -6, 6), nz(r, -6, 6), nz(r, -10, 10)
    kind = r.choice(["one", "none", "many"])
    s = r.choice([2, 3, -2, -1])
    if kind == "one":
        c, d, f = s * a + nz(r, -3, 3), s * b, s * e
    elif kind == "none":
        c, d, f = s * a, s * b, s * e + nz(r, -5, 5)
    else:
        c, d, f = s * a, s * b, s * e
    if c == 0:
        return None
    labels = {"one": "Exactly one", "none": "No solutions", "many": "Infinitely many", "two": "Exactly two"}
    q = {"prompt": S(r"$$[[l1]] = [[e]]$$ $$[[l2]] = [[f]]$$ How many solutions does the system of equations above have?",
                     l1=poly([a, 0]).replace(" + 0", "") + term(b, "y"), e=e, l2=poly([c, 0]).replace(" + 0", "") + term(d, "y"), f=f)}
    order = ["No solutions", "Exactly one", "Exactly two", "Infinitely many"]
    q["choices"] = order
    q["answer"] = "ABCD"[order.index(labels[kind])]
    why = {"one": "The ratios of the $x$- and $y$-coefficients differ, so the lines have different slopes and intersect exactly once.",
           "none": S(r"The second equation's coefficients are $[[s]]$ times the first's, but its constant is not, so the lines are parallel and distinct.", s=s),
           "many": S(r"Every term of the second equation is $[[s]]$ times the first, so they describe the same line.", s=s)}
    q["explanation"] = why[kind] + " Two lines can never intersect in exactly two points."
    return q


# ======================================================== inequalities
def which_value_ineq(r):
    a, b = nz(r, 2, 7), nz(r, -15, 15)
    x0 = r.randint(-5, 10)
    c = a * x0 + b
    op = r.choice([">", "<"])
    s = 1 if op == ">" else -1
    corr = x0 + s * r.randint(1, 4)
    ch = sorted({corr, x0, x0 - s, x0 - s * r.randint(2, 6)})
    if len(ch) < 4:
        return None
    q = {"prompt": S(r"Which of the following values of $x$ satisfies the inequality $[[e]] [[op]] [[c]]$?", e=lin(a, b), op=op, c=c),
         "choices": [f"${v}$" for v in ch], "answer": "ABCD"[ch.index(corr)]}
    q["explanation"] = S(r"[[mv]] both sides and divide by $[[a]]$: $x [[op]] [[x0]]$. Only $[[v]]$ satisfies this. A value equal to $[[x0]]$ does not satisfy a strict inequality.",
                         mv=move(b), a=a, op=op, x0=x0, v=corr)
    return q


INEQ_WORDS = [("A delivery van can carry at most [[cap]] pounds. The driver weighs [[w]] pounds, and each package weighs [[p]] pounds.", "the number of packages, $b$, that the van can carry along with the driver", "b", "≤"),
              ("An elevator can safely lift at most [[cap]] kilograms. A worker who weighs [[w]] kilograms rides with boxes that weigh [[p]] kilograms each.", "the number of boxes, $b$, that can ride with the worker", "b", "≤"),
              ("To pass a course, a student needs at least [[cap]] points. She already has [[w]] points, and each remaining project is worth [[p]] points.", "the number of projects, $b$, she must complete to pass", "b", "≥"),
              ("A club wants to raise at least [[cap]] dollars. It already has [[w]] dollars and earns [[p]] dollars for each car it washes.", "the number of cars, $b$, the club must wash to reach its goal", "b", "≥")]


def ineq_setup(r):
    ctx, what, v, op = pick(r, INEQ_WORDS)
    cap, w, p = r.choice([500, 800, 1000, 1200, 1500, 2000]), r.choice([60, 80, 150, 175, 180, 200]), r.choice([12, 15, 20, 25, 30, 40, 50])
    tex = r"\le" if op == "≤" else r"\ge"
    anti = r"\ge" if op == "≤" else r"\le"
    correct = f"${p}b + {w} {tex} {big(cap)}$"
    ds = [f"${p}b + {w} {anti} {big(cap)}$", f"${p}b {tex} {big(cap)} + {w}$", f"${w}b + {p} {tex} {big(cap)}$"]
    q = {"prompt": S(ctx, cap=big(cap) if cap < 1000 else f"{cap:,}", w=str(w), p=str(p)) + f" Which inequality represents {what}?"}
    q.update(mcq_text(correct, ds, r))
    word = "at most" if op == "≤" else "at least"
    q["explanation"] = S(r"The total is the fixed amount plus $[[p]]$ for each unit: $[[p]]b + [[w]]$. \"[[word]]\" translates to $[[tex]]$.", p=p, w=w, word=word.capitalize(), tex=tex)
    q["explanation"] = q["explanation"].replace('\\"', '"')
    return q


def greatest_integer(r):
    a, b = nz(r, 2, 7), nz(r, -9, 9)
    c = r.randint(-20, 40)
    kind = r.choice(["greatest", "least"])
    if kind == "greatest":
        bound = Fr(c, a) - b
        if bound.denominator == 1:
            return None
        ans = (bound.numerator // bound.denominator)
        prompt = S(r"What is the greatest integer value of $x$ that satisfies $[[a]]([[inner]]) \le [[c]]$?", a=a, inner=lin(1, b), c=c)
        expl = S(r"Divide by $[[a]]$: $[[inner]] \le [[cb]]$, so $x \le [[bound]]$. The greatest integer is $[[ans]]$.", a=a, inner=lin(1, b), cb=Fr(c, a), bound=bound, ans=ans)
    else:
        bound = Fr(c, a) - b
        if bound.denominator == 1:
            return None
        ans = -((-bound.numerator) // bound.denominator)
        prompt = S(r"What is the least integer value of $x$ that satisfies $[[a]]([[inner]]) > [[c]]$?", a=a, inner=lin(1, b), c=c)
        expl = S(r"Divide by $[[a]]$: $[[inner]] > [[cb]]$, so $x > [[bound]]$. The least integer is $[[ans]]$.", a=a, inner=lin(1, b), cb=Fr(c, a), bound=bound, ans=ans)
    q = {"prompt": prompt, "explanation": expl}
    q.update(spr(ans))
    return q


def point_in_system(r):
    m1, b1 = nz(r, -3, 3), r.randint(-4, 4)
    m2, b2 = nz(r, -3, 3), r.randint(-2, 8)
    pts = [(x, y) for x in range(-3, 5) for y in range(-6, 9)]
    ok = lambda p: p[1] > m1 * p[0] + b1 and p[1] <= m2 * p[0] + b2
    good = [p for p in pts if ok(p)]
    bad = [p for p in pts if not ok(p) and (p[1] == m1 * p[0] + b1 or p[1] == m2 * p[0] + b2 + 1 or abs(p[1] - m1 * p[0] - b1) <= 1)]
    if not good or len(bad) < 3:
        return None
    g = pick(r, good)
    bs = r.sample(bad, 3)
    labels = [f"$({p[0]}, {p[1]})$" for p in [g] + bs]
    if len(set(labels)) < 4:
        return None
    q = {"prompt": S(r"Which point $(x, y)$ is a solution to the following system of inequalities? $$y > [[l1]]$$ $$y \le [[l2]]$$", l1=lin(m1, b1), l2=lin(m2, b2))}
    q.update(mcq_text(labels[0], labels[1:], r))
    q["explanation"] = S(r"Check $([[x]], [[y]])$: $[[y]] > [[v1]]$ ✓ and $[[y]] \le [[v2]]$ ✓. Each other point fails at least one inequality. Remember that a point on the line $y = [[l1]]$ does not satisfy the strict inequality.",
                         x=g[0], y=g[1], v1=m1 * g[0] + b1, v2=m2 * g[0] + b2, l1=lin(m1, b1))
    return q


def min_whole_word(r):
    p1, p2 = r.choice([(40, 25), (30, 18), (45, 30), (35, 20), (50, 32), (28, 16)])
    h1 = r.randint(8, 20)
    goal = r.choice(range(600, 1400, 50))
    need = Fr(goal - p1 * h1, p2)
    if need <= 0 or need.denominator == 1:
        return None
    h2 = -((-need.numerator) // need.denominator)
    if h1 + h2 > 38:
        return None
    cap = h1 + h2 + r.randint(1, 6)
    q = {"prompt": S(r"A tutor earns $[[a]]$ per hour for in-person sessions and $[[b]]$ per hour for online sessions. This week she wants to earn at least $[[g]]$ while working no more than [[cap]] hours in total. If she works [[h1]] hours in person, what is the minimum whole number of online hours she must work?",
                     a=money(p1), b=money(p2), g=money(goal), cap=str(cap), h1=str(h1))}
    q.update(spr(h2))
    q["explanation"] = S(r"In-person earnings: $[[h1]] \times [[a]] = [[e]]$. She needs $[[e]] + [[b]]h \ge [[g]]$, so $h \ge [[need]]$. The minimum whole number is $[[h2]]$, and $[[h1]] + [[h2]] \le [[cap]]$ keeps her within the hour limit.",
                         h1=h1, a=p1, e=p1 * h1, b=p2, g=goal, need=f"{float(need):.2f}".rstrip("0").rstrip("."), h2=h2, cap=cap)
    return q


def flip_inequality(r):
    a, b = nz(r, 2, 8), nz(r, -12, 12)
    x0 = Fr(r.randint(-8, 10))
    c = -a * x0 + b
    op, flipped = r.choice([(r"\le", r"\ge"), (r"<", r">"), (r"\ge", r"\le"), (r">", r"<")])
    correct = f"$x {flipped} {num(x0)}$"
    ds = [f"$x {op} {num(x0)}$", f"$x {flipped} {num(-x0)}$", f"$x {op} {num(-x0)}$"]
    if x0 == 0:
        ds = [f"$x {op} 0$", f"$x {flipped} {num(Fr(b, a))}$", f"$x {op} {num(Fr(-b, a))}$"]
    q = {"prompt": S(r"Which inequality is equivalent to $[[l]] [[op]] [[c]]$?", l=lin(-a, b), op=op, c=c)}
    res = mcq_text(correct, ds, r)
    if not res:
        return None
    q.update(res)
    q["explanation"] = S(r"[[mv]] both sides: $-[[a]]x [[op]] [[cb]]$. Dividing both sides by the negative number $-[[a]]$ reverses the inequality: $x [[fl]] [[x0]]$.",
                         mv=move(b), a=a, op=op, cb=c - b, fl=flipped, x0=x0)
    return q


TEMPLATES = [
    ("linear-one-var", 1, solve_axb, 90), ("linear-one-var", 2, solve_distribute, 80), ("linear-one-var", 2, scaled_expression, 70),
    ("linear-one-var", 1, fee_word, 70), ("linear-one-var", 3, identity_constant, 70), ("linear-one-var", 2, fraction_sum, 25),
    ("linear-one-var", 3, cross_fraction, 60),
    ("linear-functions", 1, eval_linear, 70), ("linear-functions", 1, slope_two_points, 80), ("linear-functions", 2, interpret_linear, 60),
    ("linear-functions", 2, two_values_find, 70), ("linear-functions", 2, table_to_equation, 60), ("linear-functions", 1, drain_model, 40),
    ("linear-functions", 3, linear_composition, 60),
    ("linear-two-var", 1, point_on_line, 70), ("linear-two-var", 2, intercept_spr, 60), ("linear-two-var", 2, slope_standard_form, 70),
    ("linear-two-var", 3, perp_parallel, 70), ("linear-two-var", 1, two_item_equation, 60), ("linear-two-var", 3, line_through_find_k, 60),
    ("systems", 1, elim_simple, 70), ("systems", 2, substitution_sys, 70), ("systems", 2, general_system, 80),
    ("systems", 2, count_total_system, 60), ("systems", 3, many_solutions_k, 60), ("systems", 3, no_solution_a, 60),
    ("systems", 2, count_solutions, 50),
    ("inequalities", 1, which_value_ineq, 60), ("inequalities", 2, ineq_setup, 60), ("inequalities", 2, greatest_integer, 60),
    ("inequalities", 3, point_in_system, 60), ("inequalities", 3, min_whole_word, 50), ("inequalities", 2, flip_inequality, 60),
]
