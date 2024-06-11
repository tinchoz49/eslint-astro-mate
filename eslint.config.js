import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import { astro } from './src/index.js'

export default tseslint.config(
  stylistic.configs['recommended-flat'],
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...astro(),
  {
    ignores: [
      'dist/**/*',
      'tests/input/**/*',
      'tests/output/**/*',
    ],
  },
)
