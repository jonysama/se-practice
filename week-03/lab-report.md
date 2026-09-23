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
(paste here)
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| | | | |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed / not-allowed | |
| Is exactly two hours allowed under R2? | allowed / not-allowed | |

**Which invalid or boundary case did the assistant leave out?**

---

## 6. Original AI output — use-case diagram (Part 4)

```
(paste the PlantUML source exactly as generated)
```

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| | | |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.

**Did any screen, database or internal component appear as a use case or an actor?**

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
