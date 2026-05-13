# AuraSense Playground Closure Walkthrough – QA Logging Template

| Route / screen   | Action                  | Expected                        | Actual                        | Impact     | Fix idea                          |
|------------------|------------------------|----------------------------------|-------------------------------|------------|------------------------------------|
| /playground      | Clicked Nurse Rehearse  | Enter nurse flow cleanly         | Went to wrong / unclear route | Blocker    | Wire CTA to real route             |
| /rehearse/nurse  | Finished module         | Show result + save session       | Result unclear / not saved    | Bad demo   | Add end-state save + summary       |
| /rehearse/nurse  | Refresh page            | Resume or restore state          | Session resets                | Confusing  | Persist progress                   |
| tutor view       | Open learner result     | See anomalies + verdict clearly  | Hard to scan                  | Bad demo   | Add compact instructor summary rail|

---

### Completed (no further QA needed)

| Route / screen   | Action                  | Expected                        | Actual                        | Impact     | Fix idea                          |
|------------------|------------------------|----------------------------------|-------------------------------|------------|------------------------------------|
| (all)            | Multi-scenario polish   | All scenarios work as designed   | Confirmed complete            | None       | —                                 |
| (all)            | Full telemetry pipeline | All telemetry events captured    | Confirmed complete            | None       | —                                 |
| (all)            | Edge cases (network drop, multi-tab, expired auth) | Handled gracefully | Confirmed complete | None | — |

---

## What to test

- Playground shell entry
- Nurse rehearse entry
- Full session completion
- Result / state persistence
- Instructor visibility
- Mobile pass on iPhone / iPad

---

## Output rule

- Do not solve anything while testing
- Only log problems into the table
- Keep rows short and factual
- One problem per row
- Raw rows will later be converted into a build order

---

# Rapid pass template

| Route / screen   | Problem                        | Impact     |
|------------------|-------------------------------|------------|
| /playground      | Nurse Rehearse CTA misroutes  | Blocker    |
| /rehearse/nurse  | Result not saved after finish | Bad demo   |
| /rehearse/nurse  | Refresh resets session        | Confusing  |
| tutor view       | Results hard to scan          | Bad demo   |

---

### Completed (no further QA needed)

| Route / screen   | Problem                        | Impact     |
|------------------|-------------------------------|------------|
| (all)            | Multi-scenario polish complete | None       |
| (all)            | Telemetry pipeline complete    | None       |
| (all)            | Edge cases handled             | None       |

---

Paste this artifact directly into Notion, GitHub issues, README QA sections, or chat logs for consistent closure testing.
