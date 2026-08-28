# React Native SVG Component Contract

Use this contract only when `react-native-svg` is already available or the user
authorizes adding it. Keep the supplied imports, single `props` parameter, root
attributes, and lack of a prop spread exactly as shown. Do not destructure props,
add defaults, spread props onto `Svg`, inject accessibility props, or prune the
template imports.

## JavaScript

```jsx
import Svg, { Path, G, Symbol } from 'react-native-svg'

export function ExampleIcon(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">{/* Verified source and license comment */}{/* Verified geometry with React Native SVG elements */}</Svg>
  )
}
```

## TypeScript

Type the existing parameter with `SvgProps`; do not define additional component
props or change the template body.

```tsx
import Svg, { Path, G, Symbol, type SvgProps } from 'react-native-svg'

export function ExampleIcon(props: SvgProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">{/* Verified source and license comment */}{/* Verified geometry with React Native SVG elements */}</Svg>
  )
}
```

Substitute only the component name, verified source comment, `viewBox`, and SVG
children. Convert SVG element tag names only as required by `react-native-svg`.
