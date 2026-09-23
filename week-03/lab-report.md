# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name: Zhanibek Alimkulov
Student ID: 24B031621
GitHub username: jonysama

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | ChatGPT |
| Exact model name and version | GPT-5.6 Luna |
| Date of the session | 2026-09-23 |
| Diagram renderer used | plantuml.com/plantuml |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
Student goals
Find available study rooms quickly.
Book a suitable room for a study session.
View and manage existing bookings.
Cancel a booking when the room is no longer needed.
Administrator goals
Manage study room availability.
Monitor and manage room bookings.
Keep room and booking information accurate.
User stories
#	User story	Priority	Assumption
1	As a Student, I want to view available study rooms, so that I can choose a room for my study session.	High	Room availability is maintained by the system.
2	As a Student, I want to book an available study room, so that I can reserve it for my study session.	High	Students can make bookings for available rooms.
3	As a Student, I want to view my bookings, so that I can keep track of my reserved study rooms.	Medium	The system stores each student's bookings.
4	As a Student, I want to cancel my booking, so that the room can become available when I no longer need it.	Medium	Students are allowed to cancel their existing bookings.
5	As an Administrator, I want to manage study room availability, so that students can see accurate room availability.	High	Administrators have permission to update room availability.
6	As an Administrator, I want to view study room bookings, so that I can monitor room reservations.	High	Administrators can access booking information.
7	As an Administrator, I want to manage study room information, so that the system contains accurate information about available rooms.	Medium	Administrators are responsible for maintaining room information.
8	As an Administrator, I want to manage bookings, so that I can keep room reservations accurate and up to date.	Medium	Administrators are authorized to modify or manage bookings.```

---s

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| #1 View availability | Rewrote the reason | The reason only restated the goal ("choose a room"). It did not say why availability matters to the student. | US-01 |
| #2 Book room | Rewrote the reason | Circular reasoning: "book a room so that I can reserve it" — "book" and "reserve" are synonyms. Replaced with the actual value. | US-02 |
| #3 View my bookings | Deleted | "View my bookings" is not one of the six use cases. UC-01 is "View availability" (which rooms are free), not a personal booking list. This is scope creep by the assistant. | — |
| #4 Cancel booking | Kept, fixed wording | The story was already correct and mapped to UC-03. Only tightened the wording. | US-03 |
| #5 Manage study room availability | Rewrote | "Manage availability" is vague — it could mean anything. Rewrote to name the exact action: block and unblock a room, matching UC-04. | US-04 |
| #6 View study room bookings | Rewrote | The AI conflated "view bookings" with "review usage". UC-05 is about how rooms are used over a period, not about seeing individual bookings. | US-05 |
| #7 Manage study room information | Deleted | There is no "manage room information" use case in the scenario. The only room-management function is Block or unblock room. The assistant invented this. | — |
| #8 Manage bookings | Deleted | Administrators do not manage student bookings in this scenario. Their only booking-related actions are block/unblock (UC-04) and review usage (UC-05). Invented. | — |
| (missing) | Added a new story | The assistant produced no story for UC-06 Send confirmation, which is one of the six fixed use cases. Added US-06 to cover it. | US-06 |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in README section 1, or write "no, and here is how I checked".

The assistant did not use any of the out-of-scope vocabulary (payments, QR, SMS, passwords, waiting lists, screens/databases). However, it did invent three functions that are not among the six fixed use cases: **"view my bookings"**, **"manage study room information"**, and **"manage bookings"**. These are scope creep against section 1 (which fixes the system to exactly six functions), not against the out-of-scope list. All three were deleted.

**How many stories did you end with, and why that number?**

Six — one for each of the six use cases defined in section 1. Keeping exactly six guarantees full traceability: every use case has a story and no story sits outside the scenario. Adding a seventh would either duplicate an existing use case or bring in an invented function.

---

## 4. Original AI output — acceptance criteria (Part 3)

```
Below are acceptance criteria for each story, with the assumptions listed first.

US-02 — Book a free study room

Assumption: The system enforces R1–R4.

US-02 Acceptance Criteria

AC1 — Successful booking

Given a student has selected an available, unblocked room
When the student enters a start time in the future and a duration of no more than two hours and confirms the booking
Then the system creates the booking for that room and time slot.

AC2 — Booking must start in the future

Given a student is booking a room
When the selected start time is in the past or is the current time
Then the system rejects the booking and indicates that the booking must start in the future.

AC3 — Maximum duration

Given a student has selected an available room
When the requested booking duration is greater than two hours
Then the system rejects the booking and indicates that a booking may last at most two hours.

AC4 — Overlapping booking

Given a room already has a booking that overlaps the requested time slot
When the student attempts to book that room
Then the system rejects the booking and indicates that the room is unavailable for the selected time.

AC5 — Blocked room

Given the selected room is blocked
When the student attempts to book it
Then the system rejects the booking and does not create a new booking.
US-03 — Cancel a booking

Assumption: A student can cancel any of their own future bookings, but not past ones.

US-03 Acceptance Criteria

AC1 — Successful cancellation

Given a student has a future booking that they made
When the student chooses to cancel the booking
Then the system cancels the booking and the corresponding time slot becomes available for booking.

AC2 — Cannot cancel a past booking

Given a student has a booking whose scheduled time has already passed
When the student attempts to cancel it
Then the system rejects the cancellation and leaves the booking unchanged.

AC3 — Cannot cancel another student's booking

Given a booking was made by a different student
When the current student attempts to cancel that booking
Then the system rejects the cancellation and does not change the booking.

AC4 — Cancellation of a future booking

Given a student's booking has a start time in the future
When the student confirms cancellation
Then the booking is no longer considered an active booking for that time slot.
US-04 — Block or unblock a room

Assumption: Blocking a room prevents new bookings, as required by R4.

US-04 Acceptance Criteria

AC1 — Successfully block a room

Given an administrator selects an unblocked room
When the administrator blocks the room
Then the room is marked as blocked and cannot be booked by students.

AC2 — Booking a blocked room is rejected

Given a room has been blocked by an administrator
When a student attempts to make a new booking for that room
Then the system rejects the booking and indicates that the room is blocked.

AC3 — Successfully unblock a room

Given a room is currently blocked
When an administrator unblocks the room
Then the room is marked as unblocked and can be booked again, subject to the other booking rules.

AC4 — Unblocking does not create an overlapping booking

Given a room is unblocked and an existing booking occupies a requested time slot
When a student attempts to book that overlapping time slot
Then the booking is rejected because two bookings for the same room cannot overlap.

These criteria cover successful behavior, validation, and alternative/error cases while applying the stated booking rules.

```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| US-02 AC1–AC5 | No problem — covers happy path plus all four business rules (R1, R2, R3, R4) | Kept, renumbered | AC-01 … AC-05 |
| US-02 AC3 (max duration) | Does not say whether exactly two hours is allowed or not — leaves the open question unresolved | Reworded to make the boundary explicit: >2h rejected, ==2h accepted | AC-03 |
| US-02 AC4 (overlap) | Does not say whether a booking ending exactly when another begins counts as overlap | Reworded to make the boundary explicit: touching bookings count as an overlap | AC-04 |
| US-03 AC1–AC3 | Correct, mapped to UC-03 | Kept, renumbered | AC-06 … AC-08 |
| US-03 AC4 | Duplicate of AC1 — both describe a successful cancellation of a future booking | Deleted; replaced with a criterion about the freed time slot becoming available to others | AC-09 |
| US-04 AC1 | Correct — administrator blocks a room | Kept, renumbered | AC-10 |
| US-04 AC2 | Tests a student action, not an administrator action. The story is about the Administrator. Also duplicates US-02 AC5. | Rewritten to test the administrator side: blocking does not cancel existing bookings, only prevents new ones | AC-11 |
| US-04 AC3 | Correct — administrator unblocks a room | Kept, renumbered | AC-12 |
| US-04 AC4 | Confused — describes a student making a booking, which is not part of the unblock action at all | Rewritten to test the post-unblock state: after unblocking, the room can be booked again under R1–R3 | AC-13 |
| (missing) | The two open questions were never tested at all | Added explicit boundary rules to the assumptions and to AC-03 and AC-04 | — |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | not-allowed | Treating the boundary as an overlap is safer for scheduling: a student cannot argue that a back-to-back booking is legal, and the code check `start < other_end and end > other_start` covers touching bookings without a special case. |
| Is exactly two hours allowed under R2? | allowed | R2 says "at most two hours". "At most" includes the limit itself, so exactly two hours is allowed. |

**Which invalid or boundary case did the assistant leave out?**

The boundary case that changes the outcome of two rules: it never said whether a booking that ends exactly when another begins counts as an overlap under R3, and it never said whether exactly two hours is allowed under R2. Both are boundary values that could pass or fail depending on the interpretation, and the assistant tested neither.

---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
  usecase "UC-01 View availability" as UC01
  usecase "UC-02 Book room" as UC02
  usecase "UC-03 Cancel booking" as UC03
  usecase "UC-04 Block or unblock room" as UC04
  usecase "UC-05 Review usage" as UC05
  usecase "UC-06 Send confirmation" as UC06
}

Student --> UC01
Student --> UC02
Student --> UC03

Administrator --> UC01
Administrator --> UC04
Administrator --> UC05

UC02 ..> UC01 : <<include>>
UC02 ..> UC06 : <<include>>

@enduml

```

Rendered diagram (image, or a link):

https://www.plantuml.com/plantuml/png/RP39RW8n44Jl_HKbxY3sGuGGWJzWHEx6OoOjl4Hs3n6AykynooWQYvjT_QfwsIHHKLfdoPgJG08YDv-2cgFHmi4JAIqXefAsDbwUl_VQiUSaKUKVqOrLlh46WyhbFEoK-shJtNJ5FWI7RGXdzWsgQnBZ1lWXe4r6gvHDXzrmFC47cs-eYsAhZcnPhWEeXCDkF2dPwJqECGTtpBHaPda8hut5yT6v0sSbECVM1dr6Y6ZzCJ_xmVEINs1lBddKhAh6TDYYn9QeZA-XWpznTEfsouvTqY_Hyw0O3jUF7GjXMWepejxP_vqlvVbhUK5q2yTez33Z3QiLUsrph_MwLriMjKtUftNs3m00

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| `Administrator --> UC01 View availability` | The scenario gives the Administrator only two responsibilities: keeping rooms usable (UC-04) and watching how they are used (UC-05). Viewing availability is a Student action — the student needs to know which room to book. The Administrator never triggers UC-01. | Removed the association. |
| `UC02 ..> UC01 : <<include>>` | Wrong stereotype. `<<include>>` means UC-01 always executes as part of UC-02. But a Student can book a room without first viewing availability — the system rejects the booking if the slot is taken. The relationship is not mandatory. | Removed the relationship. |
| `UC03 Cancel booking` has no relationship to `UC06 Send confirmation` | UC-06 in the scenario confirms a booking **or a cancellation**. The diagram only showed UC-02 → UC-06, so a cancellation would never send a confirmation. | Added `UC03 ..> UC06 : <<include>>`. |
| `UC02 ..> UC06 : <<include>>` | Defensible — a successful booking does trigger a confirmation. | Kept unchanged. |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.

`Administrator --> UC01 View availability` is the only unjustified actor–use-case link. The Administrator's responsibilities in the scenario are UC-04 (block or unblock room) and UC-05 (review usage) — nothing else. Nobody is linked to UC-06 Send confirmation, which is correct: the system triggers that function as a consequence of booking or cancelling, not a person.

**Did any screen, database or internal component appear as a use case or an actor?**

No. The diagram uses only the two required actors and the six fixed use cases. There is no "System" actor, no login screen, no database, no internal classes.

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them: none — all six use cases have at least one story.
- Stories with **no use case** they belong to: none — every US-nn maps to exactly one UC-nn.
- Criteria that test **no rule** from section 1: three use cases (UC-01, UC-05, UC-06) have no acceptance criteria at all. UC-01, UC-05 and UC-06 are not covered by any AC-nn.

**What does the largest gap tell you about the generated requirements?**

The largest gap is not in the stories — it is in the acceptance criteria. UC-06 Send confirmation has a story (US-06, which I had to write myself) but no criteria, because the AI's original output never mentioned it. UC-05 Review usage has a story (US-05, rewritten from the AI's confused "view bookings") but no criteria. UC-01 has a story and no criteria, because I only selected three stories for Part 3. This shows that the generated requirements look complete in the story layer but thin in the test layer — exactly the layer a checker cannot judge.

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
PASS   US-1  user-stories.md         no placeholders left
PASS   US-2  user-stories.md         6 stories, IDs US-01…US-06
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
PASS   US-7  user-stories.md         nothing from the out-of-scope list appears
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-02, US-03, US-04
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 13 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  3 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
23 PASS · 0 FAIL · 0 ERROR   (23 checks)
Shape is clean. This says nothing about whether the requirements are good.
```

```
$ python tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Zhanibek Alimkulov
PASS   student.student_id                        24B031621
PASS   student.github                            jonysama
PASS   assistant.tool                            ChatGPT
PASS   assistant.model                           GPT-5.6 Luna
PASS   counts.user_stories                       6
PASS   counts.acceptance_criteria_sets           3
PASS   checker                                   23 PASS · 0 FAIL · 0 ERROR
NOTE   checker                                   you are claiming a clean run — it will be re-run at your commit, so make sure it is true
PASS   checker.commit                            24ac1bf
PASS   assumptions.overlap_touching_bookings     not-allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        UC-01, UC-05, UC-06
PASS   traceability.stories_not_traced           []
PASS   review_findings                           4 findings
PASS   review_findings[1]                        UC-06 Send confirmation had no story behind it in the AI's o…
PASS   review_findings[2]                        US-04 was rewritten because the AI's story #5 ('manage avail…
PASS   review_findings[3]                        Administrator had an unjustified association to UC-01 View a…
PASS   review_findings[4]                        AC-11 was rewritten: the AI's US-04 AC2 tested a Student act…
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
22 PASS · 0 FAIL · 0 ERROR · 1 note
Shape is fine. This says nothing about whether the work is good.
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | 23 | 0 | 0 |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

`24ac1bf`

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

No FAILs in the final run. During development, two FAILs appeared and were fixed: US-1 (leftover `TODO` placeholder text from the template) and US-7 (`checking` in US-06 was flagged as out-of-scope vocabulary because it contains the substring `checkin`). Both were corrected before the final commit, and both were left visible in the transcript above rather than hidden.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

No — both checkers were run with the shipped Python files, from inside `week-03/`.

---

## 10. Conclusion (150–200 words)

The most wrong part of the generated requirements was the stories layer. The AI invented three
functions that are not in the scenario — "view my bookings", "manage study room information", and
"manage bookings" — and skipped UC-06 Send confirmation entirely. Without a checker, I would have
caught the three invented functions by re-reading the six fixed use cases in section 1 and asking
"which of these does this story actually test?" The missing UC-06 would have been easier to miss:
nothing in the output looked incomplete.

The assistant got two things right that would have taken me noticeably longer. It produced working
PlantUML source in one message, with no syntax debugging. And it wrote five coherent acceptance
criteria for US-02 in Given/When/Then form, covering all four business rules — writing those from
scratch would have been an hour.

If I had to rewrite one thing for the implementer, it would be US-01 View availability. It has a
story but no acceptance criteria, so the implementer has no contract for what "available" means:
free right now, free for a given slot, or free for the requested duration. That is the gap most
likely to produce a wrong implementation.
