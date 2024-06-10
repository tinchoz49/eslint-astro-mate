import fs from 'node:fs/promises'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import pluginAstro from 'eslint-plugin-astro'

let dts = await flatConfigsToRulesDTS(pluginAstro.configs.all, {
  includeAugmentation: false,
})

await fs.writeFile('src/typegen.d.ts', dts)
