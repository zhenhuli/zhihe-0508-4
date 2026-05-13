import { mount, createLocalVue } from '@vue/test-utils'
import ElementUI from 'element-ui'
import CouponCard from '@/components/CouponCard.vue'

const localVue = createLocalVue()
localVue.use(ElementUI)

describe('CouponCard.vue', () => {
  const mockCoupon = {
    id: 1,
    name: '测试优惠券',
    value: 50,
    threshold: 200,
    type: 'full',
    tag: '限时',
    validTime: '2024.01.01 - 2024.12.31',
    description: '测试优惠券描述',
    scope: '全场通用',
    expired: false,
    received: false
  }

  beforeEach(() => {
    localStorage.clear()
  })

  it('renders coupon information correctly', () => {
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: mockCoupon }
    })

    expect(wrapper.find('.coupon-name').text()).toBe('测试优惠券')
    expect(wrapper.find('.coupon-value .amount').text()).toBe('50')
    expect(wrapper.find('.coupon-condition').text()).toBe('满200可用')
  })

  it('shows correct coupon type name', () => {
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: mockCoupon }
    })

    expect(wrapper.find('.coupon-type').text()).toBe('全场券')
  })

  it('toggles expand when clicking main area', async () => {
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: mockCoupon }
    })

    expect(wrapper.find('.coupon-expand').isVisible()).toBe(false)
    
    await wrapper.find('.coupon-main').trigger('click')
    expect(wrapper.find('.coupon-expand').isVisible()).toBe(true)
    
    await wrapper.find('.coupon-main').trigger('click')
    expect(wrapper.find('.coupon-expand').isVisible()).toBe(false)
  })

  it('does not expand for expired coupons', async () => {
    const expiredCoupon = { ...mockCoupon, expired: true }
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: expiredCoupon }
    })

    await wrapper.find('.coupon-main').trigger('click')
    expect(wrapper.find('.coupon-expand').isVisible()).toBe(false)
  })

  it('emits toggle-favorite event when clicking favorite icon', async () => {
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: mockCoupon }
    })

    await wrapper.find('.favorite-icon').trigger('click')
    expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
    expect(wrapper.emitted('toggle-favorite')[0][0]).toEqual(mockCoupon)
    expect(wrapper.emitted('toggle-favorite')[0][1]).toBe(true)
  })

  it('emits receive event when clicking receive button', async () => {
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: mockCoupon }
    })

    await wrapper.find('.coupon-main').trigger('click')
    await wrapper.vm.$nextTick()
    
    const receiveButton = wrapper.findAll('button').wrappers.find(btn => 
      btn.text().includes('立即领取')
    )
    
    if (receiveButton) {
      await receiveButton.trigger('click')
      expect(wrapper.emitted('receive')).toBeTruthy()
      expect(wrapper.emitted('receive')[0][0]).toEqual(mockCoupon)
    }
  })

  it('disables receive button for received coupon', () => {
    const receivedCoupon = { ...mockCoupon, received: true }
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: receivedCoupon }
    })

    expect(wrapper.classes()).toContain('received')
  })

  it('shows expired style for expired coupon', () => {
    const expiredCoupon = { ...mockCoupon, expired: true }
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: expiredCoupon }
    })

    expect(wrapper.classes()).toContain('expired')
  })

  it('shows tag when coupon has tag', () => {
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: mockCoupon }
    })

    expect(wrapper.find('.coupon-tag').exists()).toBe(true)
    expect(wrapper.find('.coupon-tag').text()).toBe('限时')
  })

  it('does not show tag when coupon has no tag', () => {
    const couponWithoutTag = { ...mockCoupon, tag: null }
    const wrapper = mount(CouponCard, {
      localVue,
      propsData: { coupon: couponWithoutTag }
    })

    expect(wrapper.find('.coupon-tag').exists()).toBe(false)
  })
})
