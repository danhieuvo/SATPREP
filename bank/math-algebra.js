/* Math: Algebra. All questions are original. Math is written in KaTeX between $...$. */
(function () {
  const R = String.raw;
  const add = o => SAT_BANK.push(Object.assign({ section: 'math', domain: 'algebra' }, o));

  // ---------- Linear equations in one variable ----------
  add({ id: 'm-alg-01', skill: 'linear-one-var', difficulty: 1,
    prompt: R`If $3x + 7 = 22$, what is the value of $x$?`,
    choices: ['$3$', '$5$', '$7$', '$15$'], answer: 'B',
    explanation: R`Subtract 7 from both sides: $3x = 15$. Divide by 3: $x = 5$.` });

  add({ id: 'm-alg-02', skill: 'linear-one-var', difficulty: 1,
    prompt: R`If $\dfrac{x}{4} - 2 = 3$, what is the value of $x$?`,
    answer: ['20'],
    explanation: R`Add 2 to both sides: $\dfrac{x}{4} = 5$. Multiply by 4: $x = 20$.` });

  add({ id: 'm-alg-03', skill: 'linear-one-var', difficulty: 2,
    prompt: R`If $5(x - 2) = 3x + 4$, what is the value of $x - 2$?`,
    choices: ['$3$', '$4$', '$5$', '$7$'], answer: 'C',
    explanation: R`Distribute: $5x - 10 = 3x + 4$, so $2x = 14$ and $x = 7$. The question asks for $x - 2 = 5$. Choosing 7 is the classic trap of answering for $x$.` });

  add({ id: 'm-alg-04', skill: 'linear-one-var', difficulty: 2,
    prompt: R`A plumber charges a flat fee of $\$60$ for a visit plus $\$45$ for each hour of work. A customer's total bill was $\$262.50$. For how many hours did the plumber work?`,
    answer: ['4.5', '9/2'],
    explanation: R`Set up $60 + 45h = 262.50$. Then $45h = 202.50$, so $h = 4.5$ hours.` });

  add({ id: 'm-alg-05', skill: 'linear-one-var', difficulty: 3,
    prompt: R`In the equation $ax + 3 = 5x - b$, $a$ and $b$ are constants. If the equation has infinitely many solutions, what is the value of $a + b$?`,
    choices: ['$-8$', '$-2$', '$2$', '$8$'], answer: 'C',
    explanation: R`An equation has infinitely many solutions when both sides are identical. Matching the $x$-coefficients gives $a = 5$. Matching the constants gives $3 = -b$, so $b = -3$. Therefore $a + b = 2$.` });

  add({ id: 'm-alg-06', skill: 'linear-one-var', difficulty: 3,
    prompt: R`In the equation $k(2x - 3) = 6x + 9$, $k$ is a constant. If the equation has no solution, what is the value of $k$?`,
    choices: ['$3$', '$6$', '$9$', '$12$'], answer: 'A',
    explanation: R`Distribute: $2kx - 3k = 6x + 9$. No solution means the $x$-coefficients match but the constants don't. $2k = 6$ gives $k = 3$. Check: the constants are $-9$ and $9$, which are different, so there is no solution.` });

  // ---------- Linear functions ----------
  add({ id: 'm-alg-07', skill: 'linear-functions', difficulty: 1,
    prompt: R`The function $f$ is defined by $f(x) = 4x - 9$. What is the value of $f(5)$?`,
    choices: ['$1$', '$5$', '$11$', '$20$'], answer: 'C',
    explanation: R`$f(5) = 4(5) - 9 = 20 - 9 = 11$.` });

  add({ id: 'm-alg-08', skill: 'linear-functions', difficulty: 1,
    prompt: R`A line in the $xy$-plane passes through the points $(1, 3)$ and $(4, 12)$. What is the slope of the line?`,
    choices: ['$3$', '$4$', '$6$', '$9$'], answer: 'A',
    explanation: R`Slope $= \dfrac{12 - 3}{4 - 1} = \dfrac{9}{3} = 3$.` });

  add({ id: 'm-alg-09', skill: 'linear-functions', difficulty: 2,
    prompt: R`The total cost $C$, in dollars, of a taxi ride of $m$ miles is given by $C(m) = 2.5m + 4$. What is the best interpretation of $2.5$ in this context?`,
    choices: [
      'The fixed fee, in dollars, charged for every ride',
      'The total cost, in dollars, of a 1-mile ride',
      'The number of miles in a typical ride',
      'The additional cost, in dollars, for each mile traveled'
    ], answer: 'D',
    explanation: R`In $C(m) = 2.5m + 4$, the coefficient of $m$ is the rate of change: each additional mile adds $\$2.50$. The constant $4$ is the fixed fee, and a 1-mile ride costs $\$6.50$.` });

  add({ id: 'm-alg-10', skill: 'linear-functions', difficulty: 2,
    prompt: R`The graph of the linear function $f$ has a slope of $-2$ and passes through the point $(3, 1)$. Which equation defines $f$?`,
    choices: [R`$f(x) = -2x + 7$`, R`$f(x) = -2x - 5$`, R`$f(x) = -2x + 1$`, R`$f(x) = 2x - 5$`], answer: 'A',
    explanation: R`Use $f(x) = -2x + b$ with the point $(3, 1)$: $1 = -6 + b$, so $b = 7$.` });

  add({ id: 'm-alg-11', skill: 'linear-functions', difficulty: 3,
    prompt: R`For the linear function $g$, $g(2) = 11$ and $g(6) = 23$. If $g(k) = 38$, what is the value of $k$?`,
    answer: ['11'],
    explanation: R`The slope is $\dfrac{23 - 11}{6 - 2} = 3$, so $g(x) = 3x + b$. From $g(2) = 11$: $6 + b = 11$, so $b = 5$. Then $3k + 5 = 38$ gives $k = 11$.` });

  // ---------- Linear equations in two variables ----------
  add({ id: 'm-alg-12', skill: 'linear-two-var', difficulty: 1,
    prompt: R`At a school play, student tickets cost $\$8$ each and adult tickets cost $\$12$ each. The school collected $\$960$ from selling $s$ student tickets and $a$ adult tickets. Which equation represents this situation?`,
    choices: [R`$12s + 8a = 960$`, R`$8s + 12a = 960$`, R`$s + a = 960$`, R`$20(s + a) = 960$`], answer: 'B',
    explanation: R`Student tickets bring in $8s$ dollars and adult tickets bring in $12a$ dollars, so $8s + 12a = 960$.` });

  add({ id: 'm-alg-13', skill: 'linear-two-var', difficulty: 1,
    prompt: R`Which point lies on the line $2x + 5y = 20$?`,
    choices: [R`$(2, 5)$`, R`$(4, 3)$`, R`$(10, 1)$`, R`$(5, 2)$`], answer: 'D',
    explanation: R`Test each point: $(5, 2)$ gives $2(5) + 5(2) = 20$. ✓ The others give 29, 23, and 25.` });

  add({ id: 'm-alg-14', skill: 'linear-two-var', difficulty: 2,
    prompt: R`The graph of $3x - 4y = 24$ crosses the $y$-axis at the point $(0, b)$. What is the value of $b$?`,
    answer: ['-6'],
    explanation: R`On the $y$-axis, $x = 0$: $-4y = 24$, so $y = -6$.` });

  add({ id: 'm-alg-15', skill: 'linear-two-var', difficulty: 2,
    prompt: R`Line $\ell$ is perpendicular to the line $y = \tfrac{2}{3}x - 1$ and passes through the point $(0, 4)$. Which equation defines line $\ell$?`,
    choices: [R`$y = \tfrac{3}{2}x + 4$`, R`$y = -\tfrac{2}{3}x + 4$`, R`$y = -\tfrac{3}{2}x + 4$`, R`$y = \tfrac{2}{3}x + 4$`], answer: 'C',
    explanation: R`Perpendicular slopes are negative reciprocals: the reciprocal of $\tfrac{2}{3}$ is $\tfrac{3}{2}$, and its negative is $-\tfrac{3}{2}$. The line passes through $(0, 4)$, so the $y$-intercept is 4.` });

  add({ id: 'm-alg-16', skill: 'linear-two-var', difficulty: 3,
    prompt: R`A line in the $xy$-plane passes through the points $(-2, 7)$ and $(4, -5)$. The line also passes through the point $(k, 13)$. What is the value of $k$?`,
    answer: ['-5'],
    explanation: R`Slope $= \dfrac{-5 - 7}{4 - (-2)} = \dfrac{-12}{6} = -2$. Using point-slope form: $13 - 7 = -2(k + 2)$, so $6 = -2k - 4$, which gives $k = -5$.` });

  // ---------- Systems of two linear equations ----------
  add({ id: 'm-alg-17', skill: 'systems', difficulty: 1,
    prompt: R`$$x + y = 10$$ $$x - y = 4$$ What is the value of $x$ in the solution to the system of equations above?`,
    choices: ['$3$', '$4$', '$6$', '$7$'], answer: 'D',
    explanation: R`Add the equations: $2x = 14$, so $x = 7$. (Then $y = 3$.)` });

  add({ id: 'm-alg-18', skill: 'systems', difficulty: 1,
    prompt: R`$$2x + 3y = 21$$ $$y = x + 2$$ If $(x, y)$ is the solution to the system of equations above, what is the value of $x + y$?`,
    choices: ['$3$', '$5$', '$8$', '$15$'], answer: 'C',
    explanation: R`Substitute: $2x + 3(x + 2) = 21$, so $5x + 6 = 21$ and $x = 3$. Then $y = 5$, and $x + y = 8$.` });

  add({ id: 'm-alg-19', skill: 'systems', difficulty: 2,
    prompt: R`A store sells notebooks for $\$3.00$ each and pens for $\$1.50$ each. Maya bought a total of 14 notebooks and pens for $\$33.00$. How many notebooks did she buy?`,
    choices: ['$6$', '$8$', '$10$', '$11$'], answer: 'B',
    explanation: R`Let $n$ be notebooks and $p$ be pens: $n + p = 14$ and $3n + 1.5p = 33$. Substitute $p = 14 - n$: $3n + 21 - 1.5n = 33$, so $1.5n = 12$ and $n = 8$. (6 is the number of pens.)` });

  add({ id: 'm-alg-20', skill: 'systems', difficulty: 3,
    prompt: R`$$4x - 6y = 10$$ $$6x + ky = 15$$ In the system of equations above, $k$ is a constant. If the system has infinitely many solutions, what is the value of $k$?`,
    choices: ['$-9$', '$-6$', '$6$', '$9$'], answer: 'A',
    explanation: R`For infinitely many solutions, the second equation must be a multiple of the first. Since $6 = 1.5 \times 4$ and $15 = 1.5 \times 10$, the multiplier is $1.5$, so $k = 1.5 \times (-6) = -9$.` });

  add({ id: 'm-alg-21', skill: 'systems', difficulty: 3,
    prompt: R`$$ax + 2y = 7$$ $$3x - y = 4$$ In the system of equations above, $a$ is a constant. If the system has no solution, what is the value of $a$?`,
    answer: ['-6'],
    explanation: R`No solution means parallel lines: same slope, different intercepts. The second line is $y = 3x - 4$, with slope 3. The first is $y = -\tfrac{a}{2}x + \tfrac{7}{2}$, with slope $-\tfrac{a}{2}$. Setting $-\tfrac{a}{2} = 3$ gives $a = -6$. The intercepts $\tfrac{7}{2}$ and $-4$ differ, so the lines are parallel and there is no solution.` });

  // ---------- Linear inequalities ----------
  add({ id: 'm-alg-22', skill: 'inequalities', difficulty: 1,
    prompt: R`Which of the following values of $x$ satisfies the inequality $2x - 5 > 9$?`,
    choices: ['$4$', '$6$', '$7$', '$9$'], answer: 'D',
    explanation: R`$2x > 14$, so $x > 7$. Only 9 is greater than 7. Note that 7 itself does not satisfy the <i>strict</i> inequality.` });

  add({ id: 'm-alg-23', skill: 'inequalities', difficulty: 2,
    prompt: R`A delivery van can carry at most $1{,}200$ pounds. The driver weighs 180 pounds, and each package weighs 40 pounds. Which inequality represents the number of packages, $b$, that the van can carry along with the driver?`,
    choices: [R`$40b + 180 \le 1{,}200$`, R`$40b + 180 \ge 1{,}200$`, R`$40b \le 1{,}200 + 180$`, R`$180b + 40 \le 1{,}200$`], answer: 'A',
    explanation: R`The total weight is $180 + 40b$ pounds, and "at most" means $\le$.` });

  add({ id: 'm-alg-24', skill: 'inequalities', difficulty: 2,
    prompt: R`What is the greatest integer value of $x$ that satisfies $3(x + 2) \le 25$?`,
    answer: ['6'],
    explanation: R`$3x + 6 \le 25$, so $3x \le 19$ and $x \le 6.\overline{3}$. The greatest integer is 6.` });

  add({ id: 'm-alg-25', skill: 'inequalities', difficulty: 3,
    prompt: R`Which point $(x, y)$ is a solution to the following system of inequalities? $$y > 2x - 3$$ $$y \le -x + 6$$`,
    choices: [R`$(0, 7)$`, R`$(1, 2)$`, R`$(3, 3)$`, R`$(4, 3)$`], answer: 'B',
    explanation: R`Check $(1, 2)$: $2 > -1$ ✓ and $2 \le 5$ ✓. $(0, 7)$ fails the second inequality ($7 \le 6$ is false). $(3, 3)$ fails the first because $3 > 3$ is false, and so does $(4, 3)$, since $3 > 5$ is false.` });

  add({ id: 'm-alg-26', skill: 'inequalities', difficulty: 3,
    prompt: R`A tutor earns $\$40$ per hour for in-person sessions and $\$25$ per hour for online sessions. This week she wants to earn at least $\$900$ while working no more than 30 hours in total. If she works 16 hours in person, what is the minimum whole number of online hours she must work?`,
    choices: ['$10$', '$11$', '$14$', '$15$'], answer: 'B',
    explanation: R`In-person earnings are $16 \times 40 = \$640$. She needs $640 + 25h \ge 900$, so $h \ge 10.4$. The minimum whole number is 11. Her total of $16 + 11 = 27$ hours is within the 30-hour limit.` });
})();
