"""Math > Problem-Solving and Data Analysis generators."""
import math
from fractions import Fraction as Fr
from statistics import median
from .common import S, num, money, big, lin, poly, term, paren_num, mcq_num, mcq_text, spr, pick, nz, solve_check

SECTION, DOMAIN = "math", "data"


def dec(x, places=2):
    return f"{float(x):.{places}f}".rstrip("0").rstrip(".")


# ======================================================== ratios, rates, units
RATIO_CTX = [("A recipe uses [[a]] cups of flour for every [[b]] cups of sugar.", "cups of flour", "cups of sugar"),
             ("A paint mixture uses [[a]] parts blue paint for every [[b]] parts white paint.", "parts of blue paint", "parts of white paint"),
             ("On a school trip, there are [[a]] students for every [[b]] adult chaperones.", "students", "adult chaperones"),
             ("A fruit punch uses [[a]] liters of juice for every [[b]] liters of sparkling water.", "liters of juice", "liters of sparkling water"),
             ("In a garden, [[a]] tomato plants are planted for every [[b]] pepper plants.", "tomato plants", "pepper plants")]


def ratio_scale(r):
    text, x_name, y_name = pick(r, RATIO_CTX)
    a, b = r.sample([2, 3, 4, 5, 6, 7, 8, 9], 2)
    if math.gcd(a, b) != 1:
        return None
    k = r.randint(2, 9)
    q = {"prompt": S(text, a=str(a), b=str(b)) + f" At this ratio, how many {x_name} are needed for {b * k} {y_name}?"}
    q.update(mcq_num(a * k, [b * k + a - b if b * k + a - b != a * k else a * k + 3, Fr(b * b * k, a), a * b * k], r) or {})
    q["explanation"] = S(r"The second quantity is multiplied by $\frac{[[bk]]}{[[b]]} = [[k]]$, so multiply the first by $[[k]]$ as well: $[[a]] \times [[k]] = [[ak]]$.", bk=b * k, b=b, k=k, a=a, ak=a * k)
    return q if "choices" in q else None


RATE_CTX = [("A car travels [[d]] miles on [[u]] gallons of gas.", "gallons of gas", "travel [[t]] miles", "miles per gallon"),
            ("A printer prints [[d]] pages in [[u]] minutes.", "minutes", "print [[t]] pages", "pages per minute"),
            ("A machine fills [[d]] bottles in [[u]] hours.", "hours", "fill [[t]] bottles", "bottles per hour"),
            ("A cyclist rides [[d]] kilometers in [[u]] hours.", "hours", "ride [[t]] kilometers", "kilometers per hour")]


def unit_rate(r):
    text, unit, task, rate_name = pick(r, RATE_CTX)
    rate = r.choice([12, 15, 18, 20, 24, 25, 30, 32, 35, 40, 45])
    u = r.randint(2, 9)
    t_units = r.randint(3, 25)
    q = {"prompt": S(text, d=str(rate * u), u=str(u)) + f" At this rate, how many {unit} are needed to " + S(task, t=str(rate * t_units)) + "?"}
    q.update(spr(t_units))
    q["explanation"] = S(r"The rate is $\frac{[[d]]}{[[u]]} = [[rate]]$ [[rn]]. So $\frac{[[t]]}{[[rate]]} = [[tu]]$.", d=rate * u, u=u, rate=rate, rn=rate_name, t=rate * t_units, tu=t_units)
    return q


def unit_conversion(r):
    kind = r.choice(["pump", "speed", "fabric", "data"])
    if kind == "pump":
        rate = r.choice([2, 3, 4, 5, 6, 8, 12, 15])
        val = Fr(rate * 3600, 1000)
        prompt = S(r"A pump moves water at a constant rate of [[r]] liters per second. At this rate, how many kiloliters of water does the pump move in one hour? (1 kiloliter = 1,000 liters)", r=str(rate))
        expl = S(r"One hour is $3{,}600$ seconds, so the pump moves $[[r]] \times 3{,}600 = [[l]]$ liters, which is $[[v]]$ kiloliters.", r=rate, l=big(rate * 3600), v=dec(val))
    elif kind == "speed":
        mph = r.choice([30, 45, 60, 15, 20, 40])
        val = Fr(mph * 5280, 3600)
        prompt = S(r"A vehicle travels at a constant speed of [[m]] miles per hour. What is this speed in feet per second? (1 mile = 5,280 feet)", m=str(mph))
        expl = S(r"$[[m]]$ miles per hour is $[[m]] \times 5{,}280 = [[f]]$ feet per hour. Divide by $3{,}600$ seconds per hour: $[[v]]$ feet per second.", m=mph, f=big(mph * 5280), v=dec(val))
    elif kind == "fabric":
        yards = r.choice([2, 3, 4, 5, 6, 8])
        cost = r.choice([3, 6, 9, 12, 18])
        val = Fr(cost * yards, 3)
        prompt = S(r"Fabric costs $[[c]]$ per foot. How much does [[y]] yards of fabric cost, in dollars? (1 yard = 3 feet)", c=money(Fr(cost, 3)) if cost % 3 == 0 else money(Fr(cost, 3)), y=str(yards))
        val = Fr(cost, 3) * 3 * yards
        expl = S(r"[[y]] yards is $[[f]]$ feet. At $[[c]]$ per foot, the cost is $[[f]] \times [[cc]] = [[v]]$ dollars.", y=str(yards), f=3 * yards, c=money(Fr(cost, 3)), cc=dec(Fr(cost, 3)), v=dec(val))
    else:
        mb = r.choice([2, 4, 5, 8, 10, 25])
        mins = r.choice([2, 5, 10, 15, 30])
        val = Fr(mb * 60 * mins, 1000)
        prompt = S(r"A file downloads at a constant rate of [[m]] megabytes per second. How many gigabytes are downloaded in [[t]] minutes? (1 gigabyte = 1,000 megabytes)", m=str(mb), t=str(mins))
        expl = S(r"$[[t]]$ minutes is $[[s]]$ seconds, so $[[m]] \times [[s]] = [[tot]]$ megabytes, which is $[[v]]$ gigabytes.", t=mins, s=60 * mins, m=mb, tot=big(mb * 60 * mins), v=dec(val))
    ans = spr(val)
    if not ans:
        return None
    return {"prompt": prompt, "explanation": expl, **ans}


def map_scale(r):
    scale = r.choice([5, 10, 20, 25, 40, 50, 75, 100])
    inches = r.choice([Fr(3, 2), Fr(5, 2), Fr(7, 2), 2, 3, 4, Fr(9, 2), 6, Fr(13, 4), Fr(11, 4)])
    miles = scale * inches
    if Fr(miles).denominator != 1:
        return None
    q = {"prompt": S(r"On a map, 1 inch represents [[s]] miles. Two towns are [[i]] inches apart on the map. What is the actual distance, in miles, between the towns?", s=str(scale), i=dec(inches))}
    q.update(spr(miles))
    q["explanation"] = S(r"Multiply the map distance by the scale: $[[i]] \times [[s]] = [[m]]$ miles.", i=dec(inches), s=scale, m=miles)
    return q


def density_problem(r):
    kind = r.choice(["pop", "mass"])
    if kind == "pop":
        area = r.choice([12, 15, 25, 40, 48, 60, 75, 120])
        dens = r.choice([150, 240, 300, 425, 600, 850, 1200])
        q = {"prompt": S(r"A county has a population density of [[d]] people per square mile and an area of [[a]] square miles. What is the population of the county?", d=f"{dens:,}", a=str(area))}
        q.update(mcq_num(dens * area, [Fr(dens, area), dens + area, dens * area // 10], r, wrap=lambda v: f"${big(int(v))}$" if Fr(v).denominator == 1 else f"${num(v)}$") or {})
        q["explanation"] = S(r"Population = density × area $= [[d]] \times [[a]] = [[p]]$.", d=dens, a=area, p=big(dens * area))
    else:
        vol = r.choice([20, 25, 40, 50, 80, 125, 200, 250])
        d = r.choice([Fr(27, 10), Fr(79, 10), Fr(19, 2), 8, Fr(113, 10), 2, 3])
        m = vol * d
        if Fr(m).denominator != 1:
            return None
        q = {"prompt": S(r"A metal block has a volume of [[v]] cubic centimeters and a mass of [[m]] grams. What is the density of the metal, in grams per cubic centimeter?", v=str(vol), m=f"{int(m):,}")}
        q.update(spr(d) or {})
        q["explanation"] = S(r"Density = mass ÷ volume $= \frac{[[m]]}{[[v]]} = [[d]]$ grams per cubic centimeter.", m=big(int(m)), v=vol, d=dec(d))
        if "answer" not in q:
            return None
    return q if ("choices" in q or "answer" in q) else None


# ======================================================== percentages
def percent_of(r):
    p = r.choice([5, 12, 15, 18, 20, 25, 30, 35, 40, 45, 60, 65, 75, 80, 120, 150])
    n = r.choice(range(20, 900, 20))
    val = Fr(p * n, 100)
    if val.denominator != 1:
        return None
    q = {"prompt": S(r"What is [[p]]% of [[n]]?", p=str(p), n=str(n))}
    q.update(mcq_num(val, [Fr(n, p) if n % p == 0 else val + 10, n - val if n - val != val else val + 5, Fr(p * n, 10)], r) or {})
    q["explanation"] = S(r"$[[p]]\% = [[d]]$, and $[[d]] \times [[n]] = [[v]]$.", p=p, d=dec(Fr(p, 100)), n=n, v=val)
    return q if "choices" in q else None


def successive_percent(r):
    price = r.choice([40, 50, 60, 80, 120, 150, 200, 240, 300])
    d = r.choice([10, 20, 25, 30, 40, 50])
    i = r.choice([10, 20, 25, 30, 50])
    order = r.choice(["down-up", "up-down"])
    if order == "down-up":
        final = price * Fr(100 - d, 100) * Fr(100 + i, 100)
        text = S(r"A jacket originally priced at $[[p]]$ is discounted by [[d]]%. The discounted price is then increased by [[i]]%. What is the final price of the jacket?", p=money(price), d=str(d), i=str(i))
        wrong = price * Fr(100 - d + i, 100)
        expl = S(r"After the discount: $[[p]] \times [[m1]] = [[s1]]$. After the increase: $[[s1]] \times [[m2]] = [[f]]$. The percentages can't simply be added, because the second change applies to a different amount.",
                 p=price, m1=dec(Fr(100 - d, 100)), s1=dec(price * Fr(100 - d, 100)), m2=dec(Fr(100 + i, 100)), f=dec(final))
    else:
        final = price * Fr(100 + i, 100) * Fr(100 - d, 100)
        text = S(r"A store raises the price of an item that costs $[[p]]$ by [[i]]%. Later, the new price is decreased by [[d]]%. What is the final price of the item?", p=money(price), d=str(d), i=str(i))
        wrong = price * Fr(100 - d + i, 100)
        expl = S(r"After the increase: $[[p]] \times [[m2]] = [[s1]]$. After the decrease: $[[s1]] \times [[m1]] = [[f]]$. The percentages can't simply be combined, because each applies to a different amount.",
                 p=price, m1=dec(Fr(100 - d, 100)), s1=dec(price * Fr(100 + i, 100)), m2=dec(Fr(100 + i, 100)), f=dec(final))
    if final.denominator not in (1, 2, 4, 5, 10, 20, 25, 50, 100) or wrong == final:
        return None
    q = {"prompt": text, "explanation": expl}
    q.update(mcq_num(final, [wrong, price * Fr(100 - d, 100), price], r, wrap=lambda v: f"${money(v)}$") or {})
    return q if "choices" in q else None


def percent_chain(r):
    a = r.choice([10, 20, 25, 30, 40, 50, 60])
    b = r.choice([10, 20, 25, 30, 40, 50])
    up = r.choice([True, False])
    m1 = Fr(100 + a, 100) if up else Fr(100 - a, 100)
    m2 = Fr(100 - b, 100) if up else Fr(100 + b, 100)
    val = m1 * m2 * 100
    if val.denominator != 1 or val == 100:
        return None
    q = {"prompt": S(r"The number $p$ is [[a]]% [[w1]] than the number $q$, and $q$ is [[b]]% [[w2]] than the positive number $r$. The value of $p$ is what percent of $r$?",
                     a=str(a), w1="greater" if up else "less", b=str(b), w2="less" if up else "greater")}
    q.update(spr(val))
    q["explanation"] = S(r"$p = [[m1]]q$ and $q = [[m2]]r$, so $p = [[m1]] \times [[m2]]\,r = [[prod]]r$. That is $[[v]]\%$ of $r$. Adding and subtracting the percents directly gives the wrong answer.",
                         m1=dec(m1), m2=dec(m2), prod=dec(m1 * m2, 4), v=val)
    return q


def percent_change(r):
    old = r.choice([40, 50, 60, 80, 120, 150, 200, 240, 250, 400, 500, 800])
    pct = r.choice([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, -10, -20, -25, -40, -50])
    new = old * Fr(100 + pct, 100)
    if new.denominator != 1:
        return None
    ctx = pick(r, ["The number of members in a club changed from [[o]] to [[n]].", "A store's weekly sales changed from [[o]] units to [[n]] units.", "The attendance at a museum changed from [[o]] visitors on Monday to [[n]] visitors on Tuesday."])
    word = "increase" if pct > 0 else "decrease"
    q = {"prompt": S(ctx, o=str(old), n=str(int(new))) + f" By what percent did the number {word}?"}
    q.update(spr(abs(pct)))
    q["explanation"] = S(r"Percent change $= \dfrac{\text{change}}{\text{original}} \times 100 = \dfrac{[[c]]}{[[o]]} \times 100 = [[p]]\%$. Divide by the <i>original</i> amount, not the new one.", c=abs(int(new) - old), o=old, p=abs(pct))
    return q


def original_before_change(r):
    pct = r.choice([10, 15, 20, 25, 30, 40, 50, 8, 6])
    kind = r.choice(["discount", "tax", "increase"])
    orig = r.choice({"discount": range(40, 240, 4), "tax": range(20, 160, 2), "increase": range(800, 2400, 20)}[kind])
    mult = Fr(100 - pct, 100) if kind == "discount" else Fr(100 + pct, 100)
    after = orig * mult
    if after.denominator > 100 or Fr(after * 100).denominator != 1:
        return None
    text = {"discount": "After a [[p]]% discount, the price of a pair of shoes is [[a]]. What was the price before the discount?",
            "tax": "The total cost of a meal, including a [[p]]% sales tax, is [[a]]. What was the cost of the meal before tax?",
            "increase": "After a [[p]]% increase, the monthly rent for an apartment is [[a]]. What was the monthly rent before the increase?"}[kind]
    q = {"prompt": S(text, p=str(pct), a=f"${money(after)}$")}
    wrong = after * (Fr(100 + pct, 100) if kind == "discount" else Fr(100 - pct, 100))
    q.update(mcq_num(orig, [wrong, after, after - pct if after - pct > 0 else after + pct], r, wrap=lambda v: f"${money(v)}$") or {})
    q["explanation"] = S(r"The new amount is $[[m]]$ times the original, so the original is $\dfrac{[[a]]}{[[m]]} = [[o]]$. Applying a [[p]]% change to the new price instead gives a different, incorrect value.", m=dec(mult), a=dec(after), o=orig, p=pct)
    return q if "choices" in q else None


# ======================================================== one-variable data
def mean_median(r):
    n = r.choice([5, 6, 7, 8])
    data = sorted(r.randint(1, 30) for _ in range(n))
    ask = r.choice(["mean", "median"])
    if ask == "mean":
        val = Fr(sum(data), n)
        if val.denominator != 1:
            return None
        other = Fr(median(data)).limit_denominator(2)
    else:
        val = Fr(median(data)).limit_denominator(2)
        other = Fr(sum(data), n)
    if val == other:
        return None
    lst = ",\\ ".join(map(str, data))
    q = {"prompt": S(r"What is the [[ask]] of the data set $[[lst]]$?", ask=ask, lst=lst)}
    q.update(mcq_num(val, [other, Fr(max(data) - min(data)), max(set(data), key=data.count)], r) or {})
    if ask == "mean":
        q["explanation"] = S(r"The sum is $[[s]]$, and $[[s]] \div [[n]] = [[v]]$.", s=sum(data), n=n, v=val)
    else:
        q["explanation"] = S(r"With the values in order, the median is the middle value[[extra]]: $[[v]]$.", extra=" (the mean of the two middle values, since there is an even number of values)" if n % 2 == 0 else "", v=val)
    return q if "choices" in q else None


def removed_value(r):
    n = r.randint(6, 15)
    m1 = r.randint(10, 60)
    removed = r.randint(1, 120)
    total = n * m1
    if (total - removed) % (n - 1):
        return None
    m2 = (total - removed) // (n - 1)
    if m2 == m1 or removed < 0:
        return None
    q = {"prompt": S(r"A data set of [[n]] numbers has a mean of [[m1]]. When one number is removed, the mean of the remaining [[n1]] numbers is [[m2]]. What number was removed?", n=str(n), m1=str(m1), n1=str(n - 1), m2=str(m2))}
    q.update(spr(removed))
    q["explanation"] = S(r"The original sum is $[[n]] \times [[m1]] = [[t]]$. The new sum is $[[n1]] \times [[m2]] = [[t2]]$. The removed number is $[[t]] - [[t2]] = [[rv]]$.", n=n, m1=m1, t=total, n1=n - 1, m2=m2, t2=total - removed, rv=removed)
    return q


def outlier_effect(r):
    n = r.choice([7, 9, 11])
    data = sorted(r.sample(range(10, 60), n))
    change = r.choice(["increase_max", "decrease_min", "add_same_to_all"])
    labels = {"both": "Both the mean and the median changed.", "mean": "The mean changed, but the median did not.",
              "median": "The median changed, but the mean did not.", "neither": "Neither the mean nor the median changed."}
    if change == "increase_max":
        k = r.choice([20, 35, 50, 80])
        desc = S(r"the greatest value, [[v]], is replaced with [[w]]", v=str(data[-1]), w=str(data[-1] + k))
        ans = "mean"
        why = "Increasing the greatest value raises the sum, so the mean increases. The middle value stays the same, so the median doesn't change."
    elif change == "decrease_min":
        k = r.choice([5, 8, 9])
        desc = S(r"the least value, [[v]], is replaced with [[w]]", v=str(data[0]), w=str(data[0] - k))
        ans = "mean"
        why = "Decreasing the least value lowers the sum, so the mean decreases. The values stay in the same order, so the median doesn't change."
    else:
        k = r.choice([3, 5, 10])
        desc = S(r"[[k]] is added to every value", k=str(k))
        ans = "both"
        why = S(r"Adding [[k]] to every value shifts the whole data set up by [[k]], so both the mean and the median increase by [[k]].", k=str(k))
    lst = ", ".join(map(str, data))
    q = {"prompt": f"A data set consists of the values {lst}. A new data set is created in which {desc}. Which statement best describes how the mean and median of the new data set compare with those of the original?",
         "choices": [labels["both"], labels["mean"], labels["median"], labels["neither"]], "explanation": why}
    q["answer"] = "ABCD"[["both", "mean", "median", "neither"].index(ans)]
    return q


def combined_mean(r):
    n1, n2 = r.randint(8, 30), r.randint(8, 30)
    m1, m2 = r.randint(60, 95), r.randint(60, 95)
    tot = n1 * m1 + n2 * m2
    val = Fr(tot, n1 + n2)
    if val.denominator != 1 or m1 == m2 or n1 == n2:
        return None
    groups = pick(r, [("class", "students", "test score"), ("team", "players", "number of points scored per season"), ("shift", "workers", "number of items packed per hour")])
    q = {"prompt": S(r"One [[g]] of [[n1]] [[p]] has a mean [[s]] of [[m1]], and another [[g]] of [[n2]] [[p]] has a mean [[s]] of [[m2]]. What is the mean [[s]] of all [[tot]] [[p]] combined?",
                     g=groups[0], n1=str(n1), p=groups[1], s=groups[2], m1=str(m1), n2=str(n2), m2=str(m2), tot=str(n1 + n2))}
    q.update(spr(val))
    q["explanation"] = S(r"Find the total: $[[n1]] \times [[m1]] + [[n2]] \times [[m2]] = [[t]]$. Divide by $[[n]]$: $[[v]]$. Simply averaging $[[m1]]$ and $[[m2]]$ ignores that the groups have different sizes.",
                         n1=n1, m1=m1, n2=n2, m2=m2, t=tot, n=n1 + n2, v=val)
    return q


def spread_compare(r):
    center = r.randint(20, 60)
    tight = [center + d for d in r.choice([[-2, -1, 0, 1, 2], [-3, -1, 0, 1, 3], [-1, -1, 0, 1, 1]])]
    wide = [center + d for d in r.choice([[-12, -6, 0, 6, 12], [-15, -5, 0, 5, 15], [-10, -8, 0, 8, 10]])]
    first_tight = r.random() < 0.5
    A, B = (tight, wide) if first_tight else (wide, tight)
    q = {"prompt": f"Data set A consists of the values {', '.join(map(str, A))}. Data set B consists of the values {', '.join(map(str, B))}. Which statement about the standard deviations of the two data sets is true?",
         "choices": ["The standard deviation of data set A is greater.", "The standard deviation of data set B is greater.", "The standard deviations are equal.", "There is not enough information to compare the standard deviations."]}
    q["answer"] = "B" if first_tight else "A"
    q["explanation"] = S(r"Both data sets have a mean of $[[c]]$, but the values in data set [[w]] are much farther from the mean. Standard deviation measures spread, so data set [[w]] has the greater standard deviation. No calculation is needed.",
                         c=center, w="B" if first_tight else "A")
    return q


# ======================================================== two-variable data
FIT_CTX = [("hours studied, $x$, and test score, $y$", "For each additional hour studied, the predicted test score increases by [[m]] points.", "The predicted test score for a student who studies 0 hours is [[m]] points.", "hour studied", "points"),
           ("the age of a car, $x$, in years, and its value, $y$, in thousands of dollars", "For each additional year of age, the predicted value of the car decreases by [[am]] thousand dollars.", "The predicted value of a new car is [[am]] thousand dollars.", "year", "thousand dollars"),
           ("the daily high temperature, $x$, in degrees Fahrenheit, and the number of iced drinks sold, $y$", "For each increase of 1 degree Fahrenheit, the predicted number of iced drinks sold increases by [[m]].", "The predicted number of iced drinks sold when the temperature is 0 degrees is [[m]].", "degree", "drinks"),
           ("the number of employees, $x$, and weekly revenue, $y$, in thousands of dollars, for several stores", "For each additional employee, the predicted weekly revenue increases by [[m]] thousand dollars.", "Every store has at least [[m]] employees.", "employee", "thousand dollars")]


def fit_slope_interp(r):
    ctx, good, bad1, unit, yunit = pick(r, FIT_CTX)
    neg = "decreases" in good
    m = r.choice([Fr(3, 2), 2, Fr(5, 2), 3, Fr(9, 2), 4, 6, Fr(12, 10)])
    b = r.randint(20, 90)
    slope = -m if neg else m
    q = {"prompt": S(r"A scatterplot shows the relationship between [[ctx]]. The line of best fit is $y = [[s]]x + [[b]]$. Which statement is the best interpretation of $[[am]]$ in this context?",
                     ctx=ctx, s=dec(slope), b=b, am=dec(m))}
    choices = [S(good, m=dec(m), am=dec(m)), S(bad1, m=dec(m), am=dec(m)), S("The data set includes [[m]] observations.", m=dec(m)),
               S("Every value of $y$ in the data set is at least [[m]].", m=dec(m))]
    q.update(mcq_text(choices[0], choices[1:], r))
    q["explanation"] = S(r"The slope of a line of best fit is the predicted change in $y$ for each one-unit increase in $x$. Here, $y$ changes by $[[am]]$ [[yu]] for each [[u]].", am=dec(slope), yu=yunit, u=unit)
    return q


def residual(r):
    m = r.choice([Fr(-6, 5), Fr(-3, 2), Fr(5, 2), 2, 3, Fr(-4, 5), Fr(12, 10)])
    b = r.randint(40, 100)
    x = r.choice([5, 10, 15, 20, 25])
    pred = m * x + b
    if pred.denominator != 1:
        return None
    diff = r.choice([-7, -5, -4, -3, 3, 4, 5, 6])
    actual = pred + diff
    q = {"prompt": S(r"The line of best fit for a data set is $y = [[eq]]$. One data point in the set is $([[x]], [[a]])$. Which statement about this data point is true?", eq=lin(m, b).replace("\\frac{6}{5}", "1.2").replace("\\frac{3}{2}", "1.5").replace("\\frac{5}{2}", "2.5").replace("\\frac{4}{5}", "0.8"), x=x, a=actual)}
    q["prompt"] = S(r"The line of best fit for a data set is $y = [[s]]x [[bt]]$. One data point in the set is $([[x]], [[a]])$. Which statement about this data point is true?", s=dec(m), bt=term(b, "").strip(), x=x, a=actual)
    lo, hi = "less than", "greater than"
    choices = [S(r"Its $y$-value is [[d]] [[w]] the value predicted by the line of best fit.", d=abs(diff), w=hi if diff > 0 else lo),
               S(r"Its $y$-value is [[d]] [[w]] the value predicted by the line of best fit.", d=abs(diff), w=lo if diff > 0 else hi),
               S(r"Its $y$-value is [[d]] [[w]] the value predicted by the line of best fit.", d=abs(int(actual)), w=hi if diff > 0 else lo),
               "The data point lies exactly on the line of best fit."]
    q.update(mcq_text(choices[0], choices[1:], r))
    q["explanation"] = S(r"The predicted value at $x = [[x]]$ is $[[s]]([[x]]) + [[b]] = [[p]]$. The actual value is $[[a]]$, which is $[[d]]$ [[w]] the prediction.", x=x, s=dec(m), b=b, p=pred, a=actual, d=abs(diff), w=hi if diff > 0 else lo)
    return q


def predict_from_fit(r):
    m = r.choice([Fr(3, 2), Fr(5, 2), 2, 4, Fr(-3, 2), -2, Fr(7, 2)])
    b = r.randint(10, 80)
    x = r.choice([4, 6, 8, 10, 12, 14, 16, 20])
    pred = m * x + b
    if pred.denominator != 1 or pred < 0:
        return None
    ctx = pick(r, ["the number of hours a store is open, $x$, and the number of customers, $y$",
                   "the number of weeks since planting, $x$, and a plant's height in centimeters, $y$",
                   "the outdoor temperature in degrees Celsius, $x$, and daily ice cream sales, $y$",
                   "years of experience, $x$, and hourly wage in dollars, $y$"])
    q = {"prompt": S(r"A line of best fit for the relationship between [[c]], is $y = [[s]]x + [[b]]$. According to the line of best fit, what is the predicted value of $y$ when $x = [[x]]$?", c=ctx, s=dec(m), b=b, x=x)}
    q.update(spr(pred))
    q["explanation"] = S(r"Substitute: $y = [[s]]([[x]]) + [[b]] = [[p]]$.", s=dec(m), x=x, b=b, p=pred)
    return q


def model_type(r):
    kind = r.choice(["lin_up", "lin_down", "exp_up", "exp_down"])
    start = r.choice([2, 3, 4, 5, 8, 10, 16, 20, 32, 64, 81])
    xs = [0, 1, 2, 3]
    if kind == "lin_up":
        d = r.randint(2, 9); ys = [start + d * x for x in xs]
    elif kind == "lin_down":
        d = r.randint(2, 6); ys = [start * 5 - d * x for x in xs]
    elif kind == "exp_up":
        f = r.choice([2, 3]); ys = [start * f ** x for x in xs]
    else:
        f = r.choice([2, 3])
        ys = [start * f ** 3 // f ** x for x in xs]
    if min(ys) <= 0:
        return None
    labels = {"lin_up": "Increasing linear", "lin_down": "Decreasing linear", "exp_up": "Increasing exponential", "exp_down": "Decreasing exponential"}
    rows = "".join(f"<tr><td>${x}$</td><td>${y}$</td></tr>" for x, y in zip(xs, ys))
    q = {"prompt": f"<table><tr><th>$x$</th><th>$y$</th></tr>{rows}</table><p>Which of the following best describes the relationship between $x$ and $y$ shown in the table?</p>",
         "choices": [labels[k] for k in ["lin_up", "lin_down", "exp_up", "exp_down"]]}
    q["answer"] = "ABCD"[["lin_up", "lin_down", "exp_up", "exp_down"].index(kind)]
    q["explanation"] = ("The values change by the same <i>amount</i> each step (a constant difference), which is linear." if kind.startswith("lin")
                        else "The values change by the same <i>factor</i> each step (a constant ratio), which is exponential.") + (" They increase." if kind.endswith("up") else " They decrease.")
    return q


# ======================================================== probability
def simple_probability(r):
    colors = r.sample(["red", "blue", "green", "yellow", "white", "black", "purple"], 3)
    counts = [r.randint(2, 15) for _ in range(3)]
    target = r.randrange(3)
    total = sum(counts)
    p = Fr(counts[target], total)
    obj = pick(r, ["marbles", "tiles", "beads", "chips"])
    q = {"prompt": S(r"A bag contains [[a]] [[ca]] [[o]], [[b]] [[cb]] [[o]], and [[c]] [[cc]] [[o]]. If one is selected at random, what is the probability that it is [[t]]?",
                     a=str(counts[0]), ca=colors[0], b=str(counts[1]), cb=colors[1], c=str(counts[2]), cc=colors[2], o=obj, t=colors[target])}
    wrong = Fr(counts[target], total - counts[target])
    q.update(mcq_num(p, [wrong, Fr(1, 3), Fr(total - counts[target], total)], r, wrap=lambda v: f"$\\dfrac{{{v.numerator}}}{{{v.denominator}}}$" if v.denominator != 1 else f"${v}$") or {})
    q["explanation"] = S(r"There are $[[t]]$ items in total, and $[[k]]$ are [[c]], so the probability is $\dfrac{[[k]]}{[[t]]}[[red]]$.", t=total, k=counts[target], c=colors[target], red="" if p.denominator == total else f" = {num(p)}")
    return q if "choices" in q else None


# (title, row labels, column labels, group noun, then (plural, singular) phrases for col0, row1, col1, row0)
TABLE_CTX = [("Sports Participation by Grade", ["9th grade", "10th grade"], ["Plays a sport", "Does not play a sport"], "students",
              ("play a sport", "plays a sport"), ("are in 10th grade", "is in 10th grade"), ("do not play a sport", "does not play a sport"), ("are in 9th grade", "is in 9th grade")),
             ("Pet Ownership by Housing Type", ["Apartment", "House"], ["Owns a pet", "Does not own a pet"], "residents",
              ("own a pet", "owns a pet"), ("live in a house", "lives in a house"), ("do not own a pet", "does not own a pet"), ("live in an apartment", "lives in an apartment")),
             ("Lunch Choice by Grade Level", ["Middle school", "High school"], ["Buys lunch", "Brings lunch"], "students",
              ("buy lunch", "buys lunch"), ("are in high school", "is in high school"), ("bring lunch", "brings lunch"), ("are in middle school", "is in middle school")),
             ("Commute Method by Department", ["Sales", "Engineering"], ["Drives", "Takes transit"], "employees",
              ("drive", "drives"), ("work in engineering", "works in engineering"), ("take transit", "takes transit"), ("work in sales", "works in sales"))]


def two_way_conditional(r):
    title, rows, cols, who, (c0, c0s), (r1, r1s), (c1, c1s), (r0, r0s) = pick(r, TABLE_CTX)
    a, b, c, d = [r.randint(12, 80) for _ in range(4)]
    grid = [[a, b], [c, d]]
    col_tot = [a + c, b + d]
    row_tot = [a + b, c + d]
    total = a + b + c + d
    mode = r.choice(["col_given", "row_given", "joint"])
    if mode == "col_given":
        ci = r.randrange(2)
        p = Fr(grid[1][ci], col_tot[ci])
        prompt = S(r"If one of the [[w]] who [[cc]] is selected at random, what is the probability that the person [[rr]]?", w=who, cc=[c0, c1][ci], rr=r1s)
        expl = S(r"Restrict to the $[[ct]]$ [[w]] who [[cc]]. Of those, $[[k]]$ [[rr]]: $\dfrac{[[k]]}{[[ct]]}$. The denominator is the size of the group you're choosing from, not the grand total.", ct=col_tot[ci], w=who, cc=[c0, c1][ci], k=grid[1][ci], rr=r1)
    elif mode == "row_given":
        ri = r.randrange(2)
        p = Fr(grid[ri][0], row_tot[ri])
        prompt = S(r"If one of the [[w]] who [[rr]] is selected at random, what is the probability that the person [[cc]]?", w=who, rr=[r0, r1][ri], cc=c0s)
        expl = S(r"Restrict to the $[[rt]]$ [[w]] who [[rr]]. Of those, $[[k]]$ [[cc]]: $\dfrac{[[k]]}{[[rt]]}$. The denominator is the size of the group you're choosing from, not the grand total.", rt=row_tot[ri], w=who, rr=[r0, r1][ri], k=grid[ri][0], cc=c0)
    else:
        p = Fr(d, total)
        prompt = S(r"If one of the [[t]] [[w]] is selected at random, what is the probability that the person [[rr]] and [[cc]]?", t=str(total), w=who, rr=r1s, cc=c1s)
        expl = S(r"Exactly $[[d]]$ of all $[[t]]$ [[w]] are in that cell of the table: $\dfrac{[[d]]}{[[t]]}$.", d=d, t=total, w=who)
    ans = spr(p)
    if not ans:
        return None
    table = (f"<table><caption>{title}</caption><tr><th></th><th>{cols[0]}</th><th>{cols[1]}</th><th>Total</th></tr>"
             f"<tr><th>{rows[0]}</th><td>{a}</td><td>{b}</td><td>{row_tot[0]}</td></tr>"
             f"<tr><th>{rows[1]}</th><td>{c}</td><td>{d}</td><td>{row_tot[1]}</td></tr>"
             f"<tr><th>Total</th><td>{col_tot[0]}</td><td>{col_tot[1]}</td><td>{total}</td></tr></table>")
    q = {"prompt": table + f"<p>The table summarizes survey responses from {total} {who}. " + prompt + "</p>", "explanation": expl, **ans}
    q["difficulty"] = 1 if mode == "joint" else 2
    return q


def expected_count(r):
    p = r.choice([Fr(3, 20), Fr(1, 8), Fr(2, 5), Fr(7, 25), Fr(1, 4), Fr(3, 10), Fr(9, 50)])
    n = r.choice([200, 400, 500, 800, 1000, 1200, 2000])
    val = p * n
    if val.denominator != 1:
        return None
    ctx = pick(r, [("The probability that a randomly chosen light bulb from a factory is defective is [[p]].", "light bulbs", "defective"),
                   ("The probability that a randomly selected customer at a café orders tea is [[p]].", "customers", "who order tea"),
                   ("The probability that a seed of a certain plant sprouts is [[p]].", "seeds", "that sprout")])
    q = {"prompt": S(ctx[0], p=dec(p, 3)) + f" Of {n:,} {ctx[1]}, how many would be expected to be {ctx[2]}?" if ctx[2] == "defective" else S(ctx[0], p=dec(p, 3)) + f" Of {n:,} {ctx[1]}, how many would you expect {ctx[2]}?"}
    q.update(spr(val))
    q["explanation"] = S(r"Expected count = probability × number $= [[p]] \times [[n]] = [[v]]$.", p=dec(p, 3), n=big(n), v=val)
    return q


# ======================================================== inference
MOE_CTX = [("registered voters in a city", "support a proposed park", "all registered voters in the state"),
           ("students at a large high school", "prefer a later start time", "all high school students in the country"),
           ("customers of an online store", "are satisfied with delivery times", "all online shoppers"),
           ("residents of a county", "use public libraries at least once a month", "all residents of the state")]


def margin_of_error(r):
    pop, claim, wider = pick(r, MOE_CTX)
    n = r.choice([200, 300, 400, 500, 600, 800, 1000])
    p = r.randint(30, 75)
    moe = r.choice([2, 3, 4, 5, 6])
    lo, hi = p - moe, p + moe
    q = {"prompt": S(r"A random sample of [[n]] [[pop]] found that [[p]]% [[c]]. The margin of error for the estimate is [[m]] percentage points. Which conclusion is most appropriate?", n=str(n), pop=pop, p=str(p), c=claim, m=str(moe))}
    good = S(r"It is plausible that between [[lo]]% and [[hi]]% of all [[pop]] [[c]].", lo=str(lo), hi=str(hi), pop=pop, c=claim)
    ds = [S(r"Exactly [[p]]% of all [[pop]] [[c]].", p=str(p), pop=pop, c=claim),
          S(r"It is plausible that between [[lo]]% and [[hi]]% of [[w]] [[c]].", lo=str(lo), hi=str(hi), w=wider, c=claim),
          S(r"Between [[lo]]% and [[hi]]% of the [[n]] sampled [[pop]] [[c]].", lo=str(lo), hi=str(hi), n=str(n), pop=pop, c=claim)]
    q.update(mcq_text(good, ds, r))
    q["explanation"] = S(r"A margin of error gives a plausible range, $[[p]] \pm [[m]]$, for the true percentage in the population that was sampled. It isn't exact, it doesn't extend to a larger population, and the sample's own percentage is known exactly ([[p]]%).", p=p, m=moe)
    return q


STUDY_CTX = [("dog owners in a town", "walking their dogs every day", "lower stress levels", "all people"),
             ("students at a university", "studying with music", "higher quiz scores", "all students"),
             ("adults in one city", "drinking coffee daily", "better focus", "all adults"),
             ("employees at a company", "working from home", "higher job satisfaction", "all workers")]


def causation_scope(r):
    pop, treat, outcome, everyone = pick(r, STUDY_CTX)
    design = r.choice(["survey", "experiment"])
    if design == "survey":
        text = f"A researcher surveyed a random sample of 200 {pop}. Those who reported {treat} also reported {outcome}, on average, than those who did not."
        good = f"Among {pop}, {treat} is associated with {outcome}, but the study does not show that it causes this difference."
        ds = [f"{treat.capitalize()} causes {outcome} among {pop}.", f"{treat.capitalize()} causes {outcome} for {everyone}.", f"Among {everyone}, {treat} is associated with {outcome}."]
        why = "This was an observational survey without random assignment, so it can show an association but not cause and effect. Because the sample was drawn randomly from " + pop + ", the conclusion applies to that population only."
    else:
        text = f"A researcher selected a random sample of 200 {pop} and randomly assigned half of them to begin {treat}; the other half did not. After six weeks, the first group showed {outcome}, on average, and the difference was statistically significant."
        good = f"{treat.capitalize()} likely causes {outcome} among {pop}."
        ds = [f"{treat.capitalize()} likely causes {outcome} for {everyone}.", f"Among {pop}, {treat} is associated with {outcome}, but no causal conclusion is possible.", f"{treat.capitalize()} has no effect on {outcome}."]
        why = "Random assignment to groups allows a cause-and-effect conclusion. Random selection from " + pop + " lets the result generalize to that population, but not to " + everyone + "."
    q = {"prompt": text + " Which conclusion is best supported by the study?", "explanation": why}
    q.update(mcq_text(good, ds, r))
    return q


def sample_size_moe(r):
    n1 = r.choice([100, 200, 300, 400, 500])
    n2 = n1 * r.choice([2, 3, 4])
    q = {"prompt": S(r"Two researchers each estimated the mean number of hours of sleep per night for students at a large university. Researcher A used a random sample of [[n1]] students, and Researcher B used a random sample of [[n2]] students. Both used the same method to calculate a margin of error. Which statement is most likely true?", n1=str(n1), n2=str(n2)),
         "choices": ["Researcher A's margin of error is smaller.", "Researcher B's margin of error is smaller.", "The two margins of error are equal.", "Researcher B's estimate must be exactly correct."], "answer": "B"}
    q["explanation"] = "Larger random samples give more precise estimates, so the margin of error tends to be smaller for the larger sample (Researcher B). No sample-based estimate is guaranteed to be exactly correct."
    return q


TEMPLATES = [
    ("ratios-rates", 1, ratio_scale, 60), ("ratios-rates", 2, unit_rate, 60), ("ratios-rates", 3, unit_conversion, 50),
    ("ratios-rates", 2, map_scale, 40), ("ratios-rates", 2, density_problem, 40),
    ("percentages", 1, percent_of, 60), ("percentages", 2, successive_percent, 60), ("percentages", 3, percent_chain, 40),
    ("percentages", 2, percent_change, 60), ("percentages", 3, original_before_change, 60),
    ("one-var-data", 1, mean_median, 60), ("one-var-data", 2, removed_value, 50), ("one-var-data", 2, outlier_effect, 40),
    ("one-var-data", 3, combined_mean, 50), ("one-var-data", 3, spread_compare, 30),
    ("two-var-data", 1, fit_slope_interp, 40), ("two-var-data", 3, residual, 50), ("two-var-data", 1, predict_from_fit, 50), ("two-var-data", 2, model_type, 40),
    ("probability", 1, simple_probability, 60), ("probability", 2, two_way_conditional, 80), ("probability", 2, expected_count, 40),
    ("inference", 2, margin_of_error, 50), ("inference", 3, causation_scope, 16), ("inference", 3, sample_size_moe, 12),
]
