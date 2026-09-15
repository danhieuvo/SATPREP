/* Reading and Writing: Expression of Ideas. All questions are original. */
(function () {
  const add = o => SAT_BANK.push(Object.assign({ section: 'rw', domain: 'expression' }, o));
  const TR = 'Which choice completes the text with the most logical transition?';
  const SYN = 'Which choice most effectively uses relevant information from the notes to accomplish this goal?';
  const notes = items => `<p>While researching a topic, a student has taken the following notes:</p><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;

  // ---------- Transitions ----------
  add({ id: 'rw-eoi-01', skill: 'transitions', difficulty: 1,
    passage: `<p>Mountain gorillas are mainly plant eaters, feeding on leaves, stems, and shoots. ______ they occasionally eat ants and other insects.</p>`,
    prompt: TR, choices: ['Similarly,', 'However,', 'Therefore,', 'For example,'], answer: 'B',
    explanation: `Eating insects is an exception to being "mainly plant eaters," so a contrasting transition, <b>However</b>, fits. The insects aren't an example of plant eating, and they don't follow as a result of it.` });

  add({ id: 'rw-eoi-02', skill: 'transitions', difficulty: 1,
    passage: `<p>The city added three new bus routes and increased how often buses run on existing routes. ______ ridership on the public transit system rose by 15 percent the following year.</p>`,
    prompt: TR, choices: ['Nevertheless,', 'Instead,', 'As a result,', 'In contrast,'], answer: 'C',
    explanation: `Ridership rising is presented as a consequence of better bus service, so <b>As a result</b> is logical. "Nevertheless" and "In contrast" would imply the increase was unexpected.` });

  add({ id: 'rw-eoi-03', skill: 'transitions', difficulty: 1,
    passage: `<p>Ceramic artists can decorate their work in many different ways. ______ some carve patterns into the clay before it is fired, while others paint designs using colored glazes.</p>`,
    prompt: TR, choices: ['However,', 'Consequently,', 'Finally,', 'For example,'], answer: 'D',
    explanation: `Carving and glazing are specific instances of the "many different ways" in the first sentence, so <b>For example</b> is the logical transition.` });

  add({ id: 'rw-eoi-04', skill: 'transitions', difficulty: 2,
    passage: `<p>Wind turbines generate electricity without releasing air pollution. ______ they produce power only when the wind blows, so utilities must pair them with other energy sources or with storage systems.</p>`,
    prompt: TR, choices: ['Still,', 'Moreover,', 'Specifically,', 'Similarly,'], answer: 'A',
    explanation: `The second sentence presents a drawback that qualifies the advantage in the first. <b>Still</b> signals that concession. "Moreover" would add another advantage, and "Specifically" would expand on the first point.` });

  add({ id: 'rw-eoi-05', skill: 'transitions', difficulty: 2,
    passage: `<p>Early telephone networks required operators to connect every call by hand, plugging cables into a switchboard. As the number of telephone users grew, this system became slow and costly. ______ engineers developed automatic switching equipment that could connect calls without human operators.</p>`,
    prompt: TR, choices: ['In other words,', 'In response,', 'Even so,', 'Alternatively,'], answer: 'B',
    explanation: `Engineers developed automatic switching <i>because</i> the manual system became slow and costly, so <b>In response</b> fits. "In other words" would restate the problem, and "Even so" suggests a contrast that isn't there.` });

  add({ id: 'rw-eoi-06', skill: 'transitions', difficulty: 2,
    passage: `<p>Some cities plant trees along streets to lower summer temperatures. Tree canopies shade pavement and buildings, keeping them from absorbing as much heat. ______ trees release water vapor through their leaves, which further cools the surrounding air.</p>`,
    prompt: TR, choices: ['Nonetheless,', 'By contrast,', 'Additionally,', 'As a result,'], answer: 'C',
    explanation: `Releasing water vapor is a second, separate way trees cool cities, so <b>Additionally</b> fits. "As a result" is tempting, but water vapor release is not caused by shading. It's another mechanism.` });

  add({ id: 'rw-eoi-07', skill: 'transitions', difficulty: 3,
    passage: `<p>Many people believe that the Great Wall of China can be seen from space with the naked eye. Astronauts who have orbited Earth, ______ report that the wall is extremely difficult, if not impossible, to spot without magnification.</p>`,
    prompt: TR, choices: ['for instance,', 'therefore,', 'moreover,', 'however,'], answer: 'D',
    explanation: `The astronauts' reports contradict the popular belief described first, so the contrasting <b>however</b> is logical. The placement mid-sentence doesn't change the relationship between the ideas.` });

  add({ id: 'rw-eoi-08', skill: 'transitions', difficulty: 3,
    passage: `<p>In the early twentieth century, most geologists believed that the continents had always been in the same positions. When the idea that continents drift was first proposed, it was widely rejected, largely because no one could explain what force could move such enormous masses of rock. ______ once evidence of seafloor spreading emerged in the mid-twentieth century, the theory gained broad acceptance.</p>`,
    prompt: TR, choices: ['For instance,', 'Eventually,', 'Consequently,', 'Similarly,'], answer: 'B',
    explanation: `The text describes a change over time: first rejection, then acceptance decades later. <b>Eventually</b> captures that sequence. "Consequently" is a trap: acceptance was not a result of the rejection or of the missing explanation.` });

  // ---------- Rhetorical Synthesis ----------
  add({ id: 'rw-eoi-09', skill: 'synthesis', difficulty: 1,
    passage: notes([
      'The Great Barrier Reef is located off the coast of Queensland, Australia.',
      'It is the world\'s largest coral reef system.',
      'It stretches for more than 2,300 kilometers.',
      'It is made up of nearly 3,000 individual reefs.'
    ]) + '<p>The student wants to emphasize the size of the Great Barrier Reef.</p>',
    prompt: SYN,
    choices: [
      'The Great Barrier Reef is located off the coast of Queensland, Australia.',
      'Stretching for more than 2,300 kilometers, the Great Barrier Reef is the world\'s largest coral reef system.',
      'The Great Barrier Reef is a coral reef system in Australia.',
      'Queensland, Australia, is home to a coral reef system.'
    ], answer: 'B',
    explanation: `Only <b>B</b> includes information about size: its length and its status as the largest reef system. The other choices give only location.` });

  add({ id: 'rw-eoi-10', skill: 'synthesis', difficulty: 1,
    passage: notes([
      'Mary Anning (1799–1847) was a fossil collector from Lyme Regis, England.',
      'In 1823, she discovered the first complete skeleton of a plesiosaur, a marine reptile.',
      'As a woman, she was not permitted to join the Geological Society of London.',
      'Many scientists of her time bought fossils from her and relied on her expertise.'
    ]) + '<p>The student wants to describe one of Anning\'s discoveries to an audience unfamiliar with her.</p>',
    prompt: SYN,
    choices: [
      'Mary Anning was not permitted to join the Geological Society of London.',
      'Many scientists relied on Anning\'s expertise and bought fossils from her.',
      'In 1823, Mary Anning, a fossil collector from Lyme Regis, England, discovered the first complete skeleton of a plesiosaur, a marine reptile.',
      'The plesiosaur was a marine reptile.'
    ], answer: 'C',
    explanation: `The goal has two parts: describe a <i>discovery</i>, and introduce Anning to readers who don't know her. <b>C</b> does both. A and B don't mention a discovery, and D doesn't mention Anning.` });

  add({ id: 'rw-eoi-11', skill: 'synthesis', difficulty: 1,
    passage: notes([
      'A haiku is a form of short poem that originated in Japan.',
      'A traditional haiku has three lines.',
      'The lines typically contain five, seven, and five syllables.',
      'Matsuo Bashō (1644–1694) is one of the most famous haiku poets.'
    ]) + '<p>The student wants to explain the structure of a traditional haiku.</p>',
    prompt: SYN,
    choices: [
      'Matsuo Bashō, who lived from 1644 to 1694, is one of the most famous haiku poets.',
      'The haiku, a form of short poem, originated in Japan.',
      'Matsuo Bashō wrote haiku in Japan.',
      'A traditional haiku has three lines, which typically contain five, seven, and five syllables.'
    ], answer: 'D',
    explanation: `"Structure" means how the poem is built: its lines and syllables. Only <b>D</b> describes that.` });

  add({ id: 'rw-eoi-12', skill: 'synthesis', difficulty: 2,
    passage: notes([
      'Mercury and Venus are the two planets closest to the Sun.',
      'Mercury has almost no atmosphere.',
      'Venus has a thick atmosphere made mostly of carbon dioxide.',
      'Venus\'s atmosphere traps heat, making Venus the hottest planet in the solar system even though Mercury is closer to the Sun.'
    ]) + '<p>The student wants to emphasize a difference between the atmospheres of Mercury and Venus.</p>',
    prompt: SYN,
    choices: [
      'While Mercury has almost no atmosphere, Venus has a thick atmosphere made mostly of carbon dioxide.',
      'Mercury and Venus are the two planets closest to the Sun.',
      'Venus is the hottest planet in the solar system.',
      'Venus\'s atmosphere, which is made mostly of carbon dioxide, traps heat.'
    ], answer: 'A',
    explanation: `A difference requires <i>both</i> planets' atmospheres, contrasted. Only <b>A</b> describes both. D describes only Venus, and B is a similarity.` });

  add({ id: 'rw-eoi-13', skill: 'synthesis', difficulty: 2,
    passage: notes([
      'The Svalbard Global Seed Vault is located on an island in Norway\'s Svalbard archipelago.',
      'It opened in 2008.',
      'It stores backup copies of seeds held by seed banks around the world.',
      'Its purpose is to protect the diversity of food crops in case of disasters such as wars or natural catastrophes.'
    ]) + '<p>The student wants to explain the purpose of the Svalbard Global Seed Vault.</p>',
    prompt: SYN,
    choices: [
      'Opened in 2008, the Svalbard Global Seed Vault is located in Norway.',
      'The Svalbard archipelago is part of Norway.',
      'Seed banks around the world store seeds.',
      'The Svalbard Global Seed Vault stores backup copies of seeds to protect crop diversity in case of disasters such as wars.'
    ], answer: 'D',
    explanation: `Only <b>D</b> states what the vault is <i>for</i>: protecting crop diversity with backup seeds. A gives a date and location.` });

  add({ id: 'rw-eoi-14', skill: 'synthesis', difficulty: 3,
    passage: notes([
      'For a science fair project, Dev tested whether classical music affects how quickly people solve puzzles.',
      'He timed 20 classmates solving similar puzzles, once in silence and once while classical music played.',
      'The average solving time was 4.1 minutes in silence and 4.0 minutes with music.',
      'Dev concluded that the music had little or no effect on puzzle-solving speed.'
    ]) + '<p>The student wants to present the results of Dev\'s project and the conclusion he drew from them.</p>',
    prompt: SYN,
    choices: [
      'Dev timed 20 classmates solving puzzles in silence and while classical music played.',
      'Because his classmates\' average solving time was nearly the same with music (4.0 minutes) as in silence (4.1 minutes), Dev concluded that the music had little or no effect.',
      'Dev\'s classmates solved puzzles in an average of 4.0 minutes while classical music played.',
      'Dev wanted to find out whether classical music affects how quickly people solve puzzles.'
    ], answer: 'B',
    explanation: `The goal requires both <i>results</i> and the <i>conclusion</i>. <b>B</b> gives both averages and Dev's conclusion. A describes the method, C gives only one result, and D gives the question.` });

  add({ id: 'rw-eoi-15', skill: 'synthesis', difficulty: 3,
    passage: notes([
      'The Golden Gate Bridge in San Francisco opened in 1937.',
      'Its main span is 1,280 meters long.',
      'The Akashi Kaikyō Bridge in Japan opened in 1998.',
      'Its main span is 1,991 meters long.',
      'Both are suspension bridges.'
    ]) + '<p>The student wants to emphasize a similarity between the two bridges.</p>',
    prompt: SYN,
    choices: [
      'The Akashi Kaikyō Bridge\'s main span (1,991 meters) is longer than that of the Golden Gate Bridge (1,280 meters).',
      'The Golden Gate Bridge opened in 1937, while the Akashi Kaikyō Bridge opened in 1998.',
      'Both the Golden Gate Bridge, which opened in 1937, and the Akashi Kaikyō Bridge, which opened in 1998, are suspension bridges.',
      'The Golden Gate Bridge is in San Francisco, and the Akashi Kaikyō Bridge is in Japan.'
    ], answer: 'C',
    explanation: `A, B, and D all present <i>differences</i> (span length, opening date, location). Only <b>C</b> emphasizes what the bridges share: both are suspension bridges.` });

  add({ id: 'rw-eoi-16', skill: 'synthesis', difficulty: 3,
    passage: notes([
      'Bioluminescent bays contain high concentrations of tiny organisms called dinoflagellates.',
      'When disturbed, dinoflagellates emit a flash of blue-green light.',
      'Mosquito Bay, on the island of Vieques in Puerto Rico, is one of the brightest bioluminescent bays in the world.',
      'Swimmers and kayakers visit at night to see the water glow as they move through it.'
    ]) + '<p>The student wants to explain why the water in Mosquito Bay glows while also identifying where the bay is located.</p>',
    prompt: SYN,
    choices: [
      'The water in Mosquito Bay, on Puerto Rico\'s island of Vieques, glows because it contains many dinoflagellates, tiny organisms that emit light when disturbed.',
      'Mosquito Bay, on the island of Vieques in Puerto Rico, is one of the brightest bioluminescent bays in the world.',
      'Dinoflagellates emit blue-green light when disturbed, which is why people visit bioluminescent bays at night.',
      'Swimmers and kayakers visit Mosquito Bay at night to see the water glow.'
    ], answer: 'A',
    explanation: `Two requirements: <i>why</i> it glows and <i>where</i> it is. <b>A</b> meets both. B gives the location but no cause, C gives the cause but no location, and D gives neither.` });
})();
