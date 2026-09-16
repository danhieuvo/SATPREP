"""Math > harder multi-step generators across all four domains, modeled on the last questions of the harder
Module 2: word problems that need a model, parameters, and choices built from common mistakes.
Each generator sets its own domain; answers are computed exactly and re-checked."""
import math
from fractions import Fraction as Fr
from .common import S, num, money, big, lin, poly, term, paren_num, mcq_num, mcq_text, spr, pick, nz, solve_check, Skip

SECTION, DOMAIN = "math", "algebra"


def with_domain(domain):
    def wrap(gen):
        def g(r):
            q = gen(r)
            if q:
                q["domain"] = domain
            return q
        g.__name__ = gen.__name__
        return g
    return wrap


def pct(x):
    """Fraction -> percent string without trailing zeros (e.g. 29.6)."""
    v = float(x) * 100
    return f"{v:.4f}".rstrip("0").rstrip(".")


# ======================================================== algebra
@with_domain("algebra")
def two_item_revenue(r):
    items = pick(r, [("adult tickets", "child tickets", "tickets"), ("large candles", "small candles", "candles"),
                     ("hardcover books", "paperback books", "books"), ("premium passes", "standard passes", "passes")])
    pa, pb = r.randint(9, 24), r.randint(3, 8)
    if pa <= pb:
        return None
    a, b = r.randint(20, 120), r.randint(20, 120)
    n, rev = a + b, pa * a + pb * b
    ask_diff = r.random() < 0.5
    ans = a - b if ask_diff else a
    if ask_diff and ans <= 0:
        return None
    q = {"prompt": S(r"A shop sold $[[n]]$ [[t]] in one day, all of them either [[A]] or [[B]]. Each of the [[A]] cost $[[pa]]$ and each of the [[B]] cost $[[pb]]$, and the shop collected $[[rev]]$ from these sales. " +
                     ("How many more [[A]] than [[B]] did the shop sell?" if ask_diff else "How many [[A]] did the shop sell?"),
                     n=n, t=items[2], A=items[0], B=items[1], pa=money(pa), pb=money(pb), rev=money(rev))}
    q.update(spr(ans))
    q["explanation"] = S(r"Let $a$ be the number of [[A]] and $b$ the number of [[B]]. Then $a + b = [[n]]$ and $[[pa]]a + [[pb]]b = [[rev]]$. Substituting $b = [[n]] - a$ gives $[[pa]]a + [[pb]]([[n]] - a) = [[rev]]$, so $[[d]]a = [[rhs]]$ and $a = [[a]]$. Then $b = [[b]]$." +
                         (" The difference is $[[a]] - [[b]] = [[ans]]$." if ask_diff else ""),
                         A=items[0], B=items[1], n=n, pa=pa, pb=pb, rev=rev, d=pa - pb, rhs=rev - pb * n, a=a, b=b, ans=ans)
    solve_check(pa * a + pb * (n - a) == rev)
    return q


@with_domain("algebra")
def infinite_solutions_sum(r):
    a, b, c = nz(r, 2, 7), nz(r, -9, 9), nz(r, 3, 12)
    s = Fr(r.choice([2, 3, 4, -2, 3]), r.choice([1, 1, 2, 3]))
    m, k, rhs2 = s * a, s * b, s * c
    if m.denominator != 1 or k.denominator != 1 or rhs2.denominator != 1 or abs(s) == 1:
        return None
    m, k, rhs2 = int(m), int(k), int(rhs2)
    ans = m + k
    q = {"prompt": S(r"$$[[a]]x + py = [[c]]$$ $$qx[[k]]y = [[r2]]$$ In the system of equations above, $p$ and $q$ are constants. If the system has infinitely many solutions, what is the value of $p + q$?",
                     a=a, c=c, k=term(k, ""), r2=rhs2)}
    q["prompt"] = q["prompt"].replace("qx" + term(k, "") + "y", "qx" + term(k, "y"))
    q.update(spr(b + m))
    q["explanation"] = S(r"For infinitely many solutions, the second equation must be a constant multiple of the first. Comparing the constants, the multiplier is $\dfrac{[[r2]]}{[[c]]} = [[s]]$. So $q = [[s]] \cdot [[a]] = [[m]]$, and $[[k]] = [[s]] \cdot p$, which gives $p = [[b]]$. Therefore $p + q = [[b]] + [[pm]] = [[ans]]$.",
                         r2=rhs2, c=c, s=s, a=a, m=m, k=k, b=b, pm=paren_num(m), ans=b + m)
    solve_check(s * b == k)
    return q


@with_domain("algebra")
def break_even_models(r):
    ctx = pick(r, [("Company A", "Company B", "rent a moving truck", "mile"), ("Plan A", "Plan B", "stream music", "month"),
                   ("Gym X", "Gym Y", "join a gym", "month"), ("Service P", "Service Q", "rent a bike", "hour")])
    f1, f2 = r.randint(20, 90), r.randint(0, 40)
    v1, v2 = Fr(r.randint(4, 30), 4), Fr(r.randint(8, 60), 4)
    if f1 <= f2 or v2 <= v1:
        return None
    x = Fr(f1 - f2) / (v2 - v1)
    if x.denominator != 1 or not (4 <= x <= 200):
        return None
    ask = r.choice(["x", "cost"])
    ans = x if ask == "x" else f1 + v1 * x
    if Fr(ans).denominator not in (1, 2, 4):
        return None
    unit = ctx[3]
    q = {"prompt": S(r"To [[act]], [[A]] charges a fee of $[[f1]]$ plus $[[v1]]$ per [[u]]. [[B]] charges a fee of $[[f2]]$ plus $[[v2]]$ per [[u]]. " +
                     ("For how many [[u]]s will the total charges from the two options be equal?" if ask == "x" else "When the total charges from the two options are equal, what is that total charge, in dollars?"),
                     act=ctx[2], A=ctx[0], B=ctx[1], f1=money(f1), v1=money(v1), f2=money(f2), v2=money(v2), u=unit)}
    res = spr(ans)
    if not res:
        return None
    q.update(res)
    q["explanation"] = S(r"Set the totals equal: $[[f1]] + [[v1]]x = [[f2]] + [[v2]]x$. Then $[[df]] = [[dv]]x$, so $x = [[x]]$." +
                         ("" if ask == "x" else r" The common total is $[[f1]] + [[v1]]([[x]]) = [[tot]]$."),
                         f1=f1, v1=v1, f2=f2, v2=v2, df=f1 - f2, dv=v2 - v1, x=x, tot=f1 + v1 * x)
    return q


@with_domain("algebra")
def max_items_inequality(r):
    ctx = pick(r, [("a delivery van", "boxes", "pounds", "a driver who weighs"), ("an elevator", "crates", "kilograms", "an operator who weighs"),
                   ("a small boat", "bags of supplies", "pounds", "a guide who weighs")])
    cap = r.randint(12, 40) * 50
    person = r.randint(140, 220) if ctx[2] == "pounds" else r.randint(60, 100)
    w1, w2 = r.randint(15, 60), r.randint(8, 30)
    n1 = r.randint(3, 12)
    avail = cap - person - n1 * w1
    if avail <= w2 * 3:
        return None
    ans = avail // w2
    if avail % w2 == 0:
        return None
    q = {"prompt": S(r"The maximum load for [[veh]] is $[[cap]]$ [[u]]. It will carry [[who]] $[[p]]$ [[u]], $[[n1]]$ packages that weigh $[[w1]]$ [[u]] each, and some [[items]] that weigh $[[w2]]$ [[u]] each. What is the greatest number of [[items]] it can carry without exceeding the maximum load?",
                     veh=ctx[0], cap=big(cap), u=ctx[2], who=ctx[3], p=person, n1=n1, w1=w1, items=ctx[1], w2=w2)}
    q.update(spr(ans))
    q["explanation"] = S(r"The load must satisfy $[[p]] + [[n1]]([[w1]]) + [[w2]]x \le [[cap]]$, so $[[w2]]x \le [[avail]]$ and $x \le [[frac]]$, which is about $[[dec]]$. Since $x$ must be a whole number, the greatest possible value is $[[ans]]$ (rounding up would exceed the limit).",
                         p=person, n1=n1, w1=w1, w2=w2, cap=big(cap), avail=avail, frac=r"\dfrac{%d}{%d}" % (avail, w2), dec=f"{avail / w2:.2f}", ans=ans)
    return q


@with_domain("algebra")
def linear_model_meaning(r):
    ctx = pick(r, [("the amount of water, in gallons, remaining in a tank", "hours after it began draining", "gallons", "hour", -1),
                   ("the value, in dollars, of a piece of equipment", "years after it was purchased", "dollars", "year", -1),
                   ("the height, in centimeters, of a plant", "weeks after it was measured for the first time", "centimeters", "week", 1),
                   ("the total savings, in dollars, in an account", "months after the account was opened", "dollars", "month", 1)])
    what, when, unit, per, sign = ctx
    x1, x2 = r.randint(2, 6), r.randint(8, 15)
    m = sign * r.randint(3, 25)
    b = r.randint(10, 60) * 10 if sign < 0 else r.randint(2, 40) * 5
    y1, y2 = b + m * x1, b + m * x2
    if min(y1, y2) <= 0:
        return None
    correct = f"The {'decrease' if sign < 0 else 'increase'} in {unit} per {per}"
    ds = [f"The {'decrease' if sign < 0 else 'increase'} in {unit} every {x2 - x1} {per}s",
          f"The number of {unit} when {when.split(' after')[0].replace('hours', 'zero ' + per + 's').replace('years', 'zero ' + per + 's').replace('weeks', 'zero ' + per + 's').replace('months', 'zero ' + per + 's')}",
          f"The number of {per}s it takes for {what.split(',')[0].replace('the ', 'the ')} to change by {x2 - x1} {unit}"]
    ds[1] = f"The initial number of {unit}"
    res = mcq_text(correct, ds, r)
    q = {"prompt": S(r"The function $f$ gives [[what]] $x$ [[when]]. If $f([[x1]]) = [[y1]]$ and $f([[x2]]) = [[y2]]$, and $f$ is linear, what is the best interpretation of $|m|$, where $m$ is the slope of the graph of $y = f(x)$ in the $xy$-plane?",
                     what=what, when=when, x1=x1, y1=big(y1), x2=x2, y2=big(y2)), **res}
    q["explanation"] = S(r"The slope is $m = \dfrac{[[y2]] - [[y1]]}{[[x2]] - [[x1]]} = [[m]]$, the change in $f(x)$ for each increase of $1$ in $x$. So $|m|$ is the [[dir]] in [[u]] per [[per]]. The initial amount is the $y$-intercept, $[[b]]$, not the slope.",
                         y2=y2, y1=y1, x2=x2, x1=x1, m=m, dir="decrease" if sign < 0 else "increase", u=unit, per=per, b=big(b))
    return q


# ======================================================== advanced math
@with_domain("advanced")
def projectile_after_peak(r):
    a, b = r.randint(2, 8), r.randint(1, 4)
    if a <= b:
        return None
    # h(t) = -16(t - a)(t + b): hits ground at t = a, peak at t = (a - b)/2
    coefs = [-16, -16 * (b - a), 16 * a * b]
    peak_t = Fr(a - b, 2)
    ans = a - peak_t
    q = {"prompt": S(r"An object is launched upward from a platform. Its height above the ground, in feet, $t$ seconds after launch is modeled by $h(t) = [[p]]$. How many seconds after the object reaches its maximum height does it hit the ground?",
                     p=poly(coefs, "t"))}
    res = spr(ans)
    if not res:
        return None
    q.update(res)
    q["explanation"] = S(r"Factor: $h(t) = -16(t - [[a]])(t + [[b]])$. The object hits the ground at the positive zero, $t = [[a]]$. The maximum occurs midway between the zeros, at $t = \dfrac{[[a]] + ([[nb]])}{2} = [[pk]]$. So it hits the ground $[[a]] - [[pk]] = [[ans]]$ seconds after the maximum.",
                         a=a, b=b, nb=-b, pk=peak_t, ans=ans)
    return q


@with_domain("advanced")
def tangent_line_parabola(r):
    a = r.choice([1, 1, 2, -1])
    m = nz(r, -8, 8)
    c0 = r.randint(-6, 6)
    # y = a x^2 + c0 and y = m x + k tangent: a x^2 - m x + (c0 - k) = 0, disc m^2 - 4a(c0 - k) = 0 -> k = c0 - m^2/(4a)
    k = c0 - Fr(m * m, 4 * a)
    res = spr(k)
    if not res:
        return None
    q = {"prompt": S(r"In the $xy$-plane, the graph of $y = [[p]]$ and the line $y = [[m]]x + k$, where $k$ is a constant, intersect at exactly one point. What is the value of $k$?",
                     p=poly([a, 0, c0]), m=num(m) if m not in (1, -1) else ("" if m == 1 else "-"))}
    q.update(res)
    q["explanation"] = S(r"Set the expressions equal: $[[p]] = [[m]]x + k$, so $[[quad]] = 0$. Exactly one intersection means the discriminant is $0$: $([[nm]])^2 - 4([[a]])([[c]]) = 0$. Solving gives $[[mm]] = [[fa]]([[c0]] - k)$, so $k = [[k]]$.",
                         p=poly([a, 0, c0]), m=num(m), quad=poly([a, -m, 0]) + r" + (" + num(c0) + r" - k)", nm=-m, a=a, c=r"%s - k" % num(c0),
                         mm=m * m, fa=4 * a, c0=c0, k=k)
    return q


@with_domain("advanced")
def decay_model_choice(r):
    thing = pick(r, [("a medication in a patient's bloodstream", "milligrams"), ("a radioactive sample", "grams"), ("a pesticide in a pond", "parts per billion")])
    p = r.choice([10, 15, 20, 25, 30, 40])
    h = r.choice([2, 3, 4, 6, 8, 12])
    start = r.randint(2, 9) * 50
    f = Fr(100 - p, 100)
    fs = f"{float(f):g}"
    gs = f"{1 + p / 100:g}"
    correct = rf"$A(d) = {start}({fs})^{{{Fr(24, h)}d}}$" if Fr(24, h).denominator == 1 else None
    if not correct:
        return None
    e = Fr(24, h)
    ds = [rf"$A(d) = {start}({fs})^{{\frac{{d}}{{{24 * h}}}}}$", rf"$A(d) = {start}({gs})^{{{e}d}}$", rf"$A(d) = {start}({fs})^{{{h}d}}$"]
    if h == 24 // h:
        return None
    res = mcq_text(correct, ds, r)
    q = {"prompt": S(r"The amount of [[t]] decreases by $[[p]]\%$ every $[[h]]$ hours. There are $[[s]]$ [[u]] present at the start. Which function gives the amount $A(d)$, in [[u]], present $d$ days after the start?",
                     t=thing[0], p=p, h=h, s=start, u=thing[1]), **res}
    q["explanation"] = S(r"A $[[p]]\%$ decrease keeps $[[f]]$ of the amount each period, so the base is $[[f]]$ (not $[[g]]$). The period is $[[h]]$ hours, and there are $24$ hours in a day, so $d$ days contain $\dfrac{24d}{[[h]]} = [[e]]d$ periods. So $A(d) = [[s]]([[f]])^{[[e]]d}$.",
                         p=p, f=fs, g=gs, h=h, e=e, s=start)
    return q


@with_domain("advanced")
def complete_square_constant(r):
    b = r.choice([2, 4, 6, 8, 10, 12, 14, -4, -6, -8, -10])
    h = b // 2
    kk = r.randint(-15, 15)
    c = h * h + kk
    if kk == 0 or c == 0:
        return None
    sg = lambda v, var="": ("+ " if v > 0 else "- ") + num(abs(v)) + var  # "+ 6x" / "- 6x"
    ask = r.choice(["c", "sum"])
    if ask == "c":
        prompt = S(r"The equation $x^2 [[bx]] + c = (x [[hs]])^2 [[ks]]$ is true for all values of $x$, where $c$ is a constant. What is the value of $c$?",
                   bx=sg(b, "x"), hs=sg(h), ks=sg(kk))
        ans = c
        expl = S(r"Expanding the right side gives $x^2 [[bx]] + [[hh]] [[ks]]$. Matching constant terms, $c = [[hh]] [[ks]] = [[c]]$.",
                 bx=sg(b, "x"), hh=h * h, ks=sg(kk), c=c)
    else:
        ans = -h + kk
        expl = S(r"Half of the $x$-coefficient is $[[h]]$, and $(x [[hs]])^2 = x^2 [[bx]] + [[hh]]$. So $x^2 [[bx]] [[cs]] = (x [[hs]])^2 [[ks]]$. In the form $(x - p)^2 + q$, $p = [[p]]$ (note the sign) and $q = [[kk]]$, so $p + q = [[ans]]$.",
                 h=h, hs=sg(h), bx=sg(b, "x"), hh=h * h, cs=sg(c), ks=sg(kk), p=-h, kk=kk, ans=ans)
        prompt = S(r"The expression $x^2 [[bx]] [[cs]]$ can be written in the form $(x - p)^2 + q$, where $p$ and $q$ are constants. What is the value of $p + q$?",
                   bx=sg(b, "x"), cs=sg(c))
    q = {"prompt": prompt}
    q.update(spr(ans))
    q["explanation"] = expl
    return q


@with_domain("advanced")
def transformed_table(r):
    xs = [-2, -1, 0, 1, 2, 3, 4]
    vals = {x: r.randint(-9, 12) for x in xs}
    a = r.choice([2, -1, 2])
    h = r.choice([-1, 1, 2])
    k = nz(r, -6, 6)
    # g(x) = f(a x + h) + k ; ask g(t) for t with a t + h in table
    ts = [t for t in range(-3, 5) if (a * t + h) in vals]
    if not ts:
        return None
    t = r.choice(ts)
    inner = a * t + h
    ans = vals[inner] + k
    rows = "".join(f"<tr><td>${x}$</td><td>${vals[x]}$</td></tr>" for x in xs)
    table = f"<table><tr><th>$x$</th><th>$f(x)$</th></tr>{rows}</table>"
    q = {"prompt": table + S(r"<p>The table shows selected values of the function $f$. The function $g$ is defined by $g(x) = f([[inner]])[[k]]$. What is the value of $g([[t]])$?</p>",
                             inner=lin(a, h), k=term(k, ""), t=t)}
    q.update(spr(ans))
    q["explanation"] = S(r"$g([[t]]) = f([[a]]([[pt]]) [[hs]])[[k]] = f([[inner]])[[k]]$. From the table, $f([[inner]]) = [[fv]]$, so $g([[t]]) = [[fv]][[k]] = [[ans]]$.",
                         t=t, a={1: "", -1: "-"}.get(a, num(a)), pt=paren_num(t), hs=("+ " + num(h)) if h > 0 else ("- " + num(-h)), k=term(k, ""), inner=inner, fv=vals[inner], ans=ans)
    return q


@with_domain("advanced")
def vertex_form_a(r):
    h, k = nz(r, -5, 5), r.randint(-9, 9)
    a = Fr(nz(r, -6, 6), r.choice([1, 2, 3, 4]))
    x0 = r.choice([v for v in range(-4, 6) if v != h])
    y0 = a * (x0 - h) ** 2 + k
    if y0.denominator != 1:
        return None
    res = spr(a)
    if not res:
        return None
    q = {"prompt": S(r"The graph of the quadratic function $f$ in the $xy$-plane has its vertex at $([[h]], [[k]])$ and passes through the point $([[x0]], [[y0]])$. If $f(x) = a(x - p)^2 + q$, where $a$, $p$, and $q$ are constants, what is the value of $a$?",
                     h=h, k=k, x0=x0, y0=y0)}
    q.update(res)
    q["explanation"] = S(r"The vertex gives $p = [[h]]$ and $q = [[k]]$. Substitute the point: $[[y0]] = a([[x0]] - ([[h]]))^2 + ([[k]])$, so $[[d]] = [[sq]]a$ and $a = [[a]]$.",
                         h=h, k=k, x0=x0, y0=y0, d=y0 - k, sq=(x0 - h) ** 2, a=a)
    return q


# ======================================================== problem solving and data
@with_domain("data")
def successive_percent(r):
    up, down = r.choice([10, 20, 25, 30, 40, 50]), r.choice([10, 20, 25, 30, 40, 50])
    first_up = r.random() < 0.5
    f = Fr(100 + up, 100) * Fr(100 - down, 100)
    change = (f - 1) * 100
    if change == 0 or change.denominator != 1:
        return None
    thing = pick(r, ["the price of a jacket", "the population of a town", "the number of visitors to a museum", "the value of a stock"])
    word = "increase" if change > 0 else "decrease"
    steps = (f"increased by ${up}\\%$ and then decreased by ${down}\\%$" if first_up else f"decreased by ${down}\\%$ and then increased by ${up}\\%$")
    correct = abs(change)
    ds = [abs(up - down) if up != down else up, abs(change) + 5, Fr(up * down, 100)]
    res = mcq_num(correct, ds, r, wrap=lambda v: f"${num(v)}\\%$ {word}" if v != 0 else "$0\\%$")
    q = {"prompt": S(r"Over two years, [[t]] [[steps]]. The result is equivalent to which single percent change from the original value?", t=thing, steps=steps), **res}
    q["explanation"] = S(r"Multiply the growth factors: $[[g1]] \times [[g2]] = [[f]]$. A factor of $[[f]]$ is a $[[c]]\%$ [[w]]. Simply combining $[[up]]\%$ and $[[down]]\%$ ignores that the second change applies to a different base.",
                         g1=f"{1 + up / 100:g}", g2=f"{1 - down / 100:g}", f=f"{float(f):g}", c=num(correct), w=word, up=up, down=down)
    return q


@with_domain("data")
def mean_after_removal(r):
    n = r.randint(6, 15)
    mean = r.randint(12, 90)
    total = n * mean
    new_mean = mean + r.choice([-3, -2, -1, 1, 2, 3, 4])
    removed = total - (n - 1) * new_mean
    if removed <= 0:
        return None
    ctx = pick(r, [("a list of test scores", "score"), ("the weights, in kilograms, of a group of packages", "weight"),
                   ("the ages of the members of a club", "age"), ("the daily high temperatures, in degrees Fahrenheit, for a period of days", "temperature")])
    ask = r.choice(["removed", "new"])
    if ask == "removed":
        prompt = S(r"The mean of [[ctx]] is $[[m]]$ for $[[n]]$ values. When one [[w]] is removed, the mean of the remaining values is $[[nm]]$. What is the [[w]] that was removed?",
                   ctx=ctx[0], m=mean, n=n, w=ctx[1], nm=new_mean)
        ans = removed
    else:
        prompt = S(r"The mean of [[ctx]] is $[[m]]$ for $[[n]]$ values. If a [[w]] of $[[rv]]$ is removed, what is the mean of the remaining values?",
                   ctx=ctx[0], m=mean, n=n, w=ctx[1], rv=removed)
        ans = new_mean
    q = {"prompt": prompt}
    q.update(spr(ans))
    q["explanation"] = S(r"The original total is $[[n]] \times [[m]] = [[t]]$. The remaining $[[n1]]$ values total $[[n1]] \times [[nm]] = [[t1]]$. So the removed value is $[[t]] - [[t1]] = [[rv]]$.",
                         n=n, m=mean, t=total, n1=n - 1, nm=new_mean, t1=(n - 1) * new_mean, rv=removed)
    return q


@with_domain("data")
def conditional_two_way_hard(r):
    ctx = pick(r, [("Survey of Students", ["Walk", "Bus", "Car"], ["Grade 10", "Grade 11"], "students"),
                   ("Plant Trial Results", ["Flowered", "Did not flower", "Died"], ["Fertilizer A", "Fertilizer B"], "plants"),
                   ("Museum Visitors", ["Morning", "Afternoon", "Evening"], ["Members", "Nonmembers"], "visitors")])
    title, cols, rows, who = ctx
    grid = [[r.randint(8, 60) for _ in cols] for _ in rows]
    ri, ci = r.randrange(2), r.randrange(3)
    cj = r.choice([j for j in range(3) if j != ci])
    num_ = grid[ri][ci]
    den = grid[0][ci] + grid[1][ci] + grid[0][cj] + grid[1][cj]
    p = Fr(num_, den)
    res = spr(p)
    if not res:
        return None
    head = "".join(f"<th>{c}</th>" for c in cols)
    body = "".join(f"<tr><th>{rows[i]}</th>" + "".join(f"<td>${grid[i][j]}$</td>" for j in range(3)) + "</tr>" for i in range(2))
    table = f"<table><caption>{title}</caption><tr><th></th>{head}</tr>{body}</table>"
    q = {"prompt": table + S(r"<p>The table summarizes data for $[[tot]]$ [[w]]. If one of the [[w]] in either the &ldquo;[[c1]]&rdquo; or the &ldquo;[[c2]]&rdquo; category is selected at random, what is the probability that the selected one is in the &ldquo;[[c1]]&rdquo; category and is in the &ldquo;[[rr]]&rdquo; group?</p>",
                             tot=sum(map(sum, grid)), w=who, c1=cols[ci], c2=cols[cj], rr=rows[ri])}
    q.update(res)
    q["explanation"] = S(r"The selection is only from the &ldquo;[[c1]]&rdquo; and &ldquo;[[c2]]&rdquo; columns: $[[a]] + [[b]] + [[c]] + [[d]] = [[den]]$ [[w]]. Of those, $[[k]]$ are in the &ldquo;[[c1]]&rdquo; column and the &ldquo;[[rr]]&rdquo; row. The probability is $\dfrac{[[k]]}{[[den]]}$.",
                         c1=cols[ci], c2=cols[cj], a=grid[0][ci], b=grid[1][ci], c=grid[0][cj], d=grid[1][cj], den=den, w=who, k=num_, rr=rows[ri])
    q["skill"] = "probability"
    return q


@with_domain("data")
def rate_conversion_chain(r):
    mpg = r.randint(22, 45)
    price = Fr(r.randint(280, 480), 100)
    miles = r.randint(8, 40) * 10
    cost = Fr(miles, mpg) * price
    ans = round(float(cost), 2)
    choices_raw = [cost, Fr(miles * mpg) * price / 100, Fr(miles, mpg) / price, Fr(miles, mpg) * price * 2]
    vals = []
    for v in choices_raw:
        v = Fr(round(float(v) * 100), 100)
        if v not in vals and v > 0:
            vals.append(v)
    if len(vals) < 4:
        return None
    correct = vals[0]
    q = {"prompt": S(r"A car travels an average of $[[mpg]]$ miles per gallon of gasoline, and gasoline costs $[[p]]$ per gallon. To the nearest cent, what is the cost of the gasoline the car uses to travel $[[mi]]$ miles?",
                     mpg=mpg, p=money(price), mi=miles)}
    q.update(mcq_num(correct, vals[1:], r, wrap=lambda v: f"${money(v)}$"))
    q["explanation"] = S(r"Gallons used: $\dfrac{[[mi]]}{[[mpg]]}$. Cost: $\dfrac{[[mi]]}{[[mpg]]} \times [[p]] \approx [[c]]$. Dividing by the price, or multiplying miles by miles per gallon, gives units that aren't dollars.",
                         mi=miles, mpg=mpg, p=money(price), c=money(correct))
    return q


@with_domain("data")
def percent_of_percent_reverse(r):
    part_pct = r.choice([20, 25, 30, 40, 60, 75])
    sub_pct = r.choice([10, 20, 25, 40, 50, 60])
    count = r.randint(3, 40) * 3
    total = Fr(count * 10000, part_pct * sub_pct)
    if total.denominator != 1 or total > 5000:
        return None
    ctx = pick(r, [("employees at a company", "employees", "work remotely", "live more than 30 miles from the office", "does the company have"),
                   ("students at a school", "students", "play a sport", "play on more than one team", "attend the school"),
                   ("members of a library", "members", "borrowed an e-book last year", "borrowed more than ten e-books", "does the library have")])
    q = {"prompt": S(r"Of the [[w]], $[[p]]\%$ [[a]]. Of those who [[a]], $[[s]]\%$ [[b]]. If $[[c]]$ [[n]] [[a]] and [[b]], how many [[n]] [[end]]?",
                     w=ctx[0], n=ctx[1], p=part_pct, a=ctx[2], s=sub_pct, b=ctx[3], c=count, end=ctx[4])}
    q.update(spr(total))
    q["explanation"] = S(r"If $T$ is the total, then $[[pd]] \times [[sd]] \times T = [[c]]$, so $[[prod]]T = [[c]]$ and $T = [[t]]$.",
                         pd=f"{part_pct / 100:g}", sd=f"{sub_pct / 100:g}", prod=f"{part_pct * sub_pct / 10000:g}", c=count, t=total)
    return q


# ======================================================== geometry and trigonometry
@with_domain("geometry")
def similar_triangles_parallel(r):
    ad, db = r.randint(2, 12), r.randint(2, 12)
    de = r.randint(3, 15)
    bc = Fr(de * (ad + db), ad)
    res = spr(bc)
    if not res:
        return None
    ask_bc = r.random() < 0.6
    if ask_bc:
        prompt = S(r"In triangle $ABC$, point $D$ lies on $\overline{AB}$ and point $E$ lies on $\overline{AC}$ so that $\overline{DE}$ is parallel to $\overline{BC}$. If $AD = [[ad]]$, $DB = [[db]]$, and $DE = [[de]]$, what is the length of $\overline{BC}$?", ad=ad, db=db, de=de)
        ans = bc
        expl = S(r"Because $\overline{DE} \parallel \overline{BC}$, triangle $ADE$ is similar to triangle $ABC$. So $\dfrac{DE}{BC} = \dfrac{AD}{AB} = \dfrac{[[ad]]}{[[ab]]}$. Note that $AB = AD + DB = [[ab]]$, not $[[db]]$. Then $BC = [[de]] \cdot \dfrac{[[ab]]}{[[ad]]} = [[bc]]$.", ad=ad, ab=ad + db, db=db, de=de, bc=bc)
    else:
        if bc.denominator != 1:
            return None
        prompt = S(r"In triangle $ABC$, point $D$ lies on $\overline{AB}$ and point $E$ lies on $\overline{AC}$ so that $\overline{DE}$ is parallel to $\overline{BC}$. If $AD = [[ad]]$, $DB = [[db]]$, and $BC = [[bc]]$, what is the length of $\overline{DE}$?", ad=ad, db=db, bc=bc)
        ans = de
        res = spr(de)
        expl = S(r"Triangle $ADE$ is similar to triangle $ABC$, so $\dfrac{DE}{BC} = \dfrac{AD}{AB} = \dfrac{[[ad]]}{[[ab]]}$. Then $DE = [[bc]] \cdot \dfrac{[[ad]]}{[[ab]]} = [[de]]$.", ad=ad, ab=ad + db, bc=bc, de=de)
    q = {"prompt": prompt}
    q.update(spr(ans))
    q["explanation"] = expl
    return q


@with_domain("geometry")
def complementary_trig(r):
    a, c = r.randint(2, 6), r.randint(2, 6)
    k = r.randint(4, 14)
    b = r.randint(-10, 30)
    d = 90 - (a * k + b) - c * k
    x, y = a * k + b, c * k + d
    if not (0 < x < 90 and 0 < y < 90) or a == c:
        return None
    fn = r.choice([("sin", "cos"), ("cos", "sin")])
    q = {"prompt": S(r"In the equation $\[[f1]]\big(([[e1]])^\circ\big) = \[[f2]]\big(([[e2]])^\circ\big)$, $k$ is a constant, and both angle measures are between $0^\circ$ and $90^\circ$. What is the value of $k$?",
                     e1=lin(a, b, "k"), e2=lin(c, d, "k"), f1=fn[0], f2=fn[1])}
    q.update(spr(k))
    q["explanation"] = S(r"The sine of an angle equals the cosine of its complement, so the angles add to $90^\circ$: $([[e1]]) + ([[e2]]) = 90$. That gives $[[s]]k [[t]] = 90$, so $k = [[k]]$.",
                         e1=lin(a, b, "k"), e2=lin(c, d, "k"), s=a + c, t=("+ " + num(b + d)) if b + d >= 0 else ("- " + num(-(b + d))), k=k)
    return q


@with_domain("geometry")
def cylinder_scale_percent(r):
    ru = r.choice([10, 20, 30, 50])
    hd = r.choice([10, 20, 25, 40])
    shape = pick(r, [("right circular cylinder", r"V = \pi r^2 h"), ("right circular cone", r"V = \frac{1}{3}\pi r^2 h")])
    f = Fr(100 + ru, 100) ** 2 * Fr(100 - hd, 100)
    change = (f - 1) * 100
    if change == 0:
        return None
    res = spr(abs(change))
    if not res:
        return None
    word = "increase" if change > 0 else "decrease"
    q = {"prompt": S(r"The radius of a [[s]] is increased by $[[ru]]\%$, and its height is decreased by $[[hd]]\%$. By what percent does the volume of the [[s]] [[w]]?",
                     s=shape[0], ru=ru, hd=hd, w=word)}
    q.update(res)
    q["explanation"] = S(r"Since $[[formula]]$, the volume is multiplied by $([[g]])^2 \times [[hh]] = [[f]]$, which is a $[[c]]\%$ [[w]]. The radius is squared, so its $[[ru]]\%$ increase counts more than once.",
                         formula=shape[1], g=f"{1 + ru / 100:g}", hh=f"{1 - hd / 100:g}", f=f"{float(f):g}", c=pct(abs(change) / 100), w=word, ru=ru)
    return q


@with_domain("geometry")
def sector_radians(r):
    rad = r.randint(3, 15)
    num_, den = r.choice([(1, 6), (1, 4), (1, 3), (1, 2), (2, 3), (3, 4), (5, 6), (5, 4), (4, 3), (3, 2)])
    theta = Fr(num_, den)
    ask = r.choice(["arc", "area"])
    if ask == "arc":
        val = rad * theta  # times pi
        prompt = S(r"A circle has radius $[[r]]$. A central angle of the circle measures $\dfrac{[[n]]\pi}{[[d]]}$ radians. The length of the arc intercepted by this angle is $a\pi$. What is the value of $a$?",
                   r=rad, n=num_ if num_ != 1 else "", d=den)
        expl = S(r"Arc length equals radius times angle in radians: $[[r]] \cdot \dfrac{[[n]]\pi}{[[d]]} = [[v]]\pi$, so $a = [[v]]$.", r=rad, n=num_ if num_ != 1 else "", d=den, v=val)
    else:
        val = Fr(rad * rad, 2) * theta
        prompt = S(r"A circle has radius $[[r]]$. A sector of the circle has a central angle of $\dfrac{[[n]]\pi}{[[d]]}$ radians. The area of the sector is $a\pi$. What is the value of $a$?",
                   r=rad, n=num_ if num_ != 1 else "", d=den)
        expl = S(r"The sector is $\dfrac{\theta}{2\pi}$ of the circle: $\dfrac{[[n]]\pi/[[d]]}{2\pi} \cdot \pi([[r]])^2 = [[v]]\pi$, so $a = [[v]]$.", r=rad, n=num_ if num_ != 1 else "", d=den, v=val)
    res = spr(val)
    if not res:
        return None
    q = {"prompt": prompt}
    q.update(res)
    q["explanation"] = expl
    return q


@with_domain("geometry")
def circle_center_from_general(r):
    h, k = nz(r, -8, 8), nz(r, -8, 8)
    rad = r.randint(2, 9)
    c = h * h + k * k - rad * rad
    ask = r.choice(["hk", "r2"])
    eq = S(r"x^2 [[a]] + y^2 [[b]] = [[c]]", a=term(-2 * h, "x")[1:] if False else (("+ " if -2 * h > 0 else "- ") + num(abs(2 * h)) + "x"),
           b=(("+ " if -2 * k > 0 else "- ") + num(abs(2 * k)) + "y"), c=-c)
    if ask == "hk":
        prompt = S(r"The graph of $[[eq]]$ in the $xy$-plane is a circle with center $(h, k)$. What is the value of $h + k$?", eq=eq)
        ans = h + k
        expl = S(r"Complete the square: $(x [[hs]])^2 + (y [[ks]])^2 = [[c]] + [[hh]] + [[kk]] = [[rr]]$. The center is $([[h]], [[k]])$, so $h + k = [[ans]]$. Watch the signs: $(x [[hs]])^2$ means $h = [[h]]$.",
                   hs=("- " + num(h)) if h > 0 else ("+ " + num(-h)), ks=("- " + num(k)) if k > 0 else ("+ " + num(-k)), c=-c, hh=h * h, kk=k * k, rr=rad * rad, h=h, k=k, ans=h + k)
    else:
        prompt = S(r"The graph of $[[eq]]$ in the $xy$-plane is a circle. The area of the circle is $a\pi$, where $a$ is a constant. What is the value of $a$?", eq=eq)
        ans = rad * rad
        expl = S(r"Complete the square: $(x [[hs]])^2 + (y [[ks]])^2 = [[c]] + [[hh]] + [[kk]] = [[rr]]$. So $r^2 = [[rr]]$ and the area is $[[rr]]\pi$.",
                 hs=("- " + num(h)) if h > 0 else ("+ " + num(-h)), ks=("- " + num(k)) if k > 0 else ("+ " + num(-k)), c=-c, hh=h * h, kk=k * k, rr=rad * rad)
    q = {"prompt": prompt}
    q.update(spr(ans))
    q["explanation"] = expl
    return q


TEMPLATES = [
    ("linear-two-var", 3, two_item_revenue, 70),
    ("systems", 3, infinite_solutions_sum, 60),
    ("linear-functions", 3, break_even_models, 70),
    ("inequalities", 3, max_items_inequality, 70),
    ("linear-functions", 3, linear_model_meaning, 60),
    ("nonlinear-functions", 3, projectile_after_peak, 40),
    ("nonlinear-equations", 3, tangent_line_parabola, 60),
    ("nonlinear-functions", 3, decay_model_choice, 60),
    ("equivalent-expressions", 3, complete_square_constant, 60),
    ("nonlinear-functions", 3, transformed_table, 70),
    ("nonlinear-functions", 3, vertex_form_a, 60),
    ("percentages", 3, successive_percent, 50),
    ("one-var-data", 3, mean_after_removal, 70),
    ("probability", 3, conditional_two_way_hard, 80),
    ("ratios-rates", 3, rate_conversion_chain, 60),
    ("percentages", 3, percent_of_percent_reverse, 50),
    ("lines-angles", 3, similar_triangles_parallel, 70),
    ("right-triangles", 3, complementary_trig, 60),
    ("area-volume", 3, cylinder_scale_percent, 40),
    ("circles", 3, sector_radians, 60),
    ("circles", 3, circle_center_from_general, 70),
]
