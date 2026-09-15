/* Math: Problem-Solving and Data Analysis. All questions are original; data are illustrative. */
(function () {
  const R = String.raw;
  const add = o => SAT_BANK.push(Object.assign({ section: 'math', domain: 'data' }, o));

  // ---------- Ratios, rates, and units ----------
  add({ id: 'm-dat-01', skill: 'ratios-rates', difficulty: 1,
    prompt: R`A recipe uses 3 cups of flour for every 2 cups of sugar. At this ratio, how many cups of flour are needed for 8 cups of sugar?`,
    choices: ['$10$', '$12$', '$16$', '$24$'], answer: 'B',
    explanation: R`Sugar goes from 2 to 8 cups, which is 4 times as much, so flour is $3 \times 4 = 12$ cups.` });

  add({ id: 'm-dat-02', skill: 'ratios-rates', difficulty: 2,
    prompt: R`A car travels 150 miles on 6 gallons of gas. At this rate, how many gallons of gas does the car need to travel 425 miles?`,
    answer: ['17'],
    explanation: R`The car gets $150 \div 6 = 25$ miles per gallon, so it needs $425 \div 25 = 17$ gallons.` });

  add({ id: 'm-dat-03', skill: 'ratios-rates', difficulty: 3,
    prompt: R`A pump moves water at a constant rate of 3 liters per second. At this rate, how many kiloliters of water does the pump move in one hour? (1 kiloliter = 1,000 liters)`,
    answer: ['10.8', '54/5'],
    explanation: R`One hour is $3{,}600$ seconds, so the pump moves $3 \times 3{,}600 = 10{,}800$ liters. Divide by $1{,}000$: $10.8$ kiloliters.` });

  // ---------- Percentages ----------
  add({ id: 'm-dat-04', skill: 'percentages', difficulty: 1,
    prompt: R`What is 35% of 240?`,
    choices: ['$72$', '$76$', '$84$', '$96$'], answer: 'C',
    explanation: R`$0.35 \times 240 = 84$.` });

  add({ id: 'm-dat-05', skill: 'percentages', difficulty: 2,
    prompt: R`A jacket originally priced at $\$80$ is discounted by 25%. The discounted price is then increased by 10%. What is the final price of the jacket?`,
    choices: [R`$\$66$`, R`$\$68$`, R`$\$70$`, R`$\$72$`], answer: 'A',
    explanation: R`After the discount: $80 \times 0.75 = 60$. After the increase: $60 \times 1.10 = 66$. Choice B ($\$68$) comes from incorrectly combining the changes into a single 15% discount.` });

  add({ id: 'm-dat-06', skill: 'percentages', difficulty: 3,
    prompt: R`The number $p$ is 30% greater than the number $q$, and $q$ is 20% less than the positive number $r$. The value of $p$ is what percent of $r$?`,
    answer: ['104'],
    explanation: R`$p = 1.30q$ and $q = 0.80r$, so $p = 1.30 \times 0.80\,r = 1.04r$. That makes $p$ 104% of $r$. (Adding $+30 - 20 = 10$ to get 110% is incorrect.)` });

  // ---------- One-variable data ----------
  add({ id: 'm-dat-07', skill: 'one-var-data', difficulty: 1,
    prompt: R`What is the mean of the data set $4,\ 7,\ 7,\ 9,\ 12,\ 15$?`,
    choices: ['$7$', '$8$', '$9$', '$12$'], answer: 'C',
    explanation: R`The sum is $4 + 7 + 7 + 9 + 12 + 15 = 54$, and $54 \div 6 = 9$. (The median is 8, and the mode is 7.)` });

  add({ id: 'm-dat-08', skill: 'one-var-data', difficulty: 2,
    prompt: R`A data set of 10 numbers has a mean of 20. When one number is removed, the mean of the remaining 9 numbers is 18. What number was removed?`,
    answer: ['38'],
    explanation: R`The original sum is $10 \times 20 = 200$. The new sum is $9 \times 18 = 162$. The removed number is $200 - 162 = 38$.` });

  // ---------- Two-variable data and models ----------
  add({ id: 'm-dat-09', skill: 'two-var-data', difficulty: 1,
    prompt: R`For a group of students, the line of best fit for a scatterplot of hours studied, $x$, and test score, $y$, is $y = 4.5x + 62$. Which statement is the best interpretation of $4.5$ in this context?`,
    choices: [
      'The predicted test score for a student who studies 0 hours',
      'The average number of hours the students studied',
      'Every student in the group scored at least 4.5 points.',
      'For each additional hour studied, the predicted test score increases by 4.5 points.'
    ], answer: 'D',
    explanation: R`The slope of a line of best fit is the predicted change in $y$ for each one-unit increase in $x$. The value $62$ is the predicted score at 0 hours.` });

  add({ id: 'm-dat-10', skill: 'two-var-data', difficulty: 3,
    prompt: R`Weather stations recorded the average July temperature $y$, in degrees Fahrenheit, at different elevations $x$, in hundreds of meters. The line of best fit for the data is $y = -1.2x + 98$. One station at an elevation of 1,500 meters recorded an average temperature of $75^\circ\text{F}$. Which statement is true?`,
    choices: [
      'The actual temperature is 5 degrees less than the temperature predicted by the line of best fit.',
      'The actual temperature is 5 degrees greater than the temperature predicted by the line of best fit.',
      'The actual temperature is 23 degrees less than the temperature predicted by the line of best fit.',
      'The station\'s data point lies exactly on the line of best fit.'
    ], answer: 'A',
    explanation: R`Elevation is measured in <i>hundreds</i> of meters, so $x = 15$. The prediction is $-1.2(15) + 98 = 80$. The actual value is $75$, which is $5$ less than predicted. (Using $x = 1{,}500$ would give an impossible prediction.)` });

  // ---------- Probability ----------
  add({ id: 'm-dat-11', skill: 'probability', difficulty: 1,
    prompt: R`A bag contains 5 red marbles, 3 blue marbles, and 12 green marbles. If one marble is selected at random, what is the probability that it is blue?`,
    choices: [R`$\dfrac{3}{20}$`, R`$\dfrac{3}{17}$`, R`$\dfrac{1}{5}$`, R`$\dfrac{3}{5}$`], answer: 'A',
    explanation: R`There are $5 + 3 + 12 = 20$ marbles, and 3 are blue, so the probability is $\dfrac{3}{20}$.` });

  add({ id: 'm-dat-12', skill: 'probability', difficulty: 2,
    prompt: R`<table><caption>Sports Participation by Grade</caption>
      <tr><th></th><th>Plays a sport</th><th>Does not play a sport</th><th>Total</th></tr>
      <tr><th>9th grade</th><td>45</td><td>35</td><td>80</td></tr>
      <tr><th>10th grade</th><td>30</td><td>50</td><td>80</td></tr>
      <tr><th>Total</th><td>75</td><td>85</td><td>160</td></tr></table>
      <p>The table summarizes survey responses from 160 students. If a student is selected at random from those who play a sport, what is the probability that the student is in 10th grade?</p>`,
    answer: ['2/5', '.4'],
    explanation: R`"From those who play a sport" restricts the group to 75 students, and 30 of them are in 10th grade: $\dfrac{30}{75} = \dfrac{2}{5}$. Dividing by 80 or 160 answers a different question.` });

  // ---------- Inference and margin of error ----------
  add({ id: 'm-dat-13', skill: 'inference', difficulty: 2,
    prompt: R`A random sample of 400 registered voters in a city found that 58% support a proposed park. The margin of error for the estimate is 4 percentage points. Which conclusion is most appropriate?`,
    choices: [
      'Exactly 58% of all registered voters in the city support the proposed park.',
      'Between 54% and 62% of all registered voters in the state support the proposed park.',
      'It is plausible that between 54% and 62% of all registered voters in the city support the proposed park.',
      'Between 54% and 62% of the 400 sampled voters support the proposed park.'
    ], answer: 'C',
    explanation: R`A margin of error gives a <i>plausible range</i> for the true percentage in the population the sample came from (city voters): $58 \pm 4$. It isn't exact (A), it doesn't extend to the state (B), and the sample's own percentage is exactly 58% (D).` });

  add({ id: 'm-dat-14', skill: 'inference', difficulty: 3,
    prompt: R`A researcher surveyed a random sample of 200 dog owners in a town. Owners who reported walking their dogs every day also reported lower stress levels, on average, than owners who did not. Which conclusion is best supported by the study?`,
    choices: [
      'Walking a dog every day causes lower stress for all people.',
      'Walking a dog every day causes lower stress among dog owners in the town.',
      'Among all residents of the town, daily dog walking is associated with lower stress.',
      'Among dog owners in the town, daily dog walking is associated with lower stress, but the study does not show that walking causes lower stress.'
    ], answer: 'D',
    explanation: R`This was a survey, not an experiment with random assignment, so it can show an <b>association</b> but not cause and effect. The random sample of <i>dog owners in the town</i> supports conclusions only about that population, not all residents or all people.` });
})();
