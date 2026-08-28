# Takeover

An Agent Skill for resuming work from a previous Claude Code or Codex CLI
session. It locates the session transcript, reconstructs the task history, and
reconciles that narrative with the current Git and filesystem state before
recommending the next step.

## Requirements

- An Agent Skills-compatible client
- Local access to the relevant Claude Code or Codex CLI session files
- `git`, `jq`, and standard shell utilities
- `zstd` only when the matching Codex transcript is compressed

## Install

Install this skill from the monorepo:

```bash
npx skills add joisun/skills --skill takeover -g
```

You can instead place it in a client-specific directory such as
`~/.claude/skills/takeover` or `~/.codex/skills/takeover`.

To inspect the available skills before installing:

```bash
npx skills add joisun/skills --list
```

## Use

Ask the agent to take over or continue a previous session and provide a full or
partial session ID when available. Claude Code can invoke the skill as
`/takeover <session-id>`; Codex can invoke it as `$takeover <session-id>` or
through its skill picker.

The skill reads both the parent session and any linked subagent sessions, then
checks the current branch, commits, working tree, and tests before presenting a
handoff. It does not modify code until the user explicitly chooses to continue.

See [SKILL.md](SKILL.md) for the complete workflow.

## Privacy and Safety

Session transcripts can contain credentials, tokens, customer data, and other
sensitive material. The workflow keeps transcript content local and requires
secrets to be redacted from its handoff summary. Review any transcript before
sharing or publishing it.

## License

Released under the [MIT License](LICENSE.txt).
