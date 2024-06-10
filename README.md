# eslint-astro-mate

> A friendly ESLint configuration for Astro projects.

- Fully compatible with [eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic).
- Simplifies switching between different Astro configurations.
- Formats `astro` files using [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro) without interfering with @stylistic rules.

## Install

```bash
$ npm install --save-dev eslint-astro-mate
```


## Usage

```javascript
import { astro } from 'eslint-astro-mate'

export default astro()
```

### Different configurations

```javascript
import { astro } from 'eslint-astro-mate'

export default astro({
  config: 'jsx-a11y-recommended'
})
```

### Use same options as stylistic

```javascript
import { astro } from 'eslint-astro-mate'

export default astro({
  style: {
    pluginName: '@stylistic',
    indent: 2,
    quotes: 'single',
    semi: false,
    arrowParens: false,
    blockSpacing: true,
    quoteProps: 'consistent-as-needed',
    commaDangle: 'always-multiline',
  }
})
```

### Override rules

```javascript
import { astro } from 'eslint-astro-mate'

export default astro({
  overrides: {
    'astro/astro/prefer-class-list-directive': 'off',
  }
})
```
