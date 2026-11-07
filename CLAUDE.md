# CLAUDE.md

Take-home for a Senior QA Engineer (Mobile) role. Source of truth for scope: `docs/assignment.pdf`.
The author will walk reviewers through this code in a 60-minute call (and make a small change live), so every line must be understandable and explainable. Keep explanations short and practical.

## Task
- Automate the sign-up, login and forms screens of the WebdriverIO Native Demo App v2.2.0 on Android. APK: `apps/android.wdio.native.app.v2.2.0.apk`.
- Stack: WebdriverIO v9, Appium with UiAutomator2, TypeScript, Mocha. No Cucumber.
- Required scenarios (each test asserts what the user sees, e.g. dialog or error text):
  - Sign up (Login tab -> Sign up): success dialog; invalid email rejected; mismatched passwords rejected.
  - Login (Login tab -> Login): success dialog; invalid email rejected; password shorter than 8 characters rejected.
  - Forms tab: typed text is echoed back; switch toggles and its label updates; "Active" button opens a native alert.
- Optional extras are fine only if reliable and justified in the README. A few reliable tests beat many flaky ones.
- Reviewers check: reliability (stable locators, explicit waits, NO fixed sleeps, tests independent of each other), readability (easy to extend), test design (sensible scenarios, clear expected results), communication (honest README, well-written bug reports).
- Order of work: scaffold, locator inspection, sign-up, login, forms, reliability pass, README.
- README must cover: setup and run steps, why this tool, project structure, what to do next with more time, and whether/how AI tools were used (this project uses Claude Code; say so honestly).
- Keep commit history (no squashing). The author commits after each step.

## Code style
- Plain, human-readable code. Simple page objects, no heavy abstraction, no clever helpers. Short comments only where they explain why.
- Every test asserts what the user sees (dialog text, error message text).
- Prefer accessibility id locators. Verify every locator against the real app, never guess.

## Teaching mode
The author is learning WebdriverIO and Appium while building this. For every step:
1. Before writing code, say in 3-5 lines what we are about to build and why. Use a simple real-world analogy where it helps.
2. Create at most one or two files per step.
3. After writing, explain each file briefly: what each part does, why it is written that way, and what would break without it. Use examples from the actual code.
4. List the 2-3 concepts the author should be able to explain to a reviewer (e.g. explicit waits, why page objects exist, what a capability is).
5. Do NOT add quizzes or practice exercises. The author will do those after the assignment is finished.
6. Do not move to the next step until the author says "go".

## Working rules
- If something fails, explain the root cause in plain words before fixing it. Never fix by adding sleeps.
- Never silently change files from an earlier step. Say what and why first.
