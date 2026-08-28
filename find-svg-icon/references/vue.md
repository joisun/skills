# Vue SVG Component Contract

Use the supplied Vue template exactly. Substitute only the component name,
verified source comment, `viewBox`, and SVG geometry. Keep the root SVG
attributes, their order, and the script shape unchanged. In particular, do not
add `props`, `defineProps`, `inheritAttrs`, attribute filtering, methods,
accessibility attributes, or event forwarding.

## JavaScript

```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><!-- Verified source and license comment --><!-- Verified geometry --></svg>
</template>

<script>
export default {
  name: 'ExampleIcon'
}
</script>
```

## TypeScript

`lang="ts"` is the only structural difference from the JavaScript template.
Do not introduce a TypeScript props API.

```vue
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><!-- Verified source and license comment --><!-- Verified geometry --></svg>
</template>

<script lang="ts">
export default {
  name: 'ExampleIcon'
}
</script>
```

The same template applies to Vue 2 and Vue 3. Do not upgrade its component API
to match a preferred Vue version.
