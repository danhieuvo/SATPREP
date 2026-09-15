"""Form, Structure, and Sense atoms, batch 1.
Format: sentence with one {correct|wrong|wrong|wrong} slot ## tag | note
Tags: sva (agreement; note = the subject), tense (note = the time cue), vform (finite vs. nonfinite verb; note = why),
pron (pronoun-antecedent; note = antecedent), poss (possessive/plural; note = owner), case (pronoun case; note = role),
contr (its/it's etc.; note = meaning), mod (modifier placement; note = who performs the action)."""

ITEMS = """
The collection of rare maps that the university acquired last spring {is|are|were|have been} now on display in the main library. ## sva | the singular noun "collection," not "maps"
The flock of geese that nests near the pond each spring {returns|return|are returning|have returned} to the same spot every year. ## sva | the singular noun "flock"
The results of the survey {suggest|suggests|is suggesting|has suggested} that most residents favor the new park. ## sva | the plural noun "results," not "survey"
Each of the paintings in the exhibit {was|were|are|have been} created by an artist under the age of twenty. ## sva | the singular pronoun "each"
Neither the coach nor the players {were|was|is|has been} prepared for the sudden downpour. ## sva | "players," the part of the subject closest to the verb
The number of students enrolled in coding classes {has|have|are|were} doubled over the past five years. ## sva | "the number," which is singular
A number of volunteers {have|has|is|was} already signed up for the cleanup. ## sva | "a number of volunteers," which is plural
The team of engineers working on the bridge {expects|expect|are expecting|have expected} to finish the project by spring. ## sva | the singular noun "team"
The stack of old newspapers in the garage {is|are|were|have been} a fire hazard. ## sva | the singular noun "stack"
Tomatoes, along with basil and garlic, {are|is|has been|was} essential to the chef's signature sauce. ## sva | the plural noun "tomatoes"; the phrase "along with basil and garlic" doesn't change the subject
The committee's recommendations for improving bus service {include|includes|is including|has included} adding routes to the airport. ## sva | the plural noun "recommendations"
Everyone in the choir {practices|practice|are practicing|have practiced} for an hour before each concert. ## sva | the singular pronoun "everyone"
One of the oldest trees in the forest {is|are|were|have been} more than eight hundred years old. ## sva | the singular pronoun "one," not "trees"
The instructions printed on the back of the box {explain|explains|is explaining|has explained} how to assemble the shelf. ## sva | the plural noun "instructions"
There {are|is|was|has been} several reasons the festival moved to a larger park. ## sva | "reasons," which comes after the verb in this inverted sentence
The cost of repairs to the historic theater {has|have|are|were} risen sharply. ## sva | the singular noun "cost"
Among the museum's treasures {is|are|were|have been} a letter written by the town's founder. ## sva | "a letter," which follows the verb in this inverted sentence
The members of the jury {have|has|is|was} reached a verdict. ## sva | the plural noun "members"
Physics, one of the most challenging subjects in the program, {requires|require|are requiring|have required} strong math skills. ## sva | "physics," a singular noun despite its final "s"
The herd of elephants {moves|move|are moving|have moved} slowly toward the river each evening. ## sva | the singular noun "herd"
The benefits of regular exercise {extend|extends|is extending|has extended} far beyond physical health. ## sva | the plural noun "benefits"
Every student and teacher {receives|receive|are receiving|have received} a copy of the handbook. ## sva | a subject joined by "every," which is treated as singular
The quality of the photographs {is|are|were|have been} remarkable for such an old camera. ## sva | the singular noun "quality"
The mountains that surround the valley {protect|protects|is protecting|has protected} it from strong winds. ## sva | the plural noun "mountains"
Either the director or her assistants {review|reviews|is reviewing|has reviewed} each application. ## sva | "assistants," the part of the subject closest to the verb
The list of ingredients for the stew {includes|include|are including|have included} several rare spices. ## sva | the singular noun "list"
The new rules for the tournament {require|requires|is requiring|has required} each team to submit a roster in advance. ## sva | the plural noun "rules"
The sound of waves crashing against the rocks {helps|help|are helping|have helped} many visitors relax. ## sva | the singular noun "sound"
Many of the artifacts discovered at the site {date|dates|is dating|has dated} back more than three thousand years. ## sva | "many," which is plural
Economics {is|are|were|have been} the most popular major at the small college. ## sva | "economics," a singular noun despite its final "s"
The pair of hawks nesting on the office building {has|have|are|were} attracted crowds of birdwatchers. ## sva | the singular noun "pair"
The scientist and her team {have|has|is|was} published their findings in a leading journal. ## sva | a compound subject joined by "and," which is plural
Behind the old barn {stand|stands|is standing|has stood} two enormous oak trees. ## sva | "two enormous oak trees," which follows the verb
The price of concert tickets {varies|vary|are varying|have varied} depending on the seat. ## sva | the singular noun "price"
The students in the advanced class {write|writes|is writing|has written} a research paper each semester. ## sva | the plural noun "students"
The recipe, which calls for three kinds of cheese, {takes|take|are taking|have taken} about an hour to prepare. ## sva | the singular noun "recipe"
Several species of frog found only in this valley {are|is|was|has been} threatened by habitat loss. ## sva | the plural noun "species," modified by "several"
The key to the archive's locked cabinets {was|were|are|have been} missing for weeks. ## sva | the singular noun "key"
Last summer, the volunteers {planted|plant|will plant|are planting} more than two thousand native trees. ## tense | "last summer," which places the action in the past
By the time the rescue team arrived, the storm {had been raging|has raged|raged|will have raged} for nearly two days. ## tense | an action ongoing before another past event ("by the time the rescue team arrived")
Next year, the city {will open|opened|has opened|had opened} a second public library. ## tense | "next year," which places the action in the future
Since 2010, the population of the town {has grown|grew|grows|will grow} by nearly forty percent. ## tense | "since 2010," which describes a change continuing from the past to the present
When the first settlers arrived, the valley {was|is|has been|will be} covered with dense forest. ## tense | "when the first settlers arrived," a past event
The researchers {will present|presented|had presented|have presented} their findings at a conference next month. ## tense | "next month," a future time
Every morning, the baker {opens|opened|had opened|will have opened} the shop at six o'clock. ## tense | "every morning," which describes a habitual present action
In 1869, workers {completed|complete|have completed|will complete} the first railroad across the continent. ## tense | "in 1869," a specific past date
By the end of this year, the school {will have planted|plants|had planted|has planted} a tree for every graduating student. ## tense | "by the end of this year," a future deadline by which the action will be finished
The author {had written|has written|writes|will write} three novels before she turned thirty, but none were published until later. ## tense | an action completed before another past point ("before she turned thirty")
Before the invention of the printing press, scribes {copied|copy|have copied|will copy} books by hand. ## tense | "before the invention of the printing press," a past period
Currently, the museum {is renovating|renovated|had renovated|will have renovated} its east wing. ## tense | "currently," which signals an action in progress now
Two weeks ago, the committee {announced|announces|has announced|will announce} the winners of the essay contest. ## tense | "two weeks ago," a completed past time
Once the paint dries, the workers {will add|added|had added|have added} a second coat. ## tense | "once the paint dries," a future sequence
For the past decade, the orchestra {has performed|performed|performs|will perform} a free concert every July. ## tense | "for the past decade," an action continuing up to the present
While she was studying abroad, Mariana {learned|learns|has learned|will learn} to speak fluent Portuguese. ## tense | "while she was studying abroad," a past period
The comet {will be|was|has been|had been} visible again in about seventy years. ## tense | "in about seventy years," a future time
Yesterday, the ferry {left|leaves|has left|will leave} the harbor twenty minutes late. ## tense | "yesterday," a past time
Scientists {have long debated|long debated|will long debate|had long debate} why some birds migrate at night. ## tense | a debate that began in the past and continues today
After the flood waters receded, residents {began|begin|have begun|will begin} cleaning their homes. ## tense | "after the flood waters receded," a past sequence
The city council voted last week {to fund|funding|funds|funded} a new community garden. ## vform | the phrase after "voted" needs an infinitive ("to fund") to state the purpose of the vote
The goal of the program is {to help|helping to|helps|helped} adults return to school. ## vform | the infinitive "to help," which completes "the goal of the program is"
Researchers studying the ancient manuscript {discovered|discovering|to discover|having discovered} a hidden map. ## vform | the sentence needs a main verb; "discovered" is the only finite verb
The museum, which opened in 1920, {houses|housing|to house|having housed} one of the largest fossil collections in the country. ## vform | the sentence needs a main verb for "the museum"
Hoping to reduce waste, the cafeteria {replaced|replacing|to replace|having replaced} plastic trays with reusable ones. ## vform | the main clause needs a finite verb for "the cafeteria"
The volunteers spent the afternoon {sorting|to sort|sorted|sort} donations at the food bank. ## vform | "spent the afternoon" is followed by an "-ing" form
The author's newest novel, set in a lighthouse on a remote island, {explores|exploring|to explore|having explored} themes of isolation and hope. ## vform | the sentence needs a main verb for "novel"
To prepare for the marathon, the runner {trained|training|to train|having trained} six days a week. ## vform | the main clause needs a finite verb for "the runner"
The architect's plan for the new library, praised by critics for its bold design, {includes|including|to include|having included} a rooftop garden. ## vform | the sentence needs a main verb for "plan"
Many people enjoy {hiking|to hike|hiked|hikes} in the park's quiet northern trails. ## vform | "enjoy" is followed by an "-ing" form
The students decided {to build|building|built|builds} a model of the solar system for the science fair. ## vform | "decided" is followed by an infinitive
A small group of residents, concerned about the plan to close the library, {organized|organizing|to organize|having organized} a petition. ## vform | the sentence needs a main verb for "group"
The purpose of the experiment was {to determine|determining|determines|determined} whether light affects plant growth. ## vform | the infinitive "to determine," which completes "the purpose of the experiment was"
The engineer's design, tested in a wind tunnel for months, {proved|proving|to prove|having proven} remarkably stable. ## vform | the sentence needs a main verb for "design"
The festival, held every summer since 1985, {attracts|attracting|to attract|having attracted} visitors from around the world. ## vform | the sentence needs a main verb for "festival"
When the orchestra finished {its|their|it's|they're} final piece, the audience rose to its feet. ## pron | "the orchestra," a singular noun
Although the museum's two founders disagreed about many things, {they|it|one|he or she} shared a belief that art should be free for everyone. ## pron | "the museum's two founders," a plural noun
The company announced that {its|their|it's|they're} profits had increased for the third straight year. ## pron | "the company," a singular noun
Sea turtles return to the beaches where {they|it|one|he or she} hatched to lay eggs of their own. ## pron | "sea turtles," a plural noun
Each of the girls brought {her|their|they're|there} own lunch to the picnic. ## pron | "each," which is singular and refers to one girl at a time
The committee members presented {their|its|it's|there} proposal at the meeting. ## pron | "the committee members," a plural noun
The river overflowed {its|it's|their|they're} banks after three days of rain. ## pron | "the river," a singular noun
When the scientists reviewed the data, {they|it|she|one} noticed an unexpected pattern. ## pron | "the scientists," a plural noun
The bakery is famous for {its|it's|their|they're} cinnamon rolls. ## pron | "the bakery," a singular noun
The ancient city's walls were so well built that {they|it|this|that} still stand today. ## pron | "walls," a plural noun
The school board postponed {its|their|it's|they're} vote on the new schedule. ## pron | "the school board," a singular noun
Visitors to the park should keep {their|its|it's|there} pets on a leash. ## pron | "visitors," a plural noun
The honeybee colony depends on {its|their|it's|they're} queen to lay eggs. ## pron | "the honeybee colony," a singular noun
The two companies merged, and {their|its|it's|there} combined workforce now exceeds ten thousand. ## pron | "the two companies," a plural noun
The {falcons'|falcon's|falcons|falcons's} nests, built high on the cliffs, are difficult for predators to reach. ## poss | the nests belong to several falcons, so the plural possessive is needed
The {town's|towns|towns'|town} oldest building is a stone mill constructed in 1790. ## poss | one town owns the building, so the singular possessive is needed
All of the {students'|student's|students|students's} projects were displayed in the gym. ## poss | the projects belong to many students
The {children's|childrens'|childrens|children} museum offers hands-on science exhibits. ## poss | "children" is already plural, so it takes 's
The {novel's|novels|novels'|novel} ending surprised even its most devoted readers. ## poss | one novel has the ending
Several {museums|museum's|museums'|museum} in the city offer free admission on Sundays. ## poss | "museums" is simply plural here; nothing belongs to them in this sentence
The {company's|companies|companies'|company} new headquarters will open next spring. ## poss | one company owns the headquarters
The {players|player's|players'|player} gathered around the coach before the final quarter. ## poss | "players" is simply plural; nothing belongs to them in this sentence
The {bees'|bee's|bees|bees's} hive was hidden inside a hollow tree. ## poss | the hive belongs to many bees
The {scientists'|scientist's|scientists|scientists's} findings were published in two separate journals. ## poss | the findings belong to several scientists
The {women's|womens'|womens|woman's} soccer team won the regional championship. ## poss | "women" is already plural, so it takes 's
The {city's|cities|cities'|city} residents voted to preserve the historic square. ## poss | one city's residents
The {farmers|farmer's|farmers'|farmers's} brought their produce to the market early. ## poss | "farmers" is simply plural here; "their produce" shows possession separately
The {bridge's|bridges|bridges'|bridge} cables were replaced after the inspection. ## poss | one bridge has the cables
The {artists'|artist's|artists|artists's} collective shares a studio downtown. ## poss | the collective belongs to several artists
The award was presented to Dana and {me|I|myself|mine} at the ceremony. ## case | the object of the preposition "to," which requires the object pronoun "me"
My brother and {I|me|myself|mine} built the treehouse last summer. ## case | part of the subject, which requires the subject pronoun "I"
The author {who|whom|which|whose} wrote the novel will visit the school next week. ## case | the subject of "wrote," which requires "who"
The mentor to {whom|who|which|whose} she owed her success attended the ceremony. ## case | the object of the preposition "to," which requires "whom"
Between you and {me|I|myself|mine}, the second draft is much stronger. ## case | the object of the preposition "between"
The coach asked Jordan and {her|she|herself|hers} to lead the warm-up drills. ## case | an object of "asked," which requires the object pronoun "her"
The scientist {whose|who's|whom|which} research inspired the project gave the keynote address. ## case | possession (her research), which requires "whose"
The two finalists, Amir and {she|her|herself|hers}, will compete tomorrow. ## case | an appositive renaming the subject "finalists," so it takes the subject form "she"
The dog wagged {its|it's|their|its'} tail when its owner returned. ## contr | the possessive pronoun "its" (the tail belongs to the dog), not "it's," meaning "it is"
{It's|Its|Its'|Its's} likely that the concert will sell out within an hour. ## contr | "it's," a contraction of "it is"
The students left {their|there|they're|they are} backpacks in the classroom. ## contr | the possessive "their"
{They're|Their|There|Theyre} planning to visit the aquarium on Saturday. ## contr | "they're," a contraction of "they are"
The library moved {its|it's|their|its'} rare book collection to a climate-controlled room. ## contr | the possessive pronoun "its"
{Whose|Who's|Whos|Who is} umbrella was left in the hallway? ## contr | the possessive "whose," not "who's," meaning "who is"
Having studied the ancient tablets for more than a decade, {the researcher finally deciphered their meaning|the tablets' meaning was finally deciphered by the researcher|deciphering the tablets' meaning finally happened|the meaning of the tablets finally became clear to the researcher}. ## mod | the researcher, so "the researcher" must come right after the opening phrase
Walking along the beach at sunrise, {Leah spotted a pod of dolphins|a pod of dolphins was spotted by Leah|the dolphins swam close to Leah|the sunrise revealed a pod of dolphins to Leah}. ## mod | Leah, so "Leah" must come right after the opening phrase
Built in 1889, {the tower was once the tallest structure in the world|many visitors consider the tower the city's symbol|engineers once called the tower an impossible project|people once thought the tower was the tallest structure in the world}. ## mod | the tower (it was built), so "the tower" must come right after the opening phrase
After finishing her homework, {Priya went outside to play soccer|soccer was Priya's reward|the soccer game was waiting for Priya|Priya's friends invited her to play soccer}. ## mod | Priya, so "Priya" must come right after the opening phrase
Known for its colorful murals, {the neighborhood attracts many photographers|many photographers visit the neighborhood|photographers are attracted to the neighborhood|the photographers love the neighborhood}. ## mod | the neighborhood (it is known for its murals), so "the neighborhood" must come right after the opening phrase
Determined to finish the race, {the runner ignored the pain in her ankle|the pain in the runner's ankle was ignored|the runner's ankle hurt but was ignored|ignoring the pain was the runner's choice}. ## mod | the runner, so "the runner" must come right after the opening phrase
Covered in snow, {the mountain village looked like a scene from a postcard|visitors thought the mountain village looked like a postcard|we thought the mountain village looked like a postcard|the postcard scene was the mountain village}. ## mod | the village (it was covered in snow), so "the mountain village" must come right after the opening phrase
Using a powerful telescope, {the astronomers identified a new moon|a new moon was identified by the astronomers|the new moon became visible to the astronomers|the discovery of a new moon was made}. ## mod | the astronomers, so "the astronomers" must come right after the opening phrase
Originally designed as a train station, {the building now houses an art museum|an art museum now occupies the building|visitors now see art in the building|the art museum is now in the building}. ## mod | the building (it was designed as a train station), so "the building" must come right after the opening phrase
Excited by the results, {the researchers repeated the experiment|the experiment was repeated by the researchers|the results led the researchers to repeat the experiment|repeating the experiment was the researchers' next step}. ## mod | the researchers, so "the researchers" must come right after the opening phrase
The flowers in the garden behind the old stone house {bloom|blooms|is blooming|has bloomed} every April. ## sva | the plural noun "flowers"
The history of the island's lighthouses {is|are|were|have been} the subject of a new documentary. ## sva | the singular noun "history"
Each of the recipes in the cookbook {was|were|are|have been} tested at least three times. ## sva | the singular pronoun "each"
The walls of the ancient fortress {were|was|is|has been} built from enormous blocks of limestone. ## sva | the plural noun "walls"
Mathematics {is|are|were|have been} often described as the language of science. ## sva | "mathematics," a singular noun despite its final "s"
The committee of teachers and parents {meets|meet|are meeting|have met} on the first Tuesday of every month. ## sva | the singular noun "committee"
The vegetables grown in the school garden {are|is|was|has been} served in the cafeteria. ## sva | the plural noun "vegetables"
Neither of the proposals {addresses|address|are addressing|have addressed} the city's parking shortage. ## sva | the singular pronoun "neither"
The popularity of electric bicycles {has|have|are|were} grown rapidly in recent years. ## sva | the singular noun "popularity"
Here {are|is|was|has been} the photographs from last week's field trip. ## sva | "photographs," which follows the verb in this inverted sentence
The analysis of the rock samples {reveals|reveal|are revealing|have revealed} traces of ancient microorganisms. ## sva | the singular noun "analysis"
The paintings in the east gallery, many of which were donated by local families, {depict|depicts|is depicting|has depicted} scenes from the town's past. ## sva | the plural noun "paintings"
Somebody in the audience {was|were|are|have been} recording the concert on a phone. ## sva | the singular pronoun "somebody"
The fleet of fishing boats {returns|return|are returning|have returned} to the harbor before sunset. ## sva | the singular noun "fleet"
The causes of the fire {remain|remains|is remaining|has remained} unclear. ## sva | the plural noun "causes"
The novel's vivid descriptions of the desert {make|makes|is making|has made} readers feel as if they are there. ## sva | the plural noun "descriptions"
Both the violinist and the pianist {have|has|is|was} performed at the famous concert hall. ## sva | a compound subject joined by "and," which is plural
The supply of fresh water on the island {depends|depend|are depending|have depended} on seasonal rains. ## sva | the singular noun "supply"
The ideas presented in the report {are|is|was|has been} worth considering. ## sva | the plural noun "ideas"
The only thing standing between the team and the championship {is|are|were|have been} two difficult games. ## sva | the singular noun "thing"
The storm's effects on the coastline {were|was|is|has been} visible for months. ## sva | the plural noun "effects"
Few of the original buildings {survive|survives|is surviving|has survived} today. ## sva | "few," which is plural
The discovery of new species in the rain forest {highlights|highlight|are highlighting|have highlighted} the need for conservation. ## sva | the singular noun "discovery"
The clothes in the donation bin {need|needs|is needing|has needed} to be sorted by size. ## sva | the plural noun "clothes"
The group of hikers, exhausted after the long climb, {was|were|are|have been} relieved to reach the summit. ## sva | the singular noun "group"
During the eighteenth century, the port {served|serves|has served|will serve} as a major center of trade. ## tense | "during the eighteenth century," a past period
Last night, the wind {blew|blows|has blown|will blow} so hard that several trees fell. ## tense | "last night," a past time
By 2030, engineers {will have completed|completed|had completed|complete} the new subway line, according to current plans. ## tense | "by 2030," a future deadline
The explorers {had crossed|have crossed|cross|will cross} the desert before the rainy season began. ## tense | an action completed before another past event
Every year since 1990, the festival {has featured|featured|features|will feature} a parade of handmade boats. ## tense | "every year since 1990," which continues into the present
Tomorrow, the students {will visit|visited|had visited|have visited} the state capitol. ## tense | "tomorrow," a future time
In the early 1900s, most homes in the region {lacked|lack|have lacked|will lack} electricity. ## tense | "in the early 1900s," a past period
Right now, the chef {is preparing|prepared|had prepared|will have prepared} a special menu for tonight's dinner. ## tense | "tonight's dinner," an action happening now in preparation for this evening
After years of debate, the council finally {approved|approves|will approve|has been approving} the plan last spring. ## tense | "last spring," a completed past time
The team's new strategy, developed over the off-season, {emphasizes|emphasizing|to emphasize|having emphasized} speed and passing. ## vform | the sentence needs a main verb for "strategy"
The organization works {to protect|protecting|protects|protected} coral reefs from pollution. ## vform | "works" is followed here by an infinitive of purpose
The documentary, filmed over four years on three continents, {follows|following|to follow|having followed} the migration of gray whales. ## vform | the sentence needs a main verb for "documentary"
The volunteers hope {to raise|raising|raised|raises} enough money to repair the playground. ## vform | "hope" is followed by an infinitive
Several residents, worried about traffic near the school, {asked|asking|to ask|having asked} the city to install a crosswalk. ## vform | the sentence needs a main verb for "residents"
The chef recommends {tasting|to tasting|tasted|tastes} the sauce before adding salt. ## vform | "recommends" is followed by an "-ing" form
The inventor's first prototype, built from spare bicycle parts, {was|being|to be|having been} surprisingly effective. ## vform | the sentence needs a main verb for "prototype"
The class plans {to visit|visiting|visited|visits} the planetarium in May. ## vform | "plans" is followed by an infinitive
The new policy, intended to reduce paper waste, {requires|requiring|to require|having required} all forms to be submitted online. ## vform | the sentence needs a main verb for "policy"
The goal of the campaign is {to encourage|encouraging to|encourages|encouraged} residents to recycle. ## vform | the infinitive "to encourage," which completes "the goal of the campaign is"
The team celebrated {its|their|it's|they're} first championship with a parade. ## pron | "the team," a singular noun
The hikers packed extra water because {they|he or she|it|one} expected a hot day. ## pron | "the hikers," a plural noun
The government announced that {it|they|she|these} would expand the national park. ## pron | "the government," a singular noun
The musicians tuned {their|its|his|there} instruments before the concert began. ## pron | "the musicians," a plural noun
The jury delivered {its|their|it's|they're} verdict after two days of deliberation. ## pron | "the jury," a singular noun here, acting as one unit
The city's parks are popular because {they|it|this|that} offer free concerts in the summer. ## pron | "the city's parks," a plural noun
The library received a large donation, which allowed {it|them|they|these} to expand its hours. ## pron | "the library," a singular noun
The oak and the maple dropped {their|its|it's|there} leaves early this year. ## pron | "the oak and the maple," a plural compound
The startup doubled {its|their|it's|they're} staff in a single year. ## pron | "the startup," a singular noun
The {team's|teams|teams'|team} mascot is a bright orange fox. ## poss | one team owns the mascot
The {geese's|geeses|geese|goose's} honking woke the entire campsite. ## poss | "geese" is already plural, so it takes 's
The three {sisters'|sister's|sisters|sisters's} bakery opened downtown last year. ## poss | the bakery belongs to all three sisters
The {mountain's|mountains|mountains'|mountain} peak is covered in snow year-round. ## poss | one mountain has the peak
Most {birds|bird's|birds'|bird} in the region migrate south for the winter. ## poss | "birds" is simply plural; nothing belongs to them
The {people's|peoples|peoples'|persons'} choice award went to a documentary about honeybees. ## poss | "people" is already plural, so it takes 's
The {ship's|ships|ships'|ship} captain ordered the crew to lower the sails. ## poss | one ship has the captain
The {authors'|author's|authors|authors's} contracts were signed on the same day. ## poss | the contracts belong to several authors
The {orchestra's|orchestras|orchestras'|orchestra} conductor has led it for twenty years. ## poss | one orchestra has the conductor
The {volunteers|volunteer's|volunteers'|volunteer} arrived early to set up the tables. ## poss | "volunteers" is simply plural; nothing belongs to them
The teacher gave extra credit to Marcus and {me|I|myself|mine}. ## case | the object of the preposition "to"
Sofia and {he|him|himself|his} designed the winning robot. ## case | part of the subject, which requires "he"
The candidate {who|whom|which|whose} received the most votes will become the class president. ## case | the subject of "received," which requires "who"
The student {whom|who|which|whose} the committee selected will receive a scholarship. ## case | the object of "selected," which requires "whom"
The judges praised both Ana and {him|he|himself|his} for their creativity. ## case | an object of "praised," which requires "him"
The farmer {whose|who's|whom|which} orchard was damaged received help from neighbors. ## case | possession (the farmer's orchard), which requires "whose"
The company updated {its|it's|their|its'} website to include online ordering. ## contr | the possessive pronoun "its"
{There|Their|They're|Theyre} are three bridges crossing the river in town. ## contr | "there," which introduces the existence of something
{Who's|Whose|Whos|Who're} going to lead the tour of the museum? ## contr | "who's," a contraction of "who is"
The hikers set up {their|there|they're|thier} tents near the lake. ## contr | the possessive "their"
Stunned by the view from the summit, {the climbers stood silently for several minutes|several minutes passed in silence for the climbers|the view left the climbers silent|silence fell over the climbers for several minutes}. ## mod | the climbers (they were stunned), so "the climbers" must come right after the opening phrase
Having won three championships in a row, {the team was favored to win again|fans expected the team to win again|a fourth title seemed likely for the team|the team's fans were confident of another win}. ## mod | the team, so "the team" must come right after the opening phrase
Painted in bright shades of blue, {the house stands out on the quiet street|neighbors notice the house on the quiet street|the quiet street is brightened by the house|visitors can easily spot the house}. ## mod | the house (it was painted), so "the house" must come right after the opening phrase
While reviewing the budget, {the treasurer found several errors|several errors were found by the treasurer|errors appeared in the budget|the budget revealed several errors to the treasurer}. ## mod | the treasurer, so "the treasurer" must come right after the opening phrase
Frightened by the thunder, {the puppy hid under the bed|the bed became the puppy's hiding place|thunder made the puppy hide under the bed|hiding under the bed was the puppy's reaction}. ## mod | the puppy (it was frightened), so "the puppy" must come right after the opening phrase
To qualify for the finals, {a swimmer must finish in the top eight|the top eight is where a swimmer must finish|finishing in the top eight is required of swimmers|the top eight swimmers are chosen}. ## mod | a swimmer, so "a swimmer" must come right after the opening phrase
Located at the edge of the desert, {the town depends on water piped from the mountains|water must be piped to the town from the mountains|residents rely on water piped from the mountains|the mountains supply the town with water}. ## mod | the town (it is located at the edge of the desert), so "the town" must come right after the opening phrase
Unable to find her keys, {Keiko searched every pocket of her coat|every pocket of Keiko's coat was searched|the keys were nowhere in Keiko's coat|Keiko's coat pockets were searched one by one}. ## mod | Keiko, so "Keiko" must come right after the opening phrase
"""
