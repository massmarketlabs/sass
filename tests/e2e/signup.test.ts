import { createPage, setup } from '@nuxt/test-utils/e2e'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('signup', async () => {
  await setup()
  beforeEach(() => {
    // tell vitest we use mocked time
    console.log('beforeEach test')
  })

  afterEach(() => {
    // restoring date after each test run
    console.log('afterEach test')
  })
  it('should show signup form', async () => {
    const page = await createPage('/signup')
    const title = await page.$('h1')
    expect(await title?.textContent()).toContain('Create your account')
  })

  it('should validate form fields', async () => {
    const page = await createPage('/signup')
    console.log(await page.content())
    await page.fill('input[name="name"]', 'te')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', '123')
    await page.fill('input[name="confirmPassword"]', '1234')

    await page.click('button[type="submit"]')

    const errors = await page.$$('[id^="v-"][id$="-error"]')
    console.log(errors)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should submit valid signup form', async () => {
    const page = await createPage('/signup')

    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')

    await page.click('button[type="submit"]')

    await page.waitForURL('/')

    const toast = await page.$('.toast-success')
    expect(toast).toBeTruthy()
  })

  it('should have working social login buttons', async () => {
    const page = await createPage('/signup')

    const googleButton = await page.$('button:has-text("Google")')
    const githubButton = await page.$('button:has-text("Github")')

    expect(googleButton).toBeTruthy()
    expect(githubButton).toBeTruthy()
  })
})
