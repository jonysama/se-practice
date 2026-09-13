# Prompts and Rocket log — Week 01

## 1. Prompt I typed (exact)

    Build a small program that processes a list of student marks and prints:
    average, highest, lowest, and pass rate.

## 2. Questions Rocket asked me

1. How do you want marks to be entered into the tool?
   - Type them in one by one
   - Paste a list of numbers
   - Upload a CSV or spreadsheet
   - Mix of names and marks
   → I answered: Paste a list of numbers

2. Who is this tool for?
   - Just me — personal use
   - Teachers at a school
   - Anyone — open to all
   → I answered: Just me — personal use

(Prompt score before answering: 65%. After my answers: 71%.)

## 3. Rewritten prompt by Rocket

    <вставь сюда Revised prompt из Rocket — слово в слово>

## 4. Things Rocket added on its own

- A full web UI with cards, a chart, and styled components
- Pass threshold slider (defaulted to 50 — matched the spec by chance)
- Grade distribution chart with 10-point brackets
- "All marks" list sorted high→low with colour-coded badges
- Letter grades (A+, A, B, C, F) next to each value
- "Load example" link
- Support for one-mark-per-line input in addition to comma-separated
- "Copy Results" button
- "Personal Tool - No Login Required" badge

## 5. Test results

### Test A — input: 85, 23, 45, 90, 92
Rocket output: 5 students · avg 67.0 · high 92 · low 23 · pass 60%
Spec says:     5 students · avg 67.00 · high 92 · low 23 · pass 60.0%
Match? Almost — logic correct, decimal format wrong

### Test B — input: 88, 47, -5, 101, abc, 73, 50, , 100
Rocket output: 5 students · avg 71.6 · high 100 · low 47 · pass 80%
Spec says:     5 students · avg 71.60 · high 100 · low 47 · pass 80.0%
Match? Almost — invalid values correctly skipped, decimal format wrong

### Test C — input: 10, 20, 30
Rocket output: 3 students · avg 20.0 · high 30 · low 10 · pass 0%
Spec says:     3 students · avg 20.00 · high 30 · low 10 · pass 0.0%
Match? Almost — decimal format wrong

### Test D — input: abc, , xyz
Rocket output: "No valid marks found — Make sure marks are numbers between 0 and 100,
                separated by commas or new lines."
Spec says:     clear message, no crash
Match? YES — clear message, no crash, no NaN

## 6. Defect I asked Rocket to fix

Prompt I used:
    Format the average with exactly 2 decimal places and the pass rate
    with exactly 1 decimal place (for example: 67.00 and 60.0%).

Result: fixed

Notes: Rocket updated the display using toFixed(2) for the average and
toFixed(1) for the pass rate. After the fix, test A showed 67.00 and 60.0%
as required. It also applied the fix to the copy-to-clipboard export.

## 7. Stack revealed in the fix

The fix response mentioned toFixed(2) and toFixed(1) — JavaScript/React.
This confirms the AI chose a web stack (React) for a task that could have
been a simple console script.