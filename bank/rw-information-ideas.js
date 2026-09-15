/* Reading and Writing: Information and Ideas. All questions are original; data are illustrative. */
(function () {
  const add = o => SAT_BANK.push(Object.assign({ section: 'rw', domain: 'info' }, o));
  const COMPLETE = 'Which choice most logically completes the text?';
  const DATA = 'Which choice most effectively uses data from the table to complete the statement?';

  // ---------- Central Ideas and Details ----------
  add({ id: 'rw-ii-01', skill: 'central-ideas', difficulty: 1,
    passage: `<p>Many public libraries now lend far more than books. In addition to novels and reference works, patrons at some libraries can borrow cake pans, sewing machines, telescopes, and even gardening tools. Librarians say these "libraries of things" let residents try new hobbies without buying expensive equipment they might use only once.</p>`,
    prompt: 'Which choice best states the main idea of the text?',
    choices: [
      'Many libraries have stopped lending books in order to focus on equipment.',
      'Telescopes are the items most often borrowed from public libraries.',
      'Some libraries lend nonbook items that let people try activities without buying costly equipment.',
      'Librarians believe residents should buy their own equipment for hobbies.'
    ], answer: 'C',
    explanation: `The text describes libraries lending items like cake pans and tools so residents can try hobbies without buying equipment: <b>C</b>. The libraries still lend books ("in addition to novels"), no item is called the most borrowed, and D is the opposite of the librarians' point.` });

  add({ id: 'rw-ii-02', skill: 'central-ideas', difficulty: 1,
    passage: `<p>Before refrigerators became common, many households kept food cold with blocks of ice delivered by an iceman. The ice was cut from frozen lakes in winter and stored in thick-walled icehouses packed with sawdust. The sawdust slowed melting so effectively that ice harvested in January could still be sold in August.</p>`,
    prompt: 'According to the text, why were icehouses packed with sawdust?',
    choices: [
      'To keep the ice clean enough to drink',
      'To slow the melting of the stored ice',
      'To make the blocks of ice easier to cut',
      'To reduce the cost of delivering ice to households'
    ], answer: 'B',
    explanation: `The text states directly that "the sawdust slowed melting." The other choices describe purposes the text never mentions.` });

  add({ id: 'rw-ii-03', skill: 'central-ideas', difficulty: 2,
    passage: `<p class="src">The following text is from a novel.</p><p>Grandmother Ruth's garden was not neat. Tomato vines sprawled across the path, sunflowers leaned wherever they pleased, and mint had long ago escaped its bed to wander among the beans. Visitors sometimes offered to help her "tidy things up." Ruth always thanked them and declined. The garden, she said, knew what it was doing.</p>`,
    prompt: 'Which choice best states the main idea of the text?',
    choices: [
      'Ruth is embarrassed by her untidy garden but too proud to accept help.',
      'Ruth\'s garden produces more vegetables than her neighbors\' neat gardens do.',
      'Ruth\'s visitors know more about gardening than she does.',
      'Ruth prefers to let her garden grow freely rather than impose strict order on it.'
    ], answer: 'D',
    explanation: `Ruth politely turns down offers to tidy up and trusts that the garden "knew what it was doing," so she <b>prefers to let it grow freely</b>. Nothing suggests embarrassment, and harvest size and the visitors' expertise are never mentioned.` });

  add({ id: 'rw-ii-04', skill: 'central-ideas', difficulty: 2,
    passage: `<p>Tardigrades, microscopic animals often found in damp moss, can survive conditions that would kill most living things. When their surroundings dry out, they can lose nearly all the water in their bodies and enter a state in which their metabolism slows almost to a stop. In this state they can remain inactive for years. When water returns, many of them resume normal activity within hours.</p>`,
    prompt: 'Which choice best states the main idea of the text?',
    choices: [
      'Tardigrades can survive severe drying by entering a nearly inactive state until water returns.',
      'Tardigrades live only in moss because moss holds more water than other habitats.',
      'Tardigrades need more water to survive than most other animals do.',
      'Tardigrades become active only once every several years.'
    ], answer: 'A',
    explanation: `The text explains how tardigrades survive drying out: they enter a slowed state and revive when water returns (<b>A</b>). They are "often" found in moss, not only there. C contradicts the text, and D confuses their ability to stay inactive with a normal pattern.` });

  add({ id: 'rw-ii-05', skill: 'central-ideas', difficulty: 3,
    passage: `<p>Museums have traditionally displayed objects behind glass, inviting visitors to look but not touch. Some curators now question whether this approach serves every collection well. Tools, instruments, and household objects, they note, were made to be handled; seeing a loom or a violin in a case reveals its shape but little about how it felt to use. These curators have begun offering replicas that visitors can hold and operate, arguing that understanding an object's purpose sometimes requires the hands as well as the eyes.</p>`,
    prompt: 'Which choice best states the main idea of the text?',
    choices: [
      'Museums should stop displaying original objects behind glass.',
      'Some curators believe that handling replicas can help visitors understand objects that were designed to be used.',
      'Replicas are more historically valuable than the objects they copy.',
      'Curators disagree about whether looms or violins are more important to display.'
    ], answer: 'B',
    explanation: `The curators' argument is that objects made for use are better understood by handling replicas: <b>B</b>. A overstates their position. They question whether glass cases serve "every collection well," not whether originals should ever be shown. C and D aren't claims the text makes.` });

  add({ id: 'rw-ii-06', skill: 'central-ideas', difficulty: 3,
    passage: `<p>Economists distinguish between a product's price and its full cost to society. When a factory's production releases pollution, nearby residents may bear expenses, such as medical bills, cleanup, and lost property value, that are not reflected in the price the factory charges its customers. Because those expenses are left out, the product can seem cheaper than it truly is, and people may buy more of it than they would if its full cost were included in the price.</p>`,
    prompt: 'According to the text, why might people buy more of a product whose production causes pollution than they otherwise would?',
    choices: [
      'Because pollution makes the product more useful to customers',
      'Because residents near the factory are paid to use the product',
      'Because the product\'s price does not include some costs that its production places on others',
      'Because factories raise their prices to cover cleanup expenses'
    ], answer: 'C',
    explanation: `The text says the price leaves out costs borne by residents, so the product "can seem cheaper than it truly is," and people buy more: <b>C</b>. D is the opposite: if prices covered cleanup, the full cost would be included.` });

  // ---------- Command of Evidence: Textual ----------
  add({ id: 'rw-ii-07', skill: 'evidence-textual', difficulty: 1,
    passage: `<p>In a short story, the narrator describes her neighbor Mr. Ortiz as someone who is generous with his time.</p>`,
    prompt: 'Which quotation from the story most effectively illustrates the narrator\'s claim?',
    choices: [
      '"Every Saturday, Mr. Ortiz spent the whole morning helping neighbors fix bicycles, leaky faucets, and anything else they brought to his garage, never once asking for payment."',
      '"Mr. Ortiz lived in the blue house at the very end of our street."',
      '"Mr. Ortiz rarely spoke about the years he had spent working overseas."',
      '"His vegetable garden was the most carefully tended on the block."'
    ], answer: 'A',
    explanation: `Spending every Saturday morning helping neighbors for free shows <b>generosity with his time</b>. The other quotations describe where he lives, his privacy, and his garden, none of which involve giving time to others.` });

  add({ id: 'rw-ii-08', skill: 'evidence-textual', difficulty: 1,
    passage: `<p>Researchers hypothesize that songbirds living near busy roads sing at higher pitches than members of the same species living in quiet forests, because higher-pitched songs are easier to hear over the low rumble of traffic.</p>`,
    prompt: 'Which finding, if true, would most directly support the researchers\' hypothesis?',
    choices: [
      'Songbirds near busy roads sing more often in the early morning than in the afternoon.',
      'Traffic noise near busy roads is loudest during weekday rush hours.',
      'Some songbird species avoid nesting near roads altogether.',
      'Songbirds of the species living near busy roads sing noticeably higher-pitched songs than those in quiet forests, and the difference is greatest near the loudest roads.'
    ], answer: 'D',
    explanation: `The hypothesis predicts higher pitch near traffic. <b>D</b> confirms that, and the difference growing with noise supports the explanation too. The other choices don't compare song pitch at all.` });

  add({ id: 'rw-ii-09', skill: 'evidence-textual', difficulty: 2,
    passage: `<p>An urban planner claims that the city's new downtown pedestrian mall was the main reason retail sales downtown rose 12% in the year after the mall opened.</p>`,
    prompt: 'Which finding, if true, would most directly weaken the planner\'s claim?',
    choices: [
      'Many shoppers surveyed on the pedestrian mall said they enjoyed walking without traffic.',
      'The pedestrian mall includes several new benches and fountains.',
      'Retail sales rose by a similar percentage that year in neighborhoods of the city far from the pedestrian mall.',
      'Several stores on the pedestrian mall extended their business hours.'
    ], answer: 'C',
    explanation: `If sales rose just as much in areas <i>without</i> the mall, something citywide, like a strong economy, likely caused the increase. That <b>weakens</b> the claim that the mall was the main reason. A and B are consistent with the claim, and D offers another local factor but doesn't show the mall wasn't responsible.` });

  add({ id: 'rw-ii-10', skill: 'evidence-textual', difficulty: 2,
    passage: `<p>In a novel, the character Theo is portrayed as torn between his longing for adventure and his sense of duty to his family's farm.</p>`,
    prompt: 'Which quotation from the novel most effectively illustrates this claim?',
    choices: [
      '"Theo had worked the fields since he was old enough to carry a bucket."',
      '"At night Theo studied maps of distant coastlines, but each morning he rose before dawn to tend the fields his father could no longer manage alone."',
      '"The farm had belonged to Theo\'s family for four generations."',
      '"Theo\'s sister dreamed of becoming a sailor and often spoke of the sea."'
    ], answer: 'B',
    explanation: `The claim has two sides. <b>B</b> shows both: the maps (longing for adventure) and rising early to help his father (duty). A shows only duty, C is background, and D is about his sister.` });

  add({ id: 'rw-ii-11', skill: 'evidence-textual', difficulty: 3,
    passage: `<p>Some anthropologists propose that early farming communities domesticated cats indirectly rather than deliberately. Stored grain attracted rodents, rodents attracted wild cats, and people tolerated the cats because they controlled pests. Over many generations, the cats least fearful of humans thrived near settlements.</p>`,
    prompt: 'Which finding, if true, would most directly support the anthropologists\' proposal?',
    choices: [
      'At early farming settlements, remains of cats are found more often near grain storage areas than elsewhere in the settlements.',
      'Some early farming communities kept dogs for herding livestock.',
      'Modern house cats spend much of each day sleeping.',
      'Wild cats in regions without farming hunt birds as well as rodents.'
    ], answer: 'A',
    explanation: `The proposal links cats to settlements through grain stores and rodents. Finding cat remains concentrated <b>near grain storage</b> fits that chain directly. Dogs, modern sleep habits, and diets in non-farming regions don't bear on how cats came to live with farmers.` });

  add({ id: 'rw-ii-12', skill: 'evidence-textual', difficulty: 3,
    passage: `<p>A researcher claims that students who take handwritten notes remember lecture content better than students who type their notes. Her explanation is that the slower pace of handwriting forces students to summarize ideas in their own words, which strengthens memory.</p>`,
    prompt: 'Which finding, if true, would most directly weaken the researcher\'s explanation?',
    choices: [
      'Students who typed notes recorded more total words than students who handwrote notes.',
      'Students who typed notes but were told to summarize in their own words remembered as much as students who handwrote notes.',
      'Students who handwrote notes reported that handwriting felt slower than typing.',
      'Students who handwrote notes remembered more content even when their notes were nearly word-for-word copies of what the lecturer said.'
    ], answer: 'D',
    explanation: `The explanation depends on summarizing. If handwriters still remember more when they <i>didn't</i> summarize (their notes were word-for-word), summarizing can't be the reason: <b>D</b> weakens it. B actually <i>supports</i> the explanation by showing that summarizing is what matters. A and C are consistent with it.` });

  // ---------- Command of Evidence: Quantitative ----------
  add({ id: 'rw-ii-13', skill: 'evidence-quant', difficulty: 1,
    passage: `<table><caption>Average Daily Visitors to Riverside Park</caption>
      <tr><th>Season</th><th>Visitors per day</th></tr>
      <tr><td>Spring</td><td>1,250</td></tr><tr><td>Summer</td><td>2,100</td></tr>
      <tr><td>Fall</td><td>1,400</td></tr><tr><td>Winter</td><td>450</td></tr></table>
      <p>A city parks department recorded the average number of daily visitors to Riverside Park in each season of one year. The department's report noted that attendance was highest in ______</p>`,
    prompt: DATA,
    choices: [
      'spring, when the park averaged 1,250 visitors per day.',
      'fall, when the park averaged 1,400 visitors per day.',
      'summer, when the park averaged 2,100 visitors per day.',
      'winter, when the park averaged 450 visitors per day.'
    ], answer: 'C',
    explanation: `The largest value in the table is 2,100, in <b>summer</b>. Every choice quotes the table accurately, but only C matches "highest."` });

  add({ id: 'rw-ii-14', skill: 'evidence-quant', difficulty: 1,
    passage: `<table><caption>Preferred Study Location (200 students surveyed)</caption>
      <tr><th>Location</th><th>Number of students</th></tr>
      <tr><td>Home</td><td>88</td></tr><tr><td>Library</td><td>64</td></tr>
      <tr><td>Coffee shop</td><td>30</td></tr><tr><td>Other</td><td>18</td></tr></table>
      <p>A student surveyed 200 classmates about where they prefer to study and claims that home is the most popular study location among the classmates surveyed.</p>`,
    prompt: 'Which choice best describes data from the table that support the student\'s claim?',
    choices: [
      'More students chose the library than chose a coffee shop.',
      'Of the 200 students, 88 chose home, more than chose any other location.',
      'Fewer students chose "other" than chose a coffee shop.',
      'More students chose home than chose the library and a coffee shop combined.'
    ], answer: 'B',
    explanation: `"Most popular" means chosen by more students than any other option, and 88 is the largest count: <b>B</b>. D is inaccurate, since 64 + 30 = 94, which is more than 88. A and C are true but say nothing about home.` });

  add({ id: 'rw-ii-15', skill: 'evidence-quant', difficulty: 2,
    passage: `<table><caption>Crop Yield on Test Plots (kilograms)</caption>
      <tr><th>Treatment</th><th>Year 1</th><th>Year 2</th></tr>
      <tr><td>No fertilizer</td><td>410</td><td>405</td></tr>
      <tr><td>Fertilizer A</td><td>470</td><td>430</td></tr>
      <tr><td>Fertilizer B</td><td>455</td><td>460</td></tr></table>
      <p>An agricultural researcher tested two fertilizers on identical plots over two years. She noted that although Fertilizer A produced the higher yield in Year 1, Fertilizer B may be the better long-term choice, since ______</p>`,
    prompt: DATA,
    choices: [
      'Fertilizer A produced 470 kilograms in Year 1, the highest yield in the table.',
      'the plot with no fertilizer declined only slightly, from 410 to 405 kilograms.',
      'both fertilizers produced higher yields than the plot with no fertilizer in Year 1.',
      'the yield with Fertilizer B rose from 455 to 460 kilograms, while the yield with Fertilizer A fell from 470 to 430 kilograms.'
    ], answer: 'D',
    explanation: `A "long-term" advantage for B needs a trend over time that favors B. <b>D</b> shows B's yield rising while A's fell. A actually supports Fertilizer A, and B and C don't distinguish between the two fertilizers.` });

  add({ id: 'rw-ii-16', skill: 'evidence-quant', difficulty: 2,
    passage: `<table><caption>Households Owning an Electric Vehicle, by Region</caption>
      <tr><th>Region</th><th>2020</th><th>2024</th></tr>
      <tr><td>North</td><td>3%</td><td>9%</td></tr><tr><td>South</td><td>2%</td><td>5%</td></tr>
      <tr><td>East</td><td>4%</td><td>8%</td></tr><tr><td>West</td><td>6%</td><td>11%</td></tr></table>
      <p>A transportation analyst claims that, in relative terms, electric vehicle ownership grew fastest in the North between 2020 and 2024.</p>`,
    prompt: 'Which choice best describes data from the table that support the analyst\'s claim?',
    choices: [
      'In the North, the share of households rose from 3% to 9%, tripling, which is a larger relative increase than in any other region.',
      'In the West, the share of households rose from 6% to 11%, the highest share of any region in 2024.',
      'In the East, the share of households doubled, rising from 4% to 8%.',
      'In the South, the share of households in 2024 was lower than in any other region.'
    ], answer: 'A',
    explanation: `"Relative" growth compares each region's ending share to its starting share: North ×3, South ×2.5, East ×2, West ×1.83. The North's tripling is the largest: <b>A</b>. B describes the highest 2024 <i>level</i>, not the fastest growth.` });

  add({ id: 'rw-ii-17', skill: 'evidence-quant', difficulty: 3,
    passage: `<table><caption>Average Reading Scores Before and After Summer</caption>
      <tr><th>Group</th><th>Students</th><th>Before</th><th>After</th></tr>
      <tr><td>Reading program</td><td>40</td><td>62</td><td>74</td></tr>
      <tr><td>No program</td><td>38</td><td>61</td><td>66</td></tr></table>
      <p>Researchers compared students who took part in a summer reading program with similar students who did not. They concluded that the program likely contributed to improved scores, since ______</p>`,
    prompt: DATA,
    choices: [
      'students in the program had an average score of 74 after the summer.',
      'both groups had similar average scores before the summer began.',
      'students in the program improved by an average of 12 points, compared with 5 points for students who were not in the program.',
      'slightly more students took part in the program than did not.'
    ], answer: 'C',
    explanation: `To credit the program, you need to show its students <i>gained more</i> than comparable students: 74 − 62 = 12 versus 66 − 61 = 5 (<b>C</b>). A gives only one group's final score. B shows the groups started out comparable, which is useful context but not evidence of the program's effect.` });

  add({ id: 'rw-ii-18', skill: 'evidence-quant', difficulty: 3,
    passage: `<table><caption>Butterflies Counted at a Monitoring Site (millions)</caption>
      <tr><th>Year</th><th>2018</th><th>2019</th><th>2020</th><th>2021</th><th>2022</th></tr>
      <tr><td>Count</td><td>4.2</td><td>3.1</td><td>3.5</td><td>2.4</td><td>2.9</td></tr></table>
      <p>An ecologist notes that the butterfly population at the site has declined overall despite occasional increases from one year to the next.</p>`,
    prompt: 'Which choice most effectively uses data from the table to support the ecologist\'s statement?',
    choices: [
      'The population was 3.5 million in 2020, higher than in 2019.',
      'The population fell from 4.2 million in 2018 to 2.9 million in 2022, even though it rose from 2019 to 2020 and from 2021 to 2022.',
      'The population reached its lowest level, 2.4 million, in 2021.',
      'The population rose from 2.4 million in 2021 to 2.9 million in 2022.'
    ], answer: 'B',
    explanation: `The statement has two parts: an overall decline <i>and</i> occasional increases. Only <b>B</b> supports both. A and D show only increases, and C shows only a low point.` });

  // ---------- Inferences ----------
  add({ id: 'rw-ii-19', skill: 'inferences', difficulty: 1,
    passage: `<p>Lena planted identical tomato seedlings in two garden beds and watered both beds equally. Bed A received six hours of direct sunlight each day, while Bed B, shaded by a fence, received only two. By midsummer, the plants in Bed A were taller and had produced more fruit than those in Bed B. These results suggest that ______</p>`,
    prompt: COMPLETE,
    choices: [
      'watering tomato plants too often reduces how much fruit they produce.',
      'the fence released substances that were harmful to the tomato plants.',
      'tomato plants grow best when they receive about two hours of sunlight each day.',
      'the amount of sunlight the plants received likely affected their growth.'
    ], answer: 'D',
    explanation: `Watering was the same in both beds. The main difference was sunlight, and the sunnier bed did better, so sunlight likely <b>affected growth</b>. C reverses the result, and nothing supports A or B.` });

  add({ id: 'rw-ii-20', skill: 'inferences', difficulty: 1,
    passage: `<p>Most residents of a small town get their local news from the town newspaper, which is published only on Thursdays. The town council announced a change to the recycling pickup day on a Friday, and the change took effect the following Monday. Council members were surprised when many residents put out their recycling on the old day. The confusion most likely occurred because ______</p>`,
    prompt: COMPLETE,
    choices: [
      'many residents disagreed with the council\'s decision.',
      'most residents would not have seen the announcement in the newspaper before the change took effect.',
      'the newspaper refused to print the council\'s announcement.',
      'recycling had never before been collected in the town.'
    ], answer: 'B',
    explanation: `An announcement on Friday wouldn't appear in the Thursday paper until <i>after</i> Monday's change. Residents who rely on the paper <b>wouldn't have seen it in time</b>. There's no evidence of disagreement or a refusal to print it.` });

  add({ id: 'rw-ii-21', skill: 'inferences', difficulty: 2,
    passage: `<p>Historians studying a merchant's letters from the 1700s noticed that he wrote often about the price of cloth in various port cities but almost never mentioned the price of grain, even though his ships regularly carried both goods. The letters also reveal that trusted partners in each port handled the sale of his grain, while he negotiated cloth sales himself. This suggests that ______</p>`,
    prompt: COMPLETE,
    choices: [
      'the merchant had less need to follow grain prices closely because others managed those sales.',
      'grain was far more valuable than cloth during the 1700s.',
      'the merchant\'s partners were dishonest about the price of grain.',
      'the merchant\'s ships stopped carrying grain partway through the century.'
    ], answer: 'A',
    explanation: `The merchant wrote about the goods he sold himself (cloth). Partners handled grain, so he <b>had less reason to track grain prices</b>. The text says his ships regularly carried grain, and it gives no evidence about value or dishonesty.` });

  add({ id: 'rw-ii-22', skill: 'inferences', difficulty: 2,
    passage: `<p>Some desert frogs survive long dry seasons by burrowing underground and forming a waterproof cocoon from layers of shed skin. They stay inactive inside the cocoon until heavy rain softens the soil above them. After a year with unusually light rainfall, researchers monitoring one population saw far fewer frogs above ground than usual. The researchers suggested that ______</p>`,
    prompt: COMPLETE,
    choices: [
      'the frogs had moved to a region that received more rainfall.',
      'the frogs\' cocoons had stopped being waterproof.',
      'many of the frogs may have remained in their cocoons because the rain was not heavy enough to soften the soil.',
      'heavy rain interferes with the frogs\' ability to form cocoons.'
    ], answer: 'C',
    explanation: `The frogs emerge only after <i>heavy</i> rain softens the soil. In a light-rain year, the most logical explanation based on the text is that <b>many stayed in their cocoons</b>. Nothing suggests they migrated, and B and D aren't supported.` });

  add({ id: 'rw-ii-23', skill: 'inferences', difficulty: 3,
    passage: `<p>In a study of problem solving, participants worked on logic puzzles either alone or in pairs. Pairs solved more puzzles correctly than individuals did, but they took longer to reach each solution. Recordings of the pairs showed that most of the extra time was spent discussing, and then rejecting, incorrect approaches that one partner had initially proposed. These findings suggest that ______</p>`,
    prompt: COMPLETE,
    choices: [
      'individuals would solve more puzzles than pairs if both were given unlimited time.',
      'discussing ideas with a partner makes people less confident in their own reasoning.',
      'pairs worked slowly mainly because partners rarely agreed with each other.',
      'working in pairs may improve accuracy partly because partners catch each other\'s errors before settling on an answer.'
    ], answer: 'D',
    explanation: `Pairs were more accurate, and their extra time went to rejecting incorrect approaches. In other words, partners <b>caught errors</b>. The study says nothing about unlimited time or confidence, and pairs did eventually agree on correct solutions.` });

  add({ id: 'rw-ii-24', skill: 'inferences', difficulty: 3,
    passage: `<p>Glaciers carve broad U-shaped valleys, while rivers typically carve narrower V-shaped valleys. In a mountain range with no glaciers today, geologists observed several broad U-shaped valleys. They also found large boulders made of a type of rock that does not occur naturally anywhere in the range but is common in mountains 200 kilometers to the north. Taken together, these observations suggest that ______</p>`,
    prompt: COMPLETE,
    choices: [
      'glaciers once covered the range and may have carried the boulders there from the north.',
      'rivers in the range once flowed much faster than they do today.',
      'the U-shaped valleys formed more recently than any V-shaped valleys in the range.',
      'the rock in the boulders originally formed within the range and later eroded away.'
    ], answer: 'A',
    explanation: `U-shaped valleys point to past glaciers, and boulders from far away suggest something moved them. Glaciers can do both, so <b>A</b> accounts for both observations. B would predict V-shaped valleys, and D contradicts the statement that the rock doesn't occur in the range.` });
})();
