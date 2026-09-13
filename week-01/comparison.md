# Week 01 — Manual vs AI: Comparison

**Name:**
**Group:**
**Date:**

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | JavaScript / React (web app) |
| Time to first version that ran | 20 min | 8 min |
| Time to all 4 test cases passing | 35 min | 18 min |
| Number of attempts / prompts needed | 1 | 1 + 2 answers + 1 fix |
| Lines of code you actually wrote | 47 | 0 |
| Did it handle invalid marks (case B)? | yes | yes |
| Did it handle an empty list (case D)? | yes | yes |
| Did it use the ≥ 50 pass threshold? | yes | yes |
| Output format matches the spec? | yes | yes (after 1 fix) |
| Can you explain every line of it? | yes | no |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | 5 / 67.00 / 92 / 23 / 60.0% | 5 / 67.00 / 92 / 23 / 60.0% (after fix) | avg 67.00 · high 92 · low 23 · pass 60.0% | yes |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | 5 / 71.60 / 100 / 47 / 80.0% | 5 / 71.60 / 100 / 47 / 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | yes |
| C | `10, 20, 30` | 3 / 20.00 / 30 / 10 / 0.0% | 3 / 20.00 / 30 / 10 / 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% | yes |
| D | `abc, , xyz` | No valid marks found. | No valid marks found | clear message, no crash | yes |

## 3. What the AI added that I never asked for

- A full web UI (React) with cards and styled components — I asked for a "small program".
- A 10-point grade distribution chart.
- A colour-coded "All marks" list sorted high→low.
- Letter grades (A+, A, B, C, F) next to every value.
- A "Load example" link.
- Support for one-mark-per-line input in addition to comma-separated.
- A "Copy Results" button.
- A "Personal Tool - No Login Required" badge.

## 4. What the AI got wrong or silently skipped

- Average printed as 67.0 instead of 67.00 (spec: 2 decimal places).
- Pass rate printed as 60% instead of 60.0% (spec: 1 decimal place).
- These bugs were not visible to the eye — only an exact spec test caught them.
- The AI silently skipped the output-format requirement of the spec.

## 5. The defect I asked Rocket to fix

**Prompt I used:**
    Format the average with exactly 2 decimal places and the pass rate
    with exactly 1 decimal place (for example: 67.00 and 60.0%).

**Result:** fixed

**What this tells me:**
The AI can fix a defect quickly once the defect is detected. But detecting it
was my job, not the AI's. If I had only checked "does it look right", I would
have shipped wrong output. The engineer must define the exact contract (2 decimals,
1 decimal) and verify against it.

---

## 6. Reflection (200–300 words)

Working with the AI was honestly much more fun than writing the manual version.
Typing forty lines of Python by hand was slow and boring — I had to think about
loops, edge cases, and formatting all at once. Rocket did the same thing in about
eight minutes while I just described what I wanted and answered two questions.
The whole flow felt like the future: I describe the result, the AI builds it, and
I check if it works. Fixing the decimal-format bug through a short follow-up
prompt was actually the most interesting part of the lab — I typed one sentence
and the app updated itself. That felt like real leverage.

Where the AI still cost me time: it silently got the output format wrong (67.0
instead of 67.00, 60% instead of 60.0%). I only caught it because I tested
against the exact numbers from the README. That taught me something important —
the AI is fast at producing something plausible, but the spec is my job. If I had
trusted it blindly, I would have shipped a wrong result and not even noticed.

If I had to put my name on one artefact, I would put it on the Rocket version,
not the manual one. The manual one proves I can write the code, but the AI one
is closer to how I actually want to work as an engineer. I can explain what it
does and how I tested it, even if I did not write every line myself.

The human engineer after this experiment is still responsible for the spec, the
testing, and the final "yes, this is correct". The AI is a fast builder, but the
contract and the verification stay mine.
