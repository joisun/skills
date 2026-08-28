# Find and Verify External SVG Icons

Choose icons by business meaning and verified upstream source, not by a plausible
name.

## 1. Describe the Required Meaning

For every icon, record the business action, display condition, and usage location.
Inspect the surrounding label, tooltip, handler, and route or API action. Treat an
old class name only as a hint.

For multiple replacements, create the mapping table from `SKILL.md` before editing.

## 2. Search Lucide First

Search [Lucide Icons](https://lucide.dev/icons/) using the business meaning. Prefer
an icon whose visual metaphor matches the action rather than one whose name merely
resembles the old implementation.

Before using it, verify the exact slug and SVG geometry in the
[Lucide upstream icon directory](https://github.com/lucide-icons/lucide/tree/main/icons).
Names can change; do not construct raw URLs or imports from memory.

Record a Lucide source as `lucide:<verified-slug>` in the mapping table.

## 3. Use Iconify When Lucide Does Not Fit

Search through the documented
[Iconify Search API](https://iconify.design/docs/api/search.html) or visually through
[Icônes](https://icones.js.org/).

Confirm all of the following before choosing a result:

- the complete `collection:icon-name` ID;
- the upstream icon set and project;
- the license shown for that collection;
- a source SVG or API response whose geometry matches the selected icon.

Do not guess IDs from naming patterns. If several candidates differ visually in a
meaningful way, show the verified choices and use structured user input rather than
silently selecting one.

## 4. Retrieve and Sanitize Source

Retrieve SVG only from the verified upstream repository or the official icon API.
Do not use an unattributed SVG copied from a search-result preview or arbitrary
download site.

While adapting the SVG into the selected framework component:

- preserve the verified `viewBox` and geometry;
- remove XML declarations, editor metadata, non-license comments, and unused
  definitions; preserve a notice when the license requires it;
- remove scripts, inline event handlers, `foreignObject`, and unnecessary external
  URLs;
- keep fixed width, height, stroke, and fill values in the exact form and order
  required by the selected framework template; do not convert them into props.

Keep a short source note in the change evidence or mapping table. Source provenance
does not require adding comments to every component unless the project convention
calls for them.

## 5. Stop Conditions

Do not use a candidate when its exact source, ID, or license cannot be verified.
Choose another verified icon, or ask the user to select among verified visual
options. Never fill an evidence gap with a guessed identifier.
