
# Week 06 — Lab report

**Name:** Zhanibek Alimkulov  
**Group:** Monday 16:00-19:00  
**Date:** 2026-10-18

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed |
| Bolt project link (or `not shared`, and why) | [Bolt.new project](https://bolt.new/?classId=b821ca27-77bc-49a8-8d38-127b962fe5c9&assignmentId=88814bc6-47f1-4ee7-9e88-e3d039bf07ea&submissionId=c84146d2-48c7-cefe-af8b-bc7ed8f21989) |
| Browser and version | Microsoft Edge 155.0.4283.45 |
| If you could not use Bolt.new: the tool you used instead, and why | — |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** The last column was completed after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | The page will save the checked interval as a booking, so a second check of the same slot says Unavailable. | AC5 | No. The availability check did not create a booking. T8 remained Available when I checked the same interval twice. |
| 2 | There will be no way to set the current time or block a room, so T3 and T6 will be Not testable. | AC1, AC3 | Partially right. v1 already allowed me to change the current time, so T6 was testable. However, the blocked room was disabled in the dropdown, so T3 was Not testable. |

**The initial prompt exactly as I sent it:**

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Intervals include the start and exclude the end. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` before any cleanup prompt: yes.

**Bolt's list of the files/components it created, pasted unedited:**

```text
Main files/components created:

src/types.ts — Type definitions for rooms, bookings, and the availability result
src/sampleData.ts — Five fictional campus rooms and five sample bookings
src/availability.ts — Pure function implementing all acceptance criteria
src/App.tsx — Single-page UI with the form, result panel, room details, and booking list
```

**What v1 does — one line per thing that works, or visibly does not:**

- Pick a room from a dropdown — works.
- Enter start time and end time — works.
- Adjust the "Current Campus Time" — works.
- Check Availability button — works, shows Available or Unavailable.
- Explanation text with the result — works.
- Sidebar shows existing bookings — works.
- Room blocked status — shown in the UI, but the blocked room cannot be selected in v1.
- Responsive layout — visible in the browser.

**Repair prompt** (only if the first build did not run):

```text
none
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**, and the room's **only booking 10:00–11:00**.

The Expected column follows AC1–AC6.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Available | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Not testable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Unavailable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Unavailable | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

I selected two problems for cleanup. The first affected a required functional test, while the second affected how clearly the interface explained its input.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Blocked room cannot be selected | Steps: Open the room dropdown and try to select the blocked room. Expected: The room can be selected and the availability check rejects it. Observed: The blocked room option is greyed out and disabled, making T3 Not testable. Evidence: `evidence/issue-1.png`. | High | Fix |
| 2 | Unclear explanation for Current Campus Time | Steps: Look at the current time input. Expected: The interface explains how this field affects availability. Observed: The label "(for testing)" does not clearly explain that the supplied time is used to reject requests starting too early. Evidence: `evidence/issue-2.png`. | Medium | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, the blocked room in the dropdown produces a "Not testable" state because it is greyed out and cannot be selected, but AC3 requires rejecting a booking for a blocked room. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
```

**Bolt's answer:**

```text
Bolt's answer: The fix is small: remove the disabled attribute on blocked room options so they can be selected, and align the rejection reason text with what AC3 asks for. Two edits: remove disabled={room.blocked} from the dropdown option in App.tsx, and update the blocked-room reason text in availability.ts to "Room is blocked".
```

**Cleanup prompt, as sent:**

```text
Review only the "Current Campus Time" input component for UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.
```

**Bolt's answer:**

```text
Bolt's answer: The input already uses type="time", which is the native browser time picker. The real UI feedback problem is the label "(for testing)". I reworded the label to "Current Campus Time" with a small helper line underneath: "Start times before this value are rejected." This makes the connection to AC1 visible to the user.
```

**Every change or suggestion Bolt made, judged:**

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Removed the disabled attribute from blocked room options and updated the rejection message to "Room is blocked". | accept | AC3 requires rejecting bookings for blocked rooms. The original interface prevented the test instead of showing a decision. The fix is small and directly addresses the problem. | T3 → Unavailable. Other recorded cases still pass. |
| 2 | Kept the existing native time picker and clarified its label and helper text. | accept | AC6 requires understandable feedback, and AC1 depends on the supplied current time. Improving the explanation is useful without changing the working input. | T6 → Unavailable. T1–T9 remain unchanged after cleanup. |

I would reject replacing the native time input with an unnecessary custom component. It already accepted time values correctly, and replacing it would add complexity without solving the actual usability problem.

---

## 7. Change log — v1 to final

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Blocked room was disabled in the dropdown. | Fix | `src/App.tsx` — removed the disabled attribute from blocked room options. | T3 became testable and returned Unavailable. |
| 2 | Blocked-room result needed a clear explanation. | Fix | `src/availability.ts` — changed the rejection reason to "Room is blocked". | T3 displayed the correct reason. |
| 3 | Current time input had unclear guidance. | Fix | `src/App.tsx` — improved the Current Campus Time label and added a short helper message. | T6 still returned Unavailable, and the interface was easier to understand. |

The changes were focused on the identified problems rather than redesigning the application.

---

## 8. One generated component, in my own words

**File:** `src/availability.ts`

This file contains the logic that decides whether a room is available. It receives information about the selected room, the requested start and end times, the current time, and the existing bookings. It checks whether the interval is valid and whether the start time is after the supplied current time, as required by AC1. It also rejects requests longer than 120 minutes (AC2) and requests for blocked rooms (AC3).

After that, it compares the requested interval with existing bookings. To detect an overlap, the new start must be earlier than an existing booking's end, and the new end must be later than the existing booking's start. This is important because two bookings can touch at the same endpoint without overlapping. For example, 10:00–11:00 and 11:00–12:00 are allowed under AC4.

If none of the rules reject the request, the function returns Available. It only makes a decision and does not add another booking to the data, which supports AC5. Keeping this logic in a separate file also makes it easier to test without depending on the visual interface.

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| none | All nine recorded final test cases T1–T9 have the expected results. The separate 24:00 limitation is explained below. |

### 9.2 The end of the day

AC1 allows `end ≤ 1440`, meaning a valid interval can end at 24:00. For example, a booking from 23:00 to 24:00 should be accepted if the room is available and the supplied current time is earlier than 23:00.

My final application uses native HTML time inputs in HH:MM format. The current interface does not allow the user to enter 24:00 directly because the time input is limited to values ending at 23:59.

This creates a small but important limitation. The application can handle normal daytime requests, but the user cannot request an interval that ends exactly at midnight through the existing input.

I do not consider this fully compliant with AC1 because the criterion explicitly allows an end value of 1440 minutes.

A possible improvement would be to add an option for 24:00 as an end time and convert it internally to 1440 minutes. This could be implemented without changing the main availability logic or adding a backend.

The limitation should also be reflected in `submission.yml` under `assumptions.end_of_day`.

### 9.3 Which "now"?

In v1, the application already had an editable "Current Campus Time" input. This field supplied the current time used by the availability checker.

This was important for T6 because the test required the current time to be exactly 09:00. I could set the field to 09:00 and request a booking from 09:00 to 09:30.

The correct result was Unavailable because AC1 requires the booking start time to be strictly after the supplied current time. Starting at exactly the same time is not valid.

The ability to change the current time made the test repeatable without depending on the computer's actual clock.

The final cleanup only improved the wording around this input. It did not introduce the ability to change the time, because that feature already worked in v1.

---

## 10. Conclusion (120–180 words)

My first prediction was wrong. I expected the availability check to create a booking, but T8 stayed Available when I checked the same interval twice. My second prediction was partly correct: v1 already allowed me to set the current time, but it disabled the blocked room in the dropdown. Because of this, T3 was Not testable, even though AC3 requires the application to reject requests for blocked rooms.

I accepted Bolt's focused fix because it made the room selectable and displayed the correct rejection reason. I would have rejected replacing the existing time picker with a custom component, since the original input already worked and only needed clearer instructions.

T3 showed me the difference between an application that looks finished and one that meets its acceptance criteria. The first version had a working interface, but it prevented an important test. The final version corrected this problem, although the 24:00 boundary remains a limitation worth addressing.
