// import { standard } from 'eslint-config-standard-ext'
import stylistic from '@stylistic/eslint-plugin'
import astro from './src/index.js'

export default [
  stylistic.configs.customize({
    // the following options are the default values
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
    // ...
  }),
  ...astro({
    config: 'jsx-a11y-recommended',
  }),
]
