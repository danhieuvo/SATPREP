"""R&W > Standard English Conventions > Boundaries. Original sentence atoms expanded into punctuation questions."""
from .common import mcq_text, from_list, cap

SECTION, DOMAIN = "rw", "conventions"
PROMPT = "Which choice completes the text so that it conforms to the conventions of Standard English?"

# clause 1 | clause 2 | relation (a = addition, c = contrast, r = result)
CLAUSE_PAIRS = """
The hiking club meets every Saturday morning | members who arrive late may miss the group's departure | r
The museum reopened in May after a long renovation | attendance doubled within the first month | r
Octopuses can change the color of their skin in less than a second | they can also alter its texture to resemble rocks or coral | a
The recipe calls for fresh basil | many cooks substitute dried herbs in winter | c
The first printing of the novel sold out in a week | the publisher quickly ordered a second printing | r
Honeybees communicate through a series of movements called waggle dances | these dances tell other bees where to find food | a
The town's only bakery closed last spring | residents now drive twenty minutes to buy fresh bread | r
Solar panels produce no emissions while generating electricity | they produce power only when sunlight is available | c
The orchestra rehearsed the new symphony for six weeks | the premiere was nearly flawless | r
Many desert plants store water in their thick stems | others send roots deep underground to reach moisture | c
The library extended its weekend hours | more students began studying there on Sundays | r
The painter rarely showed her work in galleries | her sketches were widely admired by other artists | c
The trail is steep and rocky near the summit | hikers are advised to wear sturdy boots | r
Sea otters use rocks to crack open shellfish | some populations pass this skill from mother to pup | a
The team lost its first three games | it went on to win the championship | c
The ancient road was paved with large, flat stones | parts of it are still used by travelers today | a
The city planted thousands of trees along its streets | summer temperatures in some neighborhoods dropped noticeably | r
The scientist's first experiment failed | she redesigned the equipment and tried again | r
Blue whales are the largest animals on Earth | they feed almost entirely on tiny shrimplike animals called krill | c
The novel is set in a small fishing village | its themes of loss and hope resonate with readers everywhere | c
The factory switched to recycled packaging | its waste output fell by nearly a third | r
The festival features music from around the world | it also offers cooking classes and craft workshops | a
The comet is visible from Earth only once every few decades | astronomers prepared for its arrival well in advance | r
The garden looks untidy to some visitors | it provides food and shelter for dozens of bird species | c
Early maps of the coastline were often inaccurate | sailors relied heavily on local guides | r
The documentary took four years to film | it includes footage from six continents | a
The storm knocked out power across the region | schools remained closed for two days | r
The architect favored simple materials like wood and stone | her buildings often surprised visitors with their bold shapes | c
Tomatoes were once considered poisonous in parts of Europe | they eventually became a staple of many regional cuisines | c
The new bus route connects the university to downtown | students can now reach the city center in fifteen minutes | r
The violinist practiced for hours each day | she still felt nervous before every performance | c
The pond's surface froze in January | the fish survived in the liquid water below the ice | c
The company's profits rose sharply last year | it hired two hundred new employees | r
The poem is only eight lines long | it captures an entire lifetime of memories | c
Volunteers cleared the trash from the riverbank | they planted native grasses to prevent erosion | a
The price of fresh strawberries rises in winter | many shoppers buy frozen berries instead | r
The mountain village has no road access | supplies are delivered by helicopter | r
The first telephones were expensive | only wealthy households could afford them at first | r
The film received poor reviews from critics | audiences flocked to theaters to see it | c
The chef grows herbs on the restaurant's roof | she buys vegetables from nearby farms | a
The river floods almost every spring | the soil along its banks is especially fertile | r
The museum's newest exhibit focuses on ancient pottery | it includes a workshop where visitors can shape their own clay bowls | a
Most spiders spin webs to catch prey | jumping spiders hunt by leaping onto insects | c
The school added a second lunch period | the cafeteria is far less crowded | r
The inventor filed dozens of patents | few of her inventions were ever manufactured | c
The island's beaches attract thousands of tourists each summer | local businesses depend heavily on the season | r
The glacier has retreated more than a kilometer in the past century | scientists monitor it closely | r
The old theater was scheduled for demolition | a group of residents raised money to restore it | c
The recipe requires only five ingredients | it can be prepared in under twenty minutes | a
The radio signal was weak in the valley | the hikers could not contact the ranger station | r
The author wrote her first novel at nineteen | she did not publish it until decades later | c
Penguins cannot fly | they are powerful swimmers | c
The city banned cars from the historic square | the area has become a popular gathering place | r
The printer ran out of ink | the report was delivered a day late | r
The coach emphasized teamwork during practice | players learned to anticipate one another's moves | r
The ancient manuscript is fragile | researchers handle it only while wearing gloves | r
The mural covers an entire wall of the station | it depicts the history of the neighborhood | a
Some bamboo species can grow nearly a meter in a single day | they are among the fastest-growing plants on Earth | r
The experiment produced surprising results | the researchers repeated it to confirm their findings | r
The bakery sells out of bread by noon | customers who arrive early have the best selection | r
The composer lost most of her hearing late in life | she continued to write music | c
The ferry runs only twice a day in winter | travelers must plan their trips carefully | r
The community center offers free tutoring | it hosts a weekly job fair | a
The lake is fed by underground springs | its water stays cold even in August | r
The candidate had little campaign funding | she won the election by a wide margin | c
The cave paintings are thousands of years old | their colors remain remarkably vivid | c
The company introduced a four-day workweek | employee satisfaction scores rose | r
The desert receives very little rain | a surprising variety of animals live there | c
The sculptor works mainly with recycled metal | her pieces often include old bicycle parts | a
The park's trails are well marked | visitors rarely get lost | r
The old lighthouse no longer guides ships | it remains a beloved local landmark | c
The student practiced the speech in front of her family | she felt confident on the day of the presentation | r
The region's winters are long and dark | residents celebrate the return of sunlight each spring | r
Elephants have an excellent sense of smell | they can detect water from several kilometers away | r
The magazine began as a small student project | it now has readers in more than forty countries | c
The subway line was extended to the airport | travel time from downtown fell by half | r
The author's early stories were rejected by several publishers | she kept writing and submitting new work | c
The soup tasted bland | the cook added more garlic and a pinch of salt | r
The concert hall has excellent acoustics | performers rarely need microphones | r
The orchard produces apples, pears, and plums | it sells homemade cider in the fall | a
The rover was designed to operate for ninety days | it continued working for several years | c
The village sits at a high elevation | water boils there at a lower temperature than at sea level | r
The dancer injured her ankle during rehearsal | her understudy performed on opening night | r
The website crashed during the ticket sale | many fans were unable to buy tickets | r
The historian studied letters written by soldiers | she interviewed their descendants | a
The café offers free refills on coffee | students often study there for hours | r
The ice cream shop is closed in January | it reopens as soon as the weather warms up | c
The recipe was passed down through four generations | each cook added a small change of their own | a
The train was delayed by a signal problem | passengers missed their connecting buses | r
The robot can sort packages quickly | it struggles to handle items with unusual shapes | c
The festival was canceled because of heavy rain | the organizers plan to hold it next month | c
The forest fire burned for weeks | new seedlings sprouted within a year | c
The museum offers free admission on Sundays | the galleries are especially crowded that day | r
The novelist writes in both English and Spanish | her books are popular in many countries | a
The copper roof has turned green over the decades | the building is easy to spot from across the river | r
The athlete trained at high altitude for months | her endurance improved dramatically | r
The early computer filled an entire room | it was less powerful than a modern calculator | c
The nature reserve limits the number of daily visitors | its wildlife is rarely disturbed | r
The pianist memorized the entire concerto | she performed it without sheet music | r
The cookbook includes recipes from twelve countries | it explains the history behind each dish | a
The river is too shallow for large boats | goods are carried by truck instead | r
The garden club meets on the first Monday of each month | new members are always welcome | a
The play's first act is lighthearted | its second act takes a much darker turn | c
The town installed streetlights along the path | more people walk there in the evening | r
Cats sleep for much of the day | they are most active at dawn and dusk | c
The scientist's theory was controversial at first | later experiments supported it | c
The heat wave lasted for ten days | the city opened cooling centers for residents | r
The market sells fresh fish every morning | it offers local honey and cheese | a
The paint on the fence is peeling | the owners plan to repaint it this summer | r
The course is designed for beginners | experienced programmers may find it too slow | r
The bridge connects two neighborhoods that were once isolated | it has become a symbol of the city's unity | a
The astronaut spent six months on the space station | she had to relearn how to walk steadily after returning to Earth | r
The singer's first album sold few copies | her second album topped the charts | c
The shop repairs old clocks | it restores antique music boxes | a
The hotel is located far from the city center | it offers a free shuttle to downtown | c
The bird's feathers are brown and speckled | it is nearly invisible against the forest floor | r
The class read the novel over the summer | the teacher began the year with a discussion of its themes | r
The wind was calm all afternoon | the sailing race was postponed | r
The recipe calls for two cups of sugar | many bakers use less | c
The volcano has not erupted in centuries | scientists still monitor it for signs of activity | c
The factory's machines are cleaned every night | they rarely break down | r
The poet grew up on a farm | many of her poems describe fields and changing seasons | r
The exhibit includes original letters and photographs | it features recorded interviews with witnesses | a
The tunnel is closed for repairs | drivers must take a longer route across the mountain | r
The candidate promised to lower taxes | she did not explain how the city would pay for its services | c
Tropical rain forests cover only a small part of the planet | they are home to a large share of its plant and animal species | c
The package was sent to the wrong address | it arrived a week late | r
The software update fixed several security problems | it made the app run faster | a
The river's water is extremely clear | divers can see fish more than twenty meters away | r
The coffee beans are roasted in small batches | each batch is tasted before it is packaged | a
The movie is nearly three hours long | few viewers complain about its length | c
The farmer rotates her crops each year | the soil stays healthy | r
The children's museum opened a new science room | it added a hands-on art studio | a
The keyboard's keys are unusually small | typing on it for long periods is uncomfortable | r
The lecture was scheduled for noon | the speaker's flight was delayed | c
The mountain pass is covered in snow most of the year | it is open to cars only in July and August | r
The detective found no fingerprints at the scene | she suspected the thief had worn gloves | r
The quilt is made from scraps of old clothing | it tells the story of the family who wore them | a
The ocean absorbs large amounts of heat | coastal areas tend to have milder temperatures than inland regions | r
The artist rarely gives interviews | little is known about her early life | r
The animal shelter received a large donation | it was able to expand its kennels | r
The recipe is simple | getting the texture exactly right takes practice | c
The city's population grew rapidly after the railroad arrived | new schools and hospitals were built to serve residents | r
The telescope is located on a remote mountaintop | it is far from the glare of city lights | r
The students built a model of the solar system | they presented it at the science fair | a
The runner fell during the first lap | she got up and finished the race in second place | c
The library's rare books are kept in a climate-controlled room | the paper does not become brittle | r
The tour guide spoke three languages | she could answer questions from nearly every visitor | r
"""

INTRO_CLAUSES = """
Although the recipe calls for fresh basil | many cooks substitute dried herbs
When the bell rang | the students hurried to their next class
Because the road was icy | the school bus arrived late
After the storm passed | volunteers began clearing fallen branches
If the weather stays clear | the launch will proceed as scheduled
While the paint dried | the artist sketched ideas for her next piece
Before the museum opened to the public | curators spent months arranging the exhibits
Since the bridge closed for repairs | commuters have taken the ferry
Unless more volunteers sign up | the cleanup event will be canceled
Even though the film was short | it made a lasting impression on audiences
As the sun set over the harbor | the fishing boats returned to shore
Once the dough has doubled in size | it is ready to be shaped into loaves
Whenever the river floods | the lowland fields become temporary wetlands
Although she had never performed in public | the young pianist played flawlessly
Because honeybees pollinate many crops | farmers often rent hives during the growing season
After years of careful restoration | the old theater reopened to sold-out crowds
When the researchers examined the samples | they found traces of an unknown mineral
Although the trail is only three miles long | it climbs more than two thousand feet
If you visit the park in early spring | you may see the wildflowers in bloom
While most bats hunt insects | some species feed on fruit or nectar
To reduce waste | the cafeteria replaced plastic trays with reusable ones
In the early years of the company | its founders worked out of a small garage
Despite the heavy rain | thousands of fans attended the outdoor concert
By the end of the season | the team had won twelve consecutive games
Surrounded by mountains on three sides | the valley is sheltered from strong winds
Built more than two centuries ago | the stone church still holds weekly services
After reading the letter twice | Marisol finally understood what her grandfather meant
Hoping to spot a rare owl | the birdwatchers waited silently in the dark
Although it looks delicate | spider silk is remarkably strong for its weight
When the first close-up photographs of the planet arrived | scientists were amazed by its swirling clouds
Because the ferry schedule changed | many travelers missed their connections
As demand for electric cars has grown | more cities have installed charging stations
Though the novel was published anonymously | readers soon guessed the author's identity
After the last guest left | the chef finally sat down to eat
If the bakery runs out of rye flour | it switches to making sourdough
Walking along the beach at dawn | the photographer captured the sunrise over the cliffs
Unlike most lizards | chameleons can move each eye independently
Until the new bridge is finished | trucks must take the long route around the lake
Although the experiment was small | its results inspired several larger studies
Whenever a storm approaches | the harbor master raises a red flag
"""

# subject | nonessential element | rest of sentence
NONESSENTIAL = """
The Atacama Desert | a strip of land along the Pacific coast of South America | is one of the driest places on Earth
The museum's newest acquisition | a nineteenth-century map of the city's harbor | will go on display next month
My grandmother's recipe book | stained and worn from decades of use | sits on a shelf above the stove
The committee's final report | released after two years of study | recommends expanding the city's bus service
Her first novel | a mystery set in a small mountain town | became an unexpected bestseller
The bakery's most popular item | a cinnamon roll the size of a dinner plate | sells out by nine each morning
The old oak tree | which has stood in the town square for three centuries | was declared a local landmark
The lead scientist | who had studied the volcano for twenty years | predicted the eruption within days
The festival | held every August since 1952 | attracts visitors from across the region
The violin | an instrument that has changed little since the 1700s | remains central to orchestral music
The new library | designed by a team of local architects | features a rooftop reading garden
The honeybee | an insect that pollinates many food crops | is essential to agriculture
The painting | long thought to be lost | was discovered in an attic last year
The ferry | the only link between the island and the mainland | runs four times a day
Mount Kilimanjaro | the tallest mountain in Africa | attracts thousands of climbers each year
The documentary | filmed over four years | follows the migration of humpback whales
The recipe | handed down from the chef's grandmother | calls for a surprising amount of black pepper
The team's captain | a senior who has played since middle school | scored the winning goal
The city's oldest bridge | completed more than a century ago | still carries thousands of cars each day
The platypus | one of the few mammals that lay eggs | lives in eastern Australia
The expedition's leader | an experienced mountaineer | decided to turn back before the storm
The novel's narrator | a retired lighthouse keeper | recalls the summer a stranger arrived in town
The garden | planted by students as a class project | now supplies vegetables to the cafeteria
The coin | minted in ancient Rome | was found by a farmer plowing his field
The concert hall | known for its excellent acoustics | hosts more than two hundred performances a year
Venus | the second planet from the Sun | is the hottest planet in the solar system
The inventor's notebook | filled with sketches of flying machines | sold at auction for a record price
The local newspaper | founded by a group of teachers in 1890 | still publishes a weekly edition
The park's tallest waterfall | a narrow ribbon of water that drops nearly 200 meters | freezes completely in winter
The poet's final collection | published a year after her death | includes several previously unknown poems
The robot | built by a team of high school students | won first place at the regional competition
The Sahara | the largest hot desert in the world | covers much of northern Africa
The chef's signature dish | a spicy stew made with smoked fish | appears on the menu every Friday
The castle | abandoned for more than a century | is now a popular museum
The whale shark | the largest fish in the ocean | feeds mainly on plankton
The school's marching band | formed only three years ago | will perform in the state parade
The mayor's proposal | a plan to convert empty lots into parks | received strong support from residents
The telescope | one of the most powerful ever built | can detect galaxies billions of light-years away
The restaurant | a favorite among local families | is celebrating its fiftieth anniversary
The quilt | stitched by hand over the course of a year | won a blue ribbon at the county fair
"""

# complete clause | what the colon introduces | L = list, E = explanation/noun phrase
COLONS = """
The museum's new exhibit features artifacts from three ancient civilizations | Egypt, Mesopotamia, and the Indus Valley | L
The recipe requires only four ingredients | flour, water, salt, and yeast | L
The architect's design solved a problem that had frustrated the city for decades | how to bring natural light into a building surrounded by taller towers | E
The coach reminded the players of the team's two priorities | defense and communication | E
The garden attracts several kinds of pollinators | bees, butterflies, moths, and hummingbirds | L
The report identified the main cause of the delays | a shortage of trained workers | E
The expedition carried only the essentials | tents, water filters, maps, and dried food | L
The novel explores a single, powerful theme | the difficulty of forgiving someone you love | E
The festival offers something for everyone | live music, local food, and craft workshops | L
The engineers faced an unusual challenge | building a bridge that could flex during earthquakes | E
The school offers three foreign languages | Spanish, Mandarin, and French | L
The discovery came from an unexpected source | a mold growing on a forgotten dish | E
The city's oldest park is known for one feature above all | its enormous collection of roses | E
The survey asked residents about two issues | public transportation and affordable housing | E
The painting uses only three colors | red, yellow, and black | L
The chef follows one rule in her kitchen | the use of fresh, local ingredients whenever possible | E
The hikers packed layers for every kind of weather | rain, wind, and sudden cold | L
The article described the benefits of urban trees | cooler streets, cleaner air, and lower energy bills | L
The museum's collection includes items from every era of the town's history | tools, letters, photographs, and clothing | L
The inventor spent years perfecting one device | a lamp powered entirely by sunlight | E
Her research focused on a single question | why some birds migrate at night | E
The town's economy relies on two industries | fishing and tourism | E
The students were given a simple task | designing a paper bridge that could hold a textbook | E
The storm left behind a clear reminder | the power of nature | E
The volunteers had one goal | planting a thousand trees before the end of spring | E
The menu features dishes from four countries | Peru, Japan, Ethiopia, and Italy | L
The band's sound blends several musical traditions | jazz, folk, and West African highlife | L
The mission had one main objective | collecting rock samples from the crater's rim | E
The kit includes everything a beginner needs | brushes, paints, a palette, and a small canvas | L
The study measured three factors | sleep, exercise, and daily screen time | L
"""

# intro | item 1 | item 2 | item 3  (items contain internal commas)
COMPLEX_LISTS = """
The tour will visit three cities: | Lyon, France | Porto, Portugal | Turin, Italy
The conference speakers included | Amara Singh, a marine biologist | Luis Ortega, a novelist | Mei Chen, an architect
The band has performed in | Austin, Texas | Nashville, Tennessee | Portland, Oregon
The committee members are | Ana Ruiz, the chair | Tom Bell, the treasurer | Priya Nair, the secretary
The recipe contest finalists came from | Dayton, Ohio | Mobile, Alabama | Boise, Idaho
The team's top scorers were | Jordan, a forward | Kim, a midfielder | Sam, a defender
The garden is divided into three sections: | herbs, such as basil and mint | vegetables, such as beans and squash | flowers, such as zinnias and marigolds
The expedition stopped in | Cusco, Peru | La Paz, Bolivia | Quito, Ecuador
The award winners included | a poet from Lagos, Nigeria | a painter from Hanoi, Vietnam | a composer from Oslo, Norway
The course covers | plants, including mosses and ferns | animals, including insects and birds | fungi, including molds and mushrooms
The students interviewed | Mr. Lee, the principal | Ms. Diaz, the librarian | Mr. Owens, the custodian
The festival lineup included | a jazz trio from Chicago, Illinois | a choir from Cardiff, Wales | a string quartet from Vienna, Austria
The report compared housing costs in | Denver, Colorado | Phoenix, Arizona | Seattle, Washington
The new menu items are | soup, served with fresh bread | salad, topped with roasted nuts | pasta, made with local tomatoes
The exchange program partners with schools in | Kyoto, Japan | Seville, Spain | Accra, Ghana
"""

# sentence containing an indirect question | following sentence
INDIRECT_Q = """
Biologists have long wondered why some birds migrate thousands of kilometers each year | Recent tracking studies have begun to offer answers
The students asked whether the field trip would be canceled because of the rain | Their teacher promised to decide by morning
Historians still debate how the ancient city came to be abandoned | New excavations may settle the question
Maria wondered what her grandmother had kept in the locked trunk | She finally found the key in an old coat pocket
The committee is investigating why the project went over budget | Its report is expected next month
Engineers want to know how long the new material will last in salt water | They plan to test it for five years
The detective asked where the witness had been on the night of the robbery | The witness refused to answer
Astronomers are trying to determine whether the planet has an atmosphere | Data from the new telescope should help
The reporter asked the mayor when the bridge would reopen | The mayor declined to give a date
Nobody knows exactly who built the stone circle | Its purpose also remains a mystery
The survey asked residents how often they use public transportation | Most said they ride the bus at least once a week
Scientists are studying how octopuses solve complex puzzles | Their findings could reveal new insights about animal intelligence
The coach wondered whether the team was ready for the championship | The players answered with a decisive win
Readers often ask why the novel ends so abruptly | The author has never explained her choice
The chef asked which dish the guests had enjoyed most | Nearly everyone named the dessert
"""

CONJ = {"a": "and", "c": "but", "r": "so", "s": "and"}
ADVERB = {"c": "however", "r": "therefore"}
REL_WORD = {"a": "adds related information", "c": "contrasts with the first", "r": "is a result of the first"}


def rows(block, n):
    out = []
    for line in block.strip().splitlines():
        if not line.strip():
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) != n:
            raise ValueError(f"bad atom: {line}")
        out.append(parts)
    return out


def split_last(s):
    head, _, last = s.rpartition(" ")
    return head, last


def split_first(s):
    first, _, tail = s.partition(" ")
    if first.endswith(","):  # keep the list comma out of the answer choice
        return first[:-1], ", " + tail
    return first, tail


def blank_passage(before, after):
    sep = "" if after[:1] in ",.;:" else " "
    return f"<p>{before} ______{sep}{after}</p>"


def all_clause_pairs():
    """(group id, clause 1, clause 2, relation, is_original_batch) for every clause pair."""
    from .clause_data1 import PAIRS as P1
    from .clause_data2 import PAIRS as P2
    from .clause_data3 import PAIRS as P3
    from .clause_data4 import PAIRS as P4
    out = [(f"ic-{i}", *row, True) for i, row in enumerate(rows(CLAUSE_PAIRS, 3))]
    for tag, block in (("ic1", P1), ("ic2", P2), ("ic3", P3), ("ic4", P4)):
        out += [(f"{tag}-{i}", *row, False) for i, row in enumerate(rows(block, 3))]
    return [p for p in out if p[2][:1].islower()]


def build_clause_pairs(r):
    qs = []
    for gid, c1, c2, rel, _ in all_clause_pairs():
        head, w1 = split_last(c1)
        w2, tail = split_first(c2)
        group = f"pair-{gid}"
        both = f"Both “{c1}” and “{cap(c2)}” are independent clauses (each could stand alone as a sentence)."
        variants = ["semicolon", "period"] + (["conj"] if rel in CONJ else []) + (["adverb"] if rel in ADVERB else [])
        for v in variants:
            if v == "semicolon":
                correct = f"{w1}; {w2}"
                ds = [f"{w1}, {w2}", f"{w1} {w2}", f"{w1} and, {w2}"]
                expl = both + " A <b>semicolon</b> can join two independent clauses. A comma alone creates a comma splice, and no punctuation creates a run-on sentence."
                diff, after = 2, tail + "."
            elif v == "period":
                correct = f"{w1}. {cap(w2)}"
                ds = [f"{w1}, {w2}", f"{w1} {w2}", f"{w1}, {cap(w2)}"]
                expl = both + " A <b>period</b> correctly separates them into two sentences. A comma alone creates a comma splice, and no punctuation creates a run-on sentence."
                diff, after = 1, tail + "."
            elif v == "conj":
                cj = CONJ[rel]
                correct = f"{w1}, {cj} {w2}"
                ds = [f"{w1} {cj}, {w2}", f"{w1}, {w2}", f"{w1}, {cj}, {w2}"]
                expl = both + f" Two independent clauses can be joined with a <b>comma followed by a coordinating conjunction</b> (“{cj}”). The comma belongs before the conjunction, not after it, and a comma alone is a comma splice."
                diff, after = 1, tail + "."
            else:
                adv = ADVERB[rel]
                correct = f"{w1}; {adv}, {w2}"
                ds = [f"{w1}, {adv}, {w2}", f"{w1} {adv}, {w2}", f"{w1}, {adv} {w2}"]
                expl = both + f" “{cap(adv)}” is a transition word, not a conjunction, so it can't join two independent clauses with only commas. Use a <b>semicolon before “{adv}” and a comma after it</b>."
                diff, after = 3, tail + "."
            res = mcq_text(correct, ds, r)
            qs.append({"passage": blank_passage(head, after), "prompt": PROMPT, **res, "explanation": expl, "difficulty": diff, "group": group})
    return qs


from . import boundary_extra as _extra
INTRO_CLAUSES += _extra.INTRO_CLAUSES
NONESSENTIAL += _extra.NONESSENTIAL
COLONS += _extra.COLONS


def build_intro(r):
    qs = []
    for i, (intro, main) in enumerate(rows(INTRO_CLAUSES, 2)):
        head, w1 = split_last(intro)
        w2, tail = split_first(main)
        correct = f"{w1}, {w2}"
        ds = [f"{w1}; {w2}", f"{w1}. {cap(w2)}", f"{w1}: {w2}"]
        expl = (f"“{intro}” is an introductory element, not a complete sentence. A <b>comma</b> separates it from the main clause. "
                "A semicolon or period would leave the introductory element as a fragment, and a colon must follow a complete independent clause.")
        qs.append({"passage": blank_passage(head, tail + "."), "prompt": PROMPT, **mcq_text(correct, ds, r), "explanation": expl, "difficulty": 1, "group": f"bnd-intro-{i}"})
    return qs


def build_nonessential(r):
    qs = []
    marks = {",": ("commas", ", "), "—": ("dashes", "—")}
    for i, (subj, elem, rest) in enumerate(rows(NONESSENTIAL, 3)):
        head, w = split_last(elem)
        nxt, tail = split_first(rest)
        for mark in (",", "—"):
            name, opener = marks[mark]
            before = f"{subj}{opener}{head}"
            closers = {",": f"{w}, {nxt}", "—": f"{w}—{nxt}", ";": f"{w}; {nxt}", "": f"{w} {nxt}"}
            correct = closers[mark]
            ds = [closers[k] for k in closers if k != mark]
            expl = (f"The phrase “{elem}” is extra information about “{subj[0].lower() + subj[1:] if not subj.split()[0][0].isupper() or subj.split()[0] in ('The', 'My', 'Her') else subj}.” "
                    f"It opens with {'a comma' if mark == ',' else 'a dash'}, so it must close with the same punctuation: a pair of <b>{name}</b>. "
                    "Mixing punctuation marks or leaving the element unclosed is incorrect.")
            qs.append({"passage": blank_passage(before, tail + "."), "prompt": PROMPT, **mcq_text(correct, ds, r), "explanation": expl, "difficulty": 2, "group": f"bnd-ne-{i}"})
    return qs


def build_colons(r):
    qs = []
    for i, (clause, cont, kind) in enumerate(rows(COLONS, 3)):
        head, w1 = split_last(clause)
        w2, tail = split_first(cont)
        correct = f"{w1}: {w2}"
        if kind == "L":
            ds = [f"{w1}; {w2}", f"{w1} {w2}", f"{w1}, {w2}"]
            expl = f"“{clause}” is a complete independent clause, and what follows is a list that specifies it. A <b>colon</b> correctly introduces such a list. A semicolon must join two independent clauses, and a comma or no punctuation fails to set off the list clearly."
        else:
            ds = [f"{w1}; {w2}", f"{w1} {w2}", f"{w1}, and {w2}"]
            expl = f"“{clause}” is a complete independent clause, and what follows is a phrase that explains or identifies something in it. A <b>colon</b> correctly introduces that explanation. A semicolon needs an independent clause on both sides, and “and” wrongly joins a clause to a phrase."
        after = (tail + ".") if tail else ""
        passage = blank_passage(head, after) if after else f"<p>{head} ______.</p>"
        if not tail:
            correct, ds = correct, ds
        qs.append({"passage": passage, "prompt": PROMPT, **mcq_text(correct, ds, r), "explanation": expl, "difficulty": 2, "group": f"bnd-colon-{i}"})
    return qs


def build_complex_lists(r):
    qs = []
    for i, (intro, i1, i2, i3) in enumerate(rows(COMPLEX_LISTS, 4)):
        head, w = split_last(i2)
        before = f"{intro} {i1}; {head}"
        correct = f"{w}; and"
        ds = [f"{w}, and", f"{w} and", f"{w}: and"]
        expl = "Each item in this list already contains a comma, so <b>semicolons</b> must separate the items to keep them distinct. The pattern set by the first semicolon must continue before “and.”"
        qs.append({"passage": blank_passage(before, i3 + "."), "prompt": PROMPT, **mcq_text(correct, ds, r), "explanation": expl, "difficulty": 3, "group": f"bnd-list-{i}"})
    return qs


def build_indirect(r):
    qs = []
    for i, (s1, s2) in enumerate(rows(INDIRECT_Q, 2)):
        head, w1 = split_last(s1)
        w2, tail = split_first(s2)
        correct = f"{w1}. {w2}"
        ds = [f"{w1}? {w2}", f"{w1}, {w2.lower() if w2 not in ('Maria',) else w2}", f"{w1}? {w2.lower()}"]
        expl = "The first sentence reports a question indirectly (for example, “wondered why” or “asked whether”) instead of asking it directly, so it ends with a <b>period</b>, not a question mark. A comma would create a comma splice."
        qs.append({"passage": blank_passage(head, tail + "."), "prompt": PROMPT, **mcq_text(correct, ds, r), "explanation": expl, "difficulty": 3, "group": f"bnd-iq-{i}"})
    return qs


TEMPLATES = [
    ("boundaries", 2, from_list(build_clause_pairs), 6000),
    ("boundaries", 1, from_list(build_intro), 100),
    ("boundaries", 2, from_list(build_nonessential), 200),
    ("boundaries", 2, from_list(build_colons), 100),
    ("boundaries", 3, from_list(build_complex_lists), 100),
    ("boundaries", 3, from_list(build_indirect), 100),
]
