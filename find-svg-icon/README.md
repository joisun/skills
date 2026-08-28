# find-svg-icon

An agent skill for finding, verifying, and integrating external SVG icons as
framework-native components.

It keeps page-level icon work narrow and reviewable: verify icon provenance,
preserve business behavior, keep components locally scoped, and avoid turning
a single-page change into a global icon-platform migration.

## What it enforces

- no inline SVG geometry in business templates;
- no mixed icon technologies inside one control cluster;
- page-local components unless two independent modules genuinely reuse an icon;
- verified Lucide or Iconify provenance instead of guessed names or IDs;
- progressive, framework-specific contracts for Vue, React, Svelte, Solid, Astro,
  and React Native;
- exact preservation of supplied framework templates without adding props,
  defaults, wrappers, spreads, or accessibility attributes;
- preservation of conditions, tooltips, handlers, arguments, and control state;
- focused static, build, and visual verification.

## Install

Install this skill from the monorepo:

```bash
npx skills add joisun/skills --skill find-svg-icon -g
```

To inspect the available skills before installing:

```bash
npx skills add joisun/skills --list
```

The skill entry point is [`SKILL.md`](SKILL.md). Supporting guidance is loaded
from [`references/`](references/) only when needed.

## Scope

This skill targets page-level external SVG integration across supported web and
native frameworks. It intentionally does not define a global icon architecture,
an iconfont migration platform, or a runtime icon registry.

## License

[MIT](LICENSE)
