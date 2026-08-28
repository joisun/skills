# Visual Observation Protocol

Use this protocol after the cheap capture pass. It combines whole-product
judgment with focused verification.

## Observe Before Explaining

For each page or atlas:

1. inspect the image at a readable size;
2. describe what draws attention and how the task is organized;
3. name visible deviations or awkward relationships;
4. compare with relevant peers;
5. only then inspect DOM, styles, or measurements.

Starting with DOM output biases the review toward measurable geometry and away
from palette, hierarchy, affordance, semantic action, and visual tone.

## Whole-Page Sweep

Inspect:

- page shell, title, breadcrumbs, and content width;
- first task and dominant call to action;
- horizontal and vertical balance;
- density and scan order;
- repeated controls and visual rhythm;
- large empty areas, crowding, or arbitrary widths;
- below-the-fold regions when present;
- loading, empty, error, disabled, and permission feedback.

Ask whether the page looks finished and intentionally composed, not merely
whether it avoids overlap.

## Component Sweep

Inspect every visible component family relevant to the page:

- filter/query controls;
- forms and text areas;
- tables and row actions;
- links, icon buttons, favorite/selected states;
- tabs, alerts, badges, drawers, and dialogs;
- charts, legends, labels, tooltips, and zero-data states;
- primary, secondary, destructive, add, remove, reset, and export actions.

Look for color/token drift, weak affordance, semantic mismatch, unbalanced
proportion, inconsistent label treatment, unexpected icon use, or a component
that appears to come from another design system.

## Cross-Page Sweep

For comparable tasks, check:

- same role, different color or emphasis;
- same filter pattern, different label/layout treatment;
- same form archetype, arbitrary field widths;
- same action pair, indistinguishable semantics;
- same table concept, inconsistent link/icon states;
- same dashboard family, incompatible chart palettes;
- same tab/alert family, inconsistent icons or padding.

An unexplained outlier is a candidate. It is not automatically a defect, but it
must be classified.

## Interaction-State Sweep

Do not infer a state from its default appearance. Trigger relevant variants:

- hover;
- focus;
- active/pressed;
- selected;
- favorited/bookmarked;
- disabled;
- loading;
- validation success/error;
- expanded/collapsed;
- destructive confirmation.

Capture before/after images when the visual transition is the issue.

## Focused Geometry Checks

Run measurement only where it can confirm or refute an observation, or where a
high-risk repeated component is being sampled:

| Suspicion | Focused check |
| --- | --- |
| overlap/occlusion | bounding-box intersection and stacking/clipping ancestor |
| arbitrary width | compare control/container rects and peer form pattern |
| strange spacing | adjacent control gaps and empty structural elements |
| truncated content | content box, scroll/clipping style, natural text width |
| off-token color | computed color/background/fill and theme variable |
| weak state | computed state styles plus before/after screenshot |
| misplaced action | control-group structure, alignment, task order, peer layout |

Do not measure every cell or control on every route in a broad review. Sample
repeated healthy patterns and deep-check anomalies.

## Judgment Without an Explicit Design

An explicit reference is required for exact claims such as “this must be 24px.”
It is not required to surface a credible concern such as:

- an action's semantic color is indistinguishable from its opposite;
- a selected state loses affordance;
- one chart palette clashes with all product tokens and peer dashboards;
- a text area consumes nearly the full page without a task reason;
- a query action is visually detached from its controls.

State the basis and classify confidence:

- confirmed;
- high-confidence;
- review-candidate.

Do not present personal preference as fact. Do not use uncertainty as a reason
to omit a visible, useful review candidate.

## Finding Threshold

Publish a verified issue when:

- the affected page, state, and viewport are known;
- the observation can be stated concretely;
- the screenshot visibly supports it;
- focused comparison or deterministic evidence supports the claim when needed;
- the impact is meaningful enough for a human reviewer.

Use `review-candidate` when intent is the only unresolved part. Use `skip`
when evidence, access, or state reachability is insufficient.

## Common Failure Modes

| Failure | Correction |
| --- | --- |
| “Page loaded, no issue” | Apply whole-page, component, cross-page, and state sweeps. |
| Only geometry findings | Run the critic before measurements and inspect tokens, hierarchy, semantics, charts, and affordance. |
| Checklist tunnel vision | Record unplanned visible deviations and compare related pages. |
| Majority equals truth | Treat frequency as evidence, then evaluate task fit and general principles. |
| Initial-state-only review | Exercise high-risk state variants. |
| Tiny contact sheet | Split it until labels and controls are readable. |
| Path-only evidence | Render the image under the issue in both reports. |
| “Clear” with unexplained anomaly | Complete the visible deviation ledger first. |
