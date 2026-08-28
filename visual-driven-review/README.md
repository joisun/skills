# Visual-Driven Review

An Agent Skill for browser-based UI review that prioritizes proactive visual
discovery. It combines low-cost route capture, inferred product grammar,
cross-page pattern atlases, state exploration, focused verification, and
human-readable evidence reports.

The skill reports findings and evidence. It does not modify application code
or install browser tooling.

## Requirements

- An Agent Skills-compatible client
- One host-provided browser automation backend: Playwright MCP, Playwright CLI,
  or an already configured code-as-action/Webwright environment
- Direct screenshot image content or a runtime image viewer that can inspect
  backend-produced screenshot artifacts
- A reachable target application and any required test authentication

The skill follows host browser rules. With Playwright MCP it defaults to an
isolated `playwright-headless` server and uses an extension-backed server only
when the current browser's login state, cookies, or installed extensions are
required. It never installs or reconfigures browser tooling during an audit.

## Install

Install this skill from the monorepo:

```bash
npx skills add joisun/skills --skill visual-driven-review -g
```

To inspect the available skills before installing:

```bash
npx skills add joisun/skills --list
```

## Use

Ask the Agent to audit, inspect, validate, or explore a web UI in a real
browser. The workflow covers broad visual audits, responsive and regression
reviews, accessibility observations, adversarial UI states, smoke checks, and
end-to-end UI flows. A broad audit visits every material route cheaply, compares
related patterns across pages, then spends detailed DOM/style checks on
suspicious components and high-risk interaction states. Missing design
instructions do not stop discovery: the skill uses theme/component semantics,
repeated product patterns, and general UX principles with explicit confidence.

Run artifacts can be written beneath the reviewed project's
`.vdr-log/YYYY-MM-DD-<task-slug>/` directory, for example
`.vdr-log/2026-07-23-dayjs-targeted-spot-check/`. The date is resolved once per
run and the task slug is lowercase ASCII kebab-case; viewport sizes, worker IDs,
generic task counters, and random hashes belong in neither the run ID nor the
run root. The skill does not edit `.gitignore` or application files during an
audit.

The final `report.md` and `report.html` are for human readers. Every issue
states the page, route, reach steps, observation, and impact, with its evidence
image rendered directly below it. Raw worker records remain separate. A
dependency-free Node.js generator and validator are provided:

```bash
node <skill-root>/scripts/build-report.mjs <run-root>
node <skill-root>/scripts/validate-run.mjs <run-root>
```

See [SKILL.md](SKILL.md) for the complete workflow and
[references/](references/) for the evidence, observation, Playwright MCP, and
reporting guides.

## Safety Boundaries

- Select one host-provided browser backend/session for a review flow and do not
  switch in a way that loses state or isolation.
- Keep navigation, actions, authentication, data mutation, and destructive
  operations inside the user-authorized scope.
- Record screenshot capture and visual inspection as separate coverage facts.
- Build cross-page pattern atlases for broad audits.
- Pair functional conclusions with deterministic evidence.
- Do not claim complete visual coverage when evidence is missing or skipped.
- Do not modify application code, dependencies, or ignore/config files as part
  of the review workflow.

## License and Attribution

Released under the [MIT License](LICENSE.txt).

This curated work derives testing ideas from Browserbase's MIT-licensed
[`skills/ui-test`](https://github.com/browserbase/skills/tree/6afe8663693372e59e167dfa5be37932af09ae3d/skills/ui-test).
The Playwright MCP workflow follows Microsoft's official
[`playwright-mcp`](https://github.com/microsoft/playwright-mcp/tree/55679f5f3d4b4f3e2534ec0ce2fc5683ba2eaf3f).
