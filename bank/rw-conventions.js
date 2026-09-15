/* Reading and Writing: Standard English Conventions. All questions are original. */
(function () {
  const add = o => SAT_BANK.push(Object.assign({ section: 'rw', domain: 'conventions' }, o));
  const SEC = 'Which choice completes the text so that it conforms to the conventions of Standard English?';

  // ---------- Boundaries ----------
  add({ id: 'rw-sec-01', skill: 'boundaries', difficulty: 1,
    passage: `<p>The hiking club meets every Saturday ______ who arrive late may miss the group's departure from the trailhead.</p>`,
    prompt: SEC, choices: ['morning, members', 'morning; members', 'morning members', 'morning, and, members'], answer: 'B',
    explanation: `Both "The hiking club meets every Saturday morning" and "members who arrive late may miss..." are independent clauses. A <b>semicolon</b> can join them. A comma alone creates a comma splice, no punctuation creates a run-on, and the commas around "and" are incorrect.` });

  add({ id: 'rw-sec-02', skill: 'boundaries', difficulty: 1,
    passage: `<p>Octopuses have three ______ two pump blood through the gills, and the third pumps it to the rest of the body.</p>`,
    prompt: SEC, choices: ['hearts:', 'hearts,', 'hearts', 'hearts, which'], answer: 'A',
    explanation: `The second clause explains the "three hearts," so a <b>colon</b> works. A comma alone would be a comma splice, no punctuation is a run-on, and "which two pump blood" is ungrammatical.` });

  add({ id: 'rw-sec-03', skill: 'boundaries', difficulty: 1,
    passage: `<p>The bakery on Elm Street opened in ______ has been run by the same family ever since.</p>`,
    prompt: SEC, choices: ['1952, it', '1952 it', '1952, and it', '1952, so that it'], answer: 'C',
    explanation: `Two independent clauses can be joined with a <b>comma plus a coordinating conjunction</b> ("and"). A is a comma splice and B is a run-on. "So that" signals purpose, which doesn't make sense here.` });

  add({ id: 'rw-sec-04', skill: 'boundaries', difficulty: 1,
    passage: `<p>Marisol finished her painting just before the art show ______ was displayed near the gallery's entrance.</p>`,
    prompt: SEC, choices: ['began, it', 'began it', 'began and, it', 'began. It'], answer: 'D',
    explanation: `"Marisol finished her painting just before the art show began" and "It was displayed..." are complete sentences, so a <b>period</b> separates them correctly. A is a comma splice, B is a run-on, and the comma in C is misplaced.` });

  add({ id: 'rw-sec-05', skill: 'boundaries', difficulty: 2,
    passage: `<p>The Atacama Desert—a long strip of land along the Pacific coast of South ______ is one of the driest places on Earth.</p>`,
    prompt: SEC, choices: ['America,', 'America—', 'America', 'America;'], answer: 'B',
    explanation: `The phrase describing the desert begins with a dash, so it must <b>end with a dash</b> too. Mixing a dash with a comma or semicolon, or leaving the phrase unclosed, is incorrect.` });

  add({ id: 'rw-sec-06', skill: 'boundaries', difficulty: 2,
    passage: `<p>The museum's new exhibit features artifacts from three ancient ______ Egypt, Mesopotamia, and the Indus Valley.</p>`,
    prompt: SEC, choices: ['civilizations;', 'civilizations', 'civilizations:', 'civilizations, including:'], answer: 'C',
    explanation: `A <b>colon</b> correctly introduces a list after a complete independent clause. A semicolon must join two independent clauses, and a colon shouldn't follow "including," since the sentence before the colon must be complete.` });

  add({ id: 'rw-sec-07', skill: 'boundaries', difficulty: 2,
    passage: `<p>Although the recipe calls for fresh ______ home cooks often substitute dried herbs when fresh ones are unavailable.</p>`,
    prompt: SEC, choices: ['basil;', 'basil', 'basil.', 'basil,'], answer: 'D',
    explanation: `"Although the recipe calls for fresh basil" is a dependent clause. A <b>comma</b> separates an introductory dependent clause from the main clause. A semicolon or period would leave the dependent clause as a fragment.` });

  add({ id: 'rw-sec-08', skill: 'boundaries', difficulty: 2,
    passage: `<p>The first bridge across the river was built of ______ it collapsed during a flood less than a decade later.</p>`,
    prompt: SEC, choices: ['wood; however,', 'wood, however,', 'wood however', 'wood, however'], answer: 'A',
    explanation: `"However" is a transition word, not a conjunction, so it can't join two independent clauses with only commas. Use a <b>semicolon before</b> and a comma after it. B and D are comma splices, and C has no punctuation.` });

  add({ id: 'rw-sec-09', skill: 'boundaries', difficulty: 2,
    passage: `<p>The American ______ is best remembered today not for his portraits but for his work developing the telegraph.</p>`,
    prompt: SEC, choices: ['painter; Samuel Morse', 'painter, Samuel Morse', 'painter Samuel Morse', 'painter Samuel Morse,'], answer: 'C',
    explanation: `"Samuel Morse" identifies which American painter is meant, so it is essential information and takes <b>no commas</b>. A single comma, as in B or D, wrongly separates the subject from its verb, and a semicolon can't go inside a clause.` });

  add({ id: 'rw-sec-10', skill: 'boundaries', difficulty: 3,
    passage: `<p>Many of the plants in the garden, including a rare orchid that blooms only once every few ______ were donated by a local botanist.</p>`,
    prompt: SEC, choices: ['years—', 'years,', 'years', 'years;'], answer: 'B',
    explanation: `The phrase "including a rare orchid ... every few years" opens with a comma, so it must <b>close with a comma</b> before the sentence continues with "were donated." A dash or semicolon doesn't match, and no punctuation leaves the phrase unclosed.` });

  add({ id: 'rw-sec-11', skill: 'boundaries', difficulty: 3,
    passage: `<p>The tour will visit three cities: Lyon, France; Porto, ______ and Turin, Italy.</p>`,
    prompt: SEC, choices: ['Portugal;', 'Portugal,', 'Portugal', 'Portugal:'], answer: 'A',
    explanation: `When list items already contain commas ("Lyon, France"), <b>semicolons</b> separate the items. The pattern set by "France;" must continue after "Portugal."` });

  add({ id: 'rw-sec-12', skill: 'boundaries', difficulty: 3,
    passage: `<p>Biologists have long wondered why some birds migrate thousands of kilometers each year while others stay in the same region ______ tracking studies have begun to offer answers.</p>`,
    prompt: SEC, choices: ['year-round? Recent', 'year-round, recent', 'year-round. Recent', 'year-round recent'], answer: 'C',
    explanation: `The first sentence contains an <i>indirect</i> question ("wondered why..."), so it ends with a <b>period</b>, not a question mark. B is a comma splice and D is a run-on.` });

  add({ id: 'rw-sec-13', skill: 'boundaries', difficulty: 3,
    passage: `<p>The architect's design solved a problem that had frustrated the city for ______ how to bring natural light into a building surrounded on all sides by taller towers.</p>`,
    prompt: SEC, choices: ['decades;', 'decades,', 'decades', 'decades:'], answer: 'D',
    explanation: `What follows is not a complete clause. It is a phrase that identifies "a problem." A <b>colon</b> after a complete clause can introduce that kind of explanation. A semicolon needs an independent clause on both sides, and a comma or no punctuation fails to set up the explanation.` });

  // ---------- Form, Structure, and Sense ----------
  add({ id: 'rw-sec-14', skill: 'form-structure', difficulty: 1,
    passage: `<p>The collection of rare maps that the university acquired last spring ______ now on display in the main library.</p>`,
    prompt: SEC, choices: ['is', 'are', 'were', 'have been'], answer: 'A',
    explanation: `The subject is the singular "collection," not "maps," which is part of a prepositional phrase. "Now" calls for the present tense, so the verb is <b>is</b>.` });

  add({ id: 'rw-sec-15', skill: 'form-structure', difficulty: 1,
    passage: `<p>Last summer, the volunteers ______ more than two thousand native trees along the riverbank.</p>`,
    prompt: SEC, choices: ['plant', 'will plant', 'planted', 'are planting'], answer: 'C',
    explanation: `"Last summer" places the action in the past, so the past tense <b>planted</b> is required.` });

  add({ id: 'rw-sec-16', skill: 'form-structure', difficulty: 1,
    passage: `<p>When the orchestra finished ______ final piece, the audience rose to its feet.</p>`,
    prompt: SEC, choices: ['their', 'its', 'they\'re', 'it\'s'], answer: 'B',
    explanation: `"Orchestra" is a singular noun, so it takes the singular possessive pronoun <b>its</b>. "It's" means "it is," and "they're" means "they are."` });

  add({ id: 'rw-sec-17', skill: 'form-structure', difficulty: 1,
    passage: `<p>The ______ nests, built high on the cliffs, are difficult for predators to reach.</p>`,
    prompt: SEC, choices: ['falcons', 'falcon\'s', 'falcons\'s', 'falcons\''], answer: 'D',
    explanation: `The nests (plural) belong to multiple falcons, so the plural possessive <b>falcons'</b> is needed. "Falcon's" would mean one falcon owns all the nests.` });

  add({ id: 'rw-sec-18', skill: 'form-structure', difficulty: 2,
    passage: `<p>Having studied the ancient tablets for more than a decade, ______</p>`,
    prompt: SEC,
    choices: [
      'the researcher finally deciphered the tablets\' meaning.',
      'the tablets\' meaning was finally deciphered by the researcher.',
      'deciphering the tablets\' meaning finally happened.',
      'the meaning of the tablets was finally clear to the researcher.'
    ], answer: 'A',
    explanation: `The opening phrase describes someone who studied the tablets, so the word right after the comma must be that person: <b>the researcher</b>. The other choices make "the tablets' meaning" or "deciphering" the one who did the studying (a dangling modifier).` });

  add({ id: 'rw-sec-19', skill: 'form-structure', difficulty: 2,
    passage: `<p>Each of the three proposals submitted to the city council ______ a plan for expanding bus service to the airport.</p>`,
    prompt: SEC, choices: ['include', 'have included', 'includes', 'are including'], answer: 'C',
    explanation: `The subject is "each," which is singular. "Proposals" is inside a prepositional phrase. The singular verb <b>includes</b> agrees with it.` });

  add({ id: 'rw-sec-20', skill: 'form-structure', difficulty: 2,
    passage: `<p>Many sea turtles return to the same beaches where ______ hatched in order to lay eggs of their own.</p>`,
    prompt: SEC, choices: ['there', 'their', 'they\'re', 'they'], answer: 'D',
    explanation: `The clause needs a subject for "hatched": <b>they</b> (the turtles). "Their" is possessive, "there" refers to a place, and "they're" would make "they are hatched."` });

  add({ id: 'rw-sec-21', skill: 'form-structure', difficulty: 3,
    passage: `<p>The discovery of fossilized footprints alongside ancient stone tools, which suggests that early humans used the area repeatedly, ______ researchers to reconsider when the region was first settled.</p>`,
    prompt: SEC, choices: ['have led', 'has led', 'leading', 'were leading'], answer: 'B',
    explanation: `Strip away the phrases: "The <i>discovery</i> ... has led researchers." The singular subject "discovery" needs the singular verb <b>has led</b>. "Leading" isn't a main verb, which would leave the sentence without one.` });

  add({ id: 'rw-sec-22', skill: 'form-structure', difficulty: 3,
    passage: `<p>Although the museum's two founders disagreed about many things, ______ shared a firm belief that art should be free for everyone to see.</p>`,
    prompt: SEC, choices: ['they', 'it', 'one', 'he or she'], answer: 'A',
    explanation: `The pronoun refers to "the museum's two founders," a plural noun, so the plural <b>they</b> is correct.` });

  add({ id: 'rw-sec-23', skill: 'form-structure', difficulty: 3,
    passage: `<p>By the time the rescue team reached the stranded hikers, the storm ______ for nearly two days.</p>`,
    prompt: SEC, choices: ['raged', 'has raged', 'had been raging', 'will have raged'], answer: 'C',
    explanation: `The storm was ongoing <i>before</i> another past event (the team's arrival). The past perfect progressive <b>had been raging</b> expresses that. "Has raged" is present perfect, which doesn't fit a past-tense narrative.` });

  add({ id: 'rw-sec-24', skill: 'form-structure', difficulty: 3,
    passage: `<p>Among the most surprising results of the survey ______ that nearly half of the respondents had never visited the city's largest park.</p>`,
    prompt: SEC, choices: ['were', 'are', 'have been', 'was'], answer: 'D',
    explanation: `The sentence is inverted. Its subject is the clause "that nearly half ... had never visited," which is singular. "Results" belongs to the phrase "Among the most surprising results." A singular past-tense verb fits: <b>was</b>.` });
})();
