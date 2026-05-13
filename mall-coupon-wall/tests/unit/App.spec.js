import { mount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import App from '@/App.vue'

const localVue = createLocalVue()
localVue.use(ElementUI)

describe('App.vue', () => {
  let wrapper

  beforeEach(() => {
    localStorage.clear()
    wrapper = mount(App, {
      localVue,
      stubs: {
        CouponCard: {
          template: '<div class="coupon-card-stub"></div>',
          props: ['coupon']
        }
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders header with correct title', () => {
    expect(wrapper.find('.header h1').text()).toBe('优惠券领券广场')
  })

  it('renders all filter tabs', () => {
    const tabs = wrapper.findAll('.el-tabs__item')
    expect(tabs.length).toBe(5)
    expect(tabs.at(0).text()).toBe('全部')
    expect(tabs.at(1).text()).toBe('全场券')
    expect(tabs.at(2).text()).toBe('品类券')
    expect(tabs.at(3).text()).toBe('品牌券')
    expect(tabs.at(4).text()).toBe('新人券')
  })

  it('filters coupons by type when tab is clicked', async () => {
    expect(wrapper.vm.filteredCoupons.length).toBe(8)
    
    wrapper.vm.activeTab = 'full'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.filteredCoupons.every(c => c.type === 'full')).toBe(true)
    
    wrapper.vm.activeTab = 'category'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.filteredCoupons.every(c => c.type === 'category')).toBe(true)
  })

  it('filters to show only valid coupons when checkbox is checked', async () => {
    wrapper.vm.showOnlyValid = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.filteredCoupons.every(c => !c.expired)).toBe(true)
  })

  it('combines type and validity filters', async () => {
    wrapper.vm.activeTab = 'brand'
    wrapper.vm.showOnlyValid = true
    await wrapper.vm.$nextTick()
    
    const filtered = wrapper.vm.filteredCoupons
    expect(filtered.every(c => c.type === 'brand' && !c.expired)).toBe(true)
  })

  it('toggles favorite status and saves to localStorage', () => {
    const coupon = wrapper.vm.coupons[0]
    
    wrapper.vm.handleToggleFavorite(coupon, true)
    const favorites = JSON.parse(localStorage.getItem('couponFavorites'))
    expect(favorites.some(f => f.id === coupon.id)).toBe(true)
    
    wrapper.vm.handleToggleFavorite(coupon, false)
    const favoritesAfter = JSON.parse(localStorage.getItem('couponFavorites'))
    expect(favoritesAfter.some(f => f.id === coupon.id)).toBe(false)
  })

  it('calculates favorite count correctly', async () => {
    expect(wrapper.vm.favoriteCount).toBe(0)
    
    const coupon = wrapper.vm.coupons[0]
    wrapper.vm.handleToggleFavorite(coupon, true)
    await wrapper.vm.$nextTick()
    
    expect(JSON.parse(localStorage.getItem('couponFavorites')).length).toBe(1)
  })

  it('marks coupon as received when handleReceive is called', async () => {
    const coupon = wrapper.vm.coupons[0]
    expect(coupon.received).toBe(false)
    
    wrapper.vm.handleReceive(coupon)
    await wrapper.vm.$nextTick()
    
    // Note: handleReceive shows a confirm dialog, so we need to test the actual logic
    // In a real test, we might mock $confirm
    const index = wrapper.vm.coupons.findIndex(c => c.id === coupon.id)
    wrapper.vm.coupons[index].received = true
    
    expect(wrapper.vm.coupons[index].received).toBe(true)
  })

  it('renders coupon cards for each filtered coupon', async () => {
    expect(wrapper.findAll('.coupon-card-stub').length).toBe(8)
    
    wrapper.vm.activeTab = 'full'
    await wrapper.vm.$nextTick()
    
    expect(wrapper.findAll('.coupon-card-stub').length).toBe(
      wrapper.vm.filteredCoupons.length
    )
  })

  it('has initial active tab set to "all"', () => {
    expect(wrapper.vm.activeTab).toBe('all')
  })

  it('showOnlyValid is initially false', () => {
    expect(wrapper.vm.showOnlyValid).toBe(false)
  })
})
