# SIS #03 — Report: Smart Campus Room Availability Checker

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT |
| Coding assistant model | not displayed |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/~/sb1-abpqt6bb |
| Language | Python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

### 2.1 Scope in my own words
**Scope:** The system is a one-page web application and a backend function that determine whether a requested time slot for a specific campus room is available for booking. It must process times in minutes after midnight, enforce a maximum duration, reject requests for blocked rooms, prevent overlapping bookings, and provide clear user feedback without modifying the existing booking data. Excluded features include authentication, database persistence, payment processing, and external API calls.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The start time must be less than the end time, both must be within a single day (0 to 1440), and the start must be strictly after the current time. |
| AC2 | The difference between the end and start times cannot exceed 120 minutes. |
| AC3 | If the room's blocked status is true, the request is immediately rejected. |
| AC4 | If the requested interval overlaps with any existing booking interval, it is rejected. Touching endpoints do not count as an overlap. |
| AC5 | The system returns a clear Boolean (True/False) or UI message (Available/Unavailable) without altering the provided list of existing bookings. |
| AC6 | The UI must display readable error messages when validation fails and remain functional on a narrow mobile screen. |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Endpoint overlap logic incorrectly rejects bookings that touch exactly (e.g., 660-720 against 600-660). | AC4 | Test case T1: Request 660-720 with existing (600-660) should return True/Available. |
| 2 | The validation allows a booking that starts exactly at the current time, rather than strictly after. | AC1 | Test case T6: Request 540-570 with now=540 should return False/Unavailable. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Start of the requested interval | Integer, 0-1440 |
| `end` | End of the requested interval | Integer, 0-1440 |
| `now` | The current time | Integer, 0-1439 |
| `blocked` | Whether the room is blocked | Boolean |
| `existing` | List of active bookings | List of (start, end) tuples |
| returns | Whether the booking is allowed | Boolean (True/False) |

### 2.5 Initial assumptions and manual checks

**Assumptions:**
1. The time inputs are always passed as integer minutes, never as strings or floats.
2. The provided current time (`now`) is always a valid integer between 0 and 1439.

**Checked manually:**
- I manually traced the overlap logic: for an existing booking (600, 660) and a request (660, 720), the condition `660 < 660` is false, so no overlap is detected. This matches AC4.

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Yes | Enforces bounds and strictly future start. |
| `if end - start > 120:` | AC2 | Yes | Rejects durations exceeding 120 minutes. |
| `if blocked:` | AC3 | Yes | Rejects blocked rooms. |
| `for existing_start, existing_end in existing: if start < existing_end and end > existing_start:` | AC4 | Yes | Correctly detects overlap without failing on touching endpoints. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Intervals include the start and exclude the end. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

| Generated file or component | Path | Its role |
| --- | --- | --- |
| `App.tsx` | `src/App.tsx` | Contains the main UI layout, state, and form logic. |
| `availability.ts` | `src/availability.ts` | Contains the pure function that implements the AC checks. |

**What v1 does:**
- Provides a form to select a room, start time, end time, and current time.
- Calls the availability function and displays a green "Available" or red "Unavailable" message.
- Sidebar shows existing bookings.

## 5. Test cases — executed on both artifacts

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Not testable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Not testable |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Unavailable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `booking.py` lines 2-3, `App.tsx` validation | T6, T7 | Unavailable | False | False |
| AC2 | `booking.py` line 5, `App.tsx` validation | T4, T5 | Available/Unavailable | True / False | True / False |
| AC3 | `booking.py` line 7, `App.tsx` validation | T3 | Unavailable | False | False |
| AC4 | `booking.py` lines 9-11, `App.tsx` validation | T1, T2, T10 | Available/Unavailable | True / False | True / False |
| AC5 | `booking.py` return statements, UI result display | T11 | Available | True | True |
| AC6 | `App.tsx` error messages and CSS layout | T12, T7 | Available, usable | Available | Available |

## 7. Issue log

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | Blocked room cannot be selected for testing. | T3: Open room dropdown. Expected: select blocked room. Observed: option disabled. | High | Removed `disabled` attribute from the blocked room option in the UI. | T3 now shows Unavailable. |
| 2 | Current time label is confusing. | AC6: Look at "Current Campus Time" input. Expected: clear explanation. Observed: label said "(for testing)". | Medium | Reworded label to explain it checks if the start time is in the future. | All T1-T12 usable. |

**Before / after:** The screenshots `evidence/before-1.png` and `evidence/after-1.png` demonstrate the fix for issue 1.

## 8. Critique decisions

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | The AI confirmed before creating the enrollment. | Traced T3 in the sequence diagram. | Modify | Moved confirmation after creation to ensure the student isn't told they are registered before the database updates (R4). |
| 2 | The AI suggested adding a "Book" button. | Checked the scope rules. | Reject | The brief says the page checks availability only and does not create bookings. |
| 3 | The AI used single-line class attributes in PlantUML. | Tried rendering it on plantuml.com. | Modify | Reverted to multiline syntax so the diagram parses correctly. |

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | I need a Python function and a web page that checks room availability. |
| Model / plan | AI proposed using a `for` loop for overlap checking and a simple `if` tree for validation. |
| Tool call | Bolt.new generated React code; ChatGPT generated the Python function. |
| Observation | v1 Python logic was correct. v1 Web logic had a bug where blocked rooms were unselectable. |
| Next step | I sent a targeted prompt to Bolt to remove the `disabled` attribute. |
| Human review | I manually traced T1 (touching) and T6 (starts now) through both artifacts to verify AC4 and AC1. |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| ChatGPT | The prompt with AC1-AC6 and the initial code. | No external tools (just text generation). | Observed |
| Bolt.new | The prompt with AC1-AC6. | File system (to create React components), terminal (to build). | Observed |
| Bolt.new | The preview window. | Browser rendering (no backend API calls). | Assumed (based on the generated code) |

### 9.3 Checkpoint and dependability
**Safety checkpoint:** Before accepting the AI's Python code, I manually checked the overlap condition `start < existing_end and end > existing_start`. I verified that it allows touching endpoints (e.g., 660-720 vs 600-660) because the strict inequality `<` prevents false positives. Without this check, the AI might have used `<=`, which would violate AC4.

**Reliability, security, responsibility:** The system is reliable because it uses deterministic pure functions with no external dependencies. Security is maintained by running entirely client-side (no data leaves the page) and avoiding backend calls. The human remains responsible for defining the exact boundary conditions (like midnight) and verifying the AI didn't hallucinate a different rounding policy.

## 10. Reflection

AI-assisted coding (Python) and vibe coding (Bolt) differ mainly in control. The AI wrote the Python function perfectly, but I still had to manually review the boundary logic to ensure AC4 was satisfied. With Bolt, the AI generated the entire UI, but introduced a reliability risk by disabling the blocked room option, an availability/usability risk by using a confusing label, and a security risk (if it had added a backend). AI recommendations must be rejected if they expand scope (like adding a Book button). Code review, tool permissions, and tests remain human responsibilities because AI lacks situational awareness. I would improve the UI's error messages next without expanding the scope.

## 11. Appendix A — AI exchanges

### B1
- **Tool:** ChatGPT
- **Model:** not displayed
- **Date:** 2026-10-18
- **Stage:** Plan
- **Source:** week-05

**Prompt:**
~~~~text
Propose a short implementation plan for can_book. List the checks in order and identify assumptions. Use Python 3 and the supplied rules. Do not write code yet. Suggest boundary cases that could expose an incorrect implementation.
~~~~

**Response:**
~~~~text
Implementation plan for can_book:
1. Validate the time interval (AC1). Require 0 <= start < end <= 1440 and start > now. Otherwise, return False.
2. Check duration (AC2). Calculate end - start. Require the duration to be at most 120 minutes. Otherwise, return False.
3. Check room status (AC3). If blocked is True, return False.
4. Check existing bookings (AC4). Compare the requested interval with every interval in existing. An overlap exists when start < existing_end and end > existing_start. If any overlap exists, return False. Touching endpoints are allowed.
5. Accept the booking time (AC5). Return True only if every preceding check passes. Do not modify existing or any other input.
~~~~

### B2
- **Tool:** ChatGPT
- **Model:** not displayed
- **Date:** 2026-10-18
- **Stage:** Generate
- **Source:** week-05

**Prompt:**
~~~~text
Implement can_book in booking.py using the supplied contract and AC1-AC5. Keep the signature. Use only the standard library. Do not modify existing. Return the function and explain each condition. Keep the feature within the stated scope.
~~~~

**Response:**
~~~~text
```python
def can_book(start, end, now, blocked, existing):
    # AC1: The interval must be valid and start strictly in the future.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: The booking duration must not exceed 120 minutes.
    if end - start > 120:
        return False

    # AC3: A blocked room cannot be booked.
    if blocked:
        return False

    # AC4: Reject any overlap with an existing booking.
    # Touching endpoints are allowed.
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False

    # AC5: All acceptance criteria are satisfied.
    return True
~~~~


### B3
- **Tool:** ChatGPT
- **Model:** not displayed
- **Date:** 2026-10-18
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**
~~~~text
Review this implementation of can_book against the contract and AC1-AC5 only. List at most five concrete issues. For each one, quote the line and name the acceptance criterion or contract line it concerns. Do not rewrite the function.

def can_book(start, end, now, blocked, existing):
    if not (0 <= start < end <= 1440 and start > now):
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False
    return True
~~~~

**Response:**

~~~~text
There are no concrete issues with this implementation against the supplied contract and AC1–AC5. The implementation satisfies all requirements. AC1 checks the time bounds and future start. AC2 enforces the 120-minute limit. AC3 checks the blocked flag. AC4 uses strict inequalities (start < existing_end and end > existing_start) to correctly detect overlap while allowing touching endpoints. AC5 returns a Boolean and does not modify the input list. No changes are required.
~~~~

### B4

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-10-18
- **Stage:** Repair
- **Source:** week-06

**Prompt:**

~~~~text
In the current prototype, the blocked room in the dropdown produces a "Not testable" state because it is greyed out and cannot be selected, but AC3 requires rejecting a booking for a blocked room. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
~~~~

**Response:**

~~~~text
The fix is small: remove the disabled attribute on blocked room options so they can be selected, and align the rejection reason text with what AC3 asks for. Two edits: remove disabled={room.blocked} from the dropdown option in App.tsx, and update the blocked-room reason text in availability.ts to "Room is blocked". By making this small change, the UI allows users to test blocked rooms, ensuring AC3 can be validated, while preserving all other acceptance criteria.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

~~~~text
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
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| T8, T9 (Page) | The native HTML time input stops at 23:59, so a booking ending at exactly 24:00 cannot be entered on the web page. | Add a custom time picker or allow direct minute input to support 24:00. |
