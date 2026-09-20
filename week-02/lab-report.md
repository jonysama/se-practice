# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Zhanibek Alimkulov
**Group:** Monday 16:00-19:00
**Date:** AI-Driven Software Engineering (Fall 2026, KBTU SITE)

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant |ChatGPT|
| Exact model name |GPT-5.6 Luna|
| Implementation language |Python|
| Date of the runs |2026-09-20|

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
n/a — used Python
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1.**Student names (Alice, Bob, Charlie, David) and their individual marks.** The AI invented four named students and gave each of them a list of five grades. I never mentioned any students or names — I only asked for code to "analyze student marks".
2.**Data format: a dictionary where each key is a name and each value is a list of marks.** I never said anything about how the marks are stored.
3.**Letter grading scale A / B / C / D / F** with thresholds 90 / 80 / 70 / 60. Nothing in my prompt mentioned grades or a grading scale.
4.**A "Status: Pass / Fail" rule with a threshold of 40.** The AI invented its own pass threshold (40) — I never gave one. The spec later says 50, but the AI had no way to know that.
5.**A "Total" column per student.** I never asked for totals.
6.**A printing script instead of a function.** The output is printed with `print()` at module level — there is no function at all, no `analyze_marks`, no return value.
7.**No `pass_mark` parameter.** The AI hardcoded its own pass rule (`average >= 40`) inside the loop.
8.**No input validation.** The code assumes every value is a number and never raises an error for invalid input.
9.**No function signature at all.** The AI did not create any callable; the script runs immediately on import.

**Questions it should have asked and did not:**

1."What should the function be called, and what arguments does it take?" — the signature `analyze_marks(marks, pass_mark=50)` was never produced.
2."Should the code return a value or print to the console?" — the AI chose to print, not return.

**Is the function named `analyze_marks` with the required signature?** No — there is no function called `analyze_marks`. The file is a top-level script with hardcoded data.

**First impression before testing** (one sentence — you will compare this with section 6 later):

Looks like a plausible little report script, but it is a completely different program from what the lab asks for — no function, no parameters, no return value, no validation.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1.B produced the required function `analyze_marks(marks, pass_mark=50)` with the correct signature — A produced no callable at all.
2.B returns a dictionary with the four required keys `average`, `highest`, `lowest`, `pass_rate` — A only printed text and invented its own keys.
3.B validates input and raises `ValueError` for empty list, non-numeric values, and out-of-range values — A had no validation.
4.B uses `>=` for the pass check, so a mark equal to `pass_mark` counts as passing — A had no pass_mark parameter at all.

**What B still leaves open:**

1.`pass_rate` is returned as a raw float (`66.66666666666666`) instead of being rounded to 2 decimals (`66.67`). The harness tolerates this because of its 0.01 tolerance, but the example in the spec shows `66.67`.
2.The code silently treats `bool` values (`True`/`False`) as invalid — a reasonable choice, but not stated in the prompt, so it is an assumption.
3.`average` is returned without rounding too (`60.0` here happens to be exact, but `[1, 2]` would give `1.5`, and `[1, 2, 4]` would give `2.3333...`).

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```


**Tests the AI wrote for itself** — how many, and which situations do they cover?

The AI wrote 7 test assertions, grouped inside one `test_analyze_marks()` function.

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes — `analyze_marks([75])` |
| decimals | yes — `analyze_marks([25.5, 50.5, 74.0])` |
| custom pass_mark | yes — `analyze_marks([40, 60, 80], 70)` |
| empty list | yes — `analyze_marks([])` inside try/except |
| text value | yes — `analyze_marks([40, "60", 80])` inside try/except |
| below 0 / above 100 | yes — two separate tests: `[-1, 50, 80]` and `[40, 101, 80]` |

**Do the AI's own tests pass against the AI's own code?** yes — the file runs and prints `{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}` at the end without any assertion errors.

**Do they agree with the harness in section 6?** yes — every situation the AI tested is also tested by the harness, and all six harness cases PASS.

**Assumptions C stated explicitly before the code:**

1.`marks` is expected to be an iterable of marks, typically a list.
2.`pass_mark` must be numeric; it is allowed to be outside 0–100 because only the marks themselves are constrained.
3.Booleans are rejected even though Python treats `bool` as a numeric subtype.
4.`average` and `pass_rate` are rounded to 2 decimal places.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).
Return a dictionary with exactly these keys: average, highest, lowest, pass_rate.

Rules:

marks is a list of numbers from 0 to 100 inclusive.

A mark passes if mark >= pass_mark (a mark equal to pass_mark counts as passing).

pass_rate is the percentage of passing marks, from 0 to 100.

Round both average and pass_rate to exactly 2 decimal places, then store the
rounded values in the returned dictionary.

Raise ValueError if marks is empty, contains a non-numeric value, or contains
a value outside 0-100. Also reject booleans.

Do not use any external libraries.

Example:
analyze_marks([40, 60, 80], 50)
returns {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}

Include tests for: one mark, decimals, custom pass_mark, empty list, text value,
and marks below 0 or above 100. State any remaining assumptions before the code.
```


**What I deliberately added that A, B and C did not have:**

1.**An explicit rounding rule** — "Round both average and pass_rate to exactly 2 decimal places." In B, `pass_rate` came back as `66.66666666666666`; the harness only accepted it because of its 0.01 tolerance. C rounded correctly, but only because the example showed `66.67` — it never stated the rounding rule directly.
2.**An explicit statement that `mark >= pass_mark` counts as passing** — the same ambiguity that decides case 3 (`[49.5, 50]` → pass_rate 50.0). A wrong `>` would have produced 0.0.
3.**An explicit boolean rejection rule** — B and C silently rejected `True`/`False` but never said so. D names it, so the behaviour is now part of the contract, not a hidden assumption.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

The specification's worked example shows `pass_rate 66.67`, but never says the value must be rounded. Prompt B returned `66.66666666666666` — mathematically correct, but not equal to the value in the spec. The harness tolerated this because of its `0.01` numeric tolerance. In Prompt D I resolved the ambiguity explicitly with the sentence "Round both average and pass_rate to exactly 2 decimal places", so the returned value is `66.67`, matching the spec exactly.

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1–6 | All six cases ERROR — the file defines no callable `analyze_marks`. It runs as a script with hardcoded data and prints a report instead of returning a dictionary. |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
ERROR: week-02\code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
========================================================================
analyze_marks harness — week-02/code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: marks must contain only numeric values
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_b.py)
========================================================================
```

**Prompt C**

```
========================================================================
analyze_marks harness — week-02/code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_c.py)
========================================================================
```

**Prompt D**

```
========================================================================
analyze_marks harness — week-02/code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 1 | 2 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 2 | 2 | 2 |
| **Total / 10** | **0** | **8** | **10** | **10** |

**Prompt length, in words:** A 6 · B 62 · C 110 · D 128

**Words added per point gained** — B over A, C over B, D over C:

- A → B: +56 words for +8 points (7 words per point) — by far the best return on writing effort.
- B → C: +48 words for +2 points (24 words per point) — the worked example and required tests cost more per point, but they removed the two remaining ambiguities.
- C → D: +18 words for +0 points — D scored the same as C, but D's extra sentence ("round to 2 decimals") makes the contract explicit rather than inferred from an example.

One line on what that ratio says: *Most of the value came from the first structured prompt; after that, extra words bought specificity, not correctness — the harness could not tell C and D apart, even though D is safer to re-run in the future.*

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
Prompt D scored 10/10, tied with C, and it is the one I would use at work. Both
passed all six cases. D is safer because its rounding rule is stated directly.

The addition that helped most was naming the signature and the return shape in
Prompt B. Prompt A scored 0/6 because it defined no analyze_marks function at
all. It printed a hardcoded report about four invented students, and the harness
rejected it before any case ran. Adding the signature and the four return keys
took the score from 0/6 to 6/6. Case 3 with [49.5, 50] caught the difference
between > and >=. B wrote >=, and pass_rate came back as 50.0. With > it would
have been 0.0.

Prompt C's own tests were noise. They passed against C's own code, and a test
written by the author agrees with the author. The harness is written by someone
else, which is the point.

The ambiguity I found: B returned pass_rate = 66.66666666666666, but the spec
example shows 66.67. The harness tolerance hid the difference. D fixed it with
one line: Round both average and pass_rate to exactly 2 decimal places.
```

**Word count:** 192

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
