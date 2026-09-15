"""Command of Evidence (textual) hypothesis records, batch 1.
Block format (blank-line separated):
  H: who | hypothesis clause (follows "hypothesize that")
  +: finding that supports it
  -: finding that weakens it
  0: finding that is irrelevant (three of these)
All scenarios are illustrative; no real study is being reported."""

RECORDS = """
H: ecologists | songbirds living near busy roads sing at higher pitches than members of the same species in quiet forests because higher-pitched songs are easier to hear over the low rumble of traffic
+: birds of the species living near busy roads sing noticeably higher-pitched songs than those in quiet forests, and the difference is greatest near the loudest roads
-: birds of the species living near busy roads sing at the same pitches as birds of the species living in quiet forests
0: birds near busy roads sing more often in the early morning than in the afternoon
0: traffic near busy roads is heaviest during weekday rush hours
0: some bird species avoid nesting near roads altogether

H: anthropologists | early farming communities domesticated cats indirectly, because stored grain attracted rodents and cats that hunted those rodents were tolerated by people
+: at early farming settlements, cat remains are found more often near grain storage areas than elsewhere in the settlements
-: cats were already living closely with people in regions where no grain was grown or stored
0: modern house cats spend much of each day sleeping
0: some early farming communities kept dogs for herding livestock
0: wild cats in some regions hunt birds as well as rodents

H: marine biologists | sea otters help kelp forests grow by eating sea urchins, which feed on kelp
+: kelp forests grew denser along stretches of coast after sea otters returned, while urchin numbers there dropped sharply
-: kelp forests grew just as dense along coastlines without sea otters as along coastlines where otters were common, and urchin numbers were similar in both places
0: sea otters use rocks to crack open shellfish
0: kelp can grow more than half a meter in a single day under ideal conditions
0: sea otters have the densest fur of any mammal

H: psychologists | students remember vocabulary words better when they test themselves than when they simply reread the words
+: students who quizzed themselves on a word list recalled significantly more words a week later than students who reread the list for the same amount of time
-: a week after studying, students who reread a word list recalled the same number of words as students who quizzed themselves for the same amount of time
0: most students in the study reported preferring to study in the evening
0: students who studied in groups finished their sessions faster than students who studied alone
0: the word lists included words of varying lengths

H: urban planners | adding protected bike lanes to a street increases the number of people who cycle on that street
+: on streets where protected bike lanes were added, the number of cyclists rose substantially within a year, while cyclist counts on similar streets without new lanes stayed flat
-: cyclist counts rose by the same amount on streets without new bike lanes as on streets where protected lanes were added
0: most cyclists surveyed said they ride for exercise rather than to commute
0: bicycles with electric motors have become more popular in recent years
0: the bike lanes were painted green to make them more visible

H: agricultural scientists | planting clover between rows of corn reduces the amount of fertilizer the corn needs, because clover adds nitrogen to the soil
+: plots with clover between the rows produced corn yields as large as fertilized plots while receiving a third less fertilizer, and their soil contained more nitrogen
-: soil in plots with clover contained no more nitrogen than soil in plots without clover, and corn in clover plots needed just as much fertilizer to reach normal yields
0: clover flowers attract bees and other pollinators
0: corn is grown on every continent except Antarctica
0: the plots were located on a university research farm

H: historians | a medieval town's wealth came mainly from the wool trade
+: tax records from the town list wool merchants as paying far more in taxes than any other group of residents
-: tax records from the town show that wool merchants paid less in taxes than fishermen, bakers, or blacksmiths
0: the town's main church was completed in the thirteenth century
0: many residents of the town kept small gardens behind their homes
0: wool was also produced in several neighboring regions

H: sleep researchers | using a phone or tablet in bed delays sleep because the screens' blue light suppresses the body's production of the sleep hormone melatonin
+: participants who read on tablets before bed had lower melatonin levels and took longer to fall asleep than participants who read printed books, but tablets fitted with blue-light filters caused no such delay
-: participants who read on tablets with blue-light filters took just as long to fall asleep as participants who read on unfiltered tablets, and melatonin levels were the same in both groups
0: participants reported that they enjoyed reading printed books and tablets about equally
0: most participants went to bed between 10 p.m. and midnight
0: tablets have become more affordable over the past decade

H: entomologists | bumblebees prefer to visit flowers that are slightly warmer than their surroundings
+: when given a choice between identical artificial flowers, bumblebees visited heated flowers far more often than unheated ones
-: bumblebees visited heated and unheated artificial flowers equally often, even after many visits
0: bumblebees can fly in cooler weather than many other bees
0: some flowers produce more nectar in the morning than in the afternoon
0: bumblebee colonies are smaller than honeybee colonies

H: economists | a city's new minimum-wage law did not reduce the number of restaurant jobs in the city
+: restaurant employment in the city grew at about the same rate after the law took effect as it did in nearby cities without a new minimum wage
-: restaurant employment in the city fell sharply after the law took effect, while it continued to grow in nearby cities that had not raised their minimum wage
0: restaurant menu prices vary widely across the city
0: many restaurant workers in the city are students
0: the city's population has grown steadily for twenty years

H: geologists | the unusual boulders scattered across a grassy plain were carried there by glaciers
+: the boulders are made of a type of rock found only in mountains hundreds of kilometers to the north, and many of them bear long parallel scratches typical of glacial transport
-: the boulders are made of the same rock as the bedrock directly beneath the plain and show no scratches or other signs of having been moved
0: the grassy plain is home to several species of burrowing owl
0: the largest boulder weighs several hundred tons
0: local farmers have used some of the smaller boulders to build walls

H: nutrition researchers | eating a high-fiber breakfast helps people feel full longer
+: participants who ate a high-fiber breakfast reported feeling full for about two hours longer, on average, than participants who ate a low-fiber breakfast with the same number of calories
-: participants who ate a high-fiber breakfast reported feeling hungry just as soon as participants who ate a low-fiber breakfast with the same number of calories
0: most participants said they usually eat breakfast at home
0: high-fiber cereals are often more expensive than low-fiber cereals
0: participants who drank coffee with breakfast were more alert at midmorning

H: primatologists | young chimpanzees learn to crack nuts with stones mainly by watching adults
+: young chimpanzees in groups where adults cracked nuts began using stones much earlier than young chimpanzees in groups where adults did not
-: young chimpanzees raised without ever seeing adults crack nuts began using stones at the same age as young chimpanzees that watched adults every day
0: chimpanzees eat many kinds of fruit in addition to nuts
0: adult chimpanzees sometimes use sticks to collect termites
0: nut-cracking stones found at some sites are thousands of years old

H: climate scientists | light-colored roofs keep buildings cooler by reflecting sunlight
+: on sunny days, buildings with white roofs had attic temperatures several degrees lower than otherwise identical buildings with black roofs, but on cloudy days the difference disappeared
-: on sunny days, attic temperatures in buildings with white roofs were the same as those in otherwise identical buildings with black roofs
0: white roofing materials are available in several textures
0: the buildings in the study were all built in the 1990s
0: dark roofs melt snow slightly faster in winter

H: linguists | children who grow up speaking two languages are better at switching quickly between tasks
+: in a game requiring players to switch sorting rules rapidly, bilingual children made fewer errors than monolingual children of the same age and background
-: bilingual and monolingual children of the same age and background made the same number of errors in a game requiring them to switch sorting rules rapidly
0: bilingual children in the study most often spoke English and Spanish
0: the task-switching game took about fifteen minutes to complete
0: many schools now offer language classes starting in kindergarten

H: marine ecologists | noise from passing ships causes humpback whales to sing less often
+: humpback whales sang about 40 percent less often in the hours after a ship passed than in the hours before, and their singing returned to normal once the area was quiet again
-: humpback whales sang just as often in the hours after ships passed as in quiet periods with no ships nearby
0: humpback whale songs can last more than twenty minutes
0: ships in the region travel most often during the summer
0: humpback whales migrate thousands of kilometers each year

H: forest ecologists | trees connected by underground fungal networks share nutrients with one another
+: carbon added to one tree was later detected in neighboring trees linked to it by fungal networks, but not in nearby trees without such links
-: carbon added to one tree was never detected in neighboring trees, even those linked to it by fungal networks
0: many forest fungi produce edible mushrooms
0: the oldest trees in the study forest were more than three hundred years old
0: fungal networks are difficult to observe without digging

H: education researchers | reading aloud to young children every day improves their vocabulary
+: children whose parents read aloud to them daily for a year learned significantly more new words than similar children whose parents did not
-: after a year, children whose parents read aloud to them daily knew the same number of words as similar children whose parents did not
0: parents in the study most often chose picture books about animals
0: many children in the study attended preschool three days a week
0: some parents reported that reading aloud helped children fall asleep

H: archaeologists | the residents of an ancient coastal settlement traded with communities far inland
+: many pots found at the settlement were made from a clay that occurs only in river valleys far inland
-: every pot found at the settlement was made from clay dug from the beach directly beside it
0: the settlement's houses were built from stone and driftwood
0: fish bones are the most common animal remains at the site
0: the settlement was abandoned after a severe storm

H: veterinary scientists | dogs can recognize their owners' voices
+: when recordings of voices were played from behind a screen, dogs turned toward their owners' voices far more often than toward the voices of strangers saying the same words
-: dogs turned toward recordings of strangers' voices just as often as they turned toward recordings of their owners saying the same words
0: most dogs in the study were between two and eight years old
0: some breeds of dog bark more often than others
0: dogs in the study were given a treat after each trial

H: hydrologists | restored wetlands reduce flooding in towns downstream
+: after heavy storms, river levels rose more slowly and peaked lower in towns below restored wetlands than in towns below drained farmland
-: after heavy storms, river levels in towns below restored wetlands rose just as quickly and peaked just as high as in towns below drained farmland
0: restored wetlands attract many species of migrating birds
0: some of the drained farmland is used to grow soybeans
0: the region receives most of its rain in the spring

H: neuroscientists | practicing a complex motor skill, such as juggling, can change the structure of the adult brain
+: brain scans showed that regions involved in tracking moving objects grew larger in adults who practiced juggling for three months, but not in adults who did not practice
-: brain scans showed no changes in any brain region among adults who practiced juggling daily for three months
0: most adults in the study had never juggled before
0: juggling is often taught at circus schools
0: participants practiced juggling with three bean bags

H: behavioral economists | shoppers buy more fruit when it is displayed near a store's entrance
+: fruit sales rose in stores that moved their fruit displays to the entrance, while sales stayed the same in similar stores that did not move their displays
-: fruit sales did not change in stores that moved their fruit displays to the entrance
0: the most popular fruit in the stores was bananas
0: the stores in the study were all located in the same city
0: many shoppers said they prefer stores with wide aisles

H: ornithologists | birds that migrate longer distances tend to have longer, narrower wings
+: across several related species, those that migrated the farthest had the longest and narrowest wings relative to their body size
-: across several related species, wing length and shape were unrelated to how far each species migrated
0: some of the species in the study migrate at night
0: many migratory birds gain weight before their journeys
0: the species studied live mainly in forests

H: materials scientists | a new coating made from seaweed slows the spoilage of fresh fruit
+: strawberries coated with the seaweed film stayed fresh about four days longer than uncoated strawberries stored under the same conditions
-: coated and uncoated strawberries stored under the same conditions spoiled at the same rate
0: the seaweed used to make the coating is harvested along rocky coastlines
0: strawberries are among the most popular fruits in many countries
0: the coating is nearly invisible once it dries

H: astronomers | a distant star dims regularly because a planet passes in front of it
+: the star's brightness dips by the same small amount at precisely regular intervals, as expected if an orbiting planet repeatedly blocks part of its light
-: the star's brightness dips at irregular intervals and by amounts that vary greatly from one dip to the next
0: the star is located in a constellation visible mainly in winter
0: the star is slightly larger than the Sun
0: the star was first cataloged more than a century ago

H: public health researchers | a city's ban on smoking in restaurants reduced the number of heart attacks among its residents
+: hospital admissions for heart attacks fell in the year after the ban took effect, while they stayed the same in similar cities without such bans
-: hospital admissions for heart attacks fell by the same amount in similar cities without smoking bans as in the city with the ban
0: the city has more restaurants per person than most cities its size
0: surveys showed that most residents supported the ban
0: the ban did not apply to outdoor patios

H: soil scientists | earthworms improve soil by creating channels that let water soak in
+: after heavy rain, water soaked into soil with many earthworms much faster than into similar soil from which earthworms had been removed
-: after heavy rain, water soaked into soil with many earthworms no faster than into similar soil from which earthworms had been removed
0: earthworms are most active during wet spring months
0: some species of earthworm can grow longer than a meter
0: robins often feed on earthworms

H: sociologists | community gardens increase how often neighbors talk to one another
+: residents reported speaking with neighbors much more often in the year after a community garden opened nearby, while residents of similar neighborhoods without new gardens reported no change
-: residents of neighborhoods where community gardens opened reported speaking with neighbors no more often than before the gardens opened
0: the gardens grew mostly tomatoes, beans, and squash
0: some gardens charged a small yearly fee to rent a plot
0: many of the gardens were built on former parking lots

H: zoologists | giving zoo elephants puzzle feeders makes them more active
+: elephants given puzzle feeders walked several kilometers more each day than they had with ordinary food trays
-: elephants walked the same distance each day whether they were given puzzle feeders or ordinary food trays
0: the zoo's elephants eat mostly hay, fruit, and vegetables
0: puzzle feeders are also used for zoo bears and primates
0: the elephant enclosure was expanded five years ago

H: botanists | a certain desert plant opens its flowers at night to attract moths rather than bees
+: the plant's flowers open only after dark, and cameras recorded moths, but no bees, carrying its pollen
-: cameras recorded bees, but no moths, carrying the plant's pollen, and its flowers remained open throughout the day
0: the plant grows best in sandy soil
0: the desert receives most of its rain in late summer
0: the plant's leaves are covered in fine hairs

H: literary scholars | a nineteenth-century poet revised her poems heavily before publishing them
+: the poet's surviving notebooks contain many drafts of each published poem, with lines crossed out and rewritten several times
-: the poet's surviving notebooks contain only single, unrevised versions of her published poems, identical to the printed texts
0: the poet's collections were popular among readers in several countries
0: the poet often wrote about the changing seasons
0: several of the poet's letters describe trips to the seaside

H: engineers | a new bridge design sways less in strong winds than traditional designs do
+: in wind tunnel tests, a model of the new design swayed far less than models of traditional designs at every wind speed tested
-: in wind tunnel tests, a model of the new design swayed just as much as models of traditional designs at every wind speed tested
0: the new design uses slightly more steel than traditional designs
0: the bridge will cross a river more than a kilometer wide
0: construction of the bridge is expected to take four years

H: ecologists | wolves returning to a national park caused its streams to become healthier by reducing overgrazing by elk
+: after wolves returned, elk spent less time near streams, and willows and other streamside plants that elk had been eating grew back
-: after wolves returned, elk numbers and grazing near streams stayed the same, and streamside plants did not recover
0: wolves in the park live in packs of about ten animals
0: the park attracts millions of visitors each year
0: elk migrate to lower elevations in the winter

H: music researchers | learning to play an instrument improves children's ability to pick out speech in noisy settings
+: after two years of music lessons, children improved more on a test of hearing speech over background noise than similar children who did not take lessons
-: after two years, children who took music lessons performed no better on a test of hearing speech over background noise than similar children who did not take lessons
0: the most popular instrument in the study was the violin
0: many of the children practiced after dinner
0: some of the children also played team sports

H: food scientists | cooking vegetables in a microwave preserves more vitamin C than boiling them
+: broccoli cooked in a microwave retained significantly more vitamin C than broccoli boiled for the same amount of time
-: broccoli cooked in a microwave lost as much vitamin C as broccoli boiled for the same amount of time
0: many people prefer the texture of steamed broccoli
0: vitamin C is also found in citrus fruits
0: microwaves became common in homes in the 1980s

H: developmental psychologists | babies can recognize melodies they heard before birth
+: newborns became calmer and more attentive when they heard a melody their mothers had played regularly during pregnancy than when they heard an unfamiliar melody
-: newborns responded the same way to melodies their mothers had played regularly during pregnancy as they did to unfamiliar melodies
0: most mothers in the study chose classical music
0: newborns sleep for most of the day
0: the melodies were played at a comfortable volume

H: coastal scientists | seagrass meadows reduce shoreline erosion by slowing waves
+: stretches of shoreline behind dense seagrass meadows lost much less sand during storms than nearby stretches with no seagrass, and wave energy measured over the meadows was lower
-: stretches of shoreline behind dense seagrass meadows lost as much sand during storms as nearby stretches with no seagrass
0: seagrass meadows provide food for sea turtles
0: some seagrass species flower underwater
0: the study sites were visited by many recreational boaters

H: ecologists | light pollution disrupts the timing of songbirds' morning songs
+: robins living under bright streetlights began singing much earlier each morning than robins living in dark areas nearby
-: robins living under bright streetlights began singing at the same time each morning as robins living in dark areas nearby
0: robins eat both insects and berries
0: the streetlights in the study were installed in 2010
0: many songbirds sing more in spring than in autumn

H: epidemiologists | regular handwashing at a school reduced student absences caused by illness
+: after the school added handwashing stations and scheduled handwashing breaks, absences due to illness dropped by a quarter, while absences at similar schools did not change
-: absences due to illness at the school stayed the same after handwashing stations and breaks were added
0: the school has about eight hundred students
0: most absences occurred during winter months
0: students voted on the color of the new handwashing stations
"""
