# Svelte SVG Component Contract

Use the supplied Svelte template exactly. It already defines attribute
forwarding through `{...$$props}`. Do not replace it with `$$restProps`,
`$props()`, a declared `size`/`color` prop, a script block, or additional root
attributes.

```svelte
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><!-- Verified source and license comment --><!-- Verified geometry --></svg>
```

Substitute only the verified source comment, `viewBox`, and SVG geometry. A
project- or user-supplied Svelte template overrides this bundled fallback and
must likewise remain structurally unchanged.
