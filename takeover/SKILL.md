---
name: takeover
description: Resume and take over an in-progress coding session left by an AI agent — this same tool in a previous session, or a different agent (Claude Code or Codex CLI) entirely. Loads the session's transcript from disk by session ID (full or partial), reconstructs what was already done, cross-checks it against the current codebase and git state, and produces a handoff briefing plus a recommended next step. Trigger this whenever the user writes "/takeover <id>", "takeover session <id>", "pick up where <id> left off", "resume the codex/claude session", "continue this session", asks you to find and load "that other session" without giving an exact ID, or otherwise wants to inherit context from a prior agent session instead of starting cold.
argument-hint: '[session-id-or-fragment]'
---

# Takeover

Resume someone else's (or your own past) coding session: find the transcript on disk, read it, reconcile it with what the repo actually looks like right now, and brief the user before touching anything.

**Install**: put the `takeover/` folder in `~/.claude/skills/` (personal) or `.claude/skills/` (project) for Claude Code, and/or `~/.codex/skills/` or `.codex/skills/` for Codex CLI — one identical SKILL.md, no other files needed. Claude Code invokes it natively as `/takeover <args>`; Codex CLI invokes it explicitly as `$takeover <args>` or via the `/skills` picker, or implicitly when a prompt matches the description above.

Never assume the transcript is still accurate — code may have been hand-edited, committed, reverted, or worked on by yet another agent since that session ended. The transcript tells you _intent and narrative_; git and the filesystem tell you _ground truth_. Always resolve conflicts in favor of ground truth, and call out any place they disagree.

## Step 0 — Parse the invocation

Invoked as `/takeover <args>` (native in current Claude Code and via `$takeover <args>` in Codex CLI) or matched implicitly from phrases like "pick up where 3f9a2c1 left off". The trailing text — `$ARGUMENTS` where that substitution is available, otherwise whatever followed the trigger phrase — is the raw hint. Parse it into:

- **session hint**: a full session ID, a short/partial ID fragment, a filename, or empty
- **agent hint** (optional): "codex", "claude", "claude code" mentioned in the args or phrasing — if absent, search both

If the hint is empty, treat this as "find the most relevant recent session for this project" (Step 1's no-hint path).

## Step 1 — Locate the session file

Two possible sources on disk. Search both unless the user named one explicitly.

**Claude Code** — one JSONL per session, organized by project:

```bash
find ~/.claude/projects -iname "*<hint>*.jsonl" 2>/dev/null
```

If no hint was given, find the most recently modified transcript for the _current_ project directory (the project folder name is the cwd with `/` replaced by `-`):

```bash
enc=$(pwd | sed 's/\//-/g')
ls -t ~/.claude/projects/*"$enc"*/*.jsonl 2>/dev/null | head -5
```

**Codex CLI** — date-partitioned rollout files, optionally compressed:

```bash
find ~/.codex/sessions -iname "*<hint>*.jsonl*" 2>/dev/null
```

If no hint was given, find the most recent rollout whose `session_meta.cwd` matches the current directory:

```bash
find ~/.codex/sessions -name "rollout-*.jsonl" -newer /tmp -printf '%T@ %p\n' 2>/dev/null \
  | sort -rn | head -20 | awk '{print $2}' \
  | xargs -I{} sh -c 'head -1 "{}" | jq -e --arg cwd "$(pwd)" "select(.payload.cwd==\$cwd or .cwd==\$cwd)" >/dev/null 2>&1 && echo {}' | head -1
```

Some older Codex sessions are compressed as `.jsonl.zst` — if the only match is `.zst`, decompress a copy first: `zstd -d rollout-....jsonl.zst -o /tmp/rollout.jsonl` (skip and note it if `zstd` isn't installed).

**If multiple candidates match** (common with a short hint, or when both agents have sessions), list them — path, mtime, first user message if you can peek it cheaply — and ask the user which one, rather than guessing. Do not silently pick one when it's ambiguous.

**If nothing matches**, say so plainly and ask the user for the ID or which directory to search, rather than fabricating a summary.

## Step 2 — Learn the schema, then read the transcript

Both formats evolve across versions, so before parsing, sample the file to confirm current field names:

```bash
head -3 "<file>" | jq .
```

**Claude Code** lines are typed events (`user`, `assistant`, `system`, plus summary/compaction markers). Useful fields: `type`, `timestamp`, `cwd`, `gitBranch`, `sessionId`, `uuid`/`parentUuid`, and `message.content` (text / `thinking` / `tool_use` / `tool_result` blocks).

```bash
# The narrative: what the user actually asked for, in order
jq -r 'select(.type=="user") | .message.content | if type=="string" then . else (.[] | select(.type=="text") | .text) end' "<file>"

# What got touched: file-editing tool calls
jq -c 'select(.type=="assistant") | .message.content[]? | select(.type=="tool_use") | select(.name|test("Edit|Write|NotebookEdit|Bash")) | {name, input}' "<file>"

# The tail end — often has the agent's own summary of state
tail -20 "<file>" | jq .
```

**Codex CLI**: first line is a `session_meta` header (cwd, originator, git info, whether it's a `cli` session or a `subagent`); subsequent lines are turns with prompts, tool calls (`shell`, `apply_patch`, etc.) and outputs. Field names have shifted across Codex versions — trust what `head -3` shows you over this doc. Same idea: pull the user prompts in order, then pull the patch/shell tool calls to see what files were touched and what commands were run.

From either format, extract:

1. The original task/prompt(s), in the user's own words
2. The sequence of files created/edited/deleted
3. Any commands run (tests, builds, migrations) and whether they appeared to succeed or fail
4. The last few turns — often contain the agent's own "here's where I left off" or "next I'd do X" statement, which is gold if present
5. Timestamp of the last line (how stale is this?)

## Step 3 — Reconcile against ground truth

The transcript is a claim; the repo is the fact. Check, in the session's original working directory if it still exists:

```bash
git status
git branch --show-current
git log --oneline -20
git diff                 # uncommitted working-tree changes
git diff --stat HEAD~10..HEAD  # recent committed churn, adjust range as needed
git stash list
```

Cross-reference:

- Do the files the transcript says were edited actually show recent changes in `git log`/`git diff`? If a file the transcript touched shows no trace at all, flag it — it may have been reverted, never actually written (e.g. tool call failed), or committed and since reverted by someone else.
- Is there uncommitted work sitting in the working tree that matches what the transcript was doing? That's likely the actual "current state" to hand off.
- Has the branch moved since the session's last recorded `gitBranch`/timestamp (i.e., did someone rebase, merge, or push over it)?
- If the transcript mentions tests or a build step, consider re-running the relevant check now rather than trusting a stale pass/fail from the transcript — note this to the user rather than assuming.

## Step 4 — Brief the user before doing anything else

Present a concise handoff, not a full replay:

- **Source**: which agent, session ID, when it ran, how stale it is
- **Original task**: one or two sentences, in plain language
- **What was actually done**: bullet list grounded in git reality, noting explicitly anything the transcript claims but the repo doesn't confirm
- **Current repo state**: branch, uncommitted changes summary, anything blocking (failing test, merge conflict, half-applied patch)
- **Likely next step**: pulled from the agent's own trailing notes if present, otherwise your best inference from the gap between "task" and "current state"

Then stop and ask how the user wants to proceed — continue the work in this conversation, resume the original tool's session directly (`claude --resume <id>` or `codex resume <id>` / `codex -c experimental_resume=<path>`), or something else. Don't start editing code as part of the takeover itself unless the user confirms.

## Notes

- Never print secrets that may appear in transcripts (API keys, tokens pasted into prompts or command output) — redact them in your summary.
- If a session belongs to a different project directory than the current one, say so before proceeding — the user may be in the wrong repo.
- **Always pull in subagent/sub-session transcripts, not just the top-level session.** When the main transcript shows a `Task`/subagent spawn (Claude Code) or a rollout with `source: subagent` and a matching parent-session field (Codex), locate that child JSONL (same project dir for Claude Code; `session_meta.parent`/originator link for Codex) and read it too — its tool calls are real work that the top-level transcript only references by a one-line summary. Fold what you learn from each child session into Step 4's file-touched list and next-step reasoning, and note in the briefing which findings came from a subagent versus the main thread so the user can tell the difference if it matters.
