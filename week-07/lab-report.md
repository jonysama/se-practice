# Week 07 — Lab report

**Name:** Zhanibek Alimkulov
**Group:** Monday 16:00-19:00
**Date:** 2026-11-02

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | `starter` |
| Bolt project link (or `not shared`, and why) | not-shared |
| Assistant that generated the tests (tool) | ChatGPT |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |
| Test command | `npx vitest run` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `src/App.tsx`, inside the `check()` function. |
| Its inputs | `start`, `end`, `now`, `blocked`, `bookings` (from React state). |
| What it returned | It set a boolean `result` state, which the UI used to show Available/Unavailable. |
| How the page used it | Called `check()` on button click, which calculated the boolean and updated the state. |

**What I changed to extract `canBook`.** I moved the availability validation logic out of the `check()` function inside `App.tsx` and into a new file `src/booking.ts`. The new `canBook` function receives an object with `start`, `end`, `now`, `blocked`, and `bookings`, and returns a boolean. I then imported `canBook` in `App.tsx` and called it on button click. The behavior is identical because I copied the exact conditions and logical operators, ensuring the UI still works as before.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | 660 is excluded from the existing booking 600-660, so they only touch and don't overlap. |
| T02 | 540–570 (starts now) | false | AC1 | The start time must be strictly after now. 540 is not greater than 540. |
| T03 | 720–720 (zero duration) | false | AC1 | Start must be less than end. 720 is not less than 720. |
| T04 | 750–720 (reversed) | false | AC1 | Start must be less than end. 750 is greater than 720. |
| T05 | 1380–1441 (past day end) | false | AC1 | End must be less than or equal to 1440. 1441 exceeds the day. |
| T06 | 720–840 (120 minutes) | true | AC2 | Duration is exactly 120 minutes, which is allowed ("at most 120 minutes"). |
| T07 | 720–841 (121 minutes) | false | AC2 | Duration is 121 minutes, which exceeds the 120-minute limit. |
| T08 | 570–600 (touching before) | true | AC4 | 600 is excluded from the existing booking 600-660, so they only touch. |
| T09 | 630–690 (partial overlap) | false | AC4 | The interval 630-690 overlaps the 600-660 booking on the end side. |
| T10 | 570–690 (contains booking) | false | AC4 | The requested interval fully contains the 600-660 booking. |
| T11 | 615–645 (inside booking) | false | AC4 | The requested interval is fully inside the 600-660 booking. |
| T12 | 600–660 (identical interval) | false | AC4 | The requested interval is exactly the same as the existing booking. |
| T13 | 660–720, blocked = true | false | AC3 | The room is blocked, so no bookings are allowed regardless of time. |
| T14 | 630–690, bookings = [] | true | AC4 | There are no existing bookings, so there is no overlap. |
| AC5 | an Available request | true, data unchanged | AC5 | The function must return true and not mutate the input array. |
| X1 | 650-670, bookings: [{600-660}, {660-720}] | false | AC4 | The interval touches two bookings but overlaps the second one (660-720). |
| X2 | 1400-1440, now=1430 | false | AC1 | The start is 1400, which is not strictly after now (1430). |

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.**
```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.
Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.
Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Here is the test file. Run it with `npx vitest run`.
AC mapping: T01-T14 cover AC1-AC4. AC5 covers data preservation. X1 and X2 are your custom cases.
I assumed T06 (exactly 120 minutes) should be rejected based on the "at most" wording.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

| # | Test or part of the suite | What is weak or wrong | Decision | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T06 AC2: 120 minutes | The AI wrote `expect(...).toBe(false)`. | revise | AC2 says "at most 120 minutes", so exactly 120 is allowed. The expected value should be `true`. |
| 2 | Prompt assumptions | The AI explicitly flagged that it assumed 120 minutes should be rejected. | accept | The AI correctly identified the ambiguity but drew the wrong conclusion. |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited.
```text
RUN  v3.2.7 C:/Kbtu/se-practice/week-07/app

 ❯ src/booking.test.ts (17 tests | 1 failed) 8ms
   ✓ Smart Campus Booking > T01 AC4: touching after 1ms
   ✓ Smart Campus Booking > T02 AC1: starts now 0ms
   ✓ Smart Campus Booking > T03 AC1: zero duration 0ms
   ✓ Smart Campus Booking > T04 AC1: reversed 0ms
   ✓ Smart Campus Booking > T05 AC1: past day end 0ms
   × Smart Campus Booking > T06 AC2: 120 minutes (AI WRONG EXPECTATION) 5ms
     → expected true to be false // Object.is equality
   ✓ Smart Campus Booking > T07 AC2: 121 minutes 0ms
   ✓ Smart Campus Booking > T08 AC4: touching before 0ms
   ✓ Smart Campus Booking > T09 AC4: partial overlap 0ms
   ✓ Smart Campus Booking > T10 AC4: contains booking 0ms
   ✓ Smart Campus Booking > T11 AC4: inside booking 0ms
   ✓ Smart Campus Booking > T12 AC4: identical interval 0ms
   ✓ Smart Campus Booking > T13 AC3: blocked 0ms
   ✓ Smart Campus Booking > T14 AC4: empty bookings 0ms
   ✓ Smart Campus Booking > AC5: data unchanged 0ms
   ✓ Smart Campus Booking > X1 AC4: overlapping second booking 0ms
   ✓ Smart Campus Booking > X2 AC1: starts past now 0ms

 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| T06 | AssertionError: expected true to be false | Input + expected result against AC | Test repair | Changed expected from false to true to match AC2. |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.
For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.
Use the actual failure output below. Separate test repairs from implementation fixes.

RUN v3.2.7 C:/Kbtu/se-practice/week-07/app
❯ src/booking.test.ts (17 tests | 1 failed) 8ms
...
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
RUN  v3.2.7 C:/Kbtu/se-practice/week-07/app

 ✓ src/booking.test.ts (17 tests) 2ms
   ✓ Smart Campus Booking > T01 AC4: touching after 1ms
   ✓ Smart Campus Booking > T02 AC1: starts now 0ms
   ✓ Smart Campus Booking > T03 AC1: zero duration 0ms
   ✓ Smart Campus Booking > T04 AC1: reversed 0ms
   ✓ Smart Campus Booking > T05 AC1: past day end 0ms
   ✓ Smart Campus Booking > T06 AC2: 120 minutes (AI WRONG EXPECTATION) 0ms
   ✓ Smart Campus Booking > T07 AC2: 121 minutes 0ms
   ✓ Smart Campus Booking > T08 AC4: touching before 0ms
   ✓ Smart Campus Booking > T09 AC4: partial overlap 0ms
   ✓ Smart Campus Booking > T10 AC4: contains booking 0ms
   ✓ Smart Campus Booking > T11 AC4: inside booking 0ms
   ✓ Smart Campus Booking > T12 AC4: identical interval 0ms
   ✓ Smart Campus Booking > T13 AC3: blocked 0ms
   ✓ Smart Campus Booking > T14 AC4: empty bookings 0ms
   ✓ Smart Campus Booking > AC5: data unchanged 0ms
   ✓ Smart Campus Booking > X1 AC4: overlapping second booking 0ms
   ✓ Smart Campus Booking > X2 AC1: starts past now 0ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | |
| M3 | Remove the blocked-room rejection | Detected | T13 | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
RUN  v3.2.7 C:/Kbtu/se-practice/week-07/app
 ❯ src/booking.test.ts (17 tests | 1 failed) 8ms
   × Smart Campus Booking > T06 AC2: 120 minutes (AI WRONG EXPECTATION) 5ms
 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)

RUN  v3.2.7 C:/Kbtu/se-practice/week-07/app
 ❯ src/booking.test.ts (17 tests | 3 failed) 8ms
   × Smart Campus Booking > T01 AC4: touching after 6ms
   × Smart Campus Booking > T08 AC4: touching before 0ms
   × Smart Campus Booking > AC5: data unchanged 0ms
 Test Files  1 failed (1)
      Tests  3 failed | 14 passed (17)

RUN  v3.2.7 C:/Kbtu/se-practice/week-07/app
 ❯ src/booking.test.ts (17 tests | 1 failed) 8ms
   × Smart Campus Booking > T13 AC3: blocked 0ms
 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | The result showed "Available". | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | The result changed to "Unavailable" when blocked was checked. | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | The error "Fill in the current time, the start and the end." appeared. | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | The layout stacked vertically and all controls were visible. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | The list "10:00–11:00" remained unchanged after multiple checks. | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The checker is clean. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 16 / 1 | 17 / 17 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1-AC5 covered. | AC1-AC5 covered. |
| Selected mutants detected | N/A | M1, M2, M3 |
| Accepted / revised / rejected tests | 16 accepted, 1 revised | All accepted. |
| Remaining limitations | The AI misunderstood AC2. | UI checks are manual. |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-My function returns true for a reversed existing booking. No AC specifies this, so I am declaring this behaviour.

---

## 10. Conclusion (120–180 words)

The biggest mistake in the first suite was T06 (120 minutes). The AI assumed AC2 meant exactly 120 minutes should be rejected. If I had changed the code to match this flawed test, M1 would have become the real behavior. My final green run proves that the tests catch the three mutants (M1, M2, M3) and cover all primary boundaries. However, it does not prove the code is flawless. For example, it does not test reversed existing bookings, which return true by default because no AC specifies otherwise. A remaining limitation is that unit tests cannot verify the UI's responsiveness or error message visibility; those require the manual checks I performed with screenshots. Another limitation is that the AI's tests could still share its blind spots, which is why independent code review is always necessary.