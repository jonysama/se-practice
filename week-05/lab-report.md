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
| 1 | test_touching_end_is_allowed | (660, 720) | — | True | AC4 | pass | pass |
| 2 | test_partial_overlap_is_rejected | (630, 690) | overlap | False | AC4 | pass | pass |
| 3 | test_blocked_room_is_rejected | (660, 720) | blocked=True | False | AC3 | pass | pass |
| 4 | test_exactly_two_hours_is_allowed | (720, 840) | duration=120 | True | AC2 | pass | pass |
| 5 | test_over_two_hours_is_rejected | (720, 841) | duration=121 | False | AC2 | pass | pass |
| 6 | test_starting_now_is_rejected | (540, 570) | start=now | False | AC1 | pass | pass |
| 7 | test_zero_length_interval_is_rejected | (700, 700) | start==end | False | AC1 | pass | pass |
| 8 | test_reversed_interval_is_rejected | (700, 690) | start>end | False | AC1 | pass | pass |
| 9 | test_end_at_1440_is_allowed | (1380, 1440) | end=1440, now=1379 | True | AC1 | pass | pass |
| 10 | test_end_after_1440_is_rejected | (1380, 1441) | end=1441 | False | AC1 | pass | pass |
| 11 | test_empty_existing_allows_booking | (600, 660) | existing=[] | True | AC4 | pass | pass |
| 12 | test_overlap_with_second_of_multiple_bookings | (720, 780) | existing=[(600,660),(700,760)] | False | AC4 | pass | pass |
| 13 | test_request_inside_existing_is_rejected | (615, 645) | request inside existing | False | AC4 | pass | pass |
| 14 | test_existing_inside_request_is_rejected | (570, 690) | existing inside request | False | AC4 | pass | pass |
| 15 | test_exact_duplicate_booking_is_rejected | (600, 660) | identical to existing | False | AC4 | pass | pass |
| 16 | test_result_is_bool_on_accept | (660, 720) | bool type on accept | True | AC5 | pass | pass |
| 17 | test_result_is_bool_on_reject_overlap | (630, 690) | bool type | False | AC5 | pass | pass |
| 18 | test_result_is_bool_on_reject_blocked | (660, 720) | blocked=True | False | AC5 | pass | pass |
| 19 | test_result_is_bool_on_reject_duration | (720, 841) | duration=121 | False | AC5 | pass | pass |
| 20 | test_result_is_bool_on_reject_start_not_future | (540, 570) | start=now | False | AC5 | pass | pass |
| 21 | test_result_is_bool_on_reject_zero_length | (700, 700) | start==end | False | AC5 | pass | pass |
| 22 | test_existing_not_modified_on_accept_sorted | (660, 720) | snapshot before/after | unchanged | AC5 | pass | pass |
| 23 | test_existing_not_modified_on_reject_sorted | (630, 690) | snapshot before/after | unchanged | AC5 | pass | pass |
| 24 | test_existing_not_modified_on_accept_unsorted | (660, 720) | unsorted input | unchanged | AC5 | pass | pass |
| 25 | test_existing_not_modified_on_reject_unsorted | (630, 690) | unsorted input | unchanged | AC5 | pass | pass |
| 26 | test_existing_not_modified_three_bookings | (660, 720) | 3 bookings | unchanged | AC5 | pass | pass |
| 27 | test_existing_not_modified_when_blocked | (660, 720) | blocked=True | unchanged | AC5 | pass | pass |
| 28 | test_empty_existing_not_modified | (600, 660) | empty list | unchanged | AC5 | pass | pass |
| 29 | test_existing_with_duplicates_not_modified | (660, 720) | duplicate entries | unchanged | AC5 | pass | pass |

---

## 5. Task 4 — debugging with evidence

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | can_book(660, 720, 540, False, [(700, 760), (600, 660)]) — unsorted existing, accepted path | existing unchanged | existing unchanged | No defect in v1; v1 does not mutate or reorder `existing`. The gap was in my test suite — the first non-mutation tests used a sorted list, so a sort inside the function would have passed them. | Added test_existing_not_modified_on_accept_unsorted and ..._on_reject_unsorted. | me, from checker M9/M10 feedback |
| 2 | can_book(600, 660, 540, False, []) — empty list | existing still `[]` | existing still `[]` | No defect in v1. Empty list was not covered; a faulty version appending to `existing` would have survived. | Added test_empty_existing_not_modified. | me, from checker M9 feedback |
| 3 | can_book(660, 720, 540, False, [(600, 660), (600, 660)]) — duplicate entries | existing unchanged | existing unchanged | No defect in v1. Duplicates were not covered. | Added test_existing_with_duplicates_not_modified. | me, from checker M9 feedback |

**The debug prompt I sent, and the assistant's answer**:

```text
(not used — v1 was correct as written; the only gaps were in my test suite.)
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
There are no concrete issues with this implementation against the supplied contract and AC1–AC5.

The implementation satisfies all requirements:

AC1 — Valid future interval: if not (0 <= start < end <= 1440 and start > now): enforces the time bounds, positive interval length, and strictly future start.

AC2 — Maximum duration: if end - start > 120: rejects durations exceeding 120 minutes while allowing exactly 120 minutes.

AC3 — Room not blocked: if blocked: returns False when the room is blocked.

AC4 — No overlap: if start < existing_end and end > existing_start: correctly detects overlapping intervals while allowing touching endpoints.

AC5 and input preservation: return True is reached only after all checks pass. The function does not modify existing or any other input.

Conclusion: No changes are required under the stated contract and acceptance criteria.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | No concrete issues against AC1–AC5. | accept | F1–F10 pass on the first run. | no change |
| 2 | AC4 uses strict comparisons and allows touching. | accept | Contract: "Intervals include the start and exclude the end"; AC4: "Touching endpoints are allowed". | no change |
| 3 | The function does not modify existing or any other input. | accept with a caveat | Correct on reading, but my first non-mutation tests used a sorted list only. M9/M10 exposed this. Added six input-preservation tests. | S1: 29 tests, OK |
| 4 | No changes are required. | accept | Function is correct as written; post-critique changes were to the test suite only. | M9 and M10 PASS |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | code/booking.py: no change | v1 passed F1-F10 and all tests on the first run | F1-F10 all PASS, S2 PASS |
| 2 | code/test_booking.py: added test_exact_duplicate_booking_is_rejected | exact-duplicate overlap not covered | closes an AC5 gap |
| 3 | code/test_booking.py: added test_existing_not_modified_on_reject_sorted | input preservation was only checked on the accepted path | M10 feedback |
| 4 | code/test_booking.py: added unsorted non-mutation tests | sorted lists would not catch a sort inside the function | M9/M10 both PASS after adding |
| 5 | code/test_booking.py: added empty-list, three-bookings, blocked non-mutation tests | broaden input-preservation coverage | M9/M10 PASS |
| 6 | code/test_booking.py: added six test_result_is_bool_on_* tests | bool type was only checked on the accepted path | F9 stays PASS |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_empty_existing_allows_booking (test_booking.BookingTests.test_empty_existing_allows_booking) ... ok
test_empty_existing_not_modified (test_booking.BookingTests.test_empty_existing_not_modified) ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests.test_end_after_1440_is_rejected) ... ok
test_end_at_1440_is_allowed (test_booking.BookingTests.test_end_at_1440_is_allowed) ... ok
test_exact_duplicate_booking_is_rejected (test_booking.BookingTests.test_exact_duplicate_booking_is_rejected) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_inside_request_is_rejected (test_booking.BookingTests.test_existing_inside_request_is_rejected) ... ok
test_existing_not_modified_on_accept_sorted (test_booking.BookingTests.test_existing_not_modified_on_accept_sorted) ... ok
test_existing_not_modified_on_accept_unsorted (test_booking.BookingTests.test_existing_not_modified_on_accept_unsorted) ... ok
test_existing_not_modified_on_reject_sorted (test_booking.BookingTests.test_existing_not_modified_on_reject_sorted) ... ok
test_existing_not_modified_on_reject_unsorted (test_booking.BookingTests.test_existing_not_modified_on_reject_unsorted) ... ok
test_existing_not_modified_three_bookings (test_booking.BookingTests.test_existing_not_modified_three_bookings) ... ok
test_existing_not_modified_when_blocked (test_booking.BookingTests.test_existing_not_modified_when_blocked) ... ok
test_existing_with_duplicates_not_modified (test_booking.BookingTests.test_existing_with_duplicates_not_modified) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_with_second_of_multiple_bookings (test_booking.BookingTests.test_overlap_with_second_of_multiple_bookings) ... ok
test_partial_overlap_is_rejected (test_booking.BookingTests.test_partial_overlap_is_rejected) ... ok
test_request_inside_existing_is_rejected (test_booking.BookingTests.test_request_inside_existing_is_rejected) ... ok
test_result_is_bool_on_accept (test_booking.BookingTests.test_result_is_bool_on_accept) ... ok
test_result_is_bool_on_reject_blocked (test_booking.BookingTests.test_result_is_bool_on_reject_blocked) ... ok
test_result_is_bool_on_reject_duration (test_booking.BookingTests.test_result_is_bool_on_reject_duration) ... ok
test_result_is_bool_on_reject_overlap (test_booking.BookingTests.test_result_is_bool_on_reject_overlap) ... ok
test_result_is_bool_on_reject_start_not_future (test_booking.BookingTests.test_result_is_bool_on_reject_start_not_future) ... ok
test_result_is_bool_on_reject_zero_length (test_booking.BookingTests.test_result_is_bool_on_reject_zero_length) ... ok
test_reversed_interval_is_rejected (test_booking.BookingTests.test_reversed_interval_is_rejected) ... ok
test_starting_now_is_rejected (test_booking.BookingTests.test_starting_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_zero_length_interval_is_rejected (test_booking.BookingTests.test_zero_length_interval_is_rejected) ... ok

----------------------------------------------------------------------
Ran 29 tests in 0.002s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (21 lines)
PASS   S1   your suite has at least 11 tests            29 tests
PASS   S2   your suite is green on your own code        29 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_result_is_bool_on_reject_start_not_future, test_starting_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_1440_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_result_is_bool_on_reject_zero_length, test_zero_length_interval_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected, test_result_is_bool_on_reject_blocked
PASS   M6   your tests catch a fault in AC4             caught by test_result_is_bool_on_accept, test_touching_end_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_overlap_with_second_of_multiple_bookings
PASS   M8   your tests catch a fault in AC4             caught by test_existing_inside_request_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_empty_existing_not_modified, test_existing_with_duplicates_not_modified
PASS   M10  your tests catch a fault in AC5             caught by test_existing_not_modified_on_accept_unsorted, test_existing_not_modified_on_reject_unsorted, test_existing_not_modified_three_bookings
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              5 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  29 tests listed
PASS   L5   report 5: debugging evidence                3 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 4 points judged
PASS   L7   report 7: change log                        6 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      151 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
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

none — final run is clean (32 PASS, 0 FAIL, 0 ERROR).

### 9.2 Outside the contract

The contract says times are integers and does not say what can_book does for `600.5` or `"600"`. My function silently accepts `600.5` (Python float comparisons work) and raises `TypeError` on `"600"`. I declared `return-false` in submission.yml: the contract describes integers only, so non-integer input is out of scope and should not produce a successful booking. I did not add explicit type-checks because AC5 does not ask for them.

### 9.3 A bound that never decides

The upper bound `end <= 1440` in AC1 can never be the only reason a request is rejected. If `end > 1440`, then `end - start > 120` for any `start >= 0` inside a day, so AC2 rejects too. A test with `end = 1441` cannot isolate AC1's upper bound from AC2.

---

## 10. Conclusion (120–180 words)

The overlap condition in my final code is `start < existing_end and end > existing_start`. Both comparisons are strict. This is what allows touching bookings through: when a new booking ends exactly where an existing one starts, `end > existing_start` is false, so no overlap is detected. If either comparison used `<=` or `>=`, a touching request would be rejected and F7 would fail on `can_book(660, 720, ...)`.

The fault my tests missed the longest was AC5 — "never alter existing". My first suite checked input preservation only on the accepted path with a sorted list, so a faulty version that reordered or appended to `existing` would have survived. Adding unsorted lists, an empty list, and the rejected path closed the gap.

The decision I had to make that neither the contract nor the assistant decided was the non-integer case. The contract says times are integers, so I declared return-false in submission.yml.