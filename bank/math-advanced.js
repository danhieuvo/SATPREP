/* Math: Advanced Math. All questions are original. */
(function () {
  const R = String.raw;
  const add = o => SAT_BANK.push(Object.assign({ section: 'math', domain: 'advanced' }, o));

  // ---------- Equivalent expressions ----------
  add({ id: 'm-adv-01', skill: 'equivalent-expressions', difficulty: 1,
    prompt: R`Which expression is equivalent to $(3x^2 + 5x - 2) + (x^2 - 7x + 6)$?`,
    choices: [R`$3x^2 - 2x + 4$`, R`$4x^2 + 12x + 4$`, R`$4x^2 - 2x + 4$`, R`$4x^2 - 2x + 8$`], answer: 'C',
    explanation: R`Combine like terms: $3x^2 + x^2 = 4x^2$, $5x - 7x = -2x$, and $-2 + 6 = 4$.` });

  add({ id: 'm-adv-02', skill: 'equivalent-expressions', difficulty: 1,
    prompt: R`Which expression is equivalent to $2x(x - 4) + 3x$?`,
    choices: [R`$2x^2 - 11x$`, R`$5x^2 - 8x$`, R`$2x^2 - 5x$`, R`$2x^2 - x$`], answer: 'C',
    explanation: R`Distribute: $2x^2 - 8x + 3x = 2x^2 - 5x$.` });

  add({ id: 'm-adv-03', skill: 'equivalent-expressions', difficulty: 1,
    prompt: R`Which expression is equivalent to $x^2 - 49$?`,
    choices: [R`$(x - 7)^2$`, R`$(x + 7)^2$`, R`$(x - 49)(x + 1)$`, R`$(x - 7)(x + 7)$`], answer: 'D',
    explanation: R`This is a difference of squares: $a^2 - b^2 = (a - b)(a + b)$ with $a = x$ and $b = 7$.` });

  add({ id: 'm-adv-04', skill: 'equivalent-expressions', difficulty: 2,
    prompt: R`Which expression is equivalent to $\dfrac{x^2 + 5x + 6}{x + 3}$, for $x > 0$?`,
    choices: [R`$x + 2$`, R`$x + 3$`, R`$x + 5$`, R`$x^2 + 2$`], answer: 'A',
    explanation: R`Factor the numerator: $x^2 + 5x + 6 = (x + 2)(x + 3)$. Cancel $x + 3$ to get $x + 2$.` });

  add({ id: 'm-adv-05', skill: 'equivalent-expressions', difficulty: 2,
    prompt: R`The expression $(2x - 3)^2$ is equivalent to $ax^2 + bx + c$, where $a$, $b$, and $c$ are constants. What is the value of $b$?`,
    answer: ['-12'],
    explanation: R`$(2x - 3)^2 = 4x^2 - 12x + 9$, so $b = -12$. A common error is writing $4x^2 + 9$ and forgetting the middle term $2(2x)(-3)$.` });

  add({ id: 'm-adv-06', skill: 'equivalent-expressions', difficulty: 3,
    prompt: R`Which expression is equivalent to $\dfrac{3}{x} + \dfrac{2}{x + 1}$, for $x > 0$?`,
    choices: [R`$\dfrac{5}{2x + 1}$`, R`$\dfrac{5x + 3}{x^2 + x}$`, R`$\dfrac{5x + 1}{x^2 + x}$`, R`$\dfrac{6}{x^2 + x}$`], answer: 'B',
    explanation: R`Use the common denominator $x(x + 1)$: $\dfrac{3(x + 1) + 2x}{x(x + 1)} = \dfrac{5x + 3}{x^2 + x}$. Choice A adds numerators and denominators separately, which isn't valid.` });

  add({ id: 'm-adv-07', skill: 'equivalent-expressions', difficulty: 3,
    prompt: R`Which expression is equivalent to $(16x^8)^{\frac{3}{4}}$, for $x > 0$?`,
    choices: [R`$8x^6$`, R`$12x^6$`, R`$12x^{\frac{32}{3}}$`, R`$8x^{\frac{32}{3}}$`], answer: 'A',
    explanation: R`Apply the exponent to each factor. $16^{3/4} = (\sqrt[4]{16})^3 = 2^3 = 8$, and $(x^8)^{3/4} = x^{8 \cdot 3/4} = x^6$.` });

  add({ id: 'm-adv-08', skill: 'equivalent-expressions', difficulty: 2,
    prompt: R`The expression $6x^2 + kx - 10$ is equivalent to $(3x + 2)(2x - 5)$, where $k$ is a constant. What is the value of $k$?`,
    answer: ['-11'],
    explanation: R`Expand: $(3x + 2)(2x - 5) = 6x^2 - 15x + 4x - 10 = 6x^2 - 11x - 10$. So $k = -11$.` });

  add({ id: 'm-adv-09', skill: 'equivalent-expressions', difficulty: 3,
    prompt: R`Which expression is equivalent to $\dfrac{4x^2 - 9}{2x^2 + x - 3}$, for $x > 1$?`,
    choices: [R`$\dfrac{2x + 3}{x - 1}$`, R`$\dfrac{2x - 3}{x + 1}$`, R`$2x - 3$`, R`$\dfrac{2x - 3}{x - 1}$`], answer: 'D',
    explanation: R`Factor both parts. The numerator is $(2x - 3)(2x + 3)$ and the denominator is $(2x + 3)(x - 1)$. Cancel $2x + 3$ to get $\dfrac{2x - 3}{x - 1}$.` });

  // ---------- Nonlinear equations and systems ----------
  add({ id: 'm-adv-10', skill: 'nonlinear-equations', difficulty: 1,
    prompt: R`What are the solutions to $x^2 - 5x + 6 = 0$?`,
    choices: [R`$-3$ and $-2$`, R`$-2$ and $3$`, R`$2$ and $3$`, R`$1$ and $6$`], answer: 'C',
    explanation: R`Factor: $(x - 2)(x - 3) = 0$, so $x = 2$ or $x = 3$.` });

  add({ id: 'm-adv-11', skill: 'nonlinear-equations', difficulty: 1,
    prompt: R`If $2x^2 - 8 = 42$ and $x > 0$, what is the value of $x$?`,
    answer: ['5'],
    explanation: R`$2x^2 = 50$, so $x^2 = 25$. Since $x > 0$, $x = 5$.` });

  add({ id: 'm-adv-12', skill: 'nonlinear-equations', difficulty: 1,
    prompt: R`If $\sqrt{x + 7} = 4$, what is the value of $x$?`,
    choices: ['$9$', '$11$', '$16$', '$23$'], answer: 'A',
    explanation: R`Square both sides: $x + 7 = 16$, so $x = 9$. Check: $\sqrt{16} = 4$ ✓.` });

  add({ id: 'm-adv-13', skill: 'nonlinear-equations', difficulty: 2,
    prompt: R`What is the sum of the solutions to $(x - 4)(2x + 6) = 0$?`,
    choices: ['$-1$', '$1$', '$7$', '$10$'], answer: 'B',
    explanation: R`Set each factor to zero: $x = 4$ or $2x = -6$, so $x = -3$. The sum is $4 + (-3) = 1$.` });

  add({ id: 'm-adv-14', skill: 'nonlinear-equations', difficulty: 2,
    prompt: R`How many distinct real solutions does the equation $x^2 - 6x + 9 = 0$ have?`,
    choices: ['Zero', 'Exactly one', 'Exactly two', 'Infinitely many'], answer: 'B',
    explanation: R`$x^2 - 6x + 9 = (x - 3)^2$, which equals 0 only when $x = 3$. You can also check the discriminant: $b^2 - 4ac = 36 - 36 = 0$ means exactly one real solution.` });

  add({ id: 'm-adv-15', skill: 'nonlinear-equations', difficulty: 2,
    prompt: R`$$y = x^2 - 4$$ $$y = 2x - 1$$ The graphs of the equations above intersect at two points. Which of the following is the $x$-coordinate of one of those points?`,
    choices: ['$-3$', '$1$', '$2$', '$3$'], answer: 'D',
    explanation: R`Set the expressions equal: $x^2 - 4 = 2x - 1$, so $x^2 - 2x - 3 = 0$. That factors as $(x - 3)(x + 1) = 0$, giving $x = 3$ or $x = -1$.` });

  add({ id: 'm-adv-16', skill: 'nonlinear-equations', difficulty: 3,
    prompt: R`In the equation $x^2 + kx + 16 = 0$, $k$ is a positive constant. If the equation has exactly one real solution, what is the value of $k$?`,
    answer: ['8'],
    explanation: R`Exactly one real solution means the discriminant is zero: $k^2 - 4(1)(16) = 0$. So $k^2 = 64$, and since $k > 0$, $k = 8$.` });

  add({ id: 'm-adv-17', skill: 'nonlinear-equations', difficulty: 3,
    prompt: R`What is the product of all solutions to the equation $\dfrac{2}{x - 1} = \dfrac{x}{3}$?`,
    choices: ['$-6$', '$-1$', '$1$', '$6$'], answer: 'A',
    explanation: R`Cross-multiply: $6 = x(x - 1)$, so $x^2 - x - 6 = 0$. That factors as $(x - 3)(x + 2) = 0$, giving $x = 3$ or $x = -2$. Neither makes a denominator zero. The product is $3 \times (-2) = -6$.` });

  add({ id: 'm-adv-18', skill: 'nonlinear-equations', difficulty: 3,
    prompt: R`$$x^2 + y^2 = 25$$ $$y = x + 1$$ If $(x, y)$ is a solution to the system above and $x > 0$, what is the value of $x$?`,
    answer: ['3'],
    explanation: R`Substitute: $x^2 + (x + 1)^2 = 25$, so $2x^2 + 2x + 1 = 25$. Then $x^2 + x - 12 = 0$, which factors as $(x + 4)(x - 3) = 0$. Since $x > 0$, $x = 3$.` });

  // ---------- Nonlinear functions ----------
  add({ id: 'm-adv-19', skill: 'nonlinear-functions', difficulty: 1,
    prompt: R`The function $f$ is defined by $f(x) = x^2 - 3x$. What is the value of $f(-2)$?`,
    choices: ['$-10$', '$-2$', '$2$', '$10$'], answer: 'D',
    explanation: R`$f(-2) = (-2)^2 - 3(-2) = 4 + 6 = 10$.` });

  add({ id: 'm-adv-20', skill: 'nonlinear-functions', difficulty: 1,
    prompt: R`A colony of bacteria starts with 500 bacteria and doubles every 3 hours. Which function gives the number of bacteria, $P(t)$, after $t$ hours?`,
    choices: [R`$P(t) = 500(2)^{3t}$`, R`$P(t) = 500(2)^{\frac{t}{3}}$`, R`$P(t) = 500 + 2\left(\tfrac{t}{3}\right)$`, R`$P(t) = 2(500)^{\frac{t}{3}}$`], answer: 'B',
    explanation: R`The population is multiplied by 2 once every 3 hours, so the number of doublings after $t$ hours is $\tfrac{t}{3}$. Check: $P(3) = 500(2)^1 = 1{,}000$ ✓.` });

  add({ id: 'm-adv-21', skill: 'nonlinear-functions', difficulty: 1,
    prompt: R`The function $g$ is defined by $g(x) = 2(x - 3)^2 + 5$. What is the minimum value of $g(x)$?`,
    choices: ['$2$', '$3$', '$5$', '$8$'], answer: 'C',
    explanation: R`$(x - 3)^2$ is never negative and equals 0 when $x = 3$. The minimum is therefore $2(0) + 5 = 5$. The vertex is $(3, 5)$.` });

  add({ id: 'm-adv-22', skill: 'nonlinear-functions', difficulty: 2,
    prompt: R`The value $V$, in dollars, of a car $t$ years after it was purchased is modeled by $V(t) = 24{,}000(0.85)^t$. Which statement is the best interpretation of $0.85$ in this context?`,
    choices: [
      R`The car loses $\$0.85$ in value each year.`,
      'The car\'s value decreases by 85% each year.',
      'The car\'s value decreases by 15% each year.',
      'The car\'s value is 85% of its purchase price after 15 years.'
    ], answer: 'C',
    explanation: R`Each year the value is multiplied by $0.85$, so it keeps 85% of the previous year's value, which is a <b>15% decrease</b> each year. Choice B confuses the amount kept with the amount lost.` });

  add({ id: 'm-adv-23', skill: 'nonlinear-functions', difficulty: 2,
    prompt: R`The height $h$, in feet, of a ball $t$ seconds after it is thrown upward is modeled by $h(t) = -16t^2 + 64t + 5$. What is the maximum height, in feet, that the ball reaches?`,
    answer: ['69'],
    explanation: R`The vertex occurs at $t = -\dfrac{b}{2a} = -\dfrac{64}{2(-16)} = 2$. Then $h(2) = -16(4) + 64(2) + 5 = -64 + 128 + 5 = 69$.` });

  add({ id: 'm-adv-24', skill: 'nonlinear-functions', difficulty: 2,
    prompt: R`The function $f$ is defined by $f(x) = (x + 2)(x - 6)$. What is the $x$-coordinate of the vertex of the graph of $y = f(x)$?`,
    choices: ['$2$', '$3$', '$4$', '$6$'], answer: 'A',
    explanation: R`A parabola's vertex lies halfway between its $x$-intercepts, $-2$ and $6$: $\dfrac{-2 + 6}{2} = 2$.` });

  add({ id: 'm-adv-25', skill: 'nonlinear-functions', difficulty: 3,
    prompt: R`An exponential function $f$ satisfies $f(0) = 50$ and $f(2) = 72$. Which equation could define $f$?`,
    choices: [R`$f(x) = 50(1.2)^x$`, R`$f(x) = 50(1.44)^x$`, R`$f(x) = 50(1.1)^x$`, R`$f(x) = 72(1.2)^x$`], answer: 'A',
    explanation: R`Write $f(x) = a \cdot b^x$. Since $f(0) = a = 50$, we have $50b^2 = 72$, so $b^2 = 1.44$ and $b = 1.2$. Choice B uses $1.44$, which would be the growth over two steps, not one.` });

  add({ id: 'm-adv-26', skill: 'nonlinear-functions', difficulty: 3,
    prompt: R`The function $f$ is defined by $f(x) = 3x^2 - 12x + k$, where $k$ is a constant. If the minimum value of $f(x)$ is $7$, what is the value of $k$?`,
    answer: ['19'],
    explanation: R`The minimum occurs at $x = -\dfrac{-12}{2(3)} = 2$. Then $f(2) = 12 - 24 + k = k - 12$. Setting $k - 12 = 7$ gives $k = 19$.` });
})();
