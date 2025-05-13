// import { setup } from '@nuxt/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ColorModeToggler from '~/components/ColorModeToggler.vue'

describe('colorModeToggler', async () => {
  it('should render light mode icon initially', async () => {
    const wrapper = await mountSuspended(ColorModeToggler)
    const lightIcon = wrapper.find('span')
    expect(lightIcon.element.outerHTML).toBe('<span class="iconify i-lucide:sun shrink-0 size-5" aria-hidden="true"></span>')
  })

  it('should switch to dark mode when clicked', async () => {
    const wrapper = await mountSuspended(ColorModeToggler)
    await wrapper.find('button').trigger('click')
    // TODO: Failed on TypeError: helper.removeColorScheme is not a function
    // Relative Issue: https://github.com/nuxt-modules/color-mode/issues/228
    const darkIcon = wrapper.find('span')
    expect(darkIcon.element.outerHTML).toBe('<span class="iconify i-lucide:moon shrink-0 size-5" aria-hidden="true"></span>')
  })

  it('should toggle between light and dark modes', async () => {
    const wrapper = await mountSuspended(ColorModeToggler)
    await wrapper.find('button').trigger('click')
    const darkIcon = wrapper.find('span')
    expect(darkIcon.element.outerHTML).toBe('<span class="iconify i-lucide:moon shrink-0 size-5" aria-hidden="true"></span>')
    await wrapper.find('button').trigger('click')
    const lightIcon = wrapper.find('span')
    expect(lightIcon.element.outerHTML).toBe('<span class="iconify i-lucide:sun shrink-0 size-5" aria-hidden="true"></span>')
  })
})
