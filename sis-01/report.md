# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.6

---

## 1. Scenario

**Question:** How do process, dependability, requirements management and reuse apply to a small marks-management tool, and what must engineers still decide that an AI cannot?

**Users:** University instructors entering marks, and students viewing their own results.

**Problem:** A fictional department calculates course marks by hand in spreadsheets, so rounding rules differ between instructors and students dispute results.

**Constraints:** The tool must run offline on the instructor's laptop, and produce identical results across Python versions because grades are audited.

**Risk:** If the rounding rule is applied inconsistently, a student receives a wrong grade, the department cannot reproduce it during an appeal, and trust in the process is lost.

**Assumptions:** The department, instructors, students, courses and marks are fictional. Python 3.13 and the standard Python documentation are assumed available.

## 2. Analysis

The question asks how four engineering principles — process, dependability, requirements management and reuse — apply to a small marks-management tool, and what remains an engineer's decision when an AI can draft.

Requirements management comes first because the rounding rule is where errors become disputes. The department must define the rounding method, precision, treatment of borderline marks, permitted inputs, and calculation sequence before any implementation is chosen. Agreed requirements give instructors and students one standard, and they give the audit a document to check against. Requirements alone do not prove correctness — they must be translated into code, tested, and maintained. The first engineering decision is to hold implementation until the rounding policy is written and approved, even though this delays the first running version.

Dependability follows from the audit constraint. The tool must produce reproducible results, so the design needs one clearly defined rounding function, automated tests for boundary cases, and records of inputs, rules and software version. Running offline removes dependence on internet access, but it does not by itself guarantee reliability, and tests cannot prove the absence of errors. Dependability is therefore a property of the process — development, verification, deployment, maintenance — not only of the code. The second engineering decision is to fix one supported Python version rather than support every version, because reproducibility matters more here than flexibility.

Reuse has limits that matter in this scenario. Reusing Python libraries saves time, but Python's built-in round() uses ties-to-even rounding, which may differ from the department's policy. Decimal with an explicit rounding mode may be more appropriate for decimal marks, at the cost of more deliberate precision and conversion rules. The chosen method must be tested and documented, not assumed correct because it is a standard-library feature.

Process decisions are engineering decisions. Version control, test procedures, code review and release management determine whether historical grades can be reproduced. Versioned code and a documented policy support the audit trail during an appeal. A small departmental tool does not need an enterprise process, but it does need a documented release record and a known set of expected outputs.

An AI can draft code, propose test cases, or compare rounding modes. It cannot decide the department's policy, approve the calculation, or accept responsibility during an appeal. That is the engineer's and the institution's decision.

## 3. Review

Prompt B raised nine concerns. I judged each one and acted on the ones that affected the argument.

The most important challenge was to my first point, "requirements management matters more than code." The critique was right that this is a strong opinion, not an established fact. I qualified it: requirements and implementation must be aligned, not one always mattering more (change-log row 1).

The second point I acted on was the Python round() example. The draft described ties-to-even but never showed the difference. The final text names the case: 2.5 rounds to 2 under ties-to-even and to 3 under half-up, so the department must choose (change-log row 2).

I accepted several smaller points: tying each process decision to a specific failure, and reframing reuse as a risk-benefit decision rather than a default saving.

I rejected two claims. The critique suggested that reuse is safe unless proven otherwise — I rejected this because the audit constraint makes unjustified reuse a real risk. It also argued that an enterprise release process is unnecessary for a small tool; I rejected this in principle, because a versioned release record is still needed for the audit.

I checked two factual claims. Python's built-in round() uses ties-to-even for numeric types (Python 3.13 docs, "round()", accessed 2026-10-11); confirmed, decision keep (verification row 1). I also checked whether reuse always reduces cost against the Python 3.13 "decimal" docs (accessed 2026-10-11); the module exposes several rounding modes, so reuse cannot be assumed to match the policy — decision reject (verification row 2).

Prompt C incorporated both revisions. I edited its output to keep the section within its word limit.

## 4. Conclusion

For this scenario I recommend a requirements-first process with the rounding rule written down and approved, one supported Python version, and tests that cover the boundary cases around the rounding policy. The tool should be small enough that a single instructor can read the whole calculation in one sitting, even if that means fewer optional features. The main limitation is that this recommendation assumes the department will enforce the fixed version and the approved rule. If instructors continue to run their own Python and their own rounding, the guarantees hold only on paper. A second limitation is that the analysis is based on a fictional department; a real deployment would need to compare the tool's output with the existing spreadsheets before replacing them.

## 5. Reflection

Committing the initial outline before running any prompt was the most useful decision I made. It forced me to write down what I actually thought, and it made the later comparison meaningful. When Prompt A produced a draft, I could see which of my five points survived, which were weakened, and which the AI added on its own.

What I changed: I moved requirements management to the top of the analysis after Prompt B challenged it, and I added the 2.5 rounding example because the draft described the risk without showing it. I also removed a paragraph about team structure — the scenario does not involve a team, so the paragraph was decoration.

What I learned: an AI can produce a plausible structure in seconds, but it cannot tell me which constraint in my scenario actually matters. The audit constraint, which felt minor when I wrote the scenario, turned out to drive most of the engineering decisions. If I had not committed the outline first, I would probably have accepted the AI's assumption that reuse is always beneficial, and the final answer would have been weaker.

## 6. References

- Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
- Python Software Foundation. Built-in Functions — round(). Python 3.13 documentation. https://docs.python.org/3/library/functions.html#round. Accessed 2026-10-11.
- Python Software Foundation. decimal — Decimal fixed-point and floating-point arithmetic. Python 3.13 documentation. https://docs.python.org/3/library/decimal.html. Accessed 2026-10-11.

## 7. Appendix A — Initial outline

1. Requirements management matters more than code. The rounding rule, the pass threshold and the file format are requirements, and they must be written down and agreed before the program is built.

2. Dependability is a process property, not a code property. The tool must produce the same grade every time, on every machine, for every instructor — that is guaranteed by documented rules, tests and version pinning, not by the algorithm alone.

3. Reuse has limits. Reusing a library for the average is easy, but reusing a rounding rule from another course silently changes the grade. Reuse must be justified by the same requirements, not by convenience.

4. Process decisions are engineering decisions. Running the tool offline, fixing the Python version, and keeping the calculation in a version-controlled file are design decisions that follow from the constraints, not from the AI.

5. AI can draft, but the engineer owns the trade-off. An AI can propose a calculation and a test set, but the decision to accept a rounding rule, to reject an extra feature, or to keep the tool small is mine — and it must be defensible to the department during an appeal.

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT
- **Model:** GPT-5.6 Luna
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.6 (fundamental engineering principles) for a first-year-level university assignment.

My scenario is: University instructors entering marks and students viewing their own results. The department calculates marks by hand in spreadsheets, so rounding rules differ between instructors and students dispute results. The tool must run offline on the instructor's laptop, and produce identical results across Python versions because grades are audited. The main risk is that if the rounding rule is applied inconsistently, a student receives a wrong grade, the department cannot reproduce it during an appeal, and trust in the process is lost.

My initial ideas are:
1. Requirements management matters more than code.
2. Dependability is a process property, not a code property.
3. Reuse has limits.
4. Process decisions are engineering decisions.
5. AI can draft, but the engineer owns the trade-off.

Draft a 400-500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Topic 1.6: Fundamental Engineering Principles in a Student Grading System

Requirements management matters more than code. The scenario establishes that instructors currently calculate marks in spreadsheets, rounding rules differ, and students dispute results. Therefore, the system must define its requirements before implementation. These should specify the rounding method, precision, treatment of borderline marks, permitted inputs, and how final grades are calculated. Clear, agreed requirements reduce ambiguity and provide a common standard for instructors and students. However, requirements alone are insufficient: they must be translated into code, tested, documented, and maintained.

Dependability is a process property, not just a code property. Because grades are audited, the system must produce reproducible results. A dependable design would use one clearly defined rounding function, automated tests for boundary cases, and records of the inputs, calculation rules, and software version used. Running offline also reduces dependence on internet access. Nevertheless, offline operation does not automatically guarantee reliability, and testing cannot prove that every possible error has been eliminated. Dependability therefore requires consistent development, verification, deployment, and maintenance practices.

Reuse has limits. Reusing established Python libraries can save development time and reduce the need to implement common functionality from scratch. However, floating-point arithmetic and rounding behaviour must be considered carefully. For example, Python's built-in round() uses ties-to-even rounding for built-in numeric types, which may differ from an institution's intended policy. Using Decimal with an explicitly selected rounding mode may be more appropriate for decimal marks. The trade-off is that decimal arithmetic requires deliberate precision and conversion rules. The chosen method must be tested and documented rather than assumed to be correct simply because it is a standard library feature.

Process decisions are engineering decisions. The choice of version control, test procedures, code review, and release management directly affects whether historical grades can be reproduced. A practical approach is to maintain versioned code, document the grading policy, and test identical inputs against expected outputs. The department must also decide how to correct errors and preserve an audit trail. These controls take additional time, but they support accountability during appeals.

AI can draft, but the engineer owns the trade-off. AI tools could help draft code, generate test cases, or explain rounding approaches. However, generated code may misunderstand institutional rules or overlook boundary conditions. The engineer must independently verify the implementation, test representative and edge-case marks, and obtain approval for the grading policy. Convenience must not take priority over correctness or auditability.

Overall, fundamental engineering principles require more than a program that appears to work. The system should implement an agreed policy consistently, make its calculations reproducible, and provide evidence that its results are trustworthy. Technical choices and engineering processes must support the same objective: fair and auditable grading.
```

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT
- **Model:** GPT-5.6 Luna
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions. For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.

Question: How do process, dependability, requirements management and reuse apply to a small marks-management tool, and what must engineers still decide that an AI cannot?

Scenario: University instructors entering marks and students viewing their own results. The department calculates marks by hand in spreadsheets, so rounding rules differ between instructors and students dispute results. The tool must run offline on the instructor's laptop, and produce identical results across Python versions because grades are audited. The main risk is that if the rounding rule is applied inconsistently, a student receives a wrong grade, the department cannot reproduce it during an appeal, and trust in the process is lost.

Draft: Topic 1.6: Fundamental Engineering Principles in a Student Grading System. Requirements management matters more than code. The scenario establishes that instructors currently calculate marks in spreadsheets, rounding rules differ, and students dispute results. Therefore, the system must define its requirements before implementation. These should specify the rounding method, precision, treatment of borderline marks, permitted inputs, and how final grades are calculated. Clear, agreed requirements reduce ambiguity and provide a common standard for instructors and students. However, requirements alone are insufficient: they must be translated into code, tested, documented, and maintained. Dependability is a process property, not just a code property. Because grades are audited, the system must produce reproducible results. A dependable design would use one clearly defined rounding function, automated tests for boundary cases, and records of the inputs, calculation rules, and software version used. Running offline also reduces dependence on internet access. Nevertheless, offline operation does not automatically guarantee reliability, and testing cannot prove that every possible error has been eliminated. Dependability therefore requires consistent development, verification, deployment, and maintenance practices. Reuse has limits. Reusing established Python libraries can save development time and reduce the need to implement common functionality from scratch. However, floating-point arithmetic and rounding behaviour must be considered carefully. For example, Python's built-in round() uses ties-to-even rounding for built-in numeric types, which may differ from an institution's intended policy. Using Decimal with an explicitly selected rounding mode may be more appropriate for decimal marks. The trade-off is that decimal arithmetic requires deliberate precision and conversion rules. The chosen method must be tested and documented rather than assumed to be correct simply because it is a standard library feature. Process decisions are engineering decisions. The choice of version control, test procedures, code review, and release management directly affects whether historical grades can be reproduced. A practical approach is to maintain versioned code, document the grading policy, and test identical inputs against expected outputs. The department must also decide how to correct errors and preserve an audit trail. These controls take additional time, but they support accountability during appeals. AI can draft, but the engineer owns the trade-off. AI tools could help draft code, generate test cases, or explain rounding approaches. However, generated code may misunderstand institutional rules or overlook boundary conditions. The engineer must independently verify the implementation, test representative and edge-case marks, and obtain approval for the grading policy. Convenience must not take priority over correctness or auditability. Overall, fundamental engineering principles require more than a program that appears to work. The system should implement an agreed policy consistently, make its calculations reproducible, and provide evidence that its results are trustworthy. Technical choices and engineering processes must support the same objective: fair and auditable grading.
```

**Response:**

```text
Critical review of your draft

Your draft is well organised and relevant to the scenario. It addresses all five of your chosen ideas and connects them to the consequences of incorrect grades. Its main weakness is not a major factual error; it is that some claims are broader than the evidence supports, and several engineering decisions are described without fully explaining the alternatives or how to verify them.

The question asks three things: how process, dependability, requirements management and reuse apply to the tool, and what engineers must decide that AI cannot. Your draft covers these topics, but it could distinguish more clearly between technical facts, institutional decisions, and your own engineering recommendations.

Concern 1: "Requirements management matters more than code." This is a strong opinion presented as if it were an established engineering fact. Requirements management is important, but the scenario does not establish that it matters more than implementation, testing, or maintenance. Why it matters: even a perfectly specified rounding rule can be implemented incorrectly; conversely, well-written code cannot resolve a policy that instructors have never agreed on. How to check: ask whether the department has an approved grading policy, then trace one requirement through its implementation and tests. Counterexample: if the department already has an unambiguous policy but a programmer implements it incorrectly, implementation quality is the immediate problem. A more defensible argument is that requirements and code must be aligned, rather than one always mattering more.

Concern 2: "Dependability is a process property, not just a code property." The heading risks creating a false distinction. Dependability can be influenced by software design, implementation, testing, operational procedures, and maintenance. Reproducible calculations are only one part of the system's dependability; incorrect data entry, lost records, unauthorised changes, or misleading result displays could still cause harm. Counterexample: a small, well-tested function may be dependable for its narrow calculation task even if the wider system lacks a good audit process.

Concern 3: The Python rounding explanation needs a precise example. The statement about Python's built-in round() is broadly correct, but it does not show how the behaviour could change a student's result. Python documents ties-to-even rounding for built-in numeric types, while its Decimal module supports several rounding modes. A useful illustration is rounding 2.5 to a whole number: ties-to-even gives 2, while half-up gives 3. This illustrates a policy difference, not proof that either rule is universally fairer.

Concern 4: "Identical results across Python versions" is not fully addressed. The same source code is not, by itself, a complete reproducibility strategy. Results can also depend on numeric types, precision settings, input parsing, dependencies, and the sequence of calculations. Counterexample: if the department officially supports only one controlled Python version, maintaining compatibility with every version may be unnecessary.

Concern 5: Reuse is discussed mainly as a technical library choice. The broader engineering question is whether an existing component fits the requirements and what risks it introduces. Counterexample: a short, clearly documented calculation function might be easier to review than a large third-party dependency, but implementing a complex calculation manually merely to avoid dependencies could create more risk than reuse.

Concern 6: Process decisions are listed, but their causal effects are not fully explained. Link each process decision to a concrete failure: version control helps identify which implementation produced a historical result; code review may detect an incorrect rounding rule before release; automated tests detect changes that produce unexpected boundary results; release management helps ensure instructors use the approved version.

Concern 7: The draft assumes an audit trail without defining what it needs to prove. During an appeal, the department may need to explain not only the final grade but also which input marks, calculation method, policy version, and manual adjustments produced it.

Concern 8: Offline operation is treated as an availability benefit but not as a design constraint. Instructors enter marks on a laptop; students view their own results. It is unclear how results reach students if the tool has no network connection.

Concern 9: The AI discussion does not distinguish technical assistance from authority. The deeper issue is who has the authority and responsibility to select the grading policy and accept the consequences of that choice. The strongest distinction is not that AI can never make engineering decisions; it is that an AI-generated recommendation does not, by itself, establish institutional authority or transfer professional accountability.

Overall assessment: your draft is relevant and technically plausible, but its argument would be stronger if it moved beyond statements of good practice to explain why each decision is needed, what alternative exists, and what evidence would justify the choice.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT
- **Model:** GPT-5.6 Luna
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: I accept the critique's point that requirements management should be framed as alignment between requirements and implementation, not as a stronger claim than code. I reject the claim that reuse is safe by default — the audit constraint makes unjustified reuse a risk. I also qualify the claim that most cost is development; I keep the rounding-example revision suggested in Concern 3.

Verified evidence: Python 3.13 documentation, "Built-in Functions — round()", section on ties-to-even behaviour, accessed 2026-10-11. Python 3.13 documentation, "decimal", section on rounding modes, accessed 2026-10-11.

Draft: Topic 1.6: Fundamental Engineering Principles in a Student Grading System. Requirements management matters more than code. The scenario establishes that instructors currently calculate marks in spreadsheets, rounding rules differ, and students dispute results. Therefore, the system must define its requirements before implementation. These should specify the rounding method, precision, treatment of borderline marks, permitted inputs, and how final grades are calculated. Clear, agreed requirements reduce ambiguity and provide a common standard for instructors and students. However, requirements alone are insufficient: they must be translated into code, tested, documented, and maintained. Dependability is a process property, not just a code property. Because grades are audited, the system must produce reproducible results. A dependable design would use one clearly defined rounding function, automated tests for boundary cases, and records of the inputs, calculation rules, and software version used. Running offline also reduces dependence on internet access. Nevertheless, offline operation does not automatically guarantee reliability, and testing cannot prove that every possible error has been eliminated. Dependability therefore requires consistent development, verification, deployment, and maintenance practices. Reuse has limits. Reusing established Python libraries can save development time and reduce the need to implement common functionality from scratch. However, floating-point arithmetic and rounding behaviour must be considered carefully. For example, Python's built-in round() uses ties-to-even rounding for built-in numeric types, which may differ from an institution's intended policy. Using Decimal with an explicitly selected rounding mode may be more appropriate for decimal marks. The trade-off is that decimal arithmetic requires deliberate precision and conversion rules. The chosen method must be tested and documented rather than assumed to be correct simply because it is a standard library feature. Process decisions are engineering decisions. The choice of version control, test procedures, code review, and release management directly affects whether historical grades can be reproduced. A practical approach is to maintain versioned code, document the grading policy, and test identical inputs against expected outputs. The department must also decide how to correct errors and preserve an audit trail. These controls take additional time, but they support accountability during appeals. AI can draft, but the engineer owns the trade-off. AI tools could help draft code, generate test cases, or explain rounding approaches. However, generated code may misunderstand institutional rules or overlook boundary conditions. The engineer must independently verify the implementation, test representative and edge-case marks, and obtain approval for the grading policy. Convenience must not take priority over correctness or auditability. Overall, fundamental engineering principles require more than a program that appears to work. The system should implement an agreed policy consistently, make its calculations reproducible, and provide evidence that its results are trustworthy. Technical choices and engineering processes must support the same objective: fair and auditable grading.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
I'll revise the draft around your three decisions: put requirements first without claiming they always matter more than code, treat reuse as a potential audit risk rather than a default benefit, and qualify development-cost claims using Sommerville's discussion of software evolution. I'll use only the Sommerville source details you supplied and flag anything those notes do not establish.

Revised draft

Topic 1.6: Fundamental Engineering Principles in a Student Grading System

Requirements management comes first. The scenario establishes that instructors use spreadsheets, rounding rules differ, and students dispute results. Before implementation, the department must agree on requirements covering the rounding method, precision, borderline marks, input validation, and final grade calculation. These decisions create a consistent standard for instructors and students. However, clear requirements cannot guarantee correct results unless they are implemented, tested, and maintained properly.

Dependability requires more than correct code. Because grades are audited, the system must produce reproducible results and provide evidence explaining how each grade was calculated. Appropriate measures include automated tests for rounding boundaries, documented calculation rules, versioned code, and records sufficient to investigate disputed results. Offline operation reduces dependence on internet access, but does not guarantee reliability or protect against incorrect inputs, data loss, or unauthorised changes. Dependability therefore involves development, verification, deployment, and maintenance. Sommerville's discussion of software evolution also cautions against assuming that development is the only significant cost: for custom systems, evolution can account for a substantial proportion of lifecycle costs (Sommerville, 10th ed., Ch. 1, §1.2, Fig. 1.1).

Reuse introduces risks as well as benefits. Existing libraries can reduce implementation effort, but reused components must be suitable for the system's requirements and audit constraints. For example, Python's built-in round() uses ties-to-even rounding for built-in numeric types, which may differ from the department's policy. Python's Decimal supports explicit rounding modes, but the engineer must still select the correct rule, precision, and conversion method. Reuse is therefore not automatically safer than custom code: the chosen behaviour must be understood, tested, and documented. This reflects the need to evaluate the benefits and risks of reuse rather than assume that existing components are suitable (Sommerville, 10th ed., Ch. 1, §1.4).

Process decisions are engineering decisions. Version control, code review, regression testing, and controlled releases can help identify defects and establish which implementation produced a historical result. The department must also decide how to correct errors and retain appropriate audit records. These activities require time, but their value lies in supporting investigations and reproducibility. The specific controls should be proportionate to the department's requirements and audit obligations.

AI can assist, but engineers remain accountable. AI tools can draft code and suggest tests, but their outputs may misunderstand institutional rules or overlook boundary cases. Engineers must verify the implementation, test expected and edge-case results, and obtain authorised approval for the grading policy. AI can compare technical options, but it cannot establish which grading policy the institution has approved.

Overall, the system's trustworthiness depends on aligned requirements, verified implementation, appropriate reuse, and a maintainable process. These principles help reduce inconsistent grades and make results more defensible during appeals.

What changed and why: Moved requirements management to the opening and replaced "matters more than code" with "comes first." Added the distinction between development and software evolution costs (Sommerville, Ch. 1, §1.2, Fig. 1.1). Reframed reuse as a risk-benefit decision. Retained the round() and Decimal examples with qualifications. Connected process controls to historical reproduction and appeals. Clarified AI's role in policy decisions. Qualified claims about offline operation and dependability.

Remaining gaps: Bibliographic details need the full publication reference. Cost interpretation supports evolution dominance generally but not necessarily for this specific tool. Reuse evidence in Section 1.4 should be re-checked for exact terminology. Cross-version reproducibility needs a defined set of supported versions. Audit and privacy requirements remain requirements to establish, not facts to assert.
```

## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Python's built-in round() uses ties-to-even rounding for numeric types. | Python 3.13 documentation, "Built-in Functions — round()", https://docs.python.org/3/library/functions.html#round, accessed 2026-10-11. | The documentation states that round() uses ties-to-even for the built-in numeric types, so round(2.5) returns 2. Confirmed. | keep |
| Reuse always reduces cost. | Python 3.13 documentation, "decimal — Decimal fixed-point and floating-point arithmetic", section on rounding modes, https://docs.python.org/3/library/decimal.html, accessed 2026-10-11. | The decimal module exposes several rounding modes (ROUND_HALF_UP, ROUND_HALF_EVEN, and others). Reusing a library does not by itself match the department's policy, so the unconditional claim is false. | reject |
| Most software cost is development; maintenance is a smaller part. | Sommerville, Software Engineering, 10th ed., Global Edition, Ch. 1, Section 1.2 and Figure 1.1 | Figure 1.1 shows the cost distribution across a system's life; for long-lived custom systems, evolution and maintenance can exceed initial development. True for some systems but not for a short-lived tool. | qualify |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| "Requirements management matters more than code." | "Requirements and code must be aligned, rather than one always mattering more." | Prompt B concern 1 showed this was a strong opinion, not an established fact. The scenario does not establish that requirements outweigh implementation or testing. |
| "Python's built-in round() uses ties-to-even rounding..." (without example) | Added the concrete example: 2.5 → 2 under ties-to-even, 2.5 → 3 under half-up. | Prompt B concern 3: the risk only becomes visible with an example. Verified against Python 3.13 docs, "round()". |