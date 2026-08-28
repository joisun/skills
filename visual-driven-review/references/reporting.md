# Human Report Contract

The report is a review deliverable for people. Worker logs and machine records
are inputs, not report prose.

Generate both `report.md` and `report.html` unless the user requests one
format only.

## Required Opening

Keep the opening short:

- target and audited scope;
- viewport(s);
- inspected, skipped, and blocked route counts;
- raw finding count;
- grouped issue count;
- one-sentence limitation, when applicable.

Do not call a grouped issue count “all findings.” State both numbers.

## Issue Structure

Each grouped issue uses this order:

1. concise title;
2. severity and confidence;
3. **Page** — human page name and route;
4. **How to reach** — short ordered steps from an agreed entry point;
5. **Found** — one concrete observation;
6. **Impact** — one concrete user or product effect;
7. **Basis** — only when needed to explain comparison or rule;
8. visible evidence image(s).

Prefer one decisive screenshot. Add a peer comparison, before/after state, or
second viewport only when it proves a distinct part of the claim.

## Images Must Render

A filename is not visual evidence in a human report.

Markdown:

```markdown
![商机看板图表颜色与系统不一致](groups/crm/screenshots/opportunity-dashboard.png)
```

HTML:

```html
<figure>
  <img src="data:image/png;base64,..." alt="商机看板图表颜色与系统不一致">
  <figcaption>商机看板：图表使用了与系统主色体系无关的高饱和配色。</figcaption>
</figure>
```

Every evidence image referenced by an issue must:

- exist;
- appear directly under that issue in Markdown and HTML;
- have useful alt text/caption;
- be large enough to inspect;
- avoid credentials and unrelated sensitive data.

The provided generator uses relative Markdown image links so Markdown viewers
render the screenshots, and embeds images as data URIs in HTML for portability.

## Language

Use concise, professional language.

Acceptable technical terms include route, viewport, token, hover, focus,
selected, disabled, DOM, WCAG, contrast, clipping, and regression when they add
precision. Explain project-specific or uncommon terms once.

Avoid:

- pane/worker chatter;
- protocol markers such as `VISUAL_FINDING`;
- raw JSON, selectors, bounding-box dumps, or full console logs;
- generic filler such as “there may potentially be some inconsistency”;
- design jargon that does not help the reader understand the defect;
- long methodology sections before the findings.

Write “删除按钮与新增按钮都使用 primary 色，危险操作没有区分” rather
than “action semantic hierarchy exhibits insufficient chromatic
differentiation.”

## Confidence Sections

Order report sections:

1. confirmed;
2. high-confidence;
3. review-candidates;
4. coverage and limitations.

Review-candidates must be visibly labeled as needing product/design judgment.
Do not mix them with verified defects or suppress them merely because no design
file exists.

## Systemic Issues

For one repeated underlying problem:

- create one grouped issue;
- list all known affected pages;
- show representative screenshots inline;
- retain every raw instance in `findings.jsonl`;
- do not repeat identical prose for every route.

## Screenshot Annotations

Prefer the original screenshot when the issue is obvious. Add a bounded outline,
arrow, or label only when it materially shortens explanation. Annotation must
not cover the defect or imply pixel precision that was not measured.

## Empty Result

A zero-issue report is valid only when:

- all in-scope routes have coverage records;
- the visual grammar and cross-route atlases were reviewed;
- state sampling is complete or limitations are explicit;
- the visible deviation ledger has no unresolved entries.

State what was inspected and what could not be reached. Do not pad the report.

## Machine Records Stay Separate

Keep these outside human prose:

- `coverage.jsonl`;
- `candidates.jsonl`;
- `findings.jsonl`;
- `issues.json`;
- raw console/network/snapshot files.

Link to them only in a compact appendix when the user requests technical audit
details.
