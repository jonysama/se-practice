# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Zhanibek Alimkulov |
| Group | Monday 16:00-19:00 |
| AI assistant | ChatGPT |
| Exact model | GPT-5.6 Luna |
| Renderer | plantuml.com/plantuml |
| Behaviour diagram | sequence |
| Stories used | my week-03 stories, revised |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Below are my approved user stories and my three revised UML diagrams for the Smart Campus study room booking system. Do not praise them. Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** The AI listed none explicitly, but its decisions imply two: (a) `Receive Booking Confirmation` is a use case, not just a side effect of booking; (b) `Block Room` and `Unblock Room` are two separate use cases, not one. Both are noted below.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student association to Receive Booking Confirmation | The student is directly associated with a use case whose trigger is the system, not the student. A student does not set out to receive a confirmation; the system sends one as a consequence of a booking. | R4 (a successful booking produces a confirmation) | Removed the association. The confirmation use case is now reached only via the include-relationship from Book Study Room and from Cancel Own Booking. |
| 2 | Include relationships into Receive Booking Confirmation | The two include relationships carry no why-comment, which is required by the PlantUML conventions in README section 4. | README section 4 (every include or extend needs a why-comment on the line directly above) | Added a why-comment above the Book Study Room line and above the Cancel Own Booking line, both citing R4. |
| 3 | Block Room and Unblock Room as two separate use cases | The Week 03 approved story US-04 names block or unblock as a single goal, and the AI split it into two use cases. | US-04 | Kept as two use cases. Rationale: block and unblock have different preconditions (a room must be unblocked to block it, and blocked to unblock it), so splitting them is a defensible modelling decision. Declared as an assumption. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one Student makes 0..* Bookings | each Booking is owned by exactly 1 Student | 1 / 0..* |
| Room — Booking | one Room is reserved by 0..* Bookings | each Booking reserves exactly 1 Room | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: stated in a note on Booking — no two ACTIVE bookings for the same Room may overlap in time. Multiplicity 0..* counts every booking, active or cancelled; R2 only constrains the active ones, so it cannot be encoded as a multiplicity.
- R1 (future start, up to 2 hours): not shown in a note. R1 is a precondition on the startTime attribute; the diagram does not model "now", so R1 is enforced by the operation, not by a diagram element. Declared in section 4.3 as an assumption.

### 4.3 Assumptions

- A1: A booking whose startTime is in the past is not modelled — the diagram has no concept of current time, so R1 is enforced outside the class diagram.
- A2: The multiplicity 0..* on the Booking end of both associations includes cancelled bookings. R2 only constrains ACTIVE bookings, which is why R2 lives in a note rather than in the multiplicity.
- A3: Blocking a Room keeps the existing bookings as they are; only new bookings are rejected. Matches the assumption declared in submission.yml.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Booking class | No note states R2. Multiplicity 0..* counts all bookings, so it cannot express "no overlapping active bookings". | R2; README section 4 says R2 goes in a note on Booking in the class diagram | Added a note right of Booking containing: no two ACTIVE bookings for the same Room may overlap in time. |
| 2 | hide methods directive (top of the file) | The AI told PlantUML to hide methods but still defined operations on every class. The task prompt asks to add appropriate operations, which are then invisible. | README section 5 Task 2 prompt ("Add attributes, appropriate operations...") | Removed the hide methods line so the operations render. |
| 3 | BookingStatus enum | Extra class beyond Student, Room and Booking. | R2 uses the word active, which justifies a status attribute | Kept as is — declared as a justified addition. The enum makes active explicit rather than a loose string. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence — it makes the R1, R2 and R3 validation steps and their ordering explicit, which is what the reviewer needs to check. An activity diagram would show the same logic but as branches, and the sequence makes validation-before-creation visually obvious.

**Design components added beyond the domain model:**
- BookingService — coordinates the booking operation: validates the rules in order, then asks the repository to persist the booking. Not a domain concept; it is the application-level logic layer.
- BookingRepository — persists and queries bookings. Handles the overlap check (R2) and the save operation. Not a domain concept; it is the persistence layer.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | hasOverlappingActiveBooking message | The check implements R2, but nothing in the diagram labels it as R2. R1 and R3 are explicitly named (validate R1, validate R3); R2 is only implicit in the method name. | R2 | Added a note right of BookingRepository stating R2 explicitly: no two ACTIVE bookings for the same room may overlap in time. |
| 2 | alt Room is available / else Room is unavailable | Guards are long noun phrases. The README section 4 convention shows short guards (created, unavailable). | README section 4 (notation convention) | Shortened to available and unavailable. The full meaning is preserved by the note and the surrounding messages. |
| 3 | R1 and R3 validation messages | The two self-messages (validate R1, validate R3) carry the rule number but not the substance of the rule, so a reader has to guess what R1 means. | R1, R3 | Added note blocks next to BookingService that spell out each rule, so the diagram is self-contained. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | The overlap check uses endTime but the sequence never calculates it from duration. | sequence.puml, hasOverlappingActiveBooking message | accept | Real gap. Added endTime = startTime + duration after R1 validation and before the overlap query. |
| 2 | validate R3 claims to check whether the room is blocked, but no message queries the Room. | sequence.puml, self-message validate R3 | accept | Real gap. Added BookingService to BookingRepository findRoom(roomId) before the R3 check so the blocked status comes from an actual object. |
| 3 | The sequence diagram does not include a cancellation flow. | sequence.puml (missing cancelBooking) | reject | Out of scope. The README Task 3 prompt fixes the sequence diagram to Book room only. Cancellation is a separate use case and is modelled in the use-case diagram, not here. |
| 4 | The class diagram has no Administrator class, no User superclass. | class.puml | reject | The class diagram is a domain model. Actors are not automatically domain classes, and the task prompt explicitly says to add other classes only when requirements justify them and to avoid unjustified inheritance. A User superclass would be exactly that. |
| 5 | Cancel Own Booking include to Receive Booking Confirmation contradicts R4. | use-case.puml, include relationship with why-comment | reject | Modelling decision. R4 states one rule about booking confirmation; US-06 states a separate student goal about receiving confirmation on booking or cancellation. Two independent requirements can both hold. |
| 6 | Room.isAvailable() does not show whether it considers blocked state and overlaps. | class.puml, Room.isAvailable operation | reject | The R2 constraint is already documented in a note right of Booking, and R3 is a blocked flag on Room that the operation reads. Documenting every precondition as a note would clutter the diagram. |
| 7 | Usage review (US-05) has no supporting class or sequence. | class.puml, sequence.puml | reject | Same scope reason as issue 3: the sequence diagram is fixed to Book room, and the class diagram is a domain model — reporting is an application concern, not a domain concept. US-05 is modelled in the use-case diagram, which is where it belongs. |

---

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Study Room | Booking (startTime, endTime) | note on BookingService; self-message validate R1; endTime = startTime + duration |
| R2 | Book Study Room | Booking (status), note right of Booking | hasOverlappingActiveBooking(roomId, startTime, endTime); note right of BookingRepository |
| R3 | Book Study Room | Room (isBlocked) | findRoom(roomId); self-message validate R3; note on BookingService |
| R4 | Receive Booking Confirmation | Booking.confirm(), BookingStatus | bookingConfirmed(bookingId) reply to Student |
| US-01 | View Room Availability | Room.isAvailable(), Booking | no sequence element |
| US-02 | Book Study Room | Student, Room, Booking | full sequence diagram |
| US-03 | Cancel Own Booking | Booking.cancel(), BookingStatus.CANCELLED | not in the sequence diagram |
| US-04 | Block Room | Room.block() | not in the sequence diagram |
| US-04 | Unblock Room | Room.unblock() | not in the sequence diagram |
| US-05 | Review Room Usage | Booking (data source for report) | not in the sequence diagram |
| US-06 | Receive Booking Confirmation | Booking.confirm() | bookingConfirmed(bookingId) |

---

## 8. Change log

## 8. Change log

| # | Diagram | Before (AI original) | After (my revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Student linked to Receive Booking Confirmation | association removed; confirmation reached only via include from Book and Cancel | R4: a confirmation is a system outcome, not a student goal. Checker UC5 fails an actor linked to confirmation. |
| 2 | use case | include into Receive Booking Confirmation with no comment | why-comment added above each include line, citing R4 | README section 4 requires a why-comment above every include or extend. Checker UC8 fails without it. |
| 3 | class | hide methods directive at top | directive removed | Task 2 prompt asks for appropriate operations, which the directive would have hidden. |
| 4 | class | no note on Booking | note right of Booking stating R2 | R2 cannot be expressed as a multiplicity; README section 4 requires a note. Checker CL8 fails without it. |
| 5 | sequence | validate R1 and validate R3 with no note and no Room query | notes added for R1 and R3; findRoom message added before R3 validation | R3 was claimed but no Room object was queried. Critique flagged this. |
| 6 | sequence | hasOverlappingActiveBooking called without endTime calculated | self-message endTime = startTime + duration added before the query | endTime came from nowhere. R1 limits duration, so the transformation is now explicit. |
| 7 | sequence | long guards alt Room is available / else Room is unavailable; no R2 note | guards shortened to available / unavailable; note right of BookingRepository added for R2 | README section 4 notation convention; and R2 was not named anywhere until the note was added. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  3 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  7 critique issues with a verdict
LR7  PASS  7 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
```

**FAILs I am keeping, and why:** none — the final run is clean.

---

## 10. Conclusion (120–180 words)

The AI got the use-case diagram most wrong. It linked Student directly to Receive Booking Confirmation, treating a system outcome as a user goal. Without review, that would have shipped as a student-facing feature that does not exist. In the class diagram the AI hid all operations with the hide methods directive and forgot the R2 note entirely, so a reader would never have seen the rule about overlapping bookings. The sequence diagram had two subtler problems: it claimed to validate R3 without querying any Room object, and it used endTime before calculating it from duration.

The critique caught the endTime gap and the missing Room query, which I accepted and fixed. It also raised seven issues I rejected — chiefly that the sequence diagram should model cancellation and usage review. Both are out of scope: the README fixes the sequence diagram to Book room only, and the class diagram is a domain model, so a reporting service does not belong in it.

If a reviewer had not caught the Student-to-confirmation link, the use-case diagram would have claimed a feature the scenario never asks for. That is the error I would fix first.