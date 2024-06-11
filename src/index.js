/** @typedef {import('prettier').Options} PrettierOptions */
/** @typedef {import('eslint').Linter.FlatConfig} FlatConfig  */
/**
 * @typedef {object} StylisticOptions
 * @prop {string} [pluginName] Override style prefix - default: '@stylistic'
 * @prop {number | 'tab'} [indent] Indentation level - default: 2
 * @prop {'single' | 'double'} [quotes] Quote style - default: 'single'
 * @prop {boolean} [semi] Whether to enable semicolons - default: false
 * @prop {boolean} [arrowParens] When to enable arrow parenthesis - default: false
 * @prop {boolean} [blockSpacing] Whether to require spaces around braces - default: true
 * @prop {'always' | 'as-needed' | 'consistent' | 'consistent-as-needed'} [quoteProps] When to enable prop quoting - default: 'consistent-as-needed'
 * @prop {'never' | 'always' | 'always-multiline' | 'only-multiline'} [commaDangle='always-multiline'] When to enable comma dangles - default: 'always-multiline'
 */
/**
 * @typedef {object} Options
 * @prop {'all' | 'base' | 'recommended' | 'jsx-a11y-recommended' | 'jsx-a11y-strict'} [config] Astro config - default: 'recommended'
 * @prop {StylisticOptions} [style]
 * @prop {string} [tsPluginName] Override typescript plugin prefix - default: '@typescript-eslint'
 * @prop {import('./typegen.js').RuleOptions} [overrides] Override astro rules
 * @prop {PrettierOptions & { astroSkipFrontmatter?: boolean, astroAllowShorthand?: boolean }} [prettier]
 */

import pluginAstro from 'eslint-plugin-astro'
import pluginFormat from 'eslint-plugin-format'
import { isPackageExists } from 'local-pkg'

const GLOB_ASTRO = '**/*.astro'
const GLOB_ASTRO_TS = '**/*.astro/*.ts'
const GLOB_ASTRO_JS = '**/*.astro/*.js'

/**
 * @param {string} prefix
 * @param {FlatConfig['rules']} rules
 * @returns {FlatConfig['rules']}
 */
const addPrefixRules = (prefix, rules) => {
  const res = {}
  Object.keys(rules).forEach((name) => {
    res[`${prefix}/${name}`] = rules[name]
  })
  return res
}

/**
 * @param {Options?} options
 * @returns {FlatConfig[]}
 */
export function astro(options = {}) {
  const {
    config = 'recommended',
    style = {},
    tsPluginName = '@typescript-eslint',
    overrides = {},
    prettier: userPrettierOptions = {},
  } = options

  const {
    pluginName = '@stylistic',
    indent = 2,
    quotes = 'single',
    semi = false,
    arrowParens = false,
    blockSpacing = true,
    quoteProps = 'consistent-as-needed',
    commaDangle = 'always-multiline',
  } = style

  /** @type {PrettierOptions} */
  const prettierOptions = {
    endOfLine: 'auto',
    semi,
    singleQuote: quotes === 'single',
    tabWidth: typeof indent === 'number' ? indent : 2,
    trailingComma: commaDangle === 'never' ? 'none' : 'all',
    useTabs: indent === 'tab',
    bracketSpacing: blockSpacing,
    quoteProps: quoteProps.includes('consistent')
      ? 'consistent'
      : quoteProps === 'as-needed'
        ? 'as-needed'
        : 'preserve',
    arrowParens: arrowParens ? 'always' : 'avoid',
    ...userPrettierOptions,
  }

  if ((config === 'jsx-a11y-recommended' || config === 'jsx-a11y-strict') && !isPackageExists('eslint-plugin-jsx-a11y')) {
    console.warn('eslint-astro-mate: To use a11y you need to install eslint-plugin-jsx-a11y.')
  }

  return [
    ...pluginAstro.configs[`flat/${config}`],
    {
      files: [GLOB_ASTRO],
      plugins: {
        format: pluginFormat,
      },
      name: 'astro/formatter',
      rules: {
        'format/prettier': [
          'error',
          {
            ...prettierOptions,
            parser: 'astro',
            plugins: [
              'prettier-plugin-astro',
            ],
          },
        ],
      },
    },
    {
      files: [GLOB_ASTRO, GLOB_ASTRO_TS, GLOB_ASTRO_JS],
      name: 'astro/disables',
      languageOptions: {
        parserOptions: {
          project: false,
          program: null,
        },
      },
      rules: {
        ...addPrefixRules(pluginName, {
          'arrow-parens': 'off',
          'block-spacing': 'off',
          'comma-dangle': 'off',
          'indent': 'off',
          'max-len': 'off',
          'no-multi-spaces': 'off',
          'object-curly-newline': 'off',
          'object-curly-spacing': 'off',
          'operator-linebreak': 'off',
          'quotes': 'off',
          'semi': 'off',
          'space-before-blocks': 'off',
          'space-before-function-paren': 'off',
          'jsx-closing-tag-location': 'off',
          'jsx-indent': 'off',
          'jsx-one-expression-per-line': 'off',
          'no-multiple-empty-lines': 'off',
          'quote-props': 'off',
        }),
        'astro/no-set-html-directive': 'off',
        'astro/semi': 'off',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
        'antfu/consistent-list-newline': 'off',
        ...addPrefixRules(tsPluginName, {
          'await-thenable': 'off',
          'consistent-return': 'off',
          'consistent-type-exports': 'off',
          'dot-notation': 'off',
          'naming-convention': 'off',
          'no-array-delete': 'off',
          'no-base-to-string': 'off',
          'no-confusing-void-expression': 'off',
          'no-duplicate-type-constituents': 'off',
          'no-floating-promises': 'off',
          'no-for-in-array': 'off',
          'no-implied-eval': 'off',
          'no-meaningless-void-operator': 'off',
          'no-misused-promises': 'off',
          'no-mixed-enums': 'off',
          'no-redundant-type-constituents': 'off',
          'no-throw-literal': 'off',
          'no-unnecessary-boolean-literal-compare': 'off',
          'no-unnecessary-condition': 'off',
          'no-unnecessary-qualifier': 'off',
          'no-unnecessary-template-expression': 'off',
          'no-unnecessary-type-arguments': 'off',
          'no-unnecessary-type-assertion': 'off',
          'no-unsafe-argument': 'off',
          'no-unsafe-assignment': 'off',
          'no-unsafe-call': 'off',
          'no-unsafe-enum-comparison': 'off',
          'no-unsafe-member-access': 'off',
          'no-unsafe-return': 'off',
          'no-unsafe-unary-minus': 'off',
          'no-useless-template-literals': 'off',
          'non-nullable-type-assertion-style': 'off',
          'only-throw-error': 'off',
          'prefer-destructuring': 'off',
          'prefer-find': 'off',
          'prefer-includes': 'off',
          'prefer-nullish-coalescing': 'off',
          'prefer-optional-chain': 'off',
          'prefer-promise-reject-errors': 'off',
          'prefer-readonly': 'off',
          'prefer-readonly-parameter-types': 'off',
          'prefer-reduce-type-parameter': 'off',
          'prefer-regexp-exec': 'off',
          'prefer-return-this-type': 'off',
          'prefer-string-starts-ends-with': 'off',
          'promise-function-async': 'off',
          'require-array-sort-compare': 'off',
          'require-await': 'off',
          'restrict-plus-operands': 'off',
          'restrict-template-expressions': 'off',
          'return-await': 'off',
          'strict-boolean-expressions': 'off',
          'switch-exhaustiveness-check': 'off',
          'unbound-method': 'off',
          'use-unknown-in-catch-callback-variable': 'off',
        }),
      },
    },
    {
      files: [GLOB_ASTRO, GLOB_ASTRO_TS, GLOB_ASTRO_JS],
      name: 'astro/rules',
      rules: {
        ...overrides,
      },
    },
  ]
}
