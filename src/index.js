import pluginAstro from 'eslint-plugin-astro'
import pluginFormat from 'eslint-plugin-format'

/** @typedef {import('prettier').Options} PrettierOptions */
/** @typedef {import('eslint').Linter.FlatConfig} FlatConfig  */

/**
 * @typedef {object} Options
 * @prop {string} [pluginName] Override style prefix - default: '@stylistic'
 * @prop {'all' | 'base' | 'recommended' | 'jsx-a11y-recommended' | 'jsx-a11y-strict'} [config] Astro config - default: 'recommended'
 * @prop {number | 'tab'} [indent] Indentation level - default: 2
 * @prop {'single' | 'double'} [quotes] Quote style - default: 'single'
 * @prop {boolean} [semi] Whether to enable semicolons - default: false
 * @prop {boolean} [arrowParens] When to enable arrow parenthesis - default: false
 * @prop {boolean} [blockSpacing] Whether to require spaces around braces - default: true
 * @prop {'always' | 'as-needed' | 'consistent' | 'consistent-as-needed'} [quoteProps] When to enable prop quoting - default: 'consistent-as-needed'
 * @prop {'never' | 'always' | 'always-multiline' | 'only-multiline'} [commaDangle='always-multiline'] When to enable comma dangles - default: 'always-multiline'
 * @prop {import('./typegen.js').RuleOptions} [overrides] Override astro rules
 * @prop {PrettierOptions & { astroSkipFrontmatter?: boolean, astroAllowShorthand?: boolean }} [prettier]
 */

const GLOB_ASTRO = '**/*.astro'
const GLOB_ASTRO_TS = '**/*.astro/*.ts'
const GLOB_ASTRO_JS = '**/*.astro/*.js'

/**
 * @param {string} prefix
 * @param {FlatConfig['rules']} rules
 * @returns {FlatConfig['rules']}
 */
const addStylisticRules = (prefix, rules) => {
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
export default function astro(options = {}) {
  const {
    pluginName = '@stylistic',
    config = 'recommended',
    indent = 2,
    quotes = 'single',
    semi = false,
    arrowParens = false,
    blockSpacing = true,
    quoteProps = 'consistent-as-needed',
    commaDangle = 'always-multiline',
    overrides = {},
    prettier: userPrettierOptions = {},
  } = options

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
      name: 'astro/formatter/disables',
      rules: {
        ...addStylisticRules(pluginName, {
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
      },
    },
    {
      files: ['**/*.d.ts'],
      name: 'astro/dts/disables',
      rules: {
        'ts/triple-slash-reference': 'off',
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
