/* Reading and Writing: Craft and Structure. All questions are original. */
(function () {
  const add = o => SAT_BANK.push(Object.assign({ section: 'rw', domain: 'craft' }, o));
  const WIC = 'Which choice completes the text with the most logical and precise word or phrase?';

  // ---------- Words in Context ----------
  add({ id: 'rw-cs-01', skill: 'words-in-context', difficulty: 1,
    passage: `<p>Although the new bridge design looked fragile in early sketches, the engineers insisted it was ______: computer models showed it could withstand winds far stronger than any ever recorded in the region.</p>`,
    prompt: WIC, choices: ['temporary', 'ornate', 'sturdy', 'affordable'], answer: 'C',
    explanation: `The colon signals that the second half explains the blank. A bridge that can withstand extremely strong winds is <b>sturdy</b>, which also contrasts with "looked fragile." Nothing in the text concerns cost, decoration, or how long the bridge will stand.` });

  add({ id: 'rw-cs-02', skill: 'words-in-context', difficulty: 1,
    passage: `<p>Scientists who study coral reefs often work at night, because many reef animals, such as certain shrimp and eels, are ______: they hide in crevices during the day and emerge to feed after dark.</p>`,
    prompt: WIC, choices: ['migratory', 'colorful', 'nocturnal', 'venomous'], answer: 'C',
    explanation: `Animals that hide during the day and are active after dark are <b>nocturnal</b>. That is also why scientists would need to work at night. Migration, color, and venom are not described.` });

  add({ id: 'rw-cs-03', skill: 'words-in-context', difficulty: 1,
    passage: `<p>The town council's decision to close the public library on weekends was ______ by residents, hundreds of whom attended the next council meeting to demand that the original hours be restored.</p>`,
    prompt: WIC, choices: ['celebrated', 'criticized', 'ignored', 'predicted'], answer: 'B',
    explanation: `Residents demanded that the old hours be restored, so they disapproved of the decision: they <b>criticized</b> it. "Celebrated" is the opposite, and hundreds of people showing up rules out "ignored."` });

  add({ id: 'rw-cs-04', skill: 'words-in-context', difficulty: 1,
    passage: `<p>In her memoir, the chef describes her grandmother's kitchen as the place where her love of cooking first ______, long before she attended culinary school or opened her own restaurant.</p>`,
    prompt: WIC, choices: ['ended', 'weakened', 'repeated', 'emerged'], answer: 'D',
    explanation: `"First" and "long before" point to a beginning: her love of cooking <b>emerged</b> in that kitchen. "Ended" and "weakened" don't fit a love that went on to shape her career, and "repeated" makes no sense with "first."` });

  add({ id: 'rw-cs-05', skill: 'words-in-context', difficulty: 1,
    passage: `<p>Because the trail's final section is steep and covered in loose rock, park rangers ______ visitors to wear sturdy boots and carry plenty of water before attempting it.</p>`,
    prompt: WIC, choices: ['advise', 'prevent', 'doubt', 'discourage'], answer: 'A',
    explanation: `Rangers recommending safety measures for a difficult trail <b>advise</b> visitors to take them. "Discourage visitors to wear boots" would mean the opposite of what the context suggests, and "prevent" and "doubt" don't work in the sentence.` });

  add({ id: 'rw-cs-06', skill: 'words-in-context', difficulty: 2,
    passage: `<p>Early reviewers dismissed the novelist's first book as ______, complaining that its plot borrowed heavily from familiar adventure stories and offered readers few surprises.</p>`,
    prompt: WIC, choices: ['provocative', 'derivative', 'meticulous', 'ambiguous'], answer: 'B',
    explanation: `A work that borrows heavily from existing stories and offers few surprises is <b>derivative</b>, meaning it copies earlier works. "Provocative" would mean surprising or challenging, which is the opposite. "Meticulous" is a compliment, and nothing suggests the plot was unclear ("ambiguous").` });

  add({ id: 'rw-cs-07', skill: 'words-in-context', difficulty: 2,
    passage: `<p>Honeybee colonies can ______ extreme winter cold by clustering tightly together and vibrating their flight muscles, which generates enough heat to keep the center of the cluster warm.</p>`,
    prompt: WIC, choices: ['endure', 'invite', 'measure', 'intensify'], answer: 'A',
    explanation: `The bees generate heat to stay warm, which is how they survive the cold. To <b>endure</b> something is to survive or withstand it. The bees don't invite, measure, or intensify the cold.` });

  add({ id: 'rw-cs-08', skill: 'words-in-context', difficulty: 2,
    passage: `<p>The historian argues that the printing press did not simply ______ existing ways of sharing knowledge in fifteenth-century Europe; instead, it transformed them, making possible entirely new forms of scholarship and debate.</p>`,
    prompt: WIC, choices: ['conceal', 'reject', 'accelerate', 'imitate'], answer: 'C',
    explanation: `"Did not simply ___; instead, it transformed them" contrasts a smaller effect with a bigger one. <b>Accelerate</b> (speed up) is that smaller effect: the press did more than make old methods faster. "Conceal" and "reject" aren't modest versions of transforming something.` });

  add({ id: 'rw-cs-09', skill: 'words-in-context', difficulty: 2,
    passage: `<p>Although the sculptor is best known for her monumental public works, her smaller pieces reveal a ______ attention to detail: individual strands of hair and the texture of fabric are carved with remarkable care.</p>`,
    prompt: WIC, choices: ['reluctant', 'superficial', 'sporadic', 'painstaking'], answer: 'D',
    explanation: `Carving individual strands of hair "with remarkable care" shows <b>painstaking</b> (extremely careful) attention to detail. "Superficial" and "sporadic" contradict "remarkable care," and nothing suggests reluctance.` });

  add({ id: 'rw-cs-10', skill: 'words-in-context', difficulty: 2,
    passage: `<p>Some economists caution that a single year of rising wages is too brief a period from which to draw firm conclusions; they argue that the trend must ______ for several more years before it can be considered a lasting change.</p>`,
    prompt: WIC, choices: ['persist', 'reverse', 'originate', 'fluctuate'], answer: 'A',
    explanation: `For a trend to count as "a lasting change," it has to continue, or <b>persist</b>. If it reversed or fluctuated, that would undercut a lasting change, and the trend has already originated.` });

  add({ id: 'rw-cs-11', skill: 'words-in-context', difficulty: 3,
    passage: `<p>The committee's report was notably ______: rather than recommending a specific course of action, it laid out the advantages and drawbacks of each proposal and left the final decision to the board.</p>`,
    prompt: WIC, choices: ['inflammatory', 'noncommittal', 'conciliatory', 'premature'], answer: 'B',
    explanation: `A report that avoids recommending any option is <b>noncommittal</b>: it doesn't commit to a position. "Inflammatory" (provoking anger) and "conciliatory" (trying to make peace) describe tones the text never mentions, and nothing suggests the report came too early.` });

  add({ id: 'rw-cs-12', skill: 'words-in-context', difficulty: 3,
    passage: `<p>Critics who describe the composer's late symphonies as a sharp break from her earlier work may be overstating the case. Close study of her notebooks shows that many of the late works' signature techniques were ______ in pieces she wrote decades earlier, though they were used only sparingly there.</p>`,
    prompt: WIC, choices: ['repudiated', 'perfected', 'anticipated', 'obscured'], answer: 'C',
    explanation: `The author argues that the late style was <i>not</i> a sharp break, so the techniques must have appeared in some early form: the earlier pieces <b>anticipated</b> them. "Perfected" clashes with "used only sparingly," and "repudiated" (rejected) would support the critics' view instead.` });

  add({ id: 'rw-cs-13', skill: 'words-in-context', difficulty: 3,
    passage: `<p>Many plants in fire-prone grasslands are not merely tolerant of periodic burning but in some sense ______ it: without regular fires, taller shrubs crowd them out, and the seeds of several species will not sprout unless exposed to smoke.</p>`,
    prompt: WIC, choices: ['indifferent to', 'threatened by', 'resistant to', 'reliant on'], answer: 'D',
    explanation: `"Not merely tolerant ... but" calls for something stronger than tolerance. The colon explains that the plants actually need fire to avoid being crowded out and to sprout, so they are <b>reliant on</b> it. "Resistant to" is roughly the same as tolerant, and "threatened by" contradicts the explanation.` });

  add({ id: 'rw-cs-14', skill: 'words-in-context', difficulty: 3,
    passage: `<p>Although the diplomat's memoir is often praised for its candor, some historians find its account of her early negotiations ______, noting that it omits several meetings documented in government archives and minimizes the author's own missteps.</p>`,
    prompt: WIC, choices: ['selective', 'exuberant', 'redundant', 'prophetic'], answer: 'A',
    explanation: `An account that leaves out documented meetings and downplays the author's mistakes includes only some of the facts: it is <b>selective</b>. "Although ... praised for its candor" sets up this contrast. Omitting material is the opposite of redundant, and nothing concerns emotion or predictions.` });

  // ---------- Text Structure and Purpose ----------
  add({ id: 'rw-cs-15', skill: 'text-structure', difficulty: 1,
    passage: `<p>Sea otters often float on their backs while eating, using their chests as tables. When an otter catches a clam or sea urchin, it may also pick up a rock from the seafloor. Floating at the surface, the otter strikes the shell against the rock again and again until the shell cracks open. Researchers consider this behavior one of the clearest examples of tool use among marine mammals.</p>`,
    prompt: 'Which choice best states the main purpose of the text?',
    choices: [
      'To compare the diets of sea otters with those of other marine mammals',
      'To describe a behavior that sea otters use to get food',
      'To explain why sea otters spend most of their time floating on their backs',
      'To argue that researchers have overestimated how often sea otters use tools'
    ], answer: 'B',
    explanation: `Almost the whole text describes how otters use rocks to open shellfish, so its purpose is to <b>describe a food-getting behavior</b>. No other animals' diets are compared, the text never says otters float "most of the time," and it doesn't dispute researchers.` });

  add({ id: 'rw-cs-16', skill: 'text-structure', difficulty: 1,
    passage: `<p class="src">The following text is from a short story.</p><p>Mara had rehearsed the speech a dozen times in front of her bedroom mirror. She knew every pause and every gesture. But as she stepped onto the auditorium stage and looked out at the rows of faces, the words she had memorized seemed to scatter like startled birds. She gripped the podium and took a slow breath.</p>`,
    prompt: 'Which choice best describes the overall structure of the text?',
    choices: [
      'It contrasts a character\'s confidence with the nervousness of her audience.',
      'It introduces a character\'s fear of public speaking and then explains how she overcame it.',
      'It describes an auditorium and then recounts the history of the event taking place there.',
      'It describes a character\'s careful preparation and then presents a moment when that preparation seems to fail her.'
    ], answer: 'D',
    explanation: `The first two sentences show Mara's rehearsal, and "But" turns to the moment her memorized words "scatter." That matches <b>D</b>. The text ends before she overcomes anything, it never describes the audience's feelings, and it gives no history.` });

  add({ id: 'rw-cs-17', skill: 'text-structure', difficulty: 2,
    passage: `<p>For decades, many astronomers assumed that planets orbiting red dwarf stars would be poor places for life, because these small stars frequently release powerful flares of radiation. <u>Recent modeling, however, suggests that a planet with a thick atmosphere and a strong magnetic field could be shielded from much of this radiation.</u> If so, the most common type of star in our galaxy might host far more habitable worlds than once thought.</p>`,
    prompt: 'Which choice best describes the function of the underlined sentence in the text as a whole?',
    choices: [
      'It offers an example that supports the assumption described in the previous sentence.',
      'It explains why red dwarf stars are the most common type of star in the galaxy.',
      'It presents a finding that challenges the assumption described in the previous sentence.',
      'It describes a method that astronomers use to detect planets around red dwarf stars.'
    ], answer: 'C',
    explanation: `The first sentence gives an old assumption (red dwarf planets are poor for life). "However" signals that the underlined sentence <b>challenges</b> it with new modeling. It doesn't support the assumption, explain why red dwarfs are common, or describe a detection method.` });

  add({ id: 'rw-cs-18', skill: 'text-structure', difficulty: 2,
    passage: `<p>Community gardens are usually valued as sources of fresh, affordable produce. Yet when gardeners are asked what they value most, many describe something else. Participants frequently mention meeting neighbors they had never spoken to before, and some say their gardens have become gathering places for celebrations and informal meetings. For these residents, the harvest may matter less than the connections the garden helps create.</p>`,
    prompt: 'Which choice best states the main purpose of the text?',
    choices: [
      'To suggest that community gardens offer social benefits beyond the food they produce',
      'To argue that community gardens produce less food than their supporters claim',
      'To describe the process of establishing a community garden',
      'To explain why many residents are reluctant to join community gardens'
    ], answer: 'A',
    explanation: `The text moves from the usual view (gardens provide produce) to "something else": meeting neighbors and gathering together. Its point is that gardens have <b>social benefits beyond food</b>. It never says the gardens produce less food than claimed, describes how to set one up, or mentions reluctance to join.` });

  add({ id: 'rw-cs-19', skill: 'text-structure', difficulty: 2,
    passage: `<p class="src">The following text is from a novel.</p><p>Ever since the factory closed, the town had grown quiet in a way that unsettled Elena. The corner where workers once gathered at dawn stood empty. One by one, the shops on Main Street put up hand-lettered signs: CLOSED MONDAYS, then CLOSED WEEKDAYS, then simply CLOSED. Still, each morning Elena unlocked the door of her bakery at six, set out the bread, and waited.</p>`,
    prompt: 'Which choice best states the main purpose of the text?',
    choices: [
      'To explain the economic causes of a factory\'s closing',
      'To describe how a character\'s bakery became the most popular shop in town',
      'To suggest that a character regrets opening a business in a small town',
      'To depict a town\'s decline and a character\'s persistence in spite of it'
    ], answer: 'D',
    explanation: `The empty corner and the worsening signs show the town's <b>decline</b>. "Still, each morning" shows Elena <b>persisting</b>. The text never explains why the factory closed, never says the bakery is popular, and gives no sign that Elena regrets anything.` });

  add({ id: 'rw-cs-20', skill: 'text-structure', difficulty: 3,
    passage: `<p>Textile scholars have often assumed that the intricate star patterns found in one region's nineteenth-century quilts were copied from pattern books sold in distant cities. <u>A recent survey of dated quilts complicates this account.</u> Several quilts featuring the star patterns were completed a decade or more before any known pattern book included the designs. The patterns may therefore have originated with rural quilters themselves and only later been adopted by publishers.</p>`,
    prompt: 'Which choice best describes the function of the underlined sentence in the text as a whole?',
    choices: [
      'It restates the assumption presented in the previous sentence in more specific terms.',
      'It indicates that the assumption presented in the previous sentence may be inaccurate.',
      'It explains why pattern books were popular among quilters in cities.',
      'It concedes that the survey\'s findings are less reliable than earlier scholarship.'
    ], answer: 'B',
    explanation: `"Complicates this account" signals doubt about the scholars' assumption. The next sentences give the evidence: quilts with the patterns came before the books. So the sentence <b>indicates the assumption may be inaccurate</b>. It doesn't restate the assumption, and it doesn't concede that the survey is unreliable. The rest of the text relies on the survey.` });

  add({ id: 'rw-cs-21', skill: 'text-structure', difficulty: 3,
    passage: `<p>Many people picture a desert as a place where rain almost never falls. For some deserts, that picture is fairly accurate. For others, low rainfall is only part of the story; what also makes these regions deserts is how quickly water disappears. Intense heat and dry winds can cause moisture to evaporate so rapidly that the amount lost each year exceeds the amount received. In such places, a desert is defined as much by the balance between rain and evaporation as by the rain itself.</p>`,
    prompt: 'Which choice best describes the overall structure of the text?',
    choices: [
      'It describes a scientific debate about deserts and then explains why the debate remains unresolved.',
      'It lists the characteristics of several deserts and then ranks them by average rainfall.',
      'It presents a common view of deserts, qualifies that view, and then offers a more complete way of understanding deserts.',
      'It argues that deserts receive more rain than most people realize and then predicts future changes in rainfall.'
    ], answer: 'C',
    explanation: `The text starts with a common picture (deserts get almost no rain). It then qualifies it: the picture is accurate only for some deserts. It ends with a fuller definition based on rain and evaporation together. That is <b>C</b>. There is no debate, no ranking, and no prediction, and the text doesn't claim that deserts get a lot of rain.` });

  add({ id: 'rw-cs-22', skill: 'text-structure', difficulty: 3,
    passage: `<p class="src">The following text is from a novel.</p><p>Jonah's father had never been a man of many words. When Jonah announced that he had been accepted to a university across the country, his father simply nodded and went back to repairing the fence. But that evening, Jonah found a road atlas on his bed, the route already traced in pencil, with small notes in the margins marking the best places to stop along the way.</p>`,
    prompt: 'Which choice best states the main purpose of the text?',
    choices: [
      'To show that a character expresses his feelings through actions rather than words',
      'To suggest that a character disapproves of his son\'s decision to leave home',
      'To explain why a character prefers repairing things to talking with his family',
      'To describe the long journey a character must take to reach his university'
    ], answer: 'A',
    explanation: `The father barely reacts in words ("simply nodded"), but "But that evening" reveals the carefully marked atlas, a quiet show of support. The passage shows him <b>expressing feelings through actions</b>. The atlas argues against disapproval, and the journey itself is never described.` });

  // ---------- Cross-Text Connections ----------
  add({ id: 'rw-cs-23', skill: 'cross-text', difficulty: 1,
    passage: `<p><b>Text 1</b></p><p>Some city planners argue that adding bike lanes to busy streets reduces traffic congestion. Safe, dedicated lanes encourage people to cycle instead of drive, they say, which means fewer cars on the road.</p><p><b>Text 2</b></p><p>Critics of new bike lanes point out that in cities where cycling is uncommon, the lanes may remain mostly empty for years. Meanwhile, the lanes take space away from cars, which can make congestion worse in the short term.</p>`,
    prompt: 'Based on the texts, how would the critics in Text 2 most likely respond to the city planners\' argument in Text 1?',
    choices: [
      'By arguing that bike lanes reduce congestion only in cities where cycling is uncommon',
      'By cautioning that bike lanes might not produce the benefit the planners expect, at least not right away',
      'By agreeing that bike lanes reduce congestion but objecting to the cost of building them',
      'By claiming that cyclists cause more congestion than drivers do'
    ], answer: 'B',
    explanation: `The planners expect less congestion. The critics say the lanes may sit empty and could make congestion worse "in the short term," so they <b>doubt the benefit, at least at first</b>. A reverses the critics' point, cost is never mentioned, and they blame lost road space, not cyclists.` });

  add({ id: 'rw-cs-24', skill: 'cross-text', difficulty: 2,
    passage: `<p><b>Text 1</b></p><p>Many nutrition guides recommend eating breakfast every day, arguing that a morning meal provides energy that improves concentration and helps people avoid overeating later. Surveys of schoolchildren, for instance, have linked regular breakfast eating with better attention in class.</p><p><b>Text 2</b></p><p>Surveys showing that breakfast eaters are more attentive can be misleading. People who eat breakfast regularly may also sleep more or follow more consistent routines, and those habits, rather than breakfast itself, could explain the difference. When researchers randomly assign adults to eat or skip breakfast, they often find little difference in how much the two groups eat over the whole day.</p>`,
    prompt: 'Based on the texts, how would the author of Text 2 most likely respond to the reasoning presented in Text 1?',
    choices: [
      'By agreeing that breakfast improves concentration but disputing that it affects later eating',
      'By arguing that schoolchildren should not be included in studies of breakfast',
      'By claiming that skipping breakfast leads to better attention in class',
      'By suggesting that the benefits linked to breakfast might actually result from other habits of people who eat it'
    ], answer: 'D',
    explanation: `Text 2's main objection is that the surveys show a correlation that other factors, like sleep or routines, could explain. So the author would say the benefits might come from <b>other habits</b>. Text 2 doesn't grant that breakfast improves concentration, says nothing about excluding children, and never claims skipping breakfast helps.` });

  add({ id: 'rw-cs-25', skill: 'cross-text', difficulty: 3,
    passage: `<p><b>Text 1</b></p><p>Commentators on language have often treated slang as a sign of decay: a collection of careless shortcuts that wears away vocabulary and grammar. On this view, the spread of slang among young people is a threat to clear communication.</p><p><b>Text 2</b></p><p>Linguists who study slang closely find that it is often highly structured. Speakers follow consistent patterns when forming new terms, and many slang words fill genuine gaps, naming experiences or social distinctions for which standard vocabulary has no precise term. Far from signaling decline, slang shows the inventiveness that keeps a language adaptable.</p>`,
    prompt: 'Based on the texts, how would the linguists described in Text 2 most likely respond to the view presented in Text 1?',
    choices: [
      'They would agree that slang threatens clear communication but argue that its effects are temporary.',
      'They would argue that slang is used mainly by commentators rather than by young people.',
      'They would reject the idea that slang is careless, pointing to evidence that it follows patterns and meets real communicative needs.',
      'They would concede that slang lacks structure while maintaining that it enriches vocabulary.'
    ], answer: 'C',
    explanation: `Text 1 calls slang "careless shortcuts." Text 2's linguists find that slang is "highly structured" and "fill[s] genuine gaps," so they would <b>reject the "careless" characterization</b>. D contradicts "highly structured," and the linguists don't agree that slang threatens communication.` });

  add({ id: 'rw-cs-26', skill: 'cross-text', difficulty: 3,
    passage: `<p><b>Text 1</b></p><p>When a fish species disappears from a lake, ecologists typically suspect overfishing, pollution, or newly introduced predators. In one lake monitored for twenty years, however, the decline of a native minnow closely tracked rising water temperatures, while fishing, pollution levels, and predator numbers stayed about the same. Warming, the monitoring team concluded, was responsible.</p><p><b>Text 2</b></p><p>A temperature record alone cannot establish why a population declined. Warmer water often comes with other changes, such as lower oxygen levels, shifts in the insects fish eat, or blooms of algae. Unless those factors are measured, researchers cannot know whether temperature harmed the fish directly or merely accompanied the true cause.</p>`,
    prompt: 'Based on the texts, how would the author of Text 2 most likely respond to the monitoring team\'s conclusion in Text 1?',
    choices: [
      'By arguing that overfishing was probably responsible for the minnow\'s decline after all',
      'By cautioning that the decline might have been caused by unmeasured changes that accompany warming',
      'By agreeing that warming directly harmed the minnows but questioning the length of the monitoring period',
      'By suggesting that the minnow population did not actually decline during the monitoring period'
    ], answer: 'B',
    explanation: `Text 2 argues that warmer water brings other changes (oxygen, insects, algae) that could be the real cause. It would therefore caution that the minnows' decline might reflect <b>unmeasured changes that come with warming</b>. Text 1 already ruled out overfishing, and Text 2 doesn't question the decline or the study's length.` });
})();
