import assert from 'node:assert'
import fs from 'node:fs/promises'
import test from 'node:test'

import { Linter } from 'eslint'

import { astro } from '../src/index.js'

test('basic', async () => {
  const linter = new Linter({ configType: 'flat' })
  const { output } = linter.verifyAndFix(await fs.readFile('tests/input/basic.astro', 'utf-8'), astro(), 'test.astro')
  assert.strictEqual(output, await fs.readFile('./tests/output/basic.astro', 'utf-8'))
})

test('indent = 4', async () => {
  const linter = new Linter({ configType: 'flat' })
  const { output } = linter.verifyAndFix(await fs.readFile('tests/input/basic.astro', 'utf-8'), astro({
    style: {
      indent: 4,
    },
  }), 'test.astro')
  assert.strictEqual(output, await fs.readFile('./tests/output/indent.astro', 'utf-8'))
})

test('semi = true', async () => {
  const linter = new Linter({ configType: 'flat' })
  const { output } = linter.verifyAndFix(await fs.readFile('tests/input/basic.astro', 'utf-8'), astro({
    style: {
      semi: true,
    },
  }), 'test.astro')
  assert.strictEqual(output, await fs.readFile('./tests/output/semi.astro', 'utf-8'))
})
