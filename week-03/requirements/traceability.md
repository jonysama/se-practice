# Traceability — use cases → stories → criteria

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | none | Yes — no acceptance criteria for this use case |
| UC-02 Book room | US-02 | AC-01, AC-02, AC-03, AC-04, AC-05 | No |
| UC-03 Cancel booking | US-03 | AC-06, AC-07, AC-08, AC-09 | No |
| UC-04 Block or unblock room | US-04 | AC-10, AC-11, AC-12, AC-13 | No |
| UC-05 Review usage | US-05 | none | Yes — no acceptance criteria for this use case |
| UC-06 Send confirmation | US-06 | none | Yes — no acceptance criteria for this use case |

**Stories that belong to no use case:** none

**What the gaps tell you:** The assistant-generated stories covered UC-01 through UC-04 but left UC-05 (Review usage) and UC-06 (Send confirmation) without any acceptance criteria — not because they are unimportant, but because the AI stopped after three story groups. UC-01 also has a story but no criteria, because I only selected three stories for Part 3. The bigger finding is UC-06: it never appeared in the AI's original output at all, so it has no criteria either. A use case with a story but no criteria is a gap in verification, not in scope.