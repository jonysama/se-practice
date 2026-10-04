# AI Usage Disclosure — Week 04

Required by the course academic policy (Generative AI use level **D** — AI-integrated). You are
responsible for the accuracy of everything you submit, including every diagram an AI drafted.

| Tool | Exact model | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-5.6 Luna | Task 1 — use-case draft | `models/original/use-case.puml` |
| ChatGPT | GPT-5.6 Luna | Task 2 — class draft | `models/original/class.puml` |
| ChatGPT | GPT-5.6 Luna | Task 3A — sequence draft | `models/original/sequence.puml` |
| ChatGPT | GPT-5.6 Luna | Critique of the revised diagrams | `lab-report.md` §6 |
| DeepSeek chat | DeepSeek-V4.1-Flash | Discussion of the critique, help wording §3–§5 | `lab-report.md` §3, §4, §5 |

**The files in `models/original/` are the AI's first replies, unedited:** yes

**The revised diagrams in `models/` were corrected by me, and I can explain every element:** yes

**Did an AI write any part of `lab-report.md` other than the critique it produced?** yes — the second assistant helped phrase the wording of §3, §4 and §5, but the findings themselves are mine (the Student-to-confirmation link, the missing R2 note, the `hide methods` directive, the missing `findRoom` call, the missing `endTime` calculation).

**Anything I accepted from the AI without fully understanding it:**

The `<<extend>>` stereotype was not used anywhere, and I did not independently re-derive when `<<extend>>` would be the correct choice instead of `<<include>>` — I followed the README's constraint that the reason must be written above each line.

Signed: Zhanibek Alimkulov
Date: 2026-10-04