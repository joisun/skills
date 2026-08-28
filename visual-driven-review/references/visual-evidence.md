# Visual Evidence Contract

Keep machine evidence complete and human reporting short.

## Artifact Layers

1. **Coverage** — what was reached, captured, inspected, skipped, or blocked.
2. **Candidates** — visible deviations before verification.
3. **Findings** — verified issue instances per route/state/viewport.
4. **Issues** — deduplicated problems for the human report.

Do not write the final report directly from worker prose. Normalize records
first so counts, evidence paths, confidence, and affected routes can be checked.

## Coverage Record

Each line of `coverage.jsonl` is one JSON object:

```json
{
  "id": "crm-opportunity-dashboard@1080x900:loaded",
  "group": "crm",
  "page": "商机看板",
  "url": "/crm/opportunity-dashboard",
  "reach": ["客户", "商机", "商机看板"],
  "viewport": {"width": 1080, "height": 900},
  "state": "loaded",
  "status": "inspected",
  "capture": "groups/crm/screenshots/opportunity-dashboard.png",
  "captureStatus": "captured",
  "inspectionStatus": "inspected",
  "archetype": "dashboard",
  "patterns": ["chart", "filters"],
  "notes": ""
}
```

Allowed `status` values:

- `inspected`;
- `finding`;
- `skipped`;
- `blocked`;
- `out_of_scope`.

A screenshot path does not prove inspection. Record both statuses.

## Candidate Record

```json
{
  "id": "cand-crm-chart-palette",
  "page": "商机看板",
  "url": "/crm/opportunity-dashboard",
  "state": "loaded",
  "viewport": {"width": 1080, "height": 900},
  "category": "data-visualization",
  "observation": "漏斗图使用多组低关联的高饱和颜色，与同模块页面主色体系不同。",
  "basis": "跨页面图表 atlas 与主题 token",
  "evidence": ["groups/crm/screenshots/opportunity-dashboard.png"],
  "disposition": "candidate"
}
```

Allowed final dispositions:

- `intentional`;
- `accepted`;
- `finding`;
- `refuted`;
- `skip`.

## Raw Finding Record

```json
{
  "id": "finding-crm-chart-palette-opportunity",
  "candidateId": "cand-crm-chart-palette",
  "title": "商机看板图表配色脱离系统视觉体系",
  "severity": "medium",
  "confidence": "high-confidence",
  "category": "data-visualization",
  "page": "商机看板",
  "url": "/crm/opportunity-dashboard",
  "reach": ["客户", "商机", "商机看板"],
  "state": "loaded",
  "viewport": {"width": 1080, "height": 900},
  "found": "漏斗图使用多组与系统主色无关联的高饱和颜色。",
  "impact": "同一系统内的仪表盘视觉语言割裂，图例层级也更难快速识别。",
  "basis": "主题 token 与销售看板、列表页的跨页面比较",
  "evidence": [
    {
      "src": "groups/crm/screenshots/opportunity-dashboard.png",
      "alt": "商机看板漏斗图配色",
      "caption": "商机看板：漏斗图使用红、蓝灰、橙、绿的混合配色。"
    }
  ]
}
```

## Grouped Issue Record

`issues.json` contains run metadata and a top-level `issues` array. Each
issue includes:

- stable `id`;
- `title`;
- `severity`: `critical`, `high`, `medium`, or `low`;
- `confidence`: `confirmed`, `high-confidence`, or
  `review-candidate`;
- `category`;
- `page`, `url`, and `reach`;
- concise `found`, `impact`, and optional `basis`;
- `affectedPages` when systemic;
- one or more evidence objects with `src`, `alt`, and `caption`.

The report generator accepts this shape:

```json
{
  "target": "https://example.test/",
  "scope": "非微前端路由",
  "viewports": ["1080x900"],
  "coverage": {"inspected": 12, "skipped": 1, "blocked": 0},
  "rawFindingCount": 18,
  "limitations": ["1 个路由因权限不足未检查"],
  "issues": []
}
```

`rawFindingCount` must equal the verified instance count, not the grouped
issue count.

## Evidence Requirements

Every published issue needs:

- a screenshot where the issue is visible;
- page, route, reach steps, state, and viewport;
- a concrete observation and impact;
- comparison or deterministic evidence when the claim depends on it;
- confidence matching the evidence strength.

Evidence images must live inside the run directory and be referenced by
relative paths. The validator rejects missing files, paths outside the run
directory, path-only report prose, and obvious secret material.

## Severity

Use demonstrated impact:

- **critical** — blocks a core task broadly, exposes sensitive data, or enables
  serious unintended action;
- **high** — blocks or materially misleads an important task with no reasonable
  workaround;
- **medium** — causes confusion, weak affordance, inconsistent semantics, or a
  significant visual defect with a workaround;
- **low** — localized polish, minor density/alignment, or low-impact
  inconsistency.

A strong aesthetic/product concern may still be `review-candidate`; confidence
and severity answer different questions.

## Deduplication

Group findings only when they share the same cause and remediation outcome.
Preserve:

- all affected pages;
- state/viewport differences;
- raw instance count;
- representative evidence;
- exceptions.

Do not merge unrelated symptoms merely because they share a category such as
“inconsistent styling.”

## Clear and Incomplete Outcomes

A route can be clear only when:

- capture and inspection are complete;
- required visual lenses were applied;
- relevant state samples were reached;
- visible deviations are classified.

Use `skipped` or `blocked` for incomplete scope. A healthy console or
`scrollWidth` does not prove visual correctness.
