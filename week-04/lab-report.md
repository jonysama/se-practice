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

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
<paste>
```

### 2.2 Task 2 — class prompt

```text
<paste>
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<paste>
```

### 2.4 Focused correction prompts (if you sent any)

```text
<paste, or write "none">
```

### 2.5 Critique prompt

```text
<paste>
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** The AI listed none explicitly, but its decisions imply two: (a) `Receive Booking Confirmation` is a use case, not just a side effect of booking; (b) `Block Room` and `Unblock Room` are two separate use cases, not one. Both are noted below.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `Student --> UC4 Receive Booking Confirmation` | The student is directly associated with a use case whose trigger is the system, not the student. A student does not set out to "receive a confirmation"; the system sends one as a consequence of a booking. | R4 ("A successful booking produces a confirmation") | Removed the association. UC4 is now reached only via `<<include>>` from UC2 and UC3. |
| 2 | `UC2 ..> UC4 : <<include>>` and `UC3 ..> UC4 : <<include>>` | The two include relationships carry no `' why:` comment, which is required by the PlantUML conventions in README §4. | README §4 (every include / extend needs `' why:` on the line directly above) | Added `' why: R4 - a successful booking produces a confirmation` above the UC2 line and `' why: R4 - a cancellation also produces a confirmation` above the UC3 line. |
| 3 | `Block Room` and `Unblock Room` as two separate use cases | The Week 03 approved story US-04 names "block or unblock" as a single goal, and the AI split it into two use cases. | US-04 | Kept as two use cases. Rationale: block and unblock have different preconditions (a room must be unblocked to block it, and blocked to unblock it), so splitting them is a defensible modelling decision. Declared as an assumption. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one Student makes 0..* Bookings | each Booking is owned by exactly 1 Student | 1 / 0..* |
| Room — Booking | one Room is reserved by 0..* Bookings | each Booking reserves exactly 1 Room | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: stated in a `note` on `Booking` — "no two ACTIVE bookings for the same Room may overlap in time". Multiplicity `0..*` counts every booking, active or cancelled; R2 only constrains the active ones, so it cannot be encoded as a multiplicity.
- R1 (future start, ≤ 2 hours): not shown in a note. R1 is a precondition on the `startTime` attribute; the diagram does not model "now", so R1 is enforced by the operation, not by a diagram element. Declared in §4.3 as an assumption.

### 4.3 Assumptions

- A1: A booking whose `startTime` is in the past is not modelled — the diagram has no concept of "current time", so R1 is enforced outside the class diagram.
- A2: The multiplicity `0..*` on the Booking end of both associations includes cancelled bookings. R2 only constrains ACTIVE bookings, which is why R2 lives in a note rather than in the multiplicity.
- A3: Blocking a Room keeps the existing bookings as they are; only new bookings are rejected. Matches the assumption declared in `submission.yml`.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `Booking` class | No note states R2. Multiplicity `0..*` counts all bookings, so it cannot express "no overlapping active bookings". | R2; README §4 says "R2 goes in a note on Booking in the class diagram" | Added a `note right of Booking` containing "R2: no two ACTIVE bookings for the same Room may overlap in time." |
| 2 | `hide methods` directive (top of the file) | The AI told PlantUML to hide methods but still defined operations on every class. The task prompt asks to add "appropriate operations", which are then invisible. | README §5 Task 2 prompt ("Add attributes, appropriate operations...") | Removed the `hide methods` line so the operations render. |
| 3 | `BookingStatus` enum | Extra class beyond Student, Room and Booking. | R2 uses the word "active", which justifies a status attribute | Kept as is — declared as a justified addition. The enum makes "active" explicit rather than a loose string. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence — it makes the R1/R2/R3 validation steps and their ordering explicit, which is what the reviewer needs to check. An activity diagram would show the same logic but as branches, and the sequence makes "validation before creation" visually obvious.

**Design components added beyond the domain model:** 
- `BookingService` — coordinates the booking operation: validates the rules in order, then asks the repository to persist the booking. Not a domain concept; it is the application-level logic layer.
- `BookingRepository` — persists and queries bookings. Handles the overlap check (R2) and the save operation. Not a domain concept; it is the persistence layer.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `hasOverlappingActiveBooking` message | The check implements R2, but nothing in the diagram labels it as R2. R1 and R3 are explicitly named ("validate R1", "validate R3"); R2 is only implicit in the method name. | R2 | Added a `note right of BookingRepository` stating R2 explicitly: "no two ACTIVE bookings for the same room may overlap in time". |
| 2 | `alt Room is available` / `else Room is unavailable` | Guards are long noun phrases. The README §4 convention shows short guards (`created` / `unavailable`). | README §4 (notation convention) | Shortened to `available` / `unavailable`. The full meaning is preserved by the note and the surrounding messages. |
| 3 | R1 and R3 validation messages | The two self-messages (`validate R1`, `validate R3`) carry the rule number but not the substance of the rule, so a reader has to guess what "R1" means. | R1, R3 | Added `note` blocks next to BookingService that spell out each rule, so the diagram is self-contained. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
