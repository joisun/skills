#!/usr/bin/env node

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import {
  extname,
  relative,
  resolve,
  sep,
} from "node:path";

const runArg = process.argv[2];

if (!runArg) {
  console.error("Usage: node validate-run.mjs <run-root>");
  process.exit(2);
}

const runRoot = resolve(runArg);
const errors = [];
const warnings = [];

function requiredJson(name) {
  const path = resolve(runRoot, name);
  if (!existsSync(path)) {
    errors.push(`Missing ${name}`);
    return {};
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`Invalid JSON in ${name}: ${error.message}`);
    return {};
  }
}

function filesNamed(root, target) {
  if (!existsSync(root)) return [];
  const results = [];
  for (const entry of readdirSync(root)) {
    const path = resolve(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      results.push(...filesNamed(path, target));
    } else if (entry === target) {
      results.push(path);
    }
  }
  return results;
}

function parseJsonl(path) {
  const result = [];
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    try {
      result.push(JSON.parse(line));
    } catch (error) {
      errors.push(
        `Invalid JSONL in ${relative(runRoot, path)}:${index + 1}: ${error.message}`,
      );
    }
  });
  return result;
}

function insideRun(path) {
  const absolute = resolve(runRoot, path);
  const prefix = runRoot.endsWith(sep) ? runRoot : `${runRoot}${sep}`;
  return absolute !== runRoot && absolute.startsWith(prefix);
}

function markdownPath(value) {
  return encodeURI(String(value))
    .replaceAll("(", "%28")
    .replaceAll(")", "%29");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const run = requiredJson("run.json");
const issuesDocument = requiredJson("issues.json");
const issues = Array.isArray(issuesDocument.issues)
  ? issuesDocument.issues
  : [];

if (!Array.isArray(issuesDocument.issues)) {
  errors.push("issues.json must contain an issues array");
}

const coverageFiles = filesNamed(runRoot, "coverage.jsonl");
if (!coverageFiles.length) {
  errors.push("No coverage.jsonl found");
}

const allowedStatuses = new Set([
  "inspected",
  "finding",
  "skipped",
  "blocked",
  "out_of_scope",
]);
const coverage = coverageFiles.flatMap(parseJsonl);

coverage.forEach((record, index) => {
  const prefix = `coverage record ${index + 1}`;
  for (const field of ["id", "page", "url", "state", "status"]) {
    if (!String(record[field] ?? "").trim()) {
      errors.push(`${prefix} missing ${field}`);
    }
  }
  if (!allowedStatuses.has(record.status)) {
    errors.push(`${prefix} has invalid status ${record.status}`);
  }
  if (
    ["inspected", "finding"].includes(record.status) &&
    record.inspectionStatus !== "inspected"
  ) {
    errors.push(`${prefix} is complete but inspectionStatus is not inspected`);
  }
  if (record.capture) {
    if (!insideRun(record.capture)) {
      errors.push(`${prefix} capture escapes run root`);
    } else if (!existsSync(resolve(runRoot, record.capture))) {
      errors.push(`${prefix} capture does not exist: ${record.capture}`);
    }
  }
});

const requiredIssueFields = [
  "id",
  "title",
  "severity",
  "confidence",
  "category",
  "page",
  "url",
  "found",
  "impact",
];
const allowedSeverity = new Set(["critical", "high", "medium", "low"]);
const allowedConfidence = new Set([
  "confirmed",
  "high-confidence",
  "review-candidate",
]);
const allowedImages = new Set([
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

issues.forEach((issue, index) => {
  const prefix = `issue ${index + 1}`;
  requiredIssueFields.forEach((field) => {
    if (!String(issue[field] ?? "").trim()) {
      errors.push(`${prefix} missing ${field}`);
    }
  });
  if (!allowedSeverity.has(issue.severity)) {
    errors.push(`${prefix} has invalid severity ${issue.severity}`);
  }
  if (!allowedConfidence.has(issue.confidence)) {
    errors.push(`${prefix} has invalid confidence ${issue.confidence}`);
  }
  if (!Array.isArray(issue.reach) || !issue.reach.length) {
    errors.push(`${prefix} must include reach steps`);
  }
  if (!Array.isArray(issue.evidence) || !issue.evidence.length) {
    errors.push(`${prefix} must include evidence images`);
    return;
  }
  issue.evidence.forEach((item, evidenceIndex) => {
    const evidencePrefix = `${prefix} evidence ${evidenceIndex + 1}`;
    if (!item?.src || !item?.alt) {
      errors.push(`${evidencePrefix} requires src and alt`);
      return;
    }
    if (!insideRun(item.src)) {
      errors.push(`${evidencePrefix} escapes run root`);
      return;
    }
    const absolute = resolve(runRoot, item.src);
    if (!existsSync(absolute)) {
      errors.push(`${evidencePrefix} missing file ${item.src}`);
    }
    if (!allowedImages.has(extname(absolute).toLowerCase())) {
      errors.push(`${evidencePrefix} is not a supported image`);
    }
  });
});

if (
  Number(issuesDocument.rawFindingCount || 0) < issues.length
) {
  errors.push("rawFindingCount cannot be smaller than grouped issue count");
}

const findingsPath = resolve(runRoot, "findings.jsonl");
if (existsSync(findingsPath)) {
  const rawFindings = parseJsonl(findingsPath);
  if (rawFindings.length !== Number(issuesDocument.rawFindingCount || 0)) {
    errors.push(
      `findings.jsonl has ${rawFindings.length} records but rawFindingCount is ${Number(
        issuesDocument.rawFindingCount || 0,
      )}`,
    );
  }
} else {
  warnings.push("findings.jsonl is missing; raw count cannot be cross-checked");
}

const reportMdPath = resolve(runRoot, "report.md");
const reportHtmlPath = resolve(runRoot, "report.html");
if (!existsSync(reportMdPath)) errors.push("Missing report.md");
if (!existsSync(reportHtmlPath)) errors.push("Missing report.html");

const reportMd = existsSync(reportMdPath)
  ? readFileSync(reportMdPath, "utf8")
  : "";
const reportHtml = existsSync(reportHtmlPath)
  ? readFileSync(reportHtmlPath, "utf8")
  : "";

issues.forEach((issue, index) => {
  issue.evidence?.forEach((item, evidenceIndex) => {
    const encoded = markdownPath(item.src);
    if (!reportMd.includes(`](${encoded})`)) {
      errors.push(
        `issue ${index + 1} evidence ${evidenceIndex + 1} is not rendered in report.md`,
      );
    }
  });
  if (
    !issue.evidence?.every((item) =>
      reportHtml.includes(`alt="${escapeHtml(item.alt)}"`),
    )
  ) {
    errors.push(`issue ${index + 1} evidence is not rendered in report.html`);
  }
});

if (issues.length && !reportHtml.includes("data:image/")) {
  errors.push("report.html does not embed evidence images");
}

const secretPatterns = [
  /EGG_SESS\s*=/i,
  /Bearer\s+[A-Za-z0-9._~+/=-]{12,}/i,
  /cookie\s*[:=]\s*[^\s,;]{8,}/i,
  /AKIA[0-9A-Z]{16}/,
];
const secretScan = [
  JSON.stringify(run),
  JSON.stringify(issuesDocument),
  reportMd,
  reportHtml,
].join("\n");
secretPatterns.forEach((pattern) => {
  if (pattern.test(secretScan)) {
    errors.push(`Possible secret detected by ${pattern}`);
  }
});

if (coverage.length === 0) {
  errors.push("Coverage is empty");
}

warnings.forEach((warning) => console.warn(`WARN: ${warning}`));
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log(
  `Validated ${coverage.length} coverage record(s), ${Number(
    issuesDocument.rawFindingCount || 0,
  )} raw finding(s), and ${issues.length} grouped issue(s).`,
);
