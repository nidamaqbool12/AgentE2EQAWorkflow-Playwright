# AgentE2EQAWorkflow-Playwright

An end-to-end QA automation workflow that uses **natural language prompts + MCP servers + AI agents** to go from a raw user story all the way to committed, self-healing Playwright test scripts.

This project demonstrates how AI agents can collaborate across the full QA lifecycle — test planning, exploratory testing, automation script generation, self-healing, reporting, and version control — with minimal manual scripting.

---

## 🧭 Overview

The workflow takes a single input (a user story) and produces:

- A structured test plan
- Manual exploratory test results with evidence
- Automated Playwright (JavaScript) test scripts
- Self-healed, stable automation scripts
- A full QA test execution report
- A committed and pushed Git history of all artifacts

It is built around three specialized agents:

| Agent | Responsibility |
|---|---|
| `playwright-test-planner` | Explores the app and builds a detailed test plan from acceptance criteria |
| `playwright-test-generator` | Converts the test plan + exploratory findings into Playwright JS scripts |
| `playwright-test-healer` | Diagnoses and auto-fixes failing automation tests (selectors, waits, assertions) |

Browser interaction throughout the workflow is powered by **Playwright MCP tools**, and repository operations are powered by the **GitHub MCP server**.

---

## 🗂️ Project Structure

```
.
├── user-stories/
│   └── SCRUM-101-ecommerce-checkout.md      # Input user story
├── specs/
│   └── saucedemo-checkout-test-plan.md      # Generated test plan
├── tests/
│   └── saucedemo-checkout/                  # Generated Playwright automation scripts
├── test-results/
│   └── SCRUM-101-checkout-test-report.md    # Final QA report
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js (LTS recommended)
- Playwright installed (`npm install @playwright/test`)
- Access to an MCP-enabled AI assistant (e.g., Claude) with:
  - Playwright MCP server (browser automation)
  - GitHub MCP server (repository operations)
  - `playwright-test-planner`, `playwright-test-generator`, and `playwright-test-healer` agents configured
- A GitHub repository to push results to

---

## 🔄 Workflow

The workflow runs in **7 steps**. Each step can be run individually or chained together in a single combined prompt.

### Step 1 — Read User Story
Reads the user story file and summarizes key requirements, acceptance criteria, application URL, and test credentials.

### Step 2 — Create Test Plan
The `playwright-test-planner` agent explores the application and produces a comprehensive test plan covering:
- Happy path scenarios
- Negative scenarios (validation errors, empty fields, invalid data)
- Edge cases and boundary conditions
- Navigation flow tests
- UI element validation

Saved to `specs/saucedemo-checkout-test-plan.md`.

### Step 3 — Exploratory Testing
Using Playwright MCP browser tools, each scenario in the test plan is manually executed, verified against expected results, and documented with screenshots and findings.

### Step 4 — Generate Automation Scripts
The `playwright-test-generator` agent combines the test plan with insights from exploratory testing (stable selectors, wait strategies, UI quirks) to generate Playwright JavaScript test suites in `tests/saucedemo-checkout/`, following best practices (`expect()` assertions, `beforeEach`/`afterEach` hooks, multi-browser config).

### Step 5 — Execute and Heal Automation Tests
All generated scripts are executed. Any failures are diagnosed and auto-healed by the `playwright-test-healer` agent (selector fixes, timing adjustments, assertion corrections), then re-run until stable.

### Step 6 — Create Test Report
A consolidated report is generated at `test-results/SCRUM-101-checkout-test-report.md`, including:
- Executive summary
- Manual test results
- Automated test results + healing summary
- Defects log
- Test coverage analysis
- Recommendations

### Step 7 — Commit to Git Repository
All workspace artifacts (user story, test plan, scripts, report) are staged, committed with a conventional commit message, and pushed to:

```
https://github.com/nidamaqbool12/AgentE2EQAWorkflow-Playwright.git
```

---

## 🚀 Running the Full Workflow

Each step above has a corresponding natural-language prompt (see the full prompt set in this repo's workflow documentation). Steps can be run one at a time for review/control, or chained as a single combined prompt to execute the entire pipeline end-to-end with status updates after each step.

---

## 📊 Output Artifacts

| Artifact | Location |
|---|---|
| Test plan | `specs/saucedemo-checkout-test-plan.md` |
| Automation scripts | `tests/saucedemo-checkout/` |
| Test report | `test-results/SCRUM-101-checkout-test-report.md` |

---

## 🧪 Tech Stack

- **Playwright** (JavaScript) — browser automation
- **MCP (Model Context Protocol)** — Playwright MCP server + GitHub MCP server
- **AI Agents** — test planning, generation, and self-healing
- **Git/GitHub** — version control and artifact history

---

## 🔁 CI/CD — GitHub Actions

Automated tests can be wired into a GitHub Actions pipeline so the `tests/saucedemo-checkout/` suite runs automatically on every push/PR, and on a schedule.

### Workflow file

Create `.github/workflows/playwright-tests.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 3 * * *"   # optional: nightly run at 3 AM UTC
  workflow_dispatch:        # allows manual trigger from the Actions tab

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test tests/saucedemo-checkout --reporter=html

      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

      - name: Upload test results (traces/screenshots)
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
          retention-days: 14
```

### What this pipeline does

| Trigger | Behavior |
|---|---|
| `push` to `main` | Runs the full suite on every merge |
| `pull_request` to `main` | Gates PRs on test results before merge |
| `schedule` (cron) | Runs nightly regression to catch environment drift |
| `workflow_dispatch` | Lets you trigger a run manually from the Actions tab |

Key steps:
1. **Checkout** the repo
2. **Install Node.js + dependencies** (`npm ci` for reproducible installs)
3. **Install Playwright browsers** (Chromium, Firefox, WebKit) with OS deps
4. **Run tests** and generate an HTML report
5. **Upload artifacts** (HTML report, traces, screenshots) so failures can be triaged from the Actions run — especially useful alongside the `playwright-test-healer` agent's output when diagnosing failures




## 📌 Notes

- This project was built as a demonstration of AI-agent-driven QA workflows and is designed to be adapted to other applications/user stories by swapping the input user story file and target application URL.
- Self-healing reduces flaky test maintenance overhead by automatically correcting common failure causes (stale selectors, timing issues) rather than requiring manual debugging each run.

