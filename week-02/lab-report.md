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

```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | |
| decimals | |
| custom pass_mark | |
| empty list | |
| text value | |
| below 0 / above 100 | |

**Do the AI's own tests pass against the AI's own code?** yes / no

**Do they agree with the harness in section 6?** yes / no — if no, where do they disagree:

**Assumptions C stated explicitly before the code:**

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```

```

**What I deliberately added that A, B and C did not have:**

1.
2.
3.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | | |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | | |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | | |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | | |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | | |
| | **Totals** | | 0/6 | 6/6 | /6 | /6 |

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

```

**Prompt D**

```

```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | | | | |
| Requirement coverage | | | | |
| Verifiability (tests) | | | | |
| Assumptions stated | | | | |
| Noise (2 = none) | | | | |
| **Total / 10** | | | | |

**Prompt length, in words:** A ____ · B ____ · C ____ · D ____

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)



```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
