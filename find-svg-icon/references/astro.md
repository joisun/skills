# Astro SVG Component Contract

Use a user- or project-supplied Astro template verbatim when available. The
bundled fallback keeps Astro's existing props object as a direct spread and does
not declare component-specific props, defaults, frontmatter, wrappers, client
directives, or accessibility attributes.

```astro
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...Astro.props}><!-- Verified source and license comment --><!-- Verified geometry --></svg>
```

Substitute only the verified source comment, `viewBox`, and SVG geometry. Do not
destructure `Astro.props` or add a `Props` interface unless that exact structure
already exists in the selected template.
