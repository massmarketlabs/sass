import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('app', async () => {
  await setup()

  it('should load homepage successfully', async () => {
    const page = await createPage('/')
    const h1 = await page.$('h1')
    expect(await h1?.textContent()).eq('NuxSaaS')
  })
})
