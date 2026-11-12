# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Zhanibek Alimkulov
**Student ID:** 24B031621
**GitHub:** jonysama

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | ChatGPT |
| Exact model (or "not displayed") | GPT Astra 6 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.13.0 |

## 2. Your tool definition — a reason for every constraint

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks if a room is available for a requested time slot. All times are in minutes since midnight, ranging from 0 to 1440. It does not save or create a booking, it only checks availability.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": { "type": "integer", "minimum": 0, "maximum": 1440, "description": "Requested start time in minutes since midnight." },
      "end": { "type": "integer", "minimum": 0, "maximum": 1440, "description": "Requested end time in minutes since midnight." },
      "now": { "type": "integer", "minimum": 0, "maximum": 1440, "description": "Current time in minutes since midnight." },
      "blocked": { "type": "boolean", "description": "Whether the room is blocked." },
      "bookings": {
        "type": "array",
        "items": { "type": "object", "properties": { "start": { "type": "integer" }, "end": { "type": "integer" } }, "required": ["start", "end"], "additionalProperties": false },
        "description": "List of existing bookings."
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| start | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | The model might send a string like "10:00" or a float, or invent a time outside the day bounds. |
| end | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | The model might send a string or a value beyond 1440 (past midnight). |
| now | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | The model might omit the current time or send it in the wrong format. |
| blocked | `"type": "boolean"` | The model might send a string "false" instead of the boolean `false`. |
| bookings | `"type": "array"`, `"items"` schema | The model might send a single object instead of an array, or omit the `end` field in a booking. |

## 3. The twelve calls — first run and final run

## 3. The twelve calls — first run and final run

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | - |
| S02 | PASS | PASS | - |
| S03 | FAIL | PASS | Added `"type": "integer"` to `end`. |
| S04 | FAIL | PASS | Added `start`, `end`, `now`, `blocked`, `bookings` to `required`. |
| S05 | FAIL | PASS | Added `"additionalProperties": false`. |
| S06 | FAIL | PASS | Added `"minimum": 0` to `start`. |
| S07 | FAIL | PASS | Added `"maximum": 1440` to `end`. |
| S08 | FAIL | PASS | Added `"items"` schema to `bookings` requiring `end`. |
| S09 | FAIL | PASS | Added `"type": "boolean"` to `blocked`. |
| S10 | FAIL | PASS | Changed `start` type to `"integer"` (rejects floats). |
| S11 | PASS | PASS | - |
| S12 | FAIL | PASS | Changed `bookings` items to an object with `start` and `end`. |

## 4. Function calling — what the model wrote

## 4. Function calling — what the model wrote

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```
The model correctly converted all times to minutes and filled all arguments.

### R2

```text
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```
The model correctly converted 16:30 to 990. It called the tool as requested, even though `canBook` will return Unavailable due to the duration and blocked status.

### R3

```text
What exact time tomorrow afternoon (November 13) do you want the room, and is it blocked or already booked?
```
The request was missing the exact start and end times, the current time (`now`), and the `blocked` status. The model correctly asked for clarification instead of guessing.

## 5. What the schema cannot check

- **AC1 (start < end):** The schema checks that both are integers between 0 and 1440, but it cannot check that `start` is less than `end`.
- **AC2 (duration <= 120):** The schema cannot enforce a relationship between `start` and `end` to ensure the duration is at most 120 minutes.
- **AC4 (no overlap):** The schema cannot check if the requested interval overlaps with items in the `bookings` array.
- **AC5 (does not save):** The schema can only check the shape of the input, not the side effects of the function.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | It is a read-only check and does not modify any data. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading code is safe and helps the agent understand the logic. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | Modifying core business logic without human review is dangerous. |
| A4 | run `npm test` in `week-08/app` | allow | Running tests is a safe, read-only verification step. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | This is a destructive command that could erase uncommitted work. |
| A6 | `git commit` its change on the `week-09` branch | ask | It is safe to commit to a feature branch, but human review is preferred first. |
| A7 | `git push` to `main` | block | Pushing directly to main bypasses the PR review process and is unsafe. |
| A8 | send the contents of `.env` to an MCP server it found online | block | This is a severe security risk, leaking secrets to an untrusted third party. |

## 7. Checkpoint

The checkpoint is commit `758f541` (from `git log --oneline`). 
To return to it, run: `git reset --hard 758f541`. 
This command would throw away any uncommitted changes and recent commits made after the checkpoint.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

## 8. Checker output

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
```

## 9. What still fails

None

## 10. Conclusion (80–150 words)

The schema, the model, and the function are three distinct layers of safety. The schema guarantees the shape (e.g., that times are integers), but it cannot understand meaning. For example, in R2, the model correctly converted 16:30 to 990 and called the tool, but only `canBook` knew that a 150-minute request exceeds the 120-minute limit. The model's job is translation from natural language to JSON. R3 showed this clearly: because the request lacked specific times, a good model asks a clarifying question instead of guessing. Ultimately, human permissions (A1-A8) are the final safeguard: an agent might be smart enough to format a call, but it should never have the power to `push` to `main` or leak `.env` files without explicit approval.
