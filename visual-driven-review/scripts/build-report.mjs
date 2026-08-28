#!/usr/bin/env node

import {
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import {
  extname,
  relative,
  resolve,
  sep,
} from "node:path";

const runArg = process.argv[2];

if (!runArg) {
  console.error("Usage: node build-report.mjs <run-root>");
  process.exit(2);
}

const runRoot = resolve(runArg);
const issuesPath = resolve(runRoot, "issues.json");

if (!existsSync(issuesPath)) {
  console.error(`Missing ${issuesPath}`);
  process.exit(1);
}

const input = JSON.parse(readFileSync(issuesPath, "utf8"));
const issues = Array.isArray(input.issues) ? input.issues : [];

function text(value, fallback = "未提供") {
  const result = String(value ?? "").trim();
  return result || fallback;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeMarkdown(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|");
}

function markdownPath(value) {
  return encodeURI(String(value))
    .replaceAll("(", "%28")
    .replaceAll(")", "%29");
}

function resolveEvidence(src) {
  if (!src || typeof src !== "string") {
    throw new Error("Evidence src must be a non-empty relative path");
  }

  const absolute = resolve(runRoot, src);
  const prefix = runRoot.endsWith(sep) ? runRoot : `${runRoot}${sep}`;

  if (absolute !== runRoot && !absolute.startsWith(prefix)) {
    throw new Error(`Evidence path escapes run root: ${src}`);
  }
  if (!existsSync(absolute)) {
    throw new Error(`Missing evidence image: ${src}`);
  }

  return {
    absolute,
    relative: relative(runRoot, absolute).split(sep).join("/"),
  };
}

function mimeFor(path) {
  const extension = extname(path).toLowerCase();
  const types = {
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  const mime = types[extension];
  if (!mime) {
    throw new Error(`Unsupported evidence image type: ${extension || "(none)"}`);
  }
  return mime;
}

function dataUri(path) {
  const mime = mimeFor(path);
  const encoded = readFileSync(path).toString("base64");
  return `data:${mime};base64,${encoded}`;
}

const severityLabels = {
  critical: "严重",
  high: "高",
  medium: "中",
  low: "低",
};

const confidenceLabels = {
  confirmed: "已确认",
  "high-confidence": "高置信度",
  "review-candidate": "待设计/产品确认",
};

const sectionLabels = {
  confirmed: "已确认问题",
  "high-confidence": "高置信度问题",
  "review-candidate": "待确认的视觉问题",
};

const normalizedIssues = issues.map((issue, index) => {
  const evidence = Array.isArray(issue.evidence) ? issue.evidence : [];
  return {
    ...issue,
    _index: index + 1,
    confidence: issue.confidence || "high-confidence",
    severity: issue.severity || "medium",
    reach: Array.isArray(issue.reach) ? issue.reach : [],
    affectedPages: Array.isArray(issue.affectedPages)
      ? issue.affectedPages
      : [],
    evidence: evidence.map((item) => {
      const resolved = resolveEvidence(item?.src);
      return {
        src: resolved.relative,
        absolute: resolved.absolute,
        alt: text(item?.alt, text(issue.title, "问题截图")),
        caption: text(item?.caption, ""),
      };
    }),
  };
});

function summaryLine() {
  const coverage = input.coverage || {};
  return [
    `检查 ${Number(coverage.inspected || 0)} 个路由`,
    `跳过 ${Number(coverage.skipped || 0)} 个`,
    `阻塞 ${Number(coverage.blocked || 0)} 个`,
    `记录 ${Number(input.rawFindingCount || 0)} 条原始发现`,
    `归并为 ${normalizedIssues.length} 个问题`,
  ].join("；") + "。";
}

function markdownIssue(issue, displayIndex) {
  const lines = [];
  const severity = severityLabels[issue.severity] || text(issue.severity);
  const confidence =
    confidenceLabels[issue.confidence] || text(issue.confidence);

  lines.push(`### ${displayIndex}. ${escapeMarkdown(text(issue.title))}`);
  lines.push("");
  lines.push(`- 严重程度：${escapeMarkdown(severity)}`);
  lines.push(`- 置信度：${escapeMarkdown(confidence)}`);
  lines.push(`- 页面：${escapeMarkdown(text(issue.page))}`);
  lines.push(`- 路由：\`${escapeMarkdown(text(issue.url))}\``);
  lines.push("");
  lines.push("如何触达：");
  lines.push("");
  if (issue.reach.length) {
    issue.reach.forEach((step, index) => {
      lines.push(`${index + 1}. ${escapeMarkdown(text(step))}`);
    });
  } else {
    lines.push("1. 未提供触达步骤");
  }
  lines.push("");
  lines.push(`发现：${escapeMarkdown(text(issue.found))}`);
  lines.push("");
  lines.push(`影响：${escapeMarkdown(text(issue.impact))}`);
  if (issue.basis) {
    lines.push("");
    lines.push(`判断依据：${escapeMarkdown(text(issue.basis))}`);
  }
  if (issue.affectedPages.length) {
    lines.push("");
    lines.push(
      `受影响页面：${issue.affectedPages
        .map((page) => escapeMarkdown(text(page)))
        .join("、")}`,
    );
  }
  issue.evidence.forEach((item) => {
    lines.push("");
    lines.push(`![${escapeMarkdown(item.alt)}](${markdownPath(item.src)})`);
    if (item.caption) {
      lines.push("");
      lines.push(`_${escapeMarkdown(item.caption)}_`);
    }
  });
  return lines.join("\n");
}

function htmlIssue(issue, displayIndex) {
  const severity = severityLabels[issue.severity] || text(issue.severity);
  const confidence =
    confidenceLabels[issue.confidence] || text(issue.confidence);
  const reach = issue.reach.length
    ? `<ol>${issue.reach
      .map((step) => `<li>${escapeHtml(text(step))}</li>`)
      .join("")}</ol>`
    : "<ol><li>未提供触达步骤</li></ol>";
  const basis = issue.basis
    ? `<p><strong>判断依据：</strong>${escapeHtml(text(issue.basis))}</p>`
    : "";
  const affected = issue.affectedPages.length
    ? `<p><strong>受影响页面：</strong>${issue.affectedPages
      .map((page) => escapeHtml(text(page)))
      .join("、")}</p>`
    : "";
  const figures = issue.evidence
    .map((item) => {
      const caption = item.caption
        ? `<figcaption>${escapeHtml(item.caption)}</figcaption>`
        : "";
      return `<figure><img src="${dataUri(item.absolute)}" alt="${escapeHtml(
        item.alt,
      )}">${caption}</figure>`;
    })
    .join("");

  return `
    <article class="issue">
      <h3>${displayIndex}. ${escapeHtml(text(issue.title))}</h3>
      <div class="badges">
        <span>${escapeHtml(severityLabels[issue.severity] || severity)}</span>
        <span>${escapeHtml(confidence)}</span>
      </div>
      <dl>
        <dt>页面</dt><dd>${escapeHtml(text(issue.page))}</dd>
        <dt>路由</dt><dd><code>${escapeHtml(text(issue.url))}</code></dd>
      </dl>
      <h4>如何触达</h4>
      ${reach}
      <p><strong>发现：</strong>${escapeHtml(text(issue.found))}</p>
      <p><strong>影响：</strong>${escapeHtml(text(issue.impact))}</p>
      ${basis}
      ${affected}
      ${figures}
    </article>`;
}

const limitations = Array.isArray(input.limitations)
  ? input.limitations.filter(Boolean)
  : [];
const viewports = Array.isArray(input.viewports)
  ? input.viewports.join("、")
  : text(input.viewports);

const markdown = [
  "# 视觉审计报告",
  "",
  `- 目标：${escapeMarkdown(text(input.target))}`,
  `- 范围：${escapeMarkdown(text(input.scope))}`,
  `- 视图：${escapeMarkdown(viewports)}`,
  "",
  summaryLine(),
  ...(limitations.length
    ? ["", `限制：${limitations.map((item) => escapeMarkdown(text(item))).join("；")}。`]
    : []),
];

let displayIndex = 1;
for (const confidence of [
  "confirmed",
  "high-confidence",
  "review-candidate",
]) {
  const group = normalizedIssues.filter(
    (issue) => issue.confidence === confidence,
  );
  if (!group.length) continue;
  markdown.push("", `## ${sectionLabels[confidence]}`, "");
  for (const issue of group) {
    markdown.push(markdownIssue(issue, displayIndex), "");
    displayIndex += 1;
  }
}

if (!normalizedIssues.length) {
  markdown.push("", "## 结果", "", "未发现达到报告阈值的问题。");
}

markdown.push(
  "",
  "## 覆盖与限制",
  "",
  summaryLine(),
  ...(limitations.length
    ? limitations.map((item) => `- ${escapeMarkdown(text(item))}`)
    : ["- 无额外限制。"]),
  "",
);

const htmlSections = [];
displayIndex = 1;
for (const confidence of [
  "confirmed",
  "high-confidence",
  "review-candidate",
]) {
  const group = normalizedIssues.filter(
    (issue) => issue.confidence === confidence,
  );
  if (!group.length) continue;
  htmlSections.push(`<section><h2>${sectionLabels[confidence]}</h2>`);
  for (const issue of group) {
    htmlSections.push(htmlIssue(issue, displayIndex));
    displayIndex += 1;
  }
  htmlSections.push("</section>");
}

if (!normalizedIssues.length) {
  htmlSections.push("<section><h2>结果</h2><p>未发现达到报告阈值的问题。</p></section>");
}

const limitationHtml = limitations.length
  ? `<ul>${limitations
    .map((item) => `<li>${escapeHtml(text(item))}</li>`)
    .join("")}</ul>`
  : "<p>无额外限制。</p>";

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>视觉审计报告</title>
  <style>
    :root { color-scheme: light; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; color: #1f2329; background: #f5f6f8; line-height: 1.65; }
    main { width: min(1080px, calc(100% - 32px)); margin: 24px auto 64px; }
    header, section { margin-bottom: 20px; padding: 24px; background: #fff; border: 1px solid #e5e6eb; border-radius: 10px; }
    h1, h2, h3, h4 { line-height: 1.35; }
    h1 { margin: 0 0 12px; font-size: 28px; }
    h2 { margin: 0 0 18px; font-size: 22px; }
    h3 { margin: 0 0 10px; font-size: 18px; }
    h4 { margin-bottom: 6px; }
    .summary { margin: 12px 0 0; }
    .issue + .issue { margin-top: 28px; padding-top: 28px; border-top: 1px solid #e5e6eb; }
    .badges { display: flex; gap: 8px; margin-bottom: 14px; }
    .badges span { padding: 2px 9px; border-radius: 999px; background: #eef3ff; color: #245bdb; font-size: 13px; }
    dl { display: grid; grid-template-columns: max-content 1fr; gap: 4px 12px; margin: 0; }
    dt { font-weight: 600; }
    dd { margin: 0; }
    code { word-break: break-all; }
    figure { margin: 18px 0 0; }
    img { display: block; width: 100%; height: auto; border: 1px solid #dcdfe6; border-radius: 6px; }
    figcaption { margin-top: 7px; color: #646a73; font-size: 14px; }
    @media (max-width: 640px) {
      main { width: min(100% - 20px, 1080px); margin-top: 10px; }
      header, section { padding: 16px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>视觉审计报告</h1>
      <p><strong>目标：</strong>${escapeHtml(text(input.target))}</p>
      <p><strong>范围：</strong>${escapeHtml(text(input.scope))}</p>
      <p><strong>视图：</strong>${escapeHtml(viewports)}</p>
      <p class="summary">${escapeHtml(summaryLine())}</p>
    </header>
    ${htmlSections.join("\n")}
    <section>
      <h2>覆盖与限制</h2>
      <p>${escapeHtml(summaryLine())}</p>
      ${limitationHtml}
    </section>
  </main>
</body>
</html>
`;

writeFileSync(resolve(runRoot, "report.md"), markdown.join("\n"), "utf8");
writeFileSync(resolve(runRoot, "report.html"), html, "utf8");

console.log(
  `Generated report.md and report.html with ${normalizedIssues.length} grouped issue(s).`,
);
