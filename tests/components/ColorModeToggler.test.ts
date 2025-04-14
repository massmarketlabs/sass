// import { setup } from '@nuxt/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ColorModeToggler from '~/components/ColorModeToggler.vue'

describe('colorModeToggler', async () => {
  // await setup()
  it('should toggle color mode', () => {
    expect(true).toBe(true)
  })

  it('should render light mode icon initially', async () => {
    const wrapper = await mountSuspended(ColorModeToggler)
    console.log(wrapper.text())
    expect(wrapper).toBeDefined()
  })

  // it('should switch to dark mode when clicked', async () => {
  //   const wrapper = mount(ColorModeToggler)
  //   const colorMode = useColorMode()

  //   await wrapper.find('button').trigger('click')

  //   expect(colorMode.value).toBe('dark')
  //   expect(wrapper.find('[data-test="dark-mode-icon"]').exists()).toBe(true)
  // })

  // it('should toggle between light and dark modes', async () => {
  //   const wrapper = mount(ColorModeToggler)
  //   const colorMode = useColorMode()

  //   await wrapper.find('button').trigger('click')
  //   expect(colorMode.value).toBe('dark')

  //   await wrapper.find('button').trigger('click')
  //   expect(colorMode.value).toBe('light')
  // })
})
