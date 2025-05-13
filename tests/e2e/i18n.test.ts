import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('i18n', async () => {
  await setup({ host: process.env.NUXT_TEST_APP_URL })

  it('should load homepage in different languages', async () => {
    // English
    const enPage = await createPage('/')
    const startBtn = await enPage.$('a:has-text("Get Started")')
    expect(startBtn).toBeTruthy()

    // French
    const frPage = await createPage('/fr')
    const frTitle = await frPage.$('a:has-text("Commencer")')
    expect(frTitle).toBeTruthy()

    // Japanese
    const jaPage = await createPage('/ja')
    const jaTitle = await jaPage.$('a:has-text("始めましょう")')
    expect(jaTitle).toBeTruthy()

    // Chinese
    const zhPage = await createPage('/zh-CN')
    const zhTitle = await zhPage.$('a:has-text("开始使用")')
    expect(zhTitle).toBeTruthy()
  })

  it('should handle language switching', async () => {
    const page = await createPage('/')

    // Switch to French
    await page.click('button[aria-label="Change language"]')
    await page.click('span:has-text("Français")')
    await page.waitForLoadState('networkidle')

    expect(page.url()).toContain('/fr')
  })
})
