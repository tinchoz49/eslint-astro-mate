import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  stylistic.configs['recommended-flat'],
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...(await import('./src/index.js')).astro(),
  {
    ignores: [
      'dist/**/*',
      'tests/input/**/*',
      'tests/output/**/*',
    ],
  },
)
