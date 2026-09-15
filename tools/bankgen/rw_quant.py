"""R&W > Information and Ideas > Command of Evidence: Quantitative.

Tables and bar charts are generated from illustrative (fictional) data. Every claim type is checked against
the numbers, and distractors are either inaccurate or accurate-but-irrelevant, as on the real test.
"""
import random
from .common import mcq_text, pick, Skip

SECTION, DOMAIN = "rw", "info"

# who, title, row category, rows, column category, column sets, measure phrase, unit kind, value range
FRAMES = [
    ("A city parks department", "Average Daily Visitors to City Parks", "park", ["Riverside Park", "Oak Hill Park", "Lakeview Park", "Cedar Grove", "Harbor Green"], "season",
     [["spring", "summer", "fall"], ["spring", "summer", "fall", "winter"]], "the average number of daily visitors", "int", (150, 2400)),
    ("A transportation analyst", "Households Owning an Electric Vehicle, by Region", "region", ["the North", "the South", "the East", "the West", "the Central region"], "year",
     [["2016", "2020", "2024"], ["2018", "2021", "2024"], ["2012", "2016", "2020", "2024"]], "the percentage of households owning an electric vehicle", "pct", (1, 30)),
    ("An agricultural researcher", "Crop Yield on Test Plots (kilograms)", "treatment", ["no fertilizer", "Fertilizer A", "Fertilizer B", "Fertilizer C", "compost"], "year",
     [["Year 1", "Year 2"], ["Year 1", "Year 2", "Year 3"]], "the crop yield", "int", (300, 700)),
    ("An ecologist", "Butterflies Counted at Monitoring Sites (thousands)", "site", ["Site 1", "Site 2", "Site 3", "Site 4", "Site 5"], "year",
     [["2015", "2018", "2021"], ["2016", "2018", "2020", "2022"], ["2014", "2016", "2018", "2020", "2022"]], "the number of butterflies counted", "dec", (1.5, 9.5)),
    ("A school district", "Students Enrolled in Elective Courses", "course", ["music", "robotics", "art", "journalism", "drama"], "school year",
     [["2019–20", "2021–22", "2023–24"], ["2020–21", "2022–23"]], "enrollment", "int", (40, 480)),
    ("A public health researcher", "Adults Who Report Exercising Weekly, by Age Group", "age group", ["ages 18–29", "ages 30–44", "ages 45–59", "ages 60–74", "ages 75 and older"], "survey year",
     [["2010", "2015", "2020"], ["2012", "2022"]], "the percentage of adults who report exercising weekly", "pct", (20, 75)),
    ("A library director", "Items Borrowed per Month at Branch Libraries", "branch", ["Main Street", "Westside", "Northgate", "Hillcrest", "Bayview"], "year",
     [["2019", "2021", "2023"], ["2020", "2022", "2024"]], "the number of items borrowed per month", "int", (800, 9800)),
    ("A marine biologist", "Average Water Temperature at Reef Sites (°C)", "reef site", ["North Reef", "Coral Point", "Blue Lagoon", "Outer Bank", "Turtle Cove"], "decade",
     [["1990s", "2000s", "2010s"], ["1980s", "2000s", "2020s"]], "the average water temperature", "dec", (21.0, 29.5)),
    ("A market researcher", "Share of Survey Respondents Who Shop Online Weekly", "age group", ["ages 16–24", "ages 25–34", "ages 35–49", "ages 50–64", "ages 65 and older"], "year",
     [["2015", "2019", "2023"], ["2017", "2020", "2023"]], "the share of respondents who shop online weekly", "pct", (8, 80)),
    ("An urban planner", "Bicycle Trips Recorded on City Bridges (per day)", "bridge", ["Elm Street Bridge", "Canal Bridge", "Iron Bridge", "Station Bridge", "Park Avenue Bridge"], "year",
     [["2014", "2018", "2022"], ["2016", "2019", "2022"]], "the number of daily bicycle trips", "int", (300, 5200)),
    ("A wildlife biologist", "Nesting Pairs of Seabirds on Coastal Islands", "island", ["Gull Island", "Rock Island", "Pine Island", "Little Island", "Far Island"], "year",
     [["2008", "2014", "2020"], ["2010", "2015", "2020", "2025"]], "the number of nesting pairs", "int", (60, 1400)),
    ("A hospital administrator", "Average Emergency Room Wait Time (minutes)", "hospital", ["Hospital A", "Hospital B", "Hospital C", "Hospital D"], "year",
     [["2018", "2020", "2022"], ["2019", "2023"]], "the average wait time", "int", (18, 95)),
    ("An energy analyst", "Share of Electricity Generated from Wind (%)", "state", ["State A", "State B", "State C", "State D", "State E"], "year",
     [["2010", "2015", "2020"], ["2012", "2017", "2022"]], "the share of electricity generated from wind", "pct", (1, 45)),
    ("A museum curator", "Annual Visitors to Regional Museums (thousands)", "museum", ["the history museum", "the science museum", "the art museum", "the children's museum"], "year",
     [["2017", "2019", "2021", "2023"], ["2018", "2023"]], "annual attendance", "dec", (12.0, 95.0)),
    ("A soil scientist", "Earthworms per Square Meter of Soil", "field type", ["no-till fields", "plowed fields", "pasture", "orchard rows", "restored prairie"], "sampling season",
     [["spring", "summer", "fall"]], "the number of earthworms per square meter", "int", (10, 320)),
    ("A labor economist", "Median Hourly Wage by Occupation (dollars)", "occupation", ["electricians", "nurses", "graphic designers", "bus drivers", "chefs"], "year",
     [["2012", "2017", "2022"], ["2014", "2024"]], "the median hourly wage", "dec", (14.0, 48.0)),
    ("A climate scientist", "Days per Year Above 32 °C in Selected Cities", "city", ["City A", "City B", "City C", "City D", "City E"], "decade",
     [["1980s", "2000s", "2020s"], ["1990s", "2000s", "2010s", "2020s"]], "the number of days per year above 32 °C", "int", (2, 110)),
    ("A food scientist", "Vitamin C Retained After Cooking (%)", "cooking method", ["boiling", "steaming", "microwaving", "roasting", "stir-frying"], "vegetable",
     [["broccoli", "spinach", "peppers"], ["broccoli", "carrots"]], "the percentage of vitamin C retained", "pct", (25, 92)),
    ("A sports statistician", "Average Points Scored per Game", "team", ["the Hawks", "the Comets", "the Rivers", "the Pioneers", "the Owls"], "season",
     [["2021", "2022", "2023"], ["2020", "2022", "2024"]], "the average number of points scored per game", "dec", (68.0, 112.0)),
    ("A tourism board", "Hotel Occupancy Rate by Month (%)", "town", ["Seaside", "Maple Falls", "Granite Ridge", "Port Allen"], "month",
     [["June", "July", "August"], ["January", "April", "July", "October"]], "the hotel occupancy rate", "pct", (30, 96)),
    ("A psychologist", "Average Recall Score in a Memory Study (out of 50)", "study condition", ["silence", "background music", "white noise", "conversation nearby"], "session",
     [["Session 1", "Session 2", "Session 3"], ["Session 1", "Session 2"]], "the average recall score", "int", (15, 48)),
    ("A forestry researcher", "Average Tree Height in Replanted Areas (meters)", "tree species", ["pine", "oak", "birch", "maple", "cedar"], "measurement",
     [["5 years", "10 years", "15 years"], ["4 years", "8 years"]], "the average tree height", "dec", (1.2, 14.5)),
    ("A water utility", "Average Household Water Use (liters per day)", "neighborhood", ["Northside", "Old Town", "Riverbend", "Eastfield", "Hilltop"], "year",
     [["2015", "2019", "2023"], ["2017", "2023"]], "average household water use", "int", (180, 520)),
    ("A linguist", "Share of Residents Who Speak More Than One Language (%)", "city", ["City A", "City B", "City C", "City D"], "census year",
     [["1990", "2000", "2010", "2020"], ["2000", "2020"]], "the share of residents who speak more than one language", "pct", (6, 64)),
    ("A retail analyst", "Monthly Sales of Reusable Water Bottles (units)", "store", ["Store 1", "Store 2", "Store 3", "Store 4", "Store 5"], "quarter",
     [["Q1", "Q2", "Q3", "Q4"], ["Q1", "Q3"]], "monthly sales", "int", (120, 2600)),
    ("A geologist", "Average Annual Erosion at Coastal Bluffs (centimeters)", "bluff", ["Bluff A", "Bluff B", "Bluff C", "Bluff D"], "decade",
     [["1990s", "2000s", "2010s"], ["2000s", "2020s"]], "the average annual erosion", "dec", (3.0, 48.0)),
    ("A college admissions office", "Applications Received by Program", "program", ["engineering", "nursing", "business", "education", "biology"], "year",
     [["2020", "2022", "2024"], ["2019", "2021", "2023"]], "the number of applications", "int", (220, 4100)),
    ("An astronomer", "Meteors Observed per Hour During a Shower", "observation site", ["Desert Station", "Mountain Station", "Coastal Station", "Valley Station"], "night",
     [["night 1", "night 2", "night 3"], ["night 1", "night 2", "night 3", "night 4"]], "the number of meteors observed per hour", "int", (6, 95)),
    ("A nutrition researcher", "Average Daily Fiber Intake (grams)", "diet group", ["vegetarian", "Mediterranean", "standard", "low-carbohydrate"], "study phase",
     [["baseline", "month 3", "month 6"], ["baseline", "month 6"]], "average daily fiber intake", "dec", (11.0, 38.0)),
    ("A city council report", "Residents Satisfied with Public Transit (%)", "district", ["District 1", "District 2", "District 3", "District 4", "District 5"], "survey year",
     [["2016", "2020", "2024"], ["2018", "2024"]], "the percentage of residents satisfied with public transit", "pct", (22, 88)),
]


def fmt(v, kind):
    if kind == "pct":
        return f"{v}%"
    if kind == "dec":
        return f"{v:.1f}"
    return f"{v:,}"


def gen_value(r, kind, lo, hi):
    if kind == "dec":
        return round(r.uniform(lo, hi), 1)
    return r.randint(lo, hi)


def make_table(r, frame, n_rows, n_cols=None, single=False):
    who, title, rcat, rows_all, ccat, colsets, measure, kind, (lo, hi) = frame
    rows = r.sample(rows_all, min(n_rows, len(rows_all)))
    cols = pick(r, [c for c in colsets if n_cols is None or len(c) == n_cols] or colsets)
    if single:
        cols = [cols[-1]]
    data = {row: [gen_value(r, kind, lo, hi) for _ in cols] for row in rows}
    return rows, cols, data


def table_html(frame, rows, cols, data):
    who, title, rcat, *_ = frame
    head = "".join(f"<th>{c.capitalize() if c[0].isalpha() else c}</th>" for c in cols)
    body = "".join(f"<tr><td>{row[0].upper() + row[1:] if not row.startswith('the ') else row[4].upper() + row[5:]}</td>" +
                   "".join(f"<td>{fmt(v, frame[7])}</td>" for v in data[row]) + "</tr>" for row in rows)
    return f"<table><caption>{title}</caption><tr><th>{rcat.capitalize()}</th>{head}</tr>{body}</table>"


def bar_chart(frame, rows, col, values):
    """Simple accessible SVG bar chart for a single series."""
    title, kind = frame[1], frame[7]
    w, h, left, bottom = 420, 240, 44, 40
    top_val = max(values) * 1.15
    bw = (w - left - 20) / len(rows)
    bars, labels = [], []
    for i, (row, v) in enumerate(zip(rows, values)):
        bh = (h - bottom - 30) * v / top_val
        x = left + i * bw + bw * 0.18
        y = h - bottom - bh
        bars.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{bw * 0.64:.0f}" height="{bh:.0f}" fill="currentColor" opacity="0.55"/>')
        bars.append(f'<text x="{x + bw * 0.32:.0f}" y="{y - 5:.0f}" text-anchor="middle" font-size="12">{fmt(v, kind)}</text>')
        name = row[4:] if row.startswith("the ") else row
        labels.append(f'<text x="{x + bw * 0.32:.0f}" y="{h - bottom + 16:.0f}" text-anchor="middle" font-size="11">{name[:14]}</text>')
    axis = f'<line x1="{left}" y1="{h - bottom}" x2="{w - 10}" y2="{h - bottom}" stroke="currentColor"/>'
    return (f'<svg viewBox="0 0 {w} {h}" width="420" role="img" aria-label="{title}, {col}">'
            f'<text x="{w / 2:.0f}" y="16" text-anchor="middle" font-size="13" font-weight="600">{title} ({col})</text>'
            f'<g font-family="system-ui, sans-serif" fill="currentColor">{"".join(bars)}{"".join(labels)}</g>{axis}</svg>')


def cap_row(row):
    return row[0].upper() + row[1:]


def distinct(vals):
    return len(set(vals)) == len(vals)


# ---------------------------------------------------------------- claim types
def q_extreme(r):
    frame = pick(r, FRAMES)
    rows, cols, data = make_table(r, frame, r.choice([3, 4, 5]), single=r.random() < 0.5)
    col_i = r.randrange(len(cols))
    vals = [data[row][col_i] for row in rows]
    if not distinct(vals):
        raise Skip()
    which = r.choice(["highest", "lowest"])
    target = rows[vals.index(max(vals) if which == "highest" else min(vals))]
    use_chart = len(cols) == 1 and r.random() < 0.7
    exhibit = bar_chart(frame, rows, cols[col_i], vals) if use_chart else table_html(frame, rows, cols, data)
    when = f" in {cols[col_i]}" if len(cols) > 1 else ""
    passage = exhibit + f"<p>{frame[0]} examined {frame[6]} for several {frame[2]}s. According to the {'graph' if use_chart else 'table'}, {frame[6]}{when} was {which} for ______</p>"
    choices = {row: f"{row}, at {fmt(data[row][col_i], frame[7])}." for row in rows}
    others = [choices[row] for row in rows if row != target]
    q = {"passage": passage, "prompt": "Which choice most effectively uses data from the " + ("graph" if use_chart else "table") + " to complete the statement?"}
    q.update(mcq_text(choices[target], r.sample(others, min(3, len(others))) if len(others) >= 3 else others + [f"{target}, at {fmt(data[target][col_i] + (7 if frame[7] != 'dec' else 0.7), frame[7])}."][:3 - len(others)], r))
    q["explanation"] = f"Compare the values{when}: {', '.join(f'{row} ({fmt(data[row][col_i], frame[7])})' for row in rows)}. The {which} is <b>{target}</b>, and the choice must also report its value accurately."
    q["difficulty"] = 1
    return q


def q_increase(r):
    frame = pick(r, FRAMES)
    rows, cols, data = make_table(r, frame, r.choice([3, 4]), n_cols=None)
    if len(cols) < 2:
        raise Skip()
    target = pick(r, rows)
    a, b = 0, len(cols) - 1
    up = r.random() < 0.5
    if (data[target][b] > data[target][a]) != up or data[target][a] == data[target][b]:
        raise Skip()
    verb = "increased" if up else "decreased"
    passage = table_html(frame, rows, cols, data) + f"<p>{frame[0]} claims that {frame[6]} {verb} for {target} from {cols[a]} to {cols[b]}.</p>"
    word = "rose" if up else "fell"
    correct = f"For {target}, {frame[6]} {word} from {fmt(data[target][a], frame[7])} in {cols[a]} to {fmt(data[target][b], frame[7])} in {cols[b]}."
    ds = []
    for row in rows:
        if row == target:
            continue
        v1, v2 = data[row][a], data[row][b]
        if v1 != v2:
            ds.append(f"For {row}, {frame[6]} {'rose' if v2 > v1 else 'fell'} from {fmt(v1, frame[7])} in {cols[a]} to {fmt(v2, frame[7])} in {cols[b]}.")
    ds.append(f"For {target}, {frame[6]} was {fmt(data[target][b], frame[7])} in {cols[b]}.")
    ds.append(f"For {target}, {frame[6]} {'fell' if up else 'rose'} from {fmt(data[target][a], frame[7])} in {cols[a]} to {fmt(data[target][b], frame[7])} in {cols[b]}.")
    if len(ds) < 3:
        raise Skip()
    q = {"passage": passage, "prompt": "Which choice best describes data from the table that support the claim?"}
    q.update(mcq_text(correct, r.sample(ds, 3), r))
    q["explanation"] = (f"The claim is about <b>{target}</b> and a change between {cols[a]} and {cols[b]}. Only the correct choice gives both of {target}'s values, showing the change. "
                        "Statements about other categories, a single value, or an inaccurate direction don't support the claim.")
    q["difficulty"] = 1 if len(rows) == 3 else 2
    return q


def q_relative(r):
    frame = pick(r, FRAMES)
    if frame[7] == "dec":
        raise Skip()
    rows, cols, data = make_table(r, frame, r.choice([3, 4]))
    if len(cols) < 2:
        raise Skip()
    a, b = 0, len(cols) - 1
    if any(data[row][a] <= 0 or data[row][b] <= data[row][a] for row in rows):
        raise Skip()
    ratios = {row: data[row][b] / data[row][a] for row in rows}
    diffs = {row: data[row][b] - data[row][a] for row in rows}
    best = max(rows, key=ratios.get)
    most_abs = max(rows, key=diffs.get)
    if best == most_abs or len(set(round(x, 3) for x in ratios.values())) < len(rows):
        raise Skip()
    passage = table_html(frame, rows, cols, data) + f"<p>{frame[0]} claims that, in relative terms, {frame[6]} grew the most for {best} between {cols[a]} and {cols[b]}.</p>"
    desc = lambda row: f"For {row}, {frame[6]} went from {fmt(data[row][a], frame[7])} to {fmt(data[row][b], frame[7])}, an increase by a factor of about {ratios[row]:.1f}."
    correct = desc(best) + " No other category's value grew by as large a factor."
    ds = [desc(row) + (" This is the largest increase in absolute terms." if row == most_abs else "") for row in rows if row != best]
    ds.append(f"For {best}, {frame[6]} was {fmt(data[best][b], frame[7])} in {cols[b]}.")
    q = {"passage": passage, "prompt": "Which choice best describes data from the table that support the claim?"}
    q.update(mcq_text(correct, ds[:3], r))
    q["explanation"] = (f"\"In relative terms\" means comparing each category's ending value with its starting value (the growth factor), not the number added. "
                        + "; ".join(f"{row}: ×{ratios[row]:.2f}" for row in rows) + f". {cap_row(best)} grew by the largest factor, even though {most_abs} added the most in absolute terms.")
    q["difficulty"] = 3
    return q


def q_every(r):
    frame = pick(r, FRAMES)
    rows, cols, data = make_table(r, frame, r.choice([2, 3, 4]))
    if len(cols) < 3:
        raise Skip()
    A, B = r.sample(rows, 2)
    if not all(x > y for x, y in zip(data[A], data[B])):
        raise Skip()
    passage = table_html(frame, rows, cols, data) + f"<p>{frame[0]} claims that {frame[6]} was greater for {A} than for {B} in every {frame[4]} shown.</p>"
    correct = f"In each {frame[4]} shown, {frame[6]} for {A} (" + ", ".join(fmt(v, frame[7]) for v in data[A]) + f") was greater than for {B} (" + ", ".join(fmt(v, frame[7]) for v in data[B]) + ")."
    i = r.randrange(len(cols))
    ds = [f"In {cols[i]}, {frame[6]} for {A} was {fmt(data[A][i], frame[7])}, and for {B} it was {fmt(data[B][i], frame[7])}.",
          f"{cap_row(frame[6])} for {A} was {fmt(data[A][-1], frame[7])} in {cols[-1]}.",
          f"{cap_row(frame[6])} for {B} changed from {fmt(data[B][0], frame[7])} in {cols[0]} to {fmt(data[B][-1], frame[7])} in {cols[-1]}."]
    q = {"passage": passage, "prompt": "Which choice best describes data from the table that support the claim?"}
    q.update(mcq_text(correct, ds, r))
    q["explanation"] = f"The claim covers <i>every</i> {frame[4]}, so the best support compares {A} and {B} in all of them. A single-{frame[4]} comparison is consistent with the claim but doesn't show that it holds every time."
    q["difficulty"] = 2
    return q


def q_decline_despite(r):
    frame = pick(r, FRAMES)
    rows, cols, data = make_table(r, frame, r.choice([2, 3]), n_cols=None)
    if len(cols) < 4:
        raise Skip()
    target = pick(r, rows)
    v = data[target]
    ups = [i for i in range(1, len(v)) if v[i] > v[i - 1]]
    if not (v[-1] < v[0] and ups and len(set(v)) == len(v)):
        raise Skip()
    i = ups[0]
    passage = table_html(frame, rows, cols, data) + f"<p>{frame[0]} notes that {frame[6]} for {target} declined overall from {cols[0]} to {cols[-1]}, even though it rose between some consecutive {frame[4]}s.</p>"
    correct = (f"For {target}, {frame[6]} fell from {fmt(v[0], frame[7])} in {cols[0]} to {fmt(v[-1], frame[7])} in {cols[-1]}, "
               f"although it rose from {fmt(v[i - 1], frame[7])} in {cols[i - 1]} to {fmt(v[i], frame[7])} in {cols[i]}.")
    lo = v.index(min(v))
    ds = [f"For {target}, {frame[6]} rose from {fmt(v[i - 1], frame[7])} in {cols[i - 1]} to {fmt(v[i], frame[7])} in {cols[i]}.",
          f"For {target}, {frame[6]} was lowest in {cols[lo]}, at {fmt(v[lo], frame[7])}.",
          f"For {target}, {frame[6]} fell from {fmt(v[0], frame[7])} in {cols[0]} to {fmt(v[-1], frame[7])} in {cols[-1]}."]
    q = {"passage": passage, "prompt": "Which choice most effectively uses data from the table to support the statement?"}
    q.update(mcq_text(correct, ds, r))
    q["explanation"] = "The statement has two parts: an overall decline <i>and</i> at least one increase along the way. Only the correct choice gives evidence for both parts. The other choices each support just one part, or neither."
    q["difficulty"] = 3
    return q


def q_weaken(r):
    frame = pick(r, FRAMES)
    rows, cols, data = make_table(r, frame, r.choice([3, 4]))
    if len(cols) < 3:
        raise Skip()
    target = pick(r, rows)
    v = data[target]
    downs = [i for i in range(1, len(v)) if v[i] < v[i - 1]]
    ups = [i for i in range(1, len(v)) if v[i] > v[i - 1]]
    if len(downs) != 1 or not ups or v[-1] <= v[0]:
        raise Skip()
    d, u = downs[0], ups[0]
    passage = table_html(frame, rows, cols, data) + f"<p>{frame[0]} claims that {frame[6]} for {target} increased from each {frame[4]} shown to the next.</p>"
    correct = f"For {target}, {frame[6]} fell from {fmt(v[d - 1], frame[7])} in {cols[d - 1]} to {fmt(v[d], frame[7])} in {cols[d]}."
    ds = [f"For {target}, {frame[6]} rose from {fmt(v[u - 1], frame[7])} in {cols[u - 1]} to {fmt(v[u], frame[7])} in {cols[u]}.",
          f"For {target}, {frame[6]} was higher in {cols[-1]} ({fmt(v[-1], frame[7])}) than in {cols[0]} ({fmt(v[0], frame[7])}).",
          f"For {target}, {frame[6]} was {fmt(v[d], frame[7])} in {cols[d]}."]
    q = {"passage": passage, "prompt": "Which choice best describes data from the table that weaken the claim?"}
    q.update(mcq_text(correct, ds, r))
    q["explanation"] = f"The claim says the value rose <i>every</i> time. A single drop contradicts it: from {cols[d - 1]} to {cols[d]}, {frame[6]} for {target} fell. Choices showing increases are consistent with the claim, so they don't weaken it."
    q["difficulty"] = 3
    return q


def q_compare_complete(r):
    frame = pick(r, FRAMES)
    rows, cols, data = make_table(r, frame, r.choice([3, 4, 5]))
    if len(cols) < 2:
        raise Skip()
    i = r.randrange(len(cols))
    A, B = r.sample(rows, 2)
    if data[A][i] == data[B][i]:
        raise Skip()
    hi, lo = (A, B) if data[A][i] > data[B][i] else (B, A)
    passage = table_html(frame, rows, cols, data) + f"<p>{frame[0]} compared {frame[6]} for {A} and {B}. In {cols[i]}, {frame[6]} was greater for ______</p>"
    correct = f"{hi} ({fmt(data[hi][i], frame[7])}) than for {lo} ({fmt(data[lo][i], frame[7])})."
    j = (i + 1) % len(cols)
    ds = [f"{lo} ({fmt(data[lo][i], frame[7])}) than for {hi} ({fmt(data[hi][i], frame[7])}).",
          f"{hi} ({fmt(data[hi][j], frame[7])}) than for {lo} ({fmt(data[lo][j], frame[7])}).",
          f"{hi} ({fmt(data[lo][i], frame[7])}) than for {lo} ({fmt(data[hi][i], frame[7])})."]
    if ds[1] == correct:
        raise Skip()
    q = {"passage": passage, "prompt": "Which choice most effectively uses data from the table to complete the statement?"}
    q.update(mcq_text(correct, ds, r))
    q["explanation"] = f"Read the {cols[i]} column: {A} has {fmt(data[A][i], frame[7])} and {B} has {fmt(data[B][i], frame[7])}. The correct choice names the greater one and reports both values from the right {frame[4]}."
    q["difficulty"] = 1
    return q


TEMPLATES = [
    ("evidence-quant", 1, q_extreme, 1300), ("evidence-quant", 2, q_increase, 1300), ("evidence-quant", 3, q_relative, 550),
    ("evidence-quant", 2, q_every, 950), ("evidence-quant", 3, q_decline_despite, 700), ("evidence-quant", 3, q_weaken, 700),
    ("evidence-quant", 1, q_compare_complete, 1100),
]
