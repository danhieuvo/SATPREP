"""R&W > Expression of Ideas > Rhetorical Synthesis.

Notes describe fictional people, works, places, and studies (so no real-world fact can be wrong). Each record yields
several goals; every choice is built from the notes, and exactly one choice contains what the goal requires.
"""
from .common import mcq_text, from_list, pick

SECTION, DOMAIN = "rw", "expression"
PROMPT = "Which choice most effectively uses relevant information from the notes to accomplish this goal?"

FIRST = ["Amara", "Tomás", "Mei", "Kwame", "Lucía", "Ravi", "Sofia", "Kenji", "Nadia", "Elias", "Priya", "Mateo", "Leila", "Jonas", "Ayumi", "Omar",
         "Ingrid", "Diego", "Hana", "Samuel", "Zara", "Viktor", "Imani", "Felipe", "Anika", "Dmitri", "Yara", "Chen", "Beatriz", "Idris", "Maren", "Kofi"]
LAST = ["Okafor", "Ferreira", "Lindqvist", "Nakamura", "Adeyemi", "Castellano", "Haddad", "Moreau", "Kowalski", "Mensah", "Varga", "Iyer", "Solberg",
        "Duarte", "Takeda", "Brennan", "Abara", "Novak", "Quintero", "Rahman", "Petrov", "Asante", "Delacroix", "Halvorsen", "Mbeki", "Oyelaran", "Sato", "Vance"]
NATS = ["Brazilian", "Kenyan", "Norwegian", "Japanese", "Nigerian", "Mexican", "Indian", "Canadian", "Polish", "Ghanaian", "Chilean", "Egyptian",
        "Filipino", "Portuguese", "Vietnamese", "Irish", "Moroccan", "Peruvian", "Korean", "Australian"]
TITLE_A = ["Salt", "Northern", "Quiet", "Glass", "Winter", "Paper", "River", "Hollow", "Copper", "Distant", "Open", "Silver", "Wild", "Small", "Last"]
TITLE_B = ["Road", "Light", "Harbor", "Garden", "Season", "Orchard", "Tide", "House", "Field", "Bridge", "Voices", "Hours", "Sky", "Map", "Shore"]
BRANDS = ["AquaLine", "TerraSense", "OpenGrip", "SunDraw", "ClearFlow", "QuakeWatch", "FieldPump", "EasyReach", "PureStream", "GroundLink"]
TOWNS = ["Marlow Bay", "Ashford", "Pine Hollow", "Riverton", "Kestrel Point", "Greyfield", "Stonebridge", "Lakemont", "Hartwell", "Elmsworth",
         "Copper Falls", "Brightwater", "Fairhaven", "Oakridge", "Westmoor", "Silver Lake"]

# profession, verb, [(work kind, how the title is formed)], methods (feature of the work), achievements, trainings
PROFILES = [
    ("architect", "designed", ["public library", "footbridge", "community center", "train station", "concert hall"],
     ["uses timber from sustainably managed forests", "relies on natural ventilation instead of air-conditioning", "is built partly from recycled steel",
      "collects rainwater to irrigate its rooftop garden", "is lit almost entirely by skylights during the day"],
     ["won a national design award", "was named the region's best new public building", "drew more than a million visitors in its first year"],
     ["studied engineering before turning to architecture", "trained at a design school in Copenhagen"]),
    ("novelist", "published", ["novel"],
     ["is told from the perspectives of three siblings", "takes place over a single day", "alternates between the present day and the 1950s",
      "is written as a series of letters", "follows one family across four generations"],
     ["won a major literary prize", "was translated into more than twenty languages", "spent a year on national bestseller lists"],
     ["worked as a journalist for a decade", "studied history at university"]),
    ("composer", "wrote", ["symphony", "opera", "string quartet", "choral work"],
     ["incorporates recordings of ocean waves", "draws on folk melodies from the composer's childhood village", "uses only percussion instruments in its second movement",
      "is designed to be performed outdoors"],
     ["has been performed by orchestras on four continents", "won an international composition prize", "received a standing ovation at its premiere"],
     ["trained as a concert pianist", "studied composition at a national conservatory"]),
    ("photographer", "created", ["photo series", "photography exhibition"],
     ["documents daily life in coastal fishing villages", "was shot entirely with a handmade pinhole camera", "pairs each portrait with a handwritten note from its subject",
      "captures the same city street at dawn every day for a year"],
     ["toured museums in six countries", "won a prestigious photography award", "was acquired by a national museum"],
     ["began as a newspaper photographer", "studied painting before taking up photography"]),
    ("engineer", "developed", ["water filter", "solar-powered pump", "low-cost earthquake sensor", "prosthetic hand"],
     ["costs less than ten dollars to produce", "can be assembled without any tools", "is made mostly from 3D-printed parts", "runs without electricity from the grid"],
     ["is now used in more than forty countries", "won an international innovation prize", "has been adopted by several aid organizations"],
     ["studied mechanical engineering", "worked for years at a rural health clinic"]),
    ("filmmaker", "released", ["documentary", "animated film"],
     ["was filmed over seven years", "uses no narration", "was drawn entirely by hand", "features only nonprofessional actors"],
     ["won the top prize at an international film festival", "was nominated for several major awards", "became one of the most-watched films of its year"],
     ["started out making short films with friends", "studied anthropology before turning to film"]),
    ("choreographer", "created", ["dance piece", "ballet"],
     ["is performed without any music", "was inspired by the movements of migrating birds", "combines classical ballet with street dance"],
     ["has been staged by dance companies in twelve countries", "won a major dance award", "sold out every performance of its first season"],
     ["danced professionally for fifteen years", "trained in both ballet and traditional dance"]),
    ("chef", "published", ["cookbook"],
     ["focuses on recipes that use leftover ingredients", "organizes its recipes by season", "includes stories from the farmers who grow each ingredient"],
     ["won a national cookbook award", "sold more than 200,000 copies", "inspired a popular cooking show"],
     ["ran a small restaurant for twenty years", "learned to cook in a grandparent's kitchen"]),
]


def person_records(r, n):
    recs = []
    for i in range(n):
        prof, verb, kinds, methods, achs, trains = pick(r, PROFILES)
        first, last = pick(r, FIRST), pick(r, LAST)
        kind = pick(r, kinds)
        if prof in ("architect", "engineer"):
            prefix = pick(r, TOWNS) if prof == "architect" else pick(r, BRANDS)
            title = f"the {prefix} {' '.join(w.capitalize() for w in kind.split())}"
            work_ref, work_cap = title, title[0].upper() + title[1:]
            work_name = work_ref
        else:
            t = f"<i>{pick(r, TITLE_A)} {pick(r, TITLE_B)}</i>"
            work_ref = work_cap = work_name = t
        recs.append(dict(i=i, prof=prof, verb=verb, kind=kind, method=pick(r, methods), ach=pick(r, achs), train=pick(r, trains),
                         name=f"{first} {last}", last=last, nat=pick(r, NATS), year=r.randint(1968, 2023), work=work_ref, Work=work_cap))
    return recs


def article(word):
    return "an" if word[0].lower() in "aeiou" else "a"


def build_person(r):
    out = []
    for p in person_records(r, 650):
        notes = [f"{p['name']} is {article(p['nat'])} {p['nat']} {p['prof']}.",
                 f"In {p['year']}, {p['last']} {p['verb']} {p['work']}, {article(p['kind'])} {p['kind']}." if not p['work'].startswith("the ") else f"In {p['year']}, {p['last']} {p['verb']} {p['work']}.",
                 f"{p['Work']} {p['method']}.",
                 f"{p['Work']} {p['ach']}.",
                 f"{p['last']} {p['train']}."]
        S = {
            "intro": f"{p['nat']} {p['prof']} {p['name']} {p['verb']} {p['work']}, {article(p['kind'])} {p['kind']}, in {p['year']}.",
            "year": f"{p['Work']} was {p['verb'].replace('wrote', 'written').replace('developed', 'developed')} in {p['year']}." if p['verb'] != "wrote" else f"{p['Work']} was written in {p['year']}.",
            "method": (f"{p['Work']}, {p['verb']} by {p['last']}, {p['method']}." if p['work'].startswith('the ')
                       else f"{p['Work']}, {article(p['kind'])} {p['kind']} by {p['last']}, {p['method']}."),
            "ach": f"{p['Work']} {p['ach']}.",
            "ach_intro": (f"{p['nat']} {p['prof']} {p['name']}'s {p['work'][4:]} {p['ach']}." if p['work'].startswith('the ')
                          else f"{p['nat']} {p['prof']} {p['name']}'s {p['kind']} {p['work']} {p['ach']}."),
            "train": f"{p['name']} {p['train']}.",
            "prof": f"{p['name']} is {article(p['nat'])} {p['nat']} {p['prof']}.",
        }
        work_plain = p['work'].replace("<i>", "").replace("</i>", "")
        goals = [
            ("introduce " + p['name'] + " and " + work_plain + " to an audience unfamiliar with both", "intro", ["year", "method", "prof"],
             "It identifies who " + p['name'] + " is (nationality and profession) and what " + work_plain + " is, which is what an unfamiliar audience needs. The other choices omit the person, the work, or both.", 2),
            ("emphasize when " + work_plain + " was completed", "year", ["method", "ach", "prof"],
             "It centers on the year the work was completed. The other choices describe a feature, an achievement, or the person, with no date.", 1),
            ("describe a distinctive feature of " + work_plain, "method", ["year", "ach", "train"],
             "It states what makes the work distinctive. The other choices give a date, an achievement, or background about the creator.", 1),
            ("emphasize the success of " + work_plain, "ach", ["method", "year", "train"],
             "It reports what the work achieved. The other choices describe its features, its date, or the creator's background.", 1),
            ("introduce " + p['name'] + " to an audience unfamiliar with the " + p['prof'] + ", emphasizing a major accomplishment", "ach_intro", ["prof", "ach", "train"],
             "It both introduces " + p['name'] + " (nationality and profession) and names a major accomplishment. One distractor introduces the person without an accomplishment, and another gives the accomplishment without introducing the person.", 3),
        ]
        for goal, key, dkeys, why, diff in goals:
            res = mcq_text(S[key], [S[k] for k in dkeys], r)
            passage = ("<p>While researching a topic, a student has taken the following notes:</p><ul>" + "".join(f"<li>{n}</li>" for n in notes) +
                       f"</ul><p>The student wants to {goal}.</p>")
            out.append({"passage": passage, "prompt": PROMPT, **res, "explanation": "The best choice fits the goal exactly. " + why, "difficulty": diff, "group": f"syn-p-{p['i']}"})
    return out


# kind, name pattern, measure noun, unit, comparative, value range, shared feature options, date verb
COMPARE_KINDS = [
    ("bridge", "the {A} Bridge", "main span", "meters", "longer", (180, 2100), ["suspension bridges", "cable-stayed bridges", "arch bridges"], "opened"),
    ("lake", "Lake {A}", "surface area", "square kilometers", "larger", (12, 900), ["freshwater lakes formed by glaciers", "reservoirs created by dams"], "was first surveyed"),
    ("museum", "the {A} Museum", "annual attendance", "visitors", "higher", (40000, 900000), ["museums of natural history", "art museums with free admission"], "opened"),
    ("mountain", "Mount {A}", "height", "meters", "taller", (1800, 6400), ["dormant volcanoes", "peaks in the same mountain range"], "was first climbed"),
    ("tower", "the {A} Tower", "height", "meters", "taller", (95, 540), ["observation towers open to the public", "towers built mainly of steel"], "was completed"),
    ("observatory", "the {A} Observatory", "main telescope's mirror diameter", "meters", "larger", (2, 12), ["observatories located on remote mountaintops", "radio observatories"], "began operating"),
    ("park", "{A} National Park", "area", "square kilometers", "larger", (150, 9000), ["parks known for their old-growth forests", "parks that protect coastal wetlands"], "was established"),
    ("tunnel", "the {A} Tunnel", "length", "kilometers", "longer", (2, 57), ["railway tunnels", "tunnels that pass under a mountain range"], "opened"),
]
NAME_ROOTS = ["Alder", "Brookhaven", "Cresthill", "Dunmore", "Eastwick", "Fenwick", "Glenrock", "Halden", "Ironwood", "Juniper", "Kingsley", "Larkspur",
              "Merrow", "Northam", "Orla", "Pembrook", "Quarry", "Redfern", "Sable", "Thornbury", "Umber", "Valewood", "Wexford", "Yarrow"]
REGIONS = ["northern Chile", "central Canada", "southern Norway", "western Kenya", "eastern Australia", "northern Japan", "central Spain", "southern Brazil",
           "western Scotland", "northern India", "southern New Zealand", "eastern Poland"]


def fmt_measure(v, unit):
    return f"{v:,} {unit}"


def build_compare(r):
    out = []
    for i in range(400):
        kind, pattern, noun, unit, comp, (lo, hi), shared_opts, dverb = pick(r, COMPARE_KINDS)
        a_root, b_root = r.sample(NAME_ROOTS, 2)
        A, B = pattern.format(A=a_root), pattern.format(A=b_root)
        Ac, Bc = A[0].upper() + A[1:], B[0].upper() + B[1:]
        va, vb = r.sample(range(lo, hi), 2)
        if va < vb:
            (A, Ac, va), (B, Bc, vb) = (B, Bc, vb), (A, Ac, va)
        ya, yb = r.sample(range(1890, 2021), 2)
        la, lb = r.sample(REGIONS, 2)
        shared = pick(r, shared_opts)
        notes = [f"{Ac} is in {la}. It {dverb} in {ya}.", f"Its {noun} is {fmt_measure(va, unit)}.",
                 f"{Bc} is in {lb}. It {dverb} in {yb}.", f"Its {noun} is {fmt_measure(vb, unit)}.", f"Both are {shared}."]
        S = {
            "sim": f"Both {A} and {B} are {shared}.",
            "measure": f"The {noun} of {A} ({fmt_measure(va, unit)}) is greater than that of {B} ({fmt_measure(vb, unit)}).",
            "year": f"{Ac} {dverb} in {ya}, while {B} {dverb} in {yb}.",
            "loc": f"{Ac} is in {la}, and {B} is in {lb}.",
            "single": f"{Ac}, which is in {la}, is one of several {shared}.",
        }
        goals = [
            (f"emphasize a similarity between {A} and {B}", "sim", ["measure", "year", "loc"],
             "Only this choice describes something the two share. The others present differences (in size, date, or location).", 2),
            (f"emphasize how the {noun} of the two {kind}s differs", "measure", ["sim", "year", "single"],
             f"It compares the {noun} of both {kind}s. The other choices describe a similarity, a difference in date, or only one {kind}.", 2),
            (f"contrast when the two {kind}s {dverb.replace('was ', 'were ')}", "year", ["measure", "sim", "loc"],
             "It gives both dates and contrasts them. The other choices compare size or location, or describe a similarity.", 2),
            (f"contrast the locations of the two {kind}s", "loc", ["year", "measure", "single"],
             "It names where both are and contrasts them. The other choices compare dates or size, or mention only one location.", 3),
        ]
        for goal, key, dkeys, why, diff in goals:
            res = mcq_text(S[key], [S[k] for k in dkeys], r)
            passage = ("<p>While researching a topic, a student has taken the following notes:</p><ul>" + "".join(f"<li>{n}</li>" for n in notes) +
                       f"</ul><p>The student wants to {goal}.</p>")
            out.append({"passage": passage, "prompt": PROMPT, **res, "explanation": "The goal asks for a specific kind of comparison. " + why, "difficulty": diff, "group": f"syn-c-{i}"})
    return out


# field, aim (whether ...), method (past tense predicate), finding (clause), conclusion (clause)
STUDIES = """
marine biologist | whether noise from passing ships affects how often humpback whales sing | recorded whale songs in a busy shipping lane and in a quiet bay for two months | whales in the shipping lane sang about 40 percent less often | ship noise may interfere with whale communication
ecologist | whether city lights change when songbirds begin singing in the morning | compared the first songs of robins in brightly lit city parks with those in dark rural woodlands | robins in lit parks began singing nearly an hour earlier | artificial light may shift birds' daily rhythms
psychologist | whether taking short breaks improves students' focus during long study sessions | had one group of students take a five-minute break every half hour while another group studied without breaks | students who took breaks answered more practice questions correctly | brief breaks may help people stay focused
agricultural scientist | whether planting clover between rows of corn reduces the need for fertilizer | grew corn with and without clover planted between the rows for three seasons | fields with clover produced similar yields using a third less fertilizer | clover may supply some of the nutrients corn needs
materials scientist | whether a coating made from seaweed can keep fruit fresh longer | coated half of a batch of strawberries with a seaweed-based film and left the rest uncoated | coated strawberries stayed fresh for about four days longer | the coating could help reduce food waste
entomologist | whether bees prefer flowers of a particular color | set out identical feeders colored blue, yellow, and white in a meadow | bees visited the blue feeders most often | color may play a role in how bees choose flowers
sociologist | whether community gardens increase how often neighbors talk to one another | surveyed residents before and one year after gardens opened in their neighborhoods | residents reported speaking with neighbors more often after the gardens opened | community gardens may strengthen neighborhood ties
geologist | whether a hillside's plant cover affects how much soil washes away in heavy rain | measured soil runoff on bare slopes and on slopes covered with native grasses | bare slopes lost several times more soil | plant cover may protect hillsides from erosion
nutrition researcher | whether eating breakfast affects how much food people eat at lunch | asked volunteers to eat breakfast on some days and skip it on others, then measured their lunch portions | lunch portions were about the same on both kinds of days | skipping breakfast may not lead people to eat more later
zoologist | whether zoo elephants that are given puzzle feeders are more active | gave puzzle feeders to some elephants and standard food trays to others, then tracked their movement | elephants with puzzle feeders walked noticeably more each day | puzzle feeders may encourage healthy activity
astronomer | whether a distant star's brightness changes on a regular schedule | measured the star's brightness every night for eighteen months | the star dimmed slightly about every 42 days | an orbiting planet may be passing in front of the star
linguist | whether bilingual children are better at switching between tasks | gave bilingual and monolingual children a game that required switching rules quickly | bilingual children switched rules with fewer errors | speaking two languages may strengthen certain mental skills
economist | whether a four-day workweek changes employee productivity | tracked output at companies before and after they adopted a four-day week | output per employee stayed the same or rose slightly | shorter workweeks may not reduce productivity
botanist | whether tomato plants grow better with music played nearby | grew tomato plants in two identical greenhouses, one with music and one without | plants in both greenhouses grew at similar rates | music may have little effect on tomato growth
urban planner | whether adding trees along streets lowers summer temperatures | measured afternoon temperatures on streets with and without tree cover | streets with trees were up to four degrees cooler | street trees may help cities stay cooler in summer
hydrologist | whether wetlands reduce flooding downstream | compared river levels below restored wetlands with levels below drained farmland after storms | river levels rose more slowly below the wetlands | wetlands may help protect nearby communities from floods
education researcher | whether reading aloud to young children improves their vocabulary | had parents in one group read aloud daily while another group continued their usual routines | children in the read-aloud group learned more new words | regular read-aloud time may support vocabulary growth
chemist | whether a new plant-based plastic breaks down in seawater | placed samples of the plastic in tanks of seawater for six months | most samples broke apart within four months | the plastic may be less harmful to oceans than conventional plastic
primatologist | whether young chimpanzees learn to use tools by watching adults | observed young chimpanzees in groups where adults cracked nuts with stones and in groups where adults did not | young chimpanzees in the nut-cracking groups began using stones much earlier | young chimpanzees may learn tool use by observation
sleep researcher | whether using screens before bed affects how quickly people fall asleep | asked volunteers to read either a printed book or a tablet for an hour before bed | tablet readers took about ten minutes longer to fall asleep | screen use before bed may delay sleep
ornithologist | whether birds that migrate farther have longer wings | measured the wings of several related species with different migration distances | species that migrated farther tended to have longer, narrower wings | wing shape may be linked to migration distance
public health researcher | whether adding bike lanes increases how often residents cycle | counted cyclists on streets before and after new bike lanes were added | cycling on those streets nearly doubled within a year | bike lanes may encourage more people to ride
archaeologist | whether a coastal settlement traded with inland villages | analyzed the minerals in pottery found at the settlement | many pots were made from clay found only far inland | the settlement may have traded with inland communities
neuroscientist | whether learning to juggle changes brain structure | scanned volunteers' brains before and after three months of juggling practice | regions linked to tracking movement grew slightly larger | practicing a new skill may reshape parts of the brain
marine ecologist | whether sea urchins limit the growth of kelp forests | fenced urchins out of some kelp plots and left others open | kelp in the fenced plots grew much denser | urchins may keep kelp forests from expanding
climate scientist | whether light-colored roofs reduce indoor temperatures | compared indoor temperatures in homes with white roofs and homes with dark roofs | homes with white roofs stayed several degrees cooler | light-colored roofs may reduce the need for air-conditioning
behavioral economist | whether shoppers buy more fruit when it is placed near the store entrance | moved the fruit display to the entrance in some stores but not others | fruit sales rose in the stores with entrance displays | product placement may influence shoppers' choices
veterinary scientist | whether dogs recognize their owners' voices | played recordings of owners' voices and strangers' voices to dogs | dogs turned toward their owners' voices far more often | dogs may be able to tell their owners' voices apart from others
forest ecologist | whether fungi help trees share nutrients | added a traceable form of carbon to some trees and checked nearby trees for it | the carbon appeared in neighboring trees connected by fungal networks | fungal networks may move nutrients between trees
music researcher | whether learning an instrument improves children's listening skills | tested children's ability to pick out sounds in noise before and after two years of music lessons | children who took lessons improved more than those who did not | music training may sharpen listening skills
"""


def build_studies(r):
    rows = [[x.strip() for x in line.split("|")] for line in STUDIES.strip().splitlines()]
    out = []
    gid = 0
    for field, aim, method, finding, concl in rows:
        for _ in range(6):
            name = f"{pick(r, FIRST)} {pick(r, LAST)}"
            last = name.split()[-1]
            notes = [f"{name} is {article(field)} {field}.", f"{last} wanted to find out {aim}.", f"{last} {method}.", f"{last} found that {finding}.",
                     f"{last} concluded that {concl}."]
            S = {
                "aim": f"{field.capitalize()} {name} set out to learn {aim}.",
                "method": f"To investigate the question, {last} {method}.",
                "finding": f"{last} found that {finding}.",
                "concl": f"{last} concluded that {concl}.",
                "both": f"Because {finding}, {last} concluded that {concl}.",
            }
            goals = [
                ("present the aim of the study", "aim", ["method", "finding", "concl"], "It states what the study set out to learn. The others describe how it was done, what was found, or what was concluded.", 1),
                ("describe how the study was conducted", "method", ["aim", "finding", "concl"], "It explains the procedure. The others give the study's aim, finding, or conclusion.", 2),
                ("present the study's finding", "finding", ["aim", "method", "concl"], "It reports what the researcher observed. A conclusion is an interpretation of a finding, not the finding itself.", 2),
                ("present both the study's finding and the conclusion drawn from it", "both", ["finding", "concl", "method"], "The goal has two parts, and only this choice includes both the finding and the conclusion. The others give only one part, or the method.", 3),
            ]
            for goal, key, dkeys, why, diff in goals:
                res = mcq_text(S[key], [S[k] for k in dkeys], r)
                passage = ("<p>While researching a topic, a student has taken the following notes:</p><ul>" + "".join(f"<li>{n}</li>" for n in notes) +
                           f"</ul><p>The student wants to {goal}.</p>")
                out.append({"passage": passage, "prompt": PROMPT, **res, "explanation": why, "difficulty": diff, "group": f"syn-s-{gid}"})
            gid += 1
    return out


TEMPLATES = [
    ("synthesis", 2, from_list(build_person), 4000),
    ("synthesis", 2, from_list(build_compare), 1600),
    ("synthesis", 2, from_list(build_studies), 720),
]
