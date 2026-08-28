# Execution Backends

Browser automation is the transport layer. It affects speed, isolation, and
token cost; it does not replace visual judgment.

## Selection Order

First obey the host's browser instructions. Then choose the lowest-overhead
already configured backend that can satisfy authentication and isolation:

1. **Playwright CLI with Skills** — strong for batch navigation, scoped
   snapshots written to files, named sessions, and repetitive capture when it is
   already available.
2. **Code-as-action or Webwright** — useful for long sequences, batch scripts,
   local artifact processing, and reducing tool-call chatter when already
   configured.
3. **Playwright MCP** — dependable interactive fallback and often the required
   host integration; use headless isolation by default and extension mode only
   when the current Chrome state is required.

Do not install, upgrade, or configure a backend during an audit. Do not switch
backends mid-session if doing so loses authentication or state continuity.

Webwright can make execution more efficient, but it is not inherently better at
finding visual design problems. The discovery workflow, atlases, critic, and
verification contract are still required.

## Token-Efficient Practices

- Write screenshots, snapshots, and logs to files. Return paths and compact
  summaries instead of raw payloads.
- Scope DOM/accessibility snapshots to the main region or suspicious component.
- Limit snapshot depth and use raw/compact modes when supported.
- Batch repeated actions and component fingerprint collection in one bounded
  script.
- Capture once, reuse many times. Do not recapture unchanged states for every
  heuristic.
- Use progressive visual inspection:
  1. contact sheet;
  2. original screenshot for suspicious tiles;
  3. focused crop and deterministic evidence for publication.
- Filter console/network records to visible failures, failed resources, or
  requests relevant to the current state.
- Keep secret-bearing request headers and storage values out of artifacts.

## Playwright MCP

When selected:

- use only one configured server for a test flow;
- default to isolated headless contexts for parallel work;
- use an extension-backed server only for current-browser authentication,
  cookies, or installed extensions;
- read
  [playwright-mcp-presets.md](playwright-mcp-presets.md) and
  [playwright-mcp-recipes.md](playwright-mcp-recipes.md);
- save screenshots to the run directory and inspect them with the runtime image
  viewer at captured resolution.

Large accessibility snapshots are not a visual review. Request only the region
and depth needed for the current question.

## CLI or Code-as-Action

When already configured:

- use a named, isolated session per worker;
- write snapshots and screenshots beneath that worker's artifact directory;
- keep automation scripts disposable and inside the run directory, not the
  application source tree;
- prefer a single batch script for navigation/capture over many one-line calls;
- return a compact manifest containing route, state, artifact path, timing, and
  errors.

Scripts must respect the same authorization and mutation boundaries as
interactive tools.

## Authentication

Use the authentication mechanism supplied by the user or host. Inject secrets
at runtime and redact them from:

- command output;
- generated scripts;
- `run.json`;
- snapshots and storage dumps;
- reports.

If screenshots expose personal or sensitive data outside the review need,
redact or avoid capturing that region.

## Parallel Isolation Gate

Before route fan-out, two workers each open a harmless sentinel route and
record:

- backend/session identifier;
- browser context identifier when exposed;
- viewport actually retained;
- storage isolation result;
- artifact output path.

Fail the gate if sessions, storage, or paths collide. The sentinel dimensions
are diagnostic only and must not be counted as review coverage unless they
match the authorized viewport.

## Backend Failure

After three failed attempts at the same backend operation, stop thrashing.
Capture the exact failure, try one safe lower-complexity alternative, and mark
affected coverage as blocked if the prerequisite remains unavailable.
