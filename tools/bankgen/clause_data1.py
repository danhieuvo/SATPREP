"""Original clause pairs, batch 1. Format: clause 1 | clause 2 | relation.
Relations: c contrast, r result, a addition, e example, s sequence, m similarity.
Clause 2 starts lowercase and never with a proper noun (it follows a transition or punctuation)."""

PAIRS = """
The recipe looked complicated on paper | it took less than half an hour to prepare | c
The museum lowered its ticket prices | attendance rose sharply the following month | r
Many animals rely on camouflage to avoid predators | the leaf-tailed gecko looks almost exactly like a dead leaf | e
The volunteers sorted the donated books by subject | they shelved them in the new reading room | s
Honeybees share information about food through dances | some ants leave chemical trails that guide others to food | m
The bakery uses only local flour | it sources its butter from a dairy down the road | a
The river was once badly polluted | it now supports a thriving population of trout | c
The highway was closed for repairs | traffic on nearby roads doubled | r
Some plants have developed clever ways to spread their seeds | burdock seeds cling to the fur of passing animals | e
The students collected water samples from the pond | they tested each sample for bacteria in the lab | s
Wolves hunt in coordinated packs | orcas work together to trap schools of fish | m
The new phone has a longer battery life | its camera takes sharper photos in low light | a
The coach expected a close game | her team won by more than twenty points | c
The factory installed new air filters | nearby residents reported fewer breathing problems | r
Several ancient cultures tracked the movements of the stars | early Polynesian navigators used star positions to cross vast stretches of ocean | e
The glassblower heated the tip of the rod | he shaped the glowing glass into a vase | s
Cacti store water in their thick stems | camels store fat in their humps to survive long journeys | m
The library offers free coding classes | it lends laptops to students who need them | a
The trail is short | it includes some of the steepest climbs in the park | c
The heavy rains saturated the soil | several hillsides collapsed into the valley | r
Many composers have drawn inspiration from nature | one wrote an entire symphony based on birdsong | e
The committee reviewed every proposal | it announced the winners at a public meeting | s
Chess rewards players who think several moves ahead | successful investors try to anticipate future market changes | m
The festival showcases local musicians | it features food from more than thirty neighborhood restaurants | a
The old farmhouse looked abandoned from the road | a family of five lived there comfortably | c
The price of gasoline rose steeply | more commuters began taking the train | r
Some insects can survive extreme cold | certain beetles produce natural antifreeze in their blood | e
The archaeologists mapped the site carefully | they began excavating the oldest layer | s
Children often learn languages quickly | young songbirds pick up the songs of adult birds with remarkable speed | m
The park added new picnic tables | it installed a water fountain near the playground | a
The first version of the software was slow | the second version ran almost twice as fast | c
The printer jammed repeatedly | the teacher postponed the quiz | r
Many cities have converted old railways into public spaces | an abandoned elevated rail line in one city became a popular walking park | e
The pilot completed the preflight checklist | she taxied the plane to the runway | s
Coral reefs support an enormous variety of marine life | rain forests are home to a huge number of plant and animal species | m
The course teaches basic photography | it covers simple techniques for editing images | a
The soup smelled wonderful | it was far too salty to eat | c
The school garden produced more vegetables than expected | the cafeteria served fresh salads all spring | r
Some birds are skilled at imitating sounds | lyrebirds can mimic camera shutters and car alarms | e
The runners stretched their legs | they lined up at the starting line | s
Beavers build dams that reshape entire streams | termites construct mounds that change the soil around them | m
The hotel has an indoor pool | it offers bicycles for guests to explore the town | a
The critic praised the novel's characters | she found its ending unconvincing | c
The bridge's cables showed signs of rust | engineers closed it for inspection | r
Many foods were discovered by accident | a cook who left chocolate chips in cookie dough created a now-famous recipe | e
The farmer harvested the wheat | he stored the grain in a dry silo | s
Salmon return to the streams where they hatched | sea turtles often lay their eggs on the beaches where they were born | m
The app tracks daily water intake | it sends reminders to drink more during hot weather | a
The painting appears simple at first glance | it contains dozens of tiny hidden details | c
The town's population declined for decades | several schools had to merge | r
Some architects design buildings that generate their own energy | one office tower produces more electricity than it uses | e
The class read the first act of the play | they performed a scene from it for their families | s
Octopuses can solve simple puzzles | crows can use sticks to pull food out of narrow holes | m
The museum offers audio tours in six languages | it provides tactile exhibits for visitors who are blind | a
The sneakers were expensive | they wore out within a few months | c
The drought lasted three summers | farmers in the region planted crops that need less water | r
Some languages have words for ideas that other languages lack | one language has a single word for the feeling of coziness on a winter evening | e
The engineers built a small model of the dam | they tested how it held up under simulated floods | s
Violins are carefully tuned before a concert | guitars must be adjusted to the correct pitch before a performance | m
The magazine publishes short stories | it runs interviews with emerging writers | a
The hikers started before dawn | they did not reach the summit until late afternoon | c
The company released its product early | several flaws went unnoticed | r
Many plants respond to touch | the sensitive plant folds its leaves when brushed | e
The baker kneaded the dough for ten minutes | she let it rise in a warm corner of the kitchen | s
Elephants mourn members of their herd | some whales appear to grieve when a companion dies | m
The volunteers painted the community center | they repaired its leaky roof | a
The team had the best record in the league | it lost in the first round of the playoffs | c
The city expanded its recycling program | the amount of trash sent to the landfill fell by a quarter | r
Several musicians have made instruments from recycled materials | one band performs on drums made from old paint cans | e
The scientists sealed the samples in glass jars | they shipped the jars to a laboratory overseas | s
Marathon runners train for months to build endurance | long-distance swimmers gradually increase the distances they swim | m
The garden center sells native plants | it teaches workshops on attracting pollinators | a
The storm was expected to be mild | it caused widespread flooding | c
The actor forgot several lines | the director added another week of rehearsals | r
Some animals change color with the seasons | the arctic fox's coat turns white in winter | e
The detective interviewed the witnesses | she compared their accounts for inconsistencies | s
Cats clean themselves with their tongues | many birds groom their feathers with their beaks | m
The bus line runs every ten minutes | it offers free rides on weekends | a
The film's budget was tiny | it earned millions of dollars at the box office | c
The lake froze earlier than usual | the skating season began in early December | r
Many inventions were inspired by animals | the design of one high-speed train's nose was modeled on a bird's beak | e
The student outlined her essay | she wrote a first draft over the weekend | s
Some trees communicate through underground fungal networks | certain plants release chemicals into the air to warn their neighbors | m
The website offers free tutorials | it hosts a forum where users can ask questions | a
The mountain looks impossible to climb | a well-marked trail winds gently to the top | c
The power went out during the storm | the restaurant served only cold dishes that evening | r
Some fish can survive out of water for long periods | the lungfish can breathe air and live in dried mud for months | e
The mechanic drained the old oil | he refilled the engine with fresh oil | s
Mountain goats climb steep cliffs with ease | some lizards can run straight up smooth walls | m
The camp offers swimming lessons | it runs a program for young astronomers | a
The poem uses very simple words | its meaning has puzzled readers for generations | c
The road signs were confusing | many drivers missed the exit for the airport | r
Several famous paintings were once overlooked | one masterpiece hung unnoticed in a small church for decades | e
The crew raised the sails | the ship slowly left the harbor | s
Hummingbirds beat their wings extremely fast | bumblebees flap their wings hundreds of times per second | m
The college offers evening classes | it provides free child care during those hours | a
The experiment seemed straightforward | the results were difficult to interpret | c
The popular exhibit was extended | the museum stayed open late on Fridays | r
Some desert animals avoid the heat entirely | the fennec fox rests in cool burrows during the day | e
The chef seared the fish | she served it over a bed of rice | s
Sharks have existed for hundreds of millions of years | horseshoe crabs have changed little over an immensely long history | m
The store extended its hours | it hired twelve additional employees | a
The apartment was small | its large windows made it feel spacious | c
The concert sold out within minutes | the band added a second performance | r
Many ancient buildings were designed to track the sun | at one temple, sunlight reaches the inner chamber only on two days each year | e
The gardener pulled up the weeds | she spread mulch around the tomato plants | s
Dolphins use clicks to locate objects underwater | bats use echoes to find insects in the dark | m
The conference includes panel discussions | it offers hands-on workshops for attendees | a
The bridge looks fragile | it was built to withstand hurricane-force winds | c
The team practiced free throws every day | its shooting percentage improved steadily | r
Some plants trap insects for nutrients | the Venus flytrap snaps shut when an insect touches its leaves | e
The historians translated the letters | they published them in a single volume | s
Starfish can regrow lost arms | some salamanders can regenerate entire limbs | m
The theater renovated its lobby | it installed more comfortable seats | a
The puzzle looked easy | it took the family an entire week to finish | c
The software update introduced a bug | many users could not log in for several hours | r
Some cities are experimenting with car-free zones | one city closed its central shopping district to cars on weekends | e
The volunteers counted the birds at dawn | they entered their data into a national database | s
Squirrels bury nuts to eat in winter | some jays hide thousands of seeds each fall | m
The newspaper launched a podcast | it began publishing a weekly newsletter | a
The sculpture is made of steel | it appears to float above the ground | c
The fog was extremely thick | all morning flights were delayed | r
Many famous scientists started their careers in unexpected fields | one pioneering chemist first trained as a lawyer | e
The potter shaped the clay on the wheel | he fired the bowl in a kiln | s
Some frogs change color to regulate their temperature | certain lizards darken their skin to absorb more heat | m
The clinic offers free checkups | it provides nutrition classes for families | a
The instructions were clear | many students still misunderstood the assignment | c
The ferry service was suspended | island residents relied on small private boats | r
Some sports have changed dramatically over time | basketball was once played with peach baskets instead of hoops | e
The researchers tagged the sea turtles | they tracked the turtles' migration by satellite | s
Penguins huddle together to stay warm | musk oxen form tight groups during winter storms | m
The shop sells used bicycles | it repairs bikes for a small fee | a
The candidate spoke confidently | her answers lacked specific details | c
The dam released extra water | the river downstream rose several feet | r
Several animals use tools | sea otters use rocks to open shellfish | e
The committee chose a design | construction began the following spring | s
Tree rings reveal a tree's age | layers of rock record the history of a landscape | m
The program trains new nurses | it offers scholarships to cover tuition | a
The café is always crowded | service there is remarkably fast | c
The author's notes were lost in a fire | historians know little about how she wrote her novels | r
Some mammals lay eggs | the echidna lays a single soft-shelled egg | e
The class planted seedlings in pots | they moved the young plants to the school garden | s
Monarch butterflies migrate thousands of kilometers | some dragonflies cross entire oceans during migration | m
The airline added nonstop flights | it lowered fares on several routes | a
The instrument is centuries old | it still produces a rich, clear sound | c
The heat wave strained the power grid | officials asked residents to limit air-conditioning | r
Many foods contain hidden sugar | some brands of bread include several grams of sugar per slice | e
The judges tasted each entry | they announced the winning chili recipe | s
Rivers carve canyons over millions of years | glaciers grind valleys into mountain ranges | m
The school added a robotics club | it opened a new science lab | a
The garden is in the middle of the city | it feels quiet and remote | c
The documentary aired on national television | donations to the wildlife charity surged | r
Some materials become stronger when heated | clay hardens into durable pottery in a kiln | e
The carpenter measured the boards | he cut them to the correct length | s
Owls can turn their heads almost completely around | chameleons can move their eyes in different directions at once | m
The festival offers free admission | it provides shuttle buses from downtown | a
The athlete was injured in March | she competed in the championship in June | c
The company offered flexible schedules | fewer employees quit that year | r
Some musical instruments are made from natural materials | the didgeridoo is traditionally made from a termite-hollowed branch | e
The team drafted the report | they sent it to reviewers for feedback | s
Ancient libraries preserved knowledge on scrolls | modern archives store information on digital servers | m
The hostel provides free breakfast | it organizes walking tours of the old town | a
The lecture was long | the audience stayed engaged the entire time | c
The river changed course after the flood | the old bridge now crosses dry land | r
Some animals communicate through vibrations | elephants can sense rumbling calls through their feet | e
The students built a small wind turbine | they measured how much electricity it produced | s
Arctic terns travel from pole to pole each year | gray whales migrate along the entire length of a continent | m
The farm sells fresh eggs | it offers hayrides in the fall | a
The ruins are thousands of years old | their stone walls remain largely intact | c
The school replaced its old windows | its heating costs dropped noticeably | r
Some writers publish under pen names | one famous novelist wrote mysteries under a different name for years | e
The paramedics stabilized the patient | they drove her to the hospital | s
Crickets chirp faster in warm weather | some frogs call more frequently as temperatures rise | m
The online store offers free shipping | it accepts returns for ninety days | a
The house was built in the 1800s | it has modern plumbing and wiring | c
The bakery's oven broke | it could not sell bread that weekend | r
Several plants are used to make natural dyes | the roots of the madder plant produce a deep red dye | e
The rangers closed the trail | they cleared the fallen trees blocking it | s
Ants can carry many times their body weight | some beetles can lift objects far heavier than themselves | m
The guidebook lists hiking trails | it describes the wildlife visitors are likely to see | a
The violin was inexpensive | its tone impressed professional musicians | c
The main road flooded | the school buses took a longer route | r
Many cultures celebrate the harvest | one village holds a festival featuring a giant pumpkin parade | e
The editor read the manuscript | she suggested several changes to the ending | s
Butterflies taste with their feet | catfish have taste buds all over their bodies | m
The gym offers yoga classes | it has a climbing wall for beginners | a
The canyon is remote | thousands of hikers visit it each summer | c
The movie theater installed larger screens | ticket sales increased | r
Some birds build elaborate structures to attract mates | the bowerbird decorates its nest with colorful objects | e
The technicians installed the solar panels | they connected them to the building's power system | s
Cheetahs sprint to catch prey | dragonflies make sudden bursts of speed to snatch insects in flight | m
The club hosts monthly book discussions | it invites authors to speak twice a year | a
The meal was simple | every dish was full of flavor | c
The trail became icy | the hikers turned back before reaching the lake | r
Some trees live for thousands of years | certain bristlecone pines are older than the pyramids | e
The orchestra tuned their instruments | the conductor raised her baton | s
Chameleons change color to communicate | cuttlefish flash patterns across their skin to signal one another | m
The website lists local events | it includes reviews of neighborhood restaurants | a
The machine is enormous | it can be operated by a single person | c
The researcher's grant was renewed | she was able to continue her study for three more years | r
Some materials conduct electricity extremely well | copper is widely used in electrical wiring for this reason | e
The volunteers loaded the boxes onto trucks | they delivered the supplies to the shelter | s
Some spiders balloon across long distances on silk threads | dandelion seeds drift for kilometers on the wind | m
The resort offers guided snorkeling trips | it rents kayaks by the hour | a
The instructions were written in English | the tourists managed to follow them with the help of the diagrams | c
The water main burst | the street was closed for two days | r
Some animals sleep in unusual positions | sea otters hold hands while resting on the water | e
The jury heard the final arguments | it began its deliberations | s
Geckos cling to walls using tiny hairs on their feet | tree frogs grip leaves with sticky toe pads | m
The school library extended its hours | it added a quiet study room | a
The recipe calls for expensive saffron | many cooks substitute turmeric for color | c
The coffee harvest was poor | prices at local cafés went up | r
Some ancient tools remain in use today | farmers in many regions still use hand sickles | e
The designer sketched the dress | she chose fabric for the first sample | s
Parrots can live for many decades | some tortoises survive for more than a century | m
The app translates menus | it recommends dishes based on dietary needs | a
The desert looks lifeless during the day | it comes alive with animals at night | c
The airport added a new runway | delays during busy hours decreased | r
Some sculptors work with unusual materials | one artist creates large sculptures entirely out of ice | e
The surgeon reviewed the scans | she explained the procedure to the patient | s
Wolves howl to locate members of their pack | coyotes use yips and howls to keep in contact | m
The farmers market accepts credit cards | it offers discounts to seniors | a
The lighthouse keeper lived alone | he wrote letters to friends nearly every day | c
The pipes froze overnight | the family had no running water until noon | r
Some cities hold festivals celebrating light | one city projects colorful images onto its historic buildings each winter | e
The class dissected the flower | they labeled each part in their notebooks | s
Frogs absorb water through their skin | earthworms breathe through their moist skin | m
The hospital opened a new wing | it hired dozens of additional nurses | a
The book is long | readers say it is hard to put down | c
The local newspaper closed | residents turned to online forums for community news | r
Some plants can grow without soil | many orchids cling to tree bark and absorb moisture from the air | e
The miners reached the underground lake | they sent a camera down to explore it | s
Snakes smell with their tongues | moths detect scents using their antennae | m
The shelter provides meals | it helps residents find permanent housing | a
The stadium is enormous | it empties in less than twenty minutes after a game | c
The software was easy to use | the company spent little on customer support | r
Some scientists study sounds made by plants | researchers have recorded faint clicks from plants under stress | e
The couple renovated the kitchen | they turned the attic into a bedroom | s
Salmon swim upstream to spawn | eels travel across oceans to reach their breeding grounds | m
The museum shop sells replicas of artifacts | it offers books about local history | a
The pianist had small hands | she played pieces that required wide stretches with ease | c
The city banned plastic bags | shoppers began bringing reusable totes | r
Some animals use disguises to hunt | the orchid mantis resembles a flower to attract insects | e
The workers poured the concrete | they smoothed the surface before it hardened | s
Tigers mark their territory with scent | many dogs leave scent markings along their walking routes | m
The newsletter highlights student achievements | it lists upcoming school events | a
The café had only four tables | it became the most popular spot in the neighborhood | c
The trail was widened | wheelchair users could reach the waterfall for the first time | r
Some rocks float on water | pumice is filled with tiny air pockets | e
The committee gathered public comments | it revised the proposal | s
Rain forests produce much of their own rainfall | large lakes influence the weather in the regions around them | m
The company planted trees | it switched its delivery trucks to electric power | a
The mural was painted quickly | its colors and details are remarkably precise | c
The zoo built a larger habitat | the elephants spent more time exploring | r
Many board games are based on ancient games | one popular modern game descends from a race game played thousands of years ago | e
The students drafted a proposal for a bike rack | they presented it to the principal | s
Hermit crabs move into larger shells as they grow | some snails enlarge their shells gradually over time | m
The camp teaches wilderness first aid | it offers a course in map reading | a
The actor had no formal training | critics praised her performance as masterful | c
The river's water level dropped | cargo ships had to carry lighter loads | r
Some birds cannot fly | the ostrich runs at high speeds instead | e
The inspectors examined the elevator | they approved it for public use | s
Whales communicate across long distances | elephants send low-frequency calls that travel for kilometers | m
The public pool offers swimming lessons | it hosts water aerobics classes | a
The ingredients were ordinary | the cake won first prize at the fair | c
The ice storm snapped power lines | thousands of homes lost electricity | r
Some ancient structures still puzzle engineers | builders of one ancient wall fit stones together without mortar so tightly that a blade cannot slip between them | e
The team reviewed the game footage | they adjusted their defensive strategy | s
Fireflies flash light to find mates | some deep-sea fish glow to attract partners | m
The bookstore hosts story time for children | it holds poetry readings on Friday nights | a
The winter was mild | the ski resort made snow to keep its slopes open | c
The subway fare increased | more residents began cycling to work | r
Some plants are toxic to pets | lilies can be dangerous to cats | e
The organizers set up the tents | the vendors arrived with their goods | s
Rabbits thump their feet to warn others of danger | prairie dogs use distinct calls to signal specific predators | m
The course covers personal finance | it includes lessons on building credit | a
The village is tiny | its annual music festival attracts thousands of visitors | c
The new vaccine was widely distributed | cases of the disease dropped dramatically | r
Some fruits keep ripening after being picked | bananas continue to ripen on kitchen counters | e
The pilot announced the descent | the flight attendants collected the trash | s
Sunflowers turn to follow the sun | some leaves shift position to capture more light during the day | m
The hotel offers airport pickup | it has a restaurant that serves regional dishes | a
The data set was huge | the analysis took only a few minutes | c
The school introduced later start times | students reported feeling more alert in class | r
Some jobs have disappeared because of technology | telephone switchboard operators are rarely needed today | e
The scouts built a fire | they cooked dinner over the flames | s
Moles tunnel through soil | earthworms burrow and loosen the ground as they move | m
The organization tutors adults | it helps immigrants prepare for citizenship exams | a
The castle was damaged in the war | its library survived intact | c
The bridge was repainted | its steel will be protected from rust for years | r
Some diseases are spread by insects | mosquitoes can carry malaria | e
The florist trimmed the stems | she arranged the roses in a glass vase | s
Kangaroos carry their young in pouches | opossums carry their babies in pouches as well | m
The app lets users split restaurant bills | it tracks shared household expenses | a
The fossil is incomplete | scientists can still estimate the animal's size | c
The festival moved to a larger park | more food vendors could participate | r
Some everyday objects were invented by children | a young boy invented a popular frozen treat on a stick | e
The builders laid the foundation | they framed the walls of the house | s
Hawks have sharp eyesight for spotting prey | eagles can see small animals from high in the sky | m
The market sells handmade crafts | it offers live music every Saturday | a
The flight was delayed by two hours | the passengers arrived in time for their connections | c
The library installed a book drop | patrons could return books after hours | r
Some sports require very little equipment | soccer can be played with nothing more than a ball | e
The students revised their lab reports | they submitted them to the teacher | s
Bees pollinate flowers while collecting nectar | hummingbirds carry pollen from flower to flower as they feed | m
The ranch offers horseback riding | it hosts cooking classes featuring local beef | a
The theory seemed unlikely at first | later observations confirmed it | c
The factory closed | many workers retrained for jobs in health care | r
Some fabrics are made from plants | linen is woven from fibers of the flax plant | e
The chef tasted the sauce | she added a squeeze of lemon | s
Some fish school together for protection | many birds fly in flocks to confuse predators | m
The website offers practice tests | it explains the answer to every question | a
The phone is lightweight | it is surprisingly durable | c
The snow melted quickly | the rivers rose to flood levels | r
Some cities are built on water | one city has canals instead of streets in its historic center | e
The workers dismantled the old stage | they built a new one in its place | s
Walruses use their tusks to haul themselves onto ice | woodpeckers use their stiff tail feathers to brace against trees | m
The clinic offers vaccinations | it provides hearing tests for children | a
The town has only one traffic light | it rarely experiences traffic jams | r
The mission was risky | the astronauts completed it without serious problems | c
Some foods have been found preserved for centuries | archaeologists have discovered edible honey in ancient tombs | e
The class watched a documentary about volcanoes | they built models of different volcano types | s
Bamboo spreads through underground stems | strawberry plants send out runners to start new plants | m
The festival raises money for local schools | it gives young performers a chance to appear on stage | a
The deadline was approaching | the team worked through the weekend | r
The singer rarely performs live | her concerts sell out within hours | c
Some plants thrive in salty environments | mangroves grow along tropical coastlines in salt water | e
The crew anchored the boat | they dove down to inspect the reef | s
Mushrooms release spores to reproduce | ferns spread by releasing spores from the undersides of their leaves | m
The bank offers free financial workshops | it provides small loans to new businesses | a
The glacier is melting | the lake at its base grows larger each year | r
The route was longer | it avoided the heaviest traffic | c
Some metals are magnetic | iron is strongly attracted to magnets | e
The sisters wrote the script | they filmed the short movie in their backyard | s
Lions live in social groups called prides | meerkats live in cooperative groups called mobs | m
The camp provides all meals | it supplies sleeping bags to campers who need them | a
The tickets were free | the event was fully booked in a day | r
The garden looked bare in winter | its bulbs bloomed brilliantly in spring | c
Some birds use their beaks as tools | certain finches use cactus spines to pry insects from bark | e
The investigators found a clue | they reopened the case | s
Koalas sleep most of the day to save energy | sloths move slowly to conserve their limited energy | m
The hostel offers private rooms | it has a shared kitchen for guests | a
The cave is completely dark | the fish that live there have no eyes | r
The laptop is powerful | it is affordable for most students | c
Some structures are designed to sway | tall skyscrapers bend slightly in strong winds | e
The candidates debated on television | voters went to the polls the following week | s
Pandas spend most of the day eating | cows graze for many hours each day | m
The program pairs students with mentors | it arranges summer internships | a
The rain stopped | the game resumed after a short delay | r
The movie is fictional | it is based on real historical events | c
Some games teach math skills | many card games require players to add quickly | e
The biologists released the rehabilitated hawk | they watched it circle over the valley | s
Horses can sleep standing up | many birds sleep while perched on a single leg | m
The tour includes a boat ride | it stops at a historic lighthouse | a
The wifi signal was weak | the students downloaded the lessons in advance | r
The house is small | its garden is enormous | c
Some foods are fermented to preserve them | cabbage is fermented to make sauerkraut | e
The teacher explained the rules | the students began the game | s
Starlings fly in huge swirling flocks | sardines swim in massive coordinated schools | m
The club cleans local beaches | it teaches children about ocean conservation | a
The lab's equipment was outdated | the results took longer to process | r
The speech was brief | it moved many listeners to tears | c
Some animals hibernate through the winter | ground squirrels sleep for months in underground burrows | e
The founders rented a small office | they hired their first employees | s
Crows remember human faces | some wasps can recognize individual members of their colony | m
The cooperative sells organic produce | it runs a community composting program | a
The bread was baked that morning | it was still warm when customers bought it | r
The comedian seems relaxed on stage | she rehearses every joke for weeks | c
Some writing systems run from right to left | the script used for Hebrew is read in that direction | e
The divers surfaced | they recorded what they had seen | s
Squid squirt ink to escape predators | skunks spray a foul odor to defend themselves | m
The website sells tickets | it offers seating charts for every venue | a
The valley is sheltered from the wind | fruit trees grow well there | r
The watch is decades old | it keeps perfect time | c
Some plants spread by producing sticky seeds | mistletoe seeds stick to birds and are carried to new trees | e
The mayor cut the ribbon | the public poured into the new library | s
Arctic hares have white fur for winter camouflage | ptarmigans grow white feathers in the snowy season | m
The center teaches pottery | it offers classes in painting and drawing | a
"""
