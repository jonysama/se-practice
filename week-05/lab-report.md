# Week 05 — Lab report

**Name:** Zhanibek Alimkulov
**Group:** Monday 16:00-19:00
**Date:** 2026-10-11

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT |
| **Exact** model name | GPT-5.6 Luna |
| Language and version | Python 3.13 |
| Path | A |
| My Week 04 declaration for touching bookings | not-allowed |

My Week 04 declaration said touching bookings are **not allowed**, but AC4 this week says they **are allowed**. That changes the class diagram note (R2) and the sequence diagram guard — both would have to be updated: the overlap check `start < other.end and end > other.start` already permits touching bookings, so the Week 04 diagram was actually correct in implementation but wrong in its declared assumption. The R2 note in `class.puml` would need an extra sentence: "touching endpoints are allowed."
---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
Implementation plan for can_book

Use Python 3 and check the conditions in order. Return False as soon as any condition fails; return True only if all five acceptance criteria are satisfied.

1. Checks in order

1. Validate the time interval (AC1).

Require 0 <= start < end <= 1440.

Require start > now.

Otherwise, return False.

2. Check duration (AC2).

Calculate end - start.

Require the duration to be at most 120 minutes.

Otherwise, return False.

3. Check room status (AC3).

If blocked is True, return False.

4. Check existing bookings (AC4).

Compare the requested interval with every interval in existing.

An overlap exists when start < existing_end and end > existing_start.

If any overlap exists, return False.

Touching endpoints are allowed.

5. Accept the booking time (AC5).

Return True only if every preceding check passes.

Do not modify existing or any other input.

2. Assumptions

All times are integer minutes after midnight on the same date.
now is valid and falls between 0 and 1439, inclusive.
blocked is a Boolean.
Every existing booking is a valid (start, end) tuple for this room and represents an active booking.
Inputs satisfy the stated contract; additional type validation is not required.
Intervals include their start and exclude their end, so adjacent bookings can share a boundary.
The function only decides whether the requested time can be booked; saving and confirmation are outside its scope.

3. Boundary cases to test

- Earliest valid start: start = now + 1 — Passes the start-time check
- Start equals now: start = now — False
- Start before now: start < now — False
- Start at midnight: start = 0, end = 60, now = 1439 — False
- End at midnight boundary: start = 1380, end = 1440, now = 1379 — True if other checks pass
- End exceeds day: end = 1441 — False
- Zero-length interval: start = end — False
- Reversed interval: start > end — False
- Minimum duration: end - start = 1 — Passes duration check
- Maximum duration: end - start = 120 — Passes duration check
- Duration too long: end - start = 121 — False
- Room blocked: blocked = True — False
- No existing bookings: existing = [] — Passes overlap check
- Touching at start: Requested 600-660; existing 540-600 — No overlap
- Touching at end: Requested 600-660; existing 660-720 — No overlap
- Exact duplicate: Requested 600-660; existing 600-660 — False
- Request inside existing: Requested 610-650; existing 600-660 — False
- Existing inside request: Requested 600-660; existing 610-650 — False
- Partial overlap: Requested 630-690; existing 600-660 — False
- Multiple bookings: No overlap with one booking, overlap with another — False
- Input preservation: Check existing before and after the call — Unchanged

4. Key implementation risks

Using >= or <= incorrectly in the overlap check, which would reject bookings that touch at an endpoint.
Checking duration incorrectly, such as rejecting exactly 120 minutes.
Allowing start == now, despite AC1 requiring a strictly future start.
Checking only one existing booking instead of all bookings.
Modifying existing while checking for conflicts.
Returning True too early, before all acceptance criteria have been evaluated.

The most important tests are the exact boundaries: start == now, duration of exactly 120 minutes, end == 1440, and bookings that touch but do not overlap.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Every step in the plan — the check order (AC1, AC2, AC3, AC4), the overlap formula `start < existing_end and end > existing_start`, the `start > now` requirement, the duration limit of 120, and the "do not modify existing" rule | All of these are directly in the contract block or in AC1–AC5. No step adds a rule the specification does not state. No buffer between bookings, no sorting, no storage, no validation of contract-guaranteed inputs. | Nothing to drop. Kept the plan as written. |

**Boundary cases the assistant suggested that I kept as tests:**

- `start == now` (AC1: `start > now` means strictly future)
- `end == 1440` (AC1: `end <= 1440`)
- `end == 1441` (AC1: rejected)
- `duration == 120` (AC2: allowed, "at most")
- `duration == 121` (AC2: rejected)
- touching at end: request `600–660`, existing `660–720` (AC4: allowed)
- touching at start: request `600–660`, existing `540–600` (AC4: allowed)
- exact duplicate: request `600–660`, existing `600–660` (AC4: rejected)
- `existing == []` (AC4: passes trivially)
- input preservation: check `existing` before and after

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | | | |

**Boundary cases the assistant suggested that I kept as tests:**

-

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440 and start > now): return False` | AC1 | Correct. `start < end` rejects zero-length and reversed intervals; `<= 1440` rejects `end > 1440`; `start > now` is strict, so a request starting exactly at `now` is rejected. |
| 2 | `if end - start > 120: return False` | AC2 | Correct. Uses `>` (strict), so a duration of exactly 120 passes, which matches "at most 120 minutes". |
| 3 | `if blocked: return False` | AC3 | Correct. Rejects any request when the room is blocked, regardless of other conditions. |
| 4 | `for existing_start, existing_end in existing: if start < existing_end and end > existing_start: return False` | AC4 | Correct. The two strict comparisons `start < existing_end and end > existing_start` are the standard overlap test that excludes touching endpoints. Request `660–720` vs existing `600–660`: `660 < 660` is False, so no overlap is detected — touching is allowed as required. The loop checks every existing booking. |
| 5 | `return True` | AC5 | Correct. Reached only when all preceding checks passed, and no input was modified anywhere. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- Nothing. The function does exactly AC1–AC5 in order, returns a Python bool, and does not touch `existing` or any other input. No buffer, no sorting, no storage, no logging, no type validation beyond what the contract already guarantees.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
