/* Math: Geometry and Trigonometry. All questions are original. */
(function () {
  const R = String.raw;
  const add = o => SAT_BANK.push(Object.assign({ section: 'math', domain: 'geometry' }, o));

  // ---------- Area and volume ----------
  add({ id: 'm-geo-01', skill: 'area-volume', difficulty: 1,
    prompt: R`A rectangle has a perimeter of 34 centimeters and a length of 12 centimeters. What is the area of the rectangle, in square centimeters?`,
    choices: ['$34$', '$60$', '$144$', '$204$'], answer: 'B',
    explanation: R`$2(12) + 2w = 34$, so $2w = 10$ and $w = 5$. Area $= 12 \times 5 = 60$.` });

  add({ id: 'm-geo-02', skill: 'area-volume', difficulty: 2,
    prompt: R`A right circular cylinder has a radius of 3 inches and a volume of $72\pi$ cubic inches. What is the height of the cylinder, in inches?`,
    answer: ['8'],
    explanation: R`$V = \pi r^2 h$, so $72\pi = \pi(9)h$. Then $h = 8$.` });

  add({ id: 'm-geo-03', skill: 'area-volume', difficulty: 2,
    prompt: R`A cube has a total surface area of 150 square inches. What is the volume of the cube, in cubic inches?`,
    choices: ['$25$', '$75$', '$125$', '$625$'], answer: 'C',
    explanation: R`A cube has 6 equal faces: $6s^2 = 150$, so $s^2 = 25$ and $s = 5$. Volume $= 5^3 = 125$.` });

  add({ id: 'm-geo-04', skill: 'area-volume', difficulty: 3,
    prompt: R`Each edge of a cube is increased in length by 50%. By what percent does the volume of the cube increase?`,
    answer: ['237.5'],
    explanation: R`Each edge is multiplied by $1.5$, so the volume is multiplied by $1.5^3 = 3.375$. That is an increase of $3.375 - 1 = 2.375$, or 237.5%. (A 50% increase in each dimension doesn't mean a 150% increase in volume.)` });

  // ---------- Lines, angles, and triangles ----------
  add({ id: 'm-geo-05', skill: 'lines-angles', difficulty: 1,
    prompt: R`Two angles are supplementary. The measure of one angle is 3 times the measure of the other. What is the measure, in degrees, of the larger angle?`,
    choices: ['$45$', '$90$', '$120$', '$135$'], answer: 'D',
    explanation: R`Supplementary angles sum to $180^\circ$: $x + 3x = 180$, so $x = 45$. The larger angle is $3(45) = 135$.` });

  add({ id: 'm-geo-06', skill: 'lines-angles', difficulty: 1,
    prompt: R`Two angles of a triangle measure $48^\circ$ and $67^\circ$. What is the measure of the third angle?`,
    choices: [R`$65^\circ$`, R`$75^\circ$`, R`$115^\circ$`, R`$133^\circ$`], answer: 'A',
    explanation: R`The angles of a triangle sum to $180^\circ$: $180 - 48 - 67 = 65$.` });

  add({ id: 'm-geo-07', skill: 'lines-angles', difficulty: 2,
    prompt: R`Parallel lines $\ell$ and $m$ are intersected by a transversal. Two same-side interior angles formed by the transversal measure $(2x + 20)^\circ$ and $(4x - 20)^\circ$. What is the value of $x$?`,
    answer: ['30'],
    explanation: R`Same-side interior angles between parallel lines are supplementary: $(2x + 20) + (4x - 20) = 180$, so $6x = 180$ and $x = 30$.` });

  add({ id: 'm-geo-08', skill: 'lines-angles', difficulty: 3,
    prompt: R`<svg viewBox="0 0 300 220" width="260" role="img" aria-label="Triangle ABC with segment DE parallel to BC">
        <g fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="150,20 40,200 260,200"/>
          <line x1="106" y1="92" x2="194" y2="92"/>
        </g>
        <g fill="currentColor" font-family="system-ui, sans-serif" font-size="15">
          <text x="144" y="14">A</text><text x="24" y="212">B</text><text x="264" y="212">C</text>
          <text x="88" y="96">D</text><text x="200" y="96">E</text>
        </g>
      </svg>
      <p>In triangle $ABC$ above, $\overline{DE}$ is parallel to $\overline{BC}$. If $AD = 6$, $DB = 9$, and $DE = 8$, what is the length of $\overline{BC}$? (Note: the figure is not drawn to scale.)</p>`,
    choices: ['$12$', '$14$', '$20$', '$24$'], answer: 'C',
    explanation: R`Because $DE \parallel BC$, triangle $ADE$ is similar to triangle $ABC$. So $\dfrac{AD}{AB} = \dfrac{DE}{BC}$. Note that $AB = 6 + 9 = 15$, not 9: $\dfrac{6}{15} = \dfrac{8}{BC}$, so $BC = 20$. (Using $\tfrac{6}{9}$ gives the incorrect 12.)` });

  // ---------- Right triangles and trigonometry ----------
  add({ id: 'm-geo-09', skill: 'right-triangles', difficulty: 1,
    prompt: R`The legs of a right triangle have lengths 9 and 12. What is the length of the hypotenuse?`,
    choices: ['$10$', '$12$', '$13$', '$15$'], answer: 'D',
    explanation: R`$c^2 = 9^2 + 12^2 = 81 + 144 = 225$, so $c = 15$. (This is a 3-4-5 triangle scaled by 3.)` });

  add({ id: 'm-geo-10', skill: 'right-triangles', difficulty: 2,
    prompt: R`In right triangle $ABC$, angle $C$ is the right angle. If $\sin A = \dfrac{5}{13}$, what is the value of $\cos B$?`,
    choices: [R`$\dfrac{5}{12}$`, R`$\dfrac{5}{13}$`, R`$\dfrac{12}{13}$`, R`$\dfrac{13}{5}$`], answer: 'B',
    explanation: R`Angles $A$ and $B$ are complementary. The side opposite $A$ is the side adjacent to $B$, so $\cos B = \sin A = \dfrac{5}{13}$.` });

  add({ id: 'm-geo-11', skill: 'right-triangles', difficulty: 3,
    prompt: R`In right triangle $PQR$, angle $Q$ is the right angle, $\tan P = \dfrac{3}{4}$, and $PR = 30$. What is the length of $\overline{QR}$?`,
    answer: ['18'],
    explanation: R`$\tan P = \dfrac{QR}{PQ} = \dfrac{3}{4}$, so the sides are in a 3-4-5 ratio with hypotenuse $PR = 30 = 5 \times 6$. Therefore $QR = 3 \times 6 = 18$ and $PQ = 24$.` });

  // ---------- Circles ----------
  add({ id: 'm-geo-12', skill: 'circles', difficulty: 1,
    prompt: R`A circle has a circumference of $18\pi$ units. What is the area of the circle, in square units?`,
    choices: [R`$9\pi$`, R`$36\pi$`, R`$81\pi$`, R`$324\pi$`], answer: 'C',
    explanation: R`$2\pi r = 18\pi$, so $r = 9$. Area $= \pi(9)^2 = 81\pi$.` });

  add({ id: 'm-geo-13', skill: 'circles', difficulty: 2,
    prompt: R`A circle in the $xy$-plane has the equation $(x - 2)^2 + (y + 5)^2 = 49$. What are the center and radius of the circle?`,
    choices: [R`Center $(2, -5)$, radius $7$`, R`Center $(-2, 5)$, radius $7$`, R`Center $(2, -5)$, radius $49$`, R`Center $(-2, 5)$, radius $49$`], answer: 'A',
    explanation: R`The form $(x - h)^2 + (y - k)^2 = r^2$ has center $(h, k)$ and radius $r$. Here $h = 2$, $k = -5$ (since $y + 5 = y - (-5)$), and $r = \sqrt{49} = 7$.` });

  add({ id: 'm-geo-14', skill: 'circles', difficulty: 3,
    prompt: R`The graph of $x^2 + y^2 - 6x + 8y = 11$ in the $xy$-plane is a circle. What is the radius of the circle?`,
    answer: ['6'],
    explanation: R`Complete the square: $(x^2 - 6x + 9) + (y^2 + 8y + 16) = 11 + 9 + 16$, so $(x - 3)^2 + (y + 4)^2 = 36$. The radius is $\sqrt{36} = 6$.` });
})();
