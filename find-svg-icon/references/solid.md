# Solid SVG Component Contract

Keep the single `props` parameter and `{...props}` spread exactly as supplied.
Do not introduce `splitProps`, component-specific props, defaults, wrappers, or
extra root attributes.

## JavaScript

```jsx
export function ExampleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Verified source and license comment */}{/* Verified geometry */}</svg>
  )
}
```

## TypeScript

Use `JSX.IntrinsicElements['svg']` directly rather than creating another props
type. Add only the repository's normal `JSX` type import when needed.

```tsx
import type { JSX } from 'solid-js'

export function ExampleIcon(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Verified source and license comment */}{/* Verified geometry */}</svg>
  )
}
```

Substitute only the component name, verified source comment, `viewBox`, and SVG
geometry, using valid JSX casing for the geometry itself.
