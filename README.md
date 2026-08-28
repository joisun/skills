# Joi Sun's Agent Skills

A public monorepo for reusable agent skills maintained by Joi Sun.

## Skills

| Skill | Purpose |
| --- | --- |
| [`visual-driven-review`](./visual-driven-review/) | Evidence-driven visual and interaction review workflow. |
| [`takeover`](./takeover/) | Resume and take over in-progress agent work safely. |
| [`task-doc-workflow`](./task-doc-workflow/) | Run resumable work through structured task documents. |
| [`find-svg-icon`](./find-svg-icon/) | Find and integrate external SVG icons across frontend frameworks. |

## Install

List the available skills:

```bash
npx skills add joisun/skills --list
```

Install one skill globally for Codex:

```bash
npx skills add joisun/skills --skill visual-driven-review --agent codex -g
```

Replace the skill name as needed. Use the space-separated
`--skill <name>` form.

## License

MIT. Each skill retains its own license and attribution file.
