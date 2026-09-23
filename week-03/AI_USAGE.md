# AI Usage Disclosure — Week 03

Required by the course academic policy (Generative AI use level **D** — AI-integrated).
AI use is expected in this lab. You remain responsible for the accuracy, testing and integrity of
everything you submit, including everything an AI tool produced.

| Tool | Exact model + version | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT-5.6 Luna | Prompt 1 — user stories | `requirements/user-stories.md` |
| ChatGPT | GPT-5.6 Luna | Prompt 2 — acceptance criteria | `requirements/acceptance-criteria.md` |
| ChatGPT | GPT-5.6 Luna | Prompt 3 — use-case diagram | `requirements/use-cases.puml` |
| DeepSeek chat | (DeepSeek-V4.1-Flash) | Discussion of results, help wording the review and the conclusion | `lab-report.md` sections 3, 5, 7, 10 |

**One tool and one model for all three prompts:** yes — ChatGPT, GPT-5.6 Luna.

**Did you use AI for anything beyond the three verbatim prompts** — rewriting your review, writing
the traceability table, drafting the conclusion? Name it. This is allowed and disclosed, not hidden.

Yes. I used a second assistant (DeepSeek chat) to discuss the AI's output, to help me phrase the review notes in `lab-report.md` sections 3, 5 and 7, and to help draft the conclusion in section 10. The decisions and the findings are mine: I identified the three invented functions in the AI's stories, the missing UC-06 story, the wrong administrator association in the diagram, and the missing UC-03 → UC-06 link.

**Everything I submitted, I can explain and defend in class:** yes

**Anything I accepted from the AI without fully understanding it:**

The `<<include>>` stereotype distinction in PlantUML — I removed the `UC02 → UC01` include relationship because it was described as "wrong stereotype", but I did not independently re-derive why `<<extend>>` would have been the better choice if the relationship were kept.

Signed: Zhanibek Alimkulov
Date: 2026-09-23