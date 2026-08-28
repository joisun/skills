# React SVG Component Contract

Keep the single `props` parameter and the existing `{...props}` spread exactly
where the template places it. Substitute only the component name, verified
source comment, `viewBox`, and SVG geometry. Do not destructure props, add size
or color defaults, define a custom props type, add `forwardRef`, or inject root
attributes.

## JavaScript

```jsx
export function ExampleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Verified source and license comment */}{/* Verified geometry */}</svg>
  )
}
```

## TypeScript

Use the framework-native SVG type directly. Add only the repository's normal
type import when it is not already in scope.

```tsx
import type { SVGProps } from 'react'

export function ExampleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Verified source and license comment */}{/* Verified geometry */}</svg>
  )
}
```

Use React attribute casing only where the verified SVG geometry requires it.
Do not otherwise reshape the template for the installed JSX runtime.
