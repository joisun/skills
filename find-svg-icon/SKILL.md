---
name: find-svg-icon
description: Use when adding or replacing external SVG icons in Vue, React, Svelte, Solid, Astro, or React Native, especially when a supplied or project converter template must remain exact and the component API must not be expanded.
---

# Find SVG Icon

Find an icon by business meaning, verify its source, and integrate it through the
target project's exact component template. Keep a page-level icon change local;
do not turn it into an architecture migration or redesign the template API.

## Inspect Before Editing

Determine from the repository rather than asking when discoverable:

- framework, framework major version, and JavaScript or TypeScript;
- the icon's business action, visibility condition, tooltip, handler, and args;
- existing local icon/component naming and placement conventions;
- an exact user-supplied, project-local, or converter template for the target
  framework, including its imports, props signature, spreads, and root attributes;
- whether the artwork is stroke-based, filled, or intentionally multicolor;
- whether the icon is local or already reused by independent modules.

Do not infer meaning from an iconfont Unicode value or class name alone.

## Shared Invariants

- Keep SVG geometry in a component file or the project's established SVG-component
  pipeline. Do not paste one-off raw SVG into a business/page template.
- Do not mix iconfont, framework-library icons, and SVG components inside the same
  control cluster after the change.
- Keep page-specific icons with that page. Promote one to a shared directory only
  when at least two independent modules genuinely reuse it.
- Import page-specific icons locally. Do not create global registration or a new
  runtime icon registry for a page-level need.
- Use the component name produced by the supplied or selected template. Do not
  replace it with a new naming scheme unless the user asks.
- Preserve the verified `viewBox`, geometry, presentation attributes, and source
  comment. Preserve their order as emitted by the selected template.
- Preserve literal size and color values from the selected template. Do not turn
  them into configurable `size`, `color`, or `strokeWidth` props.
- Do not add a full runtime icon dependency for one icon unless the user explicitly
  authorizes it.

## Treat the Template as an Immutable Contract

Use an exact user-supplied template when present; it overrides bundled examples.
Otherwise use the matching framework reference verbatim. The template fixes the
component wrapper, imports, parameter list and prop type, prop/attribute spreads,
root SVG attributes and their order, comments, and script style.

Only substitute artwork-specific slots: component name, verified source comment,
`viewBox`, SVG child elements, and their path data or presentation attributes.
Do not add or remove props, destructure props, introduce defaults, add wrappers,
add `forwardRef`, add attribute filtering, or insert accessibility/test attributes.
For example, Vue stays name-only, React keeps its single `props` signature and
spread, Svelte keeps `{...$$props}`, and React Native keeps the supplied `props`
parameter without spreading it when that is what the template defines.

## Find and Verify the Source

When the task requires searching for artwork or the supplied source, identifier,
or license is not already verified, read
[references/icon-discovery.md](references/icon-discovery.md). If the user supplies
an exact upstream SVG and license and only asks for framework conversion, keep the
minimal provenance check here and skip that reference.

For multiple icons, validate a semantic mapping before implementation:

| Business action | Existing implementation | Verified source | Component |
| --- | --- | --- | --- |
| Reset password | `icon-*` | `lucide:key-round` | `KeyRoundSvgIcon` |

Confirm exact Lucide slugs against upstream. For Iconify, confirm the complete
`collection:icon-name`, upstream set, and license. Never invent an identifier or
source URL from memory.

## Load One Framework Contract

Route by the file being changed, not by every dependency present in a monorepo.
Read exactly one matching reference. A task that genuinely edits multiple
frameworks may read one reference per edited target.

| Target | Read |
| --- | --- |
| Vue 2/3, JavaScript or TypeScript | [references/vue.md](references/vue.md) |
| React web, JSX or TSX | [references/react.md](references/react.md) |
| Svelte, current or legacy props API | [references/svelte.md](references/svelte.md) |
| Solid, JSX or TSX | [references/solid.md](references/solid.md) |
| Astro component | [references/astro.md](references/astro.md) |
| React Native with `react-native-svg` | [references/react-native.md](references/react-native.md) |

Do not load other framework contracts “just in case.” If the user supplies a
template, use it without asking for another. If neither the template nor target
framework can be discovered, collect that one decision with structured user input.

## Adapt the Artwork

- Preserve the verified `viewBox`, element order, and path data.
- Remove XML declarations, editor metadata, scripts, inline event handlers,
  `foreignObject`, and unnecessary external URLs.
- Keep fixed presentation values exactly as the selected template emits them.
- Preserve a source or license notice when the upstream license or project policy
  requires it. A source comment alone does not replace required LICENSE or NOTICE
  compliance.
- Preserve the template's existing prop spread exactly; do not add, remove,
  reorder, filter, or replace it.
- Keep accessibility and interaction ownership on the surrounding control. Do not
  mutate the icon template by injecting icon-level accessibility attributes.

Do not redraw paths for cosmetic consistency. If the source cannot be verified or
safely adapted, choose another verified source.

## Integrate Without Behavioral Drift

Replace only the icon rendering. Preserve:

- visibility, permission, and conditional-rendering logic;
- tooltip text and placement;
- handler, event modifiers, and arguments;
- disabled, loading, hover, and selected states;
- surrounding control type, class, spacing, and layout role.

Reuse one component for the same business action. Use different artwork only for a
real user-visible state distinction. Keep click handling and the accessible name on
the surrounding control unless an existing contract requires otherwise.

## Verify the Result

Search the changed call-site scope for raw SVG and legacy icon implementations,
including project-specific wrappers. Exclude the new icon component files where
the SVG root is expected.

Then verify:

- component name, extension, placement, and import match the selected framework;
- the generated component matches the selected template structurally: no added or
  removed props, defaults, wrappers, imports, spreads, or root attributes;
- filled/stroke behavior, provenance, and accessible ownership remain correct;
- conditions, tooltips, handlers, and handler arguments are unchanged;
- the narrow lint/typecheck/test command passes, followed by a proportionate build;
- material visual states render correctly, including disabled/hover/selected when
  relevant.

If authentication, backend data, a parent app, or a native runtime blocks visual
verification, record the exact missing check. Compilation alone does not prove the
icon is visually or semantically correct.
