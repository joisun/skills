# Discovery Workflow

Use this reference for broad, multi-route, or materially uncertain audits. The
goal is high recall with bounded browser and model cost.

## Why the Workflow Is Layered

A page-by-page checklist is good at finding deterministic breakage and poor at
finding product-level visual problems. Route isolation hides inconsistent
filters, strange action hierarchy, off-brand chart palettes, mismatched form
widths, and weak selected states.

The workflow therefore separates:

1. inventory;
2. cheap capture;
3. cross-route visual comparison;
4. independent candidate discovery;
5. focused verification;
6. human reporting.

Do not collapse candidate discovery into deterministic verification. If the
agent only asks questions that DOM measurements can answer, it will mostly find
geometry problems.

## Provisional Visual Grammar

Create a short grammar even when no project instruction exists.

### Evidence Sources

Use sources in this order:

1. explicit design rules, acceptance criteria, approved mockups, and WCAG target;
2. theme variables, design tokens, component variants, and framework semantics;
3. repeated patterns across comparable product pages;
4. general principles of hierarchy, affordance, proportion, consistency, and
   error prevention.

For every inferred rule, record:

- pattern name;
- applicable page/component types;
- observed examples;
- source tier;
- confidence;
- known exception or uncertainty.

Do not treat frequency as correctness. A dominant pattern can itself be poor.
Use it to expose deviations, then judge both the deviation and the dominant
pattern against the task and general principles.

### Representative Sampling

Before reviewing every route deeply, choose representative examples from each
page archetype:

- dense table/list;
- filter-heavy search;
- form;
- detail page;
- dashboard/chart;
- approval/workflow;
- tabbed utility;
- empty/error/permission state.

Prefer pages that appear mature, frequently reused, or built from shared
components. If no page can be treated as approved, label comparisons as
inferred rather than canonical.

## Cheap Capture

The first pass answers “what exists and what looks suspicious,” not “what are
all computed properties?”

For each material route/state, record:

- route and human page name;
- exact reach steps;
- viewport and state;
- one useful page screenshot;
- capture status and inspection status;
- page archetype and visible pattern tags;
- compact notes on loading, empty, error, broken asset, console, or request
  failures that change the UI.

Keep expensive artifacts local. Do not feed full accessibility trees, all CSS,
all network responses, or duplicate screenshots into the model.

## Pattern Atlases

Cross-route comparison is mandatory in a broad audit. Assemble related crops or
screenshots into compact contact sheets. Useful groups include:

| Atlas | Compare |
| --- | --- |
| Filters | label treatment, control height/width, spacing, query/reset placement |
| Forms | label alignment, field width, textarea proportion, required markers, actions |
| Tables | link tokens, row actions, icon states, density, alignment, empty columns |
| Actions | primary/secondary/destructive roles, add/remove pairs, disabled states |
| Alerts and tabs | icon policy, emphasis, padding, active/hover state |
| Charts | palette, legend, labels, empty data, hierarchy, product fit |
| Page shell | title, breadcrumbs, content width, cards, whitespace, scan order |

Annotate every tile with page name and route. Avoid tiny grids that make text
or controls illegible. Split an atlas when necessary.

## Independent Visual Critic

Run the critic before showing it detailed DOM measurements. Measurements can
anchor attention on what is easy to quantify.

Inspect at least these lenses:

- visual hierarchy and scan order;
- balance, proportion, density, and whitespace;
- typography and color/token use;
- action hierarchy and semantic color;
- affordance and interaction-state styling;
- repeated component consistency;
- form/control grouping and alignment;
- data-visualization palette, legend, labeling, and empty state;
- clipped, overlapping, truncated, or broken content;
- loading, empty, success, error, permission, and disabled feedback;
- copy clarity and visible accessibility cues.

Use direct questions:

- Which element draws more or less attention than its task importance warrants?
- Which control looks clickable but is not, or is clickable without looking so?
- Which selected/active/favorited/destructive state loses its semantic meaning?
- Which page appears to use a different design language?
- Which width, position, color, icon, or gap looks arbitrary compared with peers?
- Which visualization is technically rendered but visually misleading or
  incompatible with the rest of the product?

Record candidates liberally but do not publish them as confirmed defects yet.

## State-Risk Matrix

Initial state alone is insufficient for stateful UI. Sample by component risk:

| Component | Important states |
| --- | --- |
| Link | default, hover, visited if applicable, focus |
| Favorite/bookmark | off, on, hover, disabled, optimistic/loading |
| Button | primary, secondary, destructive, disabled, loading, focus |
| Input/select | empty, filled, focus, validation error, disabled |
| Tabs | inactive, active, hover, overflow |
| Table row action | default, hover, selected row, unavailable action |
| Alert | info/success/warning/error, icon presence, close action |
| Chart | populated, zero/empty, loading, tooltip/legend interaction |

Prioritize states whose style conveys semantics. A black fill, identical
add/remove colors, or weak active state can be a finding even when the
interaction technically works.

## Candidate Verification

For each candidate, formulate one claim and choose the smallest evidence set:

- two comparison crops for a cross-page inconsistency;
- computed token/color plus screenshot for a semantic color mismatch;
- bounding rectangles for proportion, alignment, clipping, or overlap;
- role/name/state plus interaction result for affordance;
- screenshot before/after interaction for state styling;
- console/network trace only when it explains a visible failure.

Verification outcomes:

- `confirmed`;
- `high-confidence`;
- `review-candidate`;
- `refuted`;
- `blocked`.

Do not hide refuted candidates in the human report, but retain their compact
record when it helps prevent repeated work.

## Visible Deviation Ledger

Every noticed deviation must end as:

- intentional;
- accepted;
- finding;
- skip.

“Clear” means the relevant lenses were actively applied and no deviation
remains unclassified. It does not mean “the screenshot loaded and nothing
obvious jumped out.”

## Coverage Strategy by Profile

### Targeted

Inspect the named property and enough surrounding context to detect collateral
issues. Capture one decisive whole-region image and focused evidence.

### Broad

- visit every material route;
- inspect a readable route screenshot;
- build atlases across comparable patterns;
- exercise representative and high-risk states;
- deep-verify anomalies rather than measuring every element;
- retain coverage and skip reasons per route.

### Strict Regression

Execute every authorized route/state/viewport pair, compare with the supplied
baseline, and verify all differences. This profile is expensive by design.

## Quality Metrics

Evaluate the audit by:

- route/state coverage;
- recall against known seeded issues when available;
- useful novel findings;
- false-positive rate;
- raw findings versus grouped issues;
- evidence completeness;
- elapsed time and token/tool cost.

Finding count alone is not a quality metric.
