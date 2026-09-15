"""Math > Geometry and Trigonometry generators."""
import math
from fractions import Fraction as Fr
from .common import S, num, money, big, lin, poly, term, paren_num, mcq_num, mcq_text, spr, pick, nz, solve_check, PY_TRIPLES

SECTION, DOMAIN = "math", "geometry"


def dec(x, places=2):
    return f"{float(x):.{places}f}".rstrip("0").rstrip(".")


def pi_wrap(v):
    v = Fr(v)
    if v == 1:
        return r"$\pi$"
    return f"${num(v)}\\pi$"


# ======================================================== area and volume
def rect_perimeter_area(r):
    l, w = r.randint(3, 25), r.randint(2, 20)
    if l == w:
        return None
    P = 2 * (l + w)
    unit = pick(r, ["centimeters", "inches", "meters", "feet"])
    q = {"prompt": S(r"A rectangle has a perimeter of [[p]] [[u]] and a length of [[l]] [[u]]. What is the area of the rectangle, in square [[u]]?", p=str(P), u=unit, l=str(l))}
    q.update(mcq_num(l * w, [P, l * (P - l), l * (P // 2)], r) or {})
    q["explanation"] = S(r"$2([[l]]) + 2w = [[p]]$, so $w = [[w]]$. Area $= [[l]] \times [[w]] = [[a]]$.", l=l, p=P, w=w, a=l * w)
    return q if "choices" in q else None


def cylinder_height(r):
    rad, h = r.randint(2, 9), r.randint(2, 15)
    V = rad * rad * h
    kind = r.choice(["height", "radius"])
    if kind == "height":
        q = {"prompt": S(r"A right circular cylinder has a radius of [[r]] inches and a volume of $[[v]]\pi$ cubic inches. What is the height of the cylinder, in inches?", r=str(rad), v=str(V))}
        q.update(spr(h))
        q["explanation"] = S(r"$V = \pi r^2 h$, so $[[v]]\pi = \pi([[r2]])h$ and $h = [[h]]$.", v=V, r2=rad * rad, h=h)
    else:
        q = {"prompt": S(r"A right circular cylinder has a height of [[h]] centimeters and a volume of $[[v]]\pi$ cubic centimeters. What is the radius of the base of the cylinder, in centimeters?", h=str(h), v=str(V))}
        q.update(spr(rad))
        q["explanation"] = S(r"$V = \pi r^2 h$, so $[[v]]\pi = \pi r^2([[h]])$. Then $r^2 = [[r2]]$ and $r = [[r]]$.", v=V, h=h, r2=rad * rad, r=rad)
    return q


def cube_sa_volume(r):
    s = r.randint(2, 12)
    kind = r.choice(["sa_to_v", "v_to_sa"])
    if kind == "sa_to_v":
        q = {"prompt": S(r"A cube has a total surface area of [[sa]] square inches. What is the volume of the cube, in cubic inches?", sa=f"{6 * s * s:,}")}
        q.update(mcq_num(s ** 3, [s * s, 6 * s * s, s ** 3 * 2], r) or {})
        q["explanation"] = S(r"A cube has 6 congruent square faces: $6s^2 = [[sa]]$, so $s^2 = [[s2]]$ and $s = [[s]]$. Volume $= [[s]]^3 = [[v]]$.", sa=6 * s * s, s2=s * s, s=s, v=s ** 3)
    else:
        q = {"prompt": S(r"A cube has a volume of [[v]] cubic centimeters. What is the total surface area of the cube, in square centimeters?", v=f"{s ** 3:,}")}
        q.update(mcq_num(6 * s * s, [s * s, 4 * s * s, s ** 3], r) or {})
        q["explanation"] = S(r"$s^3 = [[v]]$, so $s = [[s]]$. The surface area is $6s^2 = 6([[s2]]) = [[sa]]$.", v=s ** 3, s=s, s2=s * s, sa=6 * s * s)
    return q if "choices" in q else None


def scale_volume_percent(r):
    pct = r.choice([10, 20, 25, 50, 100, -10, -20, -50])
    dims = r.choice([2, 3])
    mult = Fr(100 + pct, 100) ** dims
    change = (mult - 1) * 100
    shape = "cube" if dims == 3 else "square"
    what = "volume" if dims == 3 else "area"
    edge = "edge" if dims == 3 else "side"
    word = "increased" if pct > 0 else "decreased"
    ans = spr(abs(change))
    if not ans:
        return None
    q = {"prompt": S(r"The length of each [[e]] of a [[sh]] is [[w]] by [[p]]%. By what percent does the [[wh]] of the [[sh]] [[verb]]?",
                     e=edge, sh=shape, w=word, p=str(abs(pct)), wh=what, verb="increase" if pct > 0 else "decrease"), **ans}
    q["explanation"] = S(r"Each [[e]] is multiplied by $[[m]]$, so the [[wh]] is multiplied by $[[m]]^[[d]] = [[mm]]$. That is a change of $[[c]]\%$. The percent for one dimension doesn't carry over directly to [[wh]].",
                         e=edge, m=dec(Fr(100 + pct, 100)), wh=what, d=dims, mm=dec(mult, 4), c=dec(abs(change), 2))
    return q


def triangle_area(r):
    kind = r.choice(["find_area", "find_height"])
    b, h = r.randint(4, 30), r.randint(3, 24)
    A = Fr(b * h, 2)
    if kind == "find_area":
        q = {"prompt": S(r"A triangle has a base of [[b]] meters and a height of [[h]] meters. What is the area of the triangle, in square meters?", b=str(b), h=str(h))}
        q.update(mcq_num(A, [b * h, b + h, Fr(b * h, 4)], r) or {})
        q["explanation"] = S(r"$A = \frac{1}{2}bh = \frac{1}{2}([[b]])([[h]]) = [[a]]$.", b=b, h=h, a=A)
        q["difficulty"] = 1
    else:
        if A.denominator != 1:
            return None
        q = {"prompt": S(r"A triangle has an area of [[a]] square inches and a base of [[b]] inches. What is the height of the triangle, in inches?", a=str(A), b=str(b))}
        q.update(spr(h))
        q["explanation"] = S(r"$A = \frac{1}{2}bh$, so $[[a]] = \frac{1}{2}([[b]])h$. Then $h = \frac{2 \cdot [[a]]}{[[b]]} = [[h]]$.", a=A, b=b, h=h)
        q["difficulty"] = 2
    return q if ("choices" in q or "answer" in q) else None


def sphere_cone_volume(r):
    kind = r.choice(["cone", "sphere"])
    if kind == "cone":
        rad, h = r.randint(2, 9), r.choice([3, 6, 9, 12, 15])
        V = Fr(rad * rad * h, 3)
        q = {"prompt": S(r"A right circular cone has a volume of $[[v]]\pi$ cubic centimeters and a height of [[h]] centimeters. What is the radius of the base of the cone, in centimeters?", v=num(V), h=str(h))}
        q.update(spr(rad))
        q["explanation"] = S(r"$V = \frac{1}{3}\pi r^2 h$, so $[[v]]\pi = \frac{1}{3}\pi r^2 ([[h]])$. Then $r^2 = [[r2]]$ and $r = [[r]]$.", v=V, h=h, r2=rad * rad, r=rad)
    else:
        rad = r.choice([3, 6, 9, 12])
        V = Fr(4 * rad ** 3, 3)
        q = {"prompt": S(r"A sphere has a volume of $[[v]]\pi$ cubic feet. What is the radius of the sphere, in feet?", v=big(int(V)))}
        q.update(spr(rad))
        q["explanation"] = S(r"$V = \frac{4}{3}\pi r^3$, so $[[v]]\pi = \frac{4}{3}\pi r^3$. Then $r^3 = [[r3]]$ and $r = [[r]]$.", v=big(int(V)), r3=big(rad ** 3), r=rad)
    return q


def similar_solids(r):
    a, b = r.choice([(1, 2), (2, 3), (1, 3), (3, 4), (2, 5), (3, 5)])
    small_v = r.choice([8, 16, 24, 27, 32, 40, 54, 64, 81, 125]) * a ** 3
    big_v = Fr(small_v * b ** 3, a ** 3)
    if big_v.denominator != 1:
        return None
    shape = pick(r, ["cylinders", "rectangular prisms", "cones", "pyramids"])
    q = {"prompt": S(r"Two similar [[s]] have heights in the ratio $[[a]]:[[b]]$. The volume of the smaller one is [[sv]] cubic units. What is the volume of the larger one, in cubic units?", s=shape, a=a, b=b, sv=f"{small_v:,}")}
    q.update(spr(big_v) or {})
    if "answer" not in q:
        return None
    q["explanation"] = S(r"For similar solids with a length ratio of $[[a]]:[[b]]$, the volume ratio is $[[a3]]:[[b3]]$. So the larger volume is $[[sv]] \times \frac{[[b3]]}{[[a3]]} = [[bv]]$.", a=a, b=b, a3=a ** 3, b3=b ** 3, sv=small_v, bv=big_v)
    return q


# ======================================================== lines, angles, triangles
def supplementary_ratio(r):
    kind = r.choice(["supplementary", "complementary"])
    total = 180 if kind == "supplementary" else 90
    k = r.choice([2, 3, 4, 5, 8]) if kind == "supplementary" else r.choice([2, 4, 5, 8])
    if total % (k + 1):
        return None
    small = total // (k + 1)
    ask = r.choice(["larger", "smaller"])
    val = small * k if ask == "larger" else small
    q = {"prompt": S(r"Two angles are [[kind]]. The measure of one angle is [[k]] times the measure of the other. What is the measure, in degrees, of the [[ask]] angle?", kind=kind, k=str(k), ask=ask)}
    q.update(mcq_num(val, [small if ask == "larger" else small * k, total // k, total - small if total - small != val else val + 10], r) or {})
    q["explanation"] = S(r"[[K]] angles sum to $[[t]]^\circ$: $x + [[k]]x = [[t]]$, so $x = [[s]]$. The [[ask]] angle is $[[v]]^\circ$.", K=kind.capitalize(), t=total, k=k, s=small, ask=ask, v=val)
    return q if "choices" in q else None


def third_angle(r):
    a, b = r.randint(20, 100), r.randint(20, 100)
    c = 180 - a - b
    if c <= 5:
        return None
    q = {"prompt": S(r"Two angles of a triangle measure $[[a]]^\circ$ and $[[b]]^\circ$. What is the measure of the third angle?", a=a, b=b)}
    q.update(mcq_num(c, [a + b, 360 - a - b, 90 - c if 90 - c > 0 and 90 - c != c else c + 10], r, wrap=lambda v: f"${num(v)}^\\circ$") or {})
    q["explanation"] = S(r"The angles of a triangle sum to $180^\circ$: $180 - [[a]] - [[b]] = [[c]]$.", a=a, b=b, c=c)
    return q if "choices" in q else None


def parallel_transversal(r):
    kind = r.choice(["same-side interior", "alternate interior", "corresponding"])
    x = r.randint(5, 40)
    if kind == "same-side interior":
        a, b = r.randint(2, 5), r.randint(1, 4)
        c = r.randint(-20, 40)
        d = 180 - (a * x + c) - b * x
        e1, e2 = lin(a, c), lin(b, d)
        if a * x + c <= 0 or b * x + d <= 0:
            return None
        rule = "Same-side interior angles between parallel lines are supplementary"
        eq = S(r"$([[e1]]) + ([[e2]]) = 180$", e1=e1, e2=e2)
    else:
        a, b = r.randint(2, 7), r.randint(1, 6)
        if a == b:
            return None
        c = r.randint(-15, 40)
        d = a * x + c - b * x
        e1, e2 = lin(a, c), lin(b, d)
        if a * x + c <= 0 or a * x + c >= 180:
            return None
        rule = ("Alternate interior" if kind == "alternate interior" else "Corresponding") + " angles formed by parallel lines are congruent"
        eq = S(r"$[[e1]] = [[e2]]$", e1=e1, e2=e2)
    q = {"prompt": S(r"Parallel lines $\ell$ and $m$ are intersected by a transversal. Two [[k]] angles formed by the transversal measure $([[e1]])^\circ$ and $([[e2]])^\circ$. What is the value of $x$?", k=kind, e1=e1, e2=e2)}
    q.update(spr(x))
    q["explanation"] = S(r"[[rule]]: [[eq]], so $x = [[x]]$.", rule=rule, eq=eq, x=x)
    return q


def similar_triangle_figure(r):
    ad, db = r.randint(2, 12), r.randint(2, 15)
    de = r.randint(3, 14)
    ab = ad + db
    bc = Fr(de * ab, ad)
    if bc.denominator != 1:
        return None
    t = Fr(ad, ab)
    ax, ay, bx, by, cx, cy = 150, 20, 40, 200, 260, 200
    dx, dy = ax + float(t) * (bx - ax), ay + float(t) * (by - ay)
    ex, ey = ax + float(t) * (cx - ax), dy
    svg = (f'<svg viewBox="0 0 300 220" width="260" role="img" aria-label="Triangle ABC with segment DE parallel to BC">'
           f'<g fill="none" stroke="currentColor" stroke-width="2"><polygon points="150,20 40,200 260,200"/>'
           f'<line x1="{dx:.0f}" y1="{dy:.0f}" x2="{ex:.0f}" y2="{ey:.0f}"/></g>'
           f'<g fill="currentColor" font-family="system-ui, sans-serif" font-size="15"><text x="144" y="14">A</text><text x="24" y="212">B</text>'
           f'<text x="264" y="212">C</text><text x="{dx - 18:.0f}" y="{dy + 4:.0f}">D</text><text x="{ex + 6:.0f}" y="{ey + 4:.0f}">E</text></g></svg>')
    ask = r.choice(["BC", "DE"])
    if ask == "BC":
        text = S(r"In triangle $ABC$ above, $\overline{DE}$ is parallel to $\overline{BC}$. If $AD = [[ad]]$, $DB = [[db]]$, and $DE = [[de]]$, what is the length of $\overline{BC}$? (Note: the figure is not drawn to scale.)", ad=ad, db=db, de=de)
        val, wrong = bc, Fr(de * db, ad)
        expl = S(r"Since $DE \parallel BC$, triangle $ADE$ is similar to triangle $ABC$, so $\frac{AD}{AB} = \frac{DE}{BC}$. Note that $AB = [[ad]] + [[db]] = [[ab]]$: $\frac{[[ad]]}{[[ab]]} = \frac{[[de]]}{BC}$, so $BC = [[bc]]$.", ad=ad, db=db, ab=ab, de=de, bc=bc)
    else:
        text = S(r"In triangle $ABC$ above, $\overline{DE}$ is parallel to $\overline{BC}$. If $AD = [[ad]]$, $DB = [[db]]$, and $BC = [[bc]]$, what is the length of $\overline{DE}$? (Note: the figure is not drawn to scale.)", ad=ad, db=db, bc=bc)
        val, wrong = Fr(de), Fr(bc * ad, db)
        expl = S(r"Since $DE \parallel BC$, triangle $ADE$ is similar to triangle $ABC$, so $\frac{DE}{BC} = \frac{AD}{AB} = \frac{[[ad]]}{[[ab]]}$. Then $DE = [[bc]] \times \frac{[[ad]]}{[[ab]]} = [[de]]$.", ad=ad, ab=ab, bc=bc, de=de)
    q = {"prompt": svg + f"<p>{text}</p>", "explanation": expl}
    q.update(mcq_num(val, [wrong, val + ad, Fr(val, 2) if val % 2 == 0 else val - 1], r) or {})
    return q if "choices" in q else None


def isosceles_angles(r):
    kind = r.choice(["vertex_given", "base_given"])
    if kind == "vertex_given":
        v = r.choice(range(20, 160, 2))
        base = Fr(180 - v, 2)
        q = {"prompt": S(r"In isosceles triangle $PQR$, $PQ = PR$ and the measure of angle $P$ is $[[v]]^\circ$. What is the measure, in degrees, of angle $Q$?", v=v)}
        q.update(spr(base))
        q["explanation"] = S(r"Base angles $Q$ and $R$ are congruent: $2x + [[v]] = 180$, so $x = [[b]]$.", v=v, b=base)
    else:
        b = r.randint(15, 85)
        vertex = 180 - 2 * b
        q = {"prompt": S(r"In isosceles triangle $PQR$, $PQ = PR$ and the measure of angle $Q$ is $[[b]]^\circ$. What is the measure, in degrees, of angle $P$?", b=b)}
        q.update(spr(vertex))
        q["explanation"] = S(r"Since $PQ = PR$, angles $Q$ and $R$ are congruent, each $[[b]]^\circ$. So angle $P$ is $180 - 2([[b]]) = [[v]]$ degrees.", b=b, v=vertex)
    return q if q.get("answer") else None


def exterior_angle(r):
    a, b = r.randint(20, 80), r.randint(20, 80)
    x = r.randint(3, 20)
    coef = r.randint(2, 6)
    const = a + b - coef * x
    q = {"prompt": S(r"In a triangle, two interior angles measure $[[a]]^\circ$ and $[[b]]^\circ$. The exterior angle adjacent to the third interior angle measures $([[e]])^\circ$. What is the value of $x$?", a=a, b=b, e=lin(coef, const))}
    q.update(spr(x))
    q["explanation"] = S(r"An exterior angle equals the sum of the two remote interior angles: $[[e]] = [[a]] + [[b]] = [[s]]$, so $x = [[x]]$.", e=lin(coef, const), a=a, b=b, s=a + b, x=x)
    return q


def polygon_angles(r):
    n = r.choice([5, 6, 8, 9, 10, 12, 15, 18, 20])
    kind = r.choice(["interior", "sum", "exterior"])
    names = {5: "pentagon", 6: "hexagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "dodecagon"}
    name = f"regular {names[n]}" if n in names else f"regular polygon with {n} sides"
    if kind == "interior":
        val = Fr((n - 2) * 180, n)
        ask = "the measure, in degrees, of each interior angle"
        expl = S(r"The interior angles sum to $(n - 2) \times 180 = [[s]]$. Divide by $[[n]]$: $[[v]]$.", s=(n - 2) * 180, n=n, v=val)
    elif kind == "sum":
        val = Fr((n - 2) * 180)
        ask = "the sum, in degrees, of the interior angles"
        expl = S(r"The sum is $(n - 2) \times 180 = ([[n]] - 2) \times 180 = [[v]]$.", n=n, v=big(int(val)))
    else:
        val = Fr(360, n)
        ask = "the measure, in degrees, of each exterior angle"
        expl = S(r"Exterior angles of any polygon sum to $360^\circ$, so each is $\frac{360}{[[n]]} = [[v]]$.", n=n, v=val)
    ans = spr(val)
    if not ans:
        return None
    return {"prompt": f"What is {ask} of a {name}?", "explanation": expl, **ans}


# ======================================================== right triangles and trig
def hypotenuse(r):
    a0, b0, c0 = pick(r, PY_TRIPLES[:4])
    k = r.randint(1, 5)
    a, b, c = a0 * k, b0 * k, c0 * k
    kind = r.choice(["hyp", "leg"])
    if kind == "hyp":
        q = {"prompt": S(r"The legs of a right triangle have lengths [[a]] and [[b]]. What is the length of the hypotenuse?", a=str(a), b=str(b))}
        q.update(mcq_num(c, [a + b, c + k, abs(b - a) if abs(b - a) != c else c - 2], r) or {})
        q["explanation"] = S(r"$c^2 = [[a]]^2 + [[b]]^2 = [[a2]] + [[b2]] = [[c2]]$, so $c = [[c]]$.", a=a, b=b, a2=a * a, b2=b * b, c2=c * c, c=c)
    else:
        q = {"prompt": S(r"A right triangle has a hypotenuse of length [[c]] and one leg of length [[a]]. What is the length of the other leg?", c=str(c), a=str(a))}
        q.update(mcq_num(b, [c - a, c + a, b + k], r) or {})
        q["explanation"] = S(r"$[[a]]^2 + x^2 = [[c]]^2$, so $x^2 = [[c2]] - [[a2]] = [[b2]]$ and $x = [[b]]$.", a=a, c=c, c2=c * c, a2=a * a, b2=b * b, b=b)
    return q if "choices" in q else None


def cofunction(r):
    a, b, c = pick(r, PY_TRIPLES[:5])
    given = r.choice(["sin", "cos"])
    ratio = Fr(a, c)
    other = {"sin": "cos", "cos": "sin"}[given]
    q = {"prompt": S(r"In right triangle $ABC$, angle $C$ is the right angle. If $\[[g]] A = \dfrac{[[a]]}{[[c]]}$, what is the value of $\[[o]] B$?", g=given, a=a, c=c, o=other)}
    wrap = lambda v: f"$\\dfrac{{{v.numerator}}}{{{v.denominator}}}$"
    q.update(mcq_num(ratio, [Fr(b, c), Fr(a, b), Fr(c, a)], r, wrap=wrap) or {})
    q["explanation"] = S(r"Angles $A$ and $B$ are complementary. The side opposite $A$ is adjacent to $B$, so $\[[o]] B = \[[g]] A = \dfrac{[[a]]}{[[c]]}$.", o=other, g=given, a=a, c=c)
    return q if "choices" in q else None


def trig_side(r):
    a0, b0, c0 = pick(r, PY_TRIPLES[:4])
    k = r.randint(2, 6)
    fn = r.choice(["tan", "sin", "cos"])
    opp, adj, hyp = a0 * k, b0 * k, c0 * k
    given_ratio = {"tan": Fr(a0, b0), "sin": Fr(a0, c0), "cos": Fr(b0, c0)}[fn]
    if fn == "tan":
        known, known_val, ask, ans = "PR", hyp, "QR", opp
    elif fn == "sin":
        known, known_val, ask, ans = "PQ", adj, "PR", hyp
    else:
        known, known_val, ask, ans = "QR", opp, "PQ", adj
    q = {"prompt": S(r"In right triangle $PQR$, angle $Q$ is the right angle, $\[[fn]] P = \dfrac{[[n]]}{[[d]]}$, and $[[known]] = [[kv]]$. What is the length of $\overline{[[ask]]}$?",
                     fn=fn, n=given_ratio.numerator, d=given_ratio.denominator, known=known, kv=known_val, ask=ask)}
    q.update(spr(ans))
    q["explanation"] = S(r"Side $QR$ is opposite angle $P$, $PQ$ is adjacent, and $PR$ is the hypotenuse. $\[[fn]] P = \frac{[[n]]}{[[d]]}$ means the sides are in the ratio $[[a0]]:[[b0]]:[[c0]]$ (opposite : adjacent : hypotenuse). Since $[[known]] = [[kv]]$, the scale factor is $[[k]]$, so $[[ask]] = [[ans]]$.",
                         fn=fn, n=given_ratio.numerator, d=given_ratio.denominator, a0=a0, b0=b0, c0=c0, known=known, kv=known_val, k=k, ask=ask, ans=ans)
    return q


def special_right(r):
    kind = r.choice(["30-60-90", "45-45-90"])
    s = r.randint(2, 12)
    if kind == "45-45-90":
        ask = r.choice(["hyp", "leg"])
        if ask == "hyp":
            prompt = S(r"Each leg of an isosceles right triangle has length [[s]]. What is the length of the hypotenuse?", s=str(s))
            correct = f"${s}\\sqrt{{2}}$"
            ds = [f"${2 * s}$", f"${s}\\sqrt{{3}}$", f"${s * 2}\\sqrt{{2}}$"]
            expl = S(r"In a $45^\circ$-$45^\circ$-$90^\circ$ triangle, the hypotenuse is $\sqrt{2}$ times a leg: $[[s]]\sqrt{2}$.", s=s)
        else:
            prompt = S(r"The hypotenuse of an isosceles right triangle has length $[[s]]\sqrt{2}$. What is the length of each leg?", s=s)
            correct = f"${s}$"
            ds = [f"${s}\\sqrt{{2}}$", f"${2 * s}$", f"$\\frac{{{s}}}{{2}}$" if s % 2 else f"${s // 2}$"]
            expl = S(r"In a $45^\circ$-$45^\circ$-$90^\circ$ triangle, the hypotenuse is $\sqrt{2}$ times a leg, so each leg is $[[s]]$.", s=s)
    else:
        ask = r.choice(["long", "hyp"])
        if ask == "long":
            prompt = S(r"In a right triangle, one angle measures $30^\circ$ and the side opposite that angle has length [[s]]. What is the length of the side opposite the $60^\circ$ angle?", s=str(s))
            correct = f"${s}\\sqrt{{3}}$"
            ds = [f"${2 * s}$", f"${s}\\sqrt{{2}}$", f"$\\frac{{{s}\\sqrt{{3}}}}{{3}}$"]
            expl = S(r"In a $30^\circ$-$60^\circ$-$90^\circ$ triangle, the sides are $x$, $x\sqrt{3}$, $2x$. With $x = [[s]]$, the side opposite $60^\circ$ is $[[s]]\sqrt{3}$.", s=s)
        else:
            prompt = S(r"In a right triangle, one angle measures $60^\circ$ and the side opposite the $30^\circ$ angle has length [[s]]. What is the length of the hypotenuse?", s=str(s))
            correct = f"${2 * s}$"
            ds = [f"${s}\\sqrt{{3}}$", f"${s}\\sqrt{{2}}$", f"${3 * s}$"]
            expl = S(r"In a $30^\circ$-$60^\circ$-$90^\circ$ triangle, the hypotenuse is twice the shortest side: $2 \times [[s]] = [[h]]$.", s=s, h=2 * s)
    q = {"prompt": prompt, "explanation": expl}
    q.update(mcq_text(correct, ds, r))
    return q


def sin_cos_equal(r):
    a, b = r.randint(2, 6), r.randint(2, 6)
    k = r.randint(3, 15)
    c = r.randint(-10, 30)
    d = 90 - (a * k + c) - b * k
    if a * k + c <= 0 or b * k + d <= 0:
        return None
    q = {"prompt": S(r"In the equation $\sin([[e1]])^\circ = \cos([[e2]])^\circ$, both angle measures are between $0^\circ$ and $90^\circ$. What is the value of $k$?", e1=lin(a, c, "k"), e2=lin(b, d, "k"))}
    q.update(spr(k))
    q["explanation"] = S(r"$\sin x^\circ = \cos y^\circ$ when $x + y = 90$ (complementary angles): $([[e1]]) + ([[e2]]) = 90$, so $[[s]]k [[ct]] = 90$ and $k = [[k]]$.", e1=lin(a, c, "k"), e2=lin(b, d, "k"), s=a + b, ct=term(c + d, "").strip(), k=k)
    return q


def degrees_radians(r):
    deg = r.choice([30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360, 20, 40, 72, 100])
    frac = Fr(deg, 180)
    if r.random() < 0.5:
        q = {"prompt": S(r"What is the measure, in radians, of an angle of $[[d]]^\circ$?", d=deg)}
        wrap = lambda v: pi_wrap(v)
        q.update(mcq_num(frac, [Fr(180, deg), Fr(deg, 360), Fr(deg, 90)], r, wrap=wrap) or {})
        q["explanation"] = S(r"Multiply by $\frac{\pi}{180}$: $[[d]] \times \frac{\pi}{180} = [[f]]\pi$.", d=deg, f=frac if frac != 1 else "")
    else:
        q = {"prompt": S(r"An angle measures $[[f]]\pi$ radians. What is its measure in degrees?", f=num(frac) if frac != 1 else "")}
        q.update(spr(deg) or {})
        q["explanation"] = S(r"Multiply by $\frac{180}{\pi}$: $[[f]]\pi \times \frac{180}{\pi} = [[d]]$.", f=num(frac) if frac != 1 else "", d=deg)
    return q if ("choices" in q or "answer" in q) else None


# ======================================================== circles
def circumference_area(r):
    rad = r.randint(2, 15)
    kind = r.choice(["c_to_a", "a_to_c"])
    if kind == "c_to_a":
        q = {"prompt": S(r"A circle has a circumference of $[[c]]\pi$ units. What is the area of the circle, in square units?", c=2 * rad)}
        q.update(mcq_num(rad * rad, [2 * rad, rad, 4 * rad * rad], r, wrap=pi_wrap) or {})
        q["explanation"] = S(r"$2\pi r = [[c]]\pi$, so $r = [[r]]$. Area $= \pi r^2 = [[a]]\pi$.", c=2 * rad, r=rad, a=rad * rad)
    else:
        q = {"prompt": S(r"A circle has an area of $[[a]]\pi$ square units. What is the circumference of the circle, in units?", a=rad * rad)}
        q.update(mcq_num(2 * rad, [rad, rad * rad, 4 * rad], r, wrap=pi_wrap) or {})
        q["explanation"] = S(r"$\pi r^2 = [[a]]\pi$, so $r = [[r]]$. Circumference $= 2\pi r = [[c]]\pi$.", a=rad * rad, r=rad, c=2 * rad)
    return q if "choices" in q else None


def circle_center_radius(r):
    h, k = r.randint(-9, 9), r.randint(-9, 9)
    rad = r.randint(2, 12)
    eq = f"{'x^2' if h == 0 else '(' + lin(1, -h) + ')^2'} + {'y^2' if k == 0 else '(' + lin(1, -k, 'y') + ')^2'} = {rad * rad}"
    correct = f"Center $({h}, {k})$, radius ${rad}$"
    ds = [f"Center $({-h}, {-k})$, radius ${rad}$", f"Center $({h}, {k})$, radius ${rad * rad}$", f"Center $({-h}, {-k})$, radius ${rad * rad}$"]
    q = {"prompt": S(r"A circle in the $xy$-plane has the equation $[[eq]]$. What are the center and radius of the circle?", eq=eq)}
    q.update(mcq_text(correct, ds, r))
    q["explanation"] = S(r"The form $(x - h)^2 + (y - k)^2 = r^2$ has center $(h, k)$ and radius $r$. Here $h = [[h]]$, $k = [[k]]$, and $r = \sqrt{[[r2]]} = [[r]]$. Watch the signs inside the parentheses.", h=h, k=k, r2=rad * rad, r=rad)
    return q


def complete_square_radius(r):
    h, k = nz(r, -8, 8), nz(r, -8, 8)
    rad = r.randint(2, 11)
    c = rad * rad - h * h - k * k
    ask = r.choice(["radius", "center"])
    eq = "x^2 + y^2" + term(-2 * h, "x") + term(-2 * k, "y") + f" = {c}"
    if ask == "radius":
        q = {"prompt": S(r"The graph of $[[eq]]$ in the $xy$-plane is a circle. What is the radius of the circle?", eq=eq)}
        q.update(spr(rad))
    else:
        q = {"prompt": S(r"The graph of $[[eq]]$ in the $xy$-plane is a circle with center $(h, k)$. What is the value of $h + k$?", eq=eq)}
        q.update(spr(h + k))
    q["explanation"] = S(r"Complete the square: $(x^2 [[t1]] + [[h2]]) + (y^2 [[t2]] + [[k2]]) = [[c]] + [[h2]] + [[k2]]$, so $([[xh]])^2 + ([[yk]])^2 = [[r2]]$. The center is $([[h]], [[k]])$ and the radius is $[[r]]$.",
                         t1=term(-2 * h, "x").strip(), h2=h * h, t2=term(-2 * k, "y").strip(), k2=k * k, c=c, xh=lin(1, -h), yk=lin(1, -k, "y"), r2=rad * rad, h=h, k=k, r=rad)
    return q


def arc_sector(r):
    rad = r.randint(2, 15)
    ang = r.choice([30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270])
    kind = r.choice(["arc", "sector"])
    if kind == "arc":
        val = Fr(ang, 360) * 2 * rad
        q = {"prompt": S(r"A circle has a radius of [[r]] centimeters. What is the length, in centimeters, of an arc of the circle that is intercepted by a central angle of $[[a]]^\circ$?", r=str(rad), a=ang)}
        q.update(mcq_num(val, [Fr(ang, 360) * rad * rad, Fr(ang, 180) * rad, 2 * rad], r, wrap=pi_wrap) or {})
        q["explanation"] = S(r"Arc length $= \frac{[[a]]}{360} \times 2\pi([[r]]) = [[v]]\pi$.", a=ang, r=rad, v=val if val != 1 else "")
    else:
        val = Fr(ang, 360) * rad * rad
        q = {"prompt": S(r"A circle has a radius of [[r]] inches. What is the area, in square inches, of a sector of the circle with a central angle of $[[a]]^\circ$?", r=str(rad), a=ang)}
        q.update(mcq_num(val, [Fr(ang, 360) * 2 * rad, Fr(ang, 180) * rad * rad, rad * rad], r, wrap=pi_wrap) or {})
        q["explanation"] = S(r"Sector area $= \frac{[[a]]}{360} \times \pi([[r]])^2 = [[v]]\pi$.", a=ang, r=rad, v=val if val != 1 else "")
    return q if "choices" in q else None


def point_on_circle(r):
    h, k = r.randint(-6, 6), r.randint(-6, 6)
    a, b, c = pick(r, PY_TRIPLES[:3])
    pts = [(h + a, k + b), (h - b, k + a), (h + c, k), (h, k - c)]
    good = pick(r, pts)
    bad = [p for p in [(h + a, k + a), (h + b, k + b), (h + c - 1, k + 1), (h + a + 1, k + b), (h - c, k + 1)]
           if (p[0] - h) ** 2 + (p[1] - k) ** 2 != c * c]
    if len(bad) < 3:
        return None
    labels = [f"$({p[0]}, {p[1]})$" for p in [good] + bad[:3]]
    eq = f"{'x^2' if h == 0 else '(' + lin(1, -h) + ')^2'} + {'y^2' if k == 0 else '(' + lin(1, -k, 'y') + ')^2'} = {c * c}"
    q = {"prompt": S(r"Which point lies on the circle with equation $[[eq]]$?", eq=eq)}
    q.update(mcq_text(labels[0], labels[1:], r))
    q["explanation"] = S(r"The center is $([[h]], [[k]])$ and the radius is $[[c]]$. The point $([[x]], [[y]])$ is at horizontal distance $[[dx]]$ and vertical distance $[[dy]]$ from the center, and $[[dx]]^2 + [[dy]]^2 = [[c2]]$ ✓.",
                         h=h, k=k, c=c, x=good[0], y=good[1], dx=abs(good[0] - h), dy=abs(good[1] - k), c2=c * c)
    return q


TEMPLATES = [
    ("area-volume", 1, rect_perimeter_area, 50), ("area-volume", 2, cylinder_height, 50), ("area-volume", 2, cube_sa_volume, 30),
    ("area-volume", 3, scale_volume_percent, 16), ("area-volume", 1, triangle_area, 50), ("area-volume", 3, sphere_cone_volume, 30),
    ("area-volume", 3, similar_solids, 40),
    ("lines-angles", 1, supplementary_ratio, 20), ("lines-angles", 1, third_angle, 50), ("lines-angles", 2, parallel_transversal, 60),
    ("lines-angles", 3, similar_triangle_figure, 60), ("lines-angles", 2, isosceles_angles, 50), ("lines-angles", 2, exterior_angle, 50),
    ("lines-angles", 2, polygon_angles, 26),
    ("right-triangles", 1, hypotenuse, 50), ("right-triangles", 2, cofunction, 20), ("right-triangles", 3, trig_side, 60),
    ("right-triangles", 2, special_right, 60), ("right-triangles", 3, sin_cos_equal, 50), ("right-triangles", 2, degrees_radians, 40),
    ("circles", 1, circumference_area, 40), ("circles", 2, circle_center_radius, 60), ("circles", 3, complete_square_radius, 60),
    ("circles", 2, arc_sector, 60), ("circles", 2, point_on_circle, 40),
]
