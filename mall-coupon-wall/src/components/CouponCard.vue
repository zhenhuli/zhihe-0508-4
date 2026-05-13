<template>
  <div class="coupon-card" :class="{ 'expired': coupon.expired, 'received': coupon.received }">
    <div class="coupon-main" @click="toggleExpand">
      <div class="coupon-left">
        <div class="coupon-value">
          <span class="symbol">¥</span>
          <span class="amount">{{ coupon.value }}</span>
        </div>
        <div class="coupon-condition">满{{ coupon.threshold }}可用</div>
      </div>
      <div class="coupon-right">
        <div class="coupon-name">{{ coupon.name }}</div>
        <div class="coupon-type">{{ getTypeName(coupon.type) }}</div>
        <div class="coupon-time">{{ coupon.validTime }}</div>
      </div>
      <div class="coupon-tag" v-if="coupon.tag">{{ coupon.tag }}</div>
    </div>
    <div class="coupon-expand" v-show="isExpanded">
      <div class="coupon-desc">
        <p>使用说明：{{ coupon.description }}</p>
        <p>适用范围：{{ coupon.scope }}</p>
      </div>
      <div class="coupon-actions">
        <el-button
          size="small"
          :type="isFavorited ? 'warning' : 'default'"
          @click.stop="toggleFavorite"
          icon="el-icon-star-on"
        >
          {{ isFavorited ? '已收藏' : '收藏' }}
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click.stop="receiveCoupon"
          :disabled="coupon.expired || coupon.received"
          v-show="!coupon.expired"
        >
          {{ coupon.received ? '已领取' : '立即领取' }}
        </el-button>
        <el-button
          size="small"
          type="info"
          disabled
          v-show="coupon.expired"
        >
          已失效
        </el-button>
      </div>
    </div>
    <div class="favorite-icon" @click.stop="toggleFavorite">
      <i :class="isFavorited ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CouponCard',
  props: {
    coupon: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isExpanded: false,
      isFavorited: false
    }
  },
  mounted() {
    this.checkFavorite()
  },
  methods: {
    toggleExpand() {
      if (!this.coupon.expired) {
        this.isExpanded = !this.isExpanded
      }
    },
    getTypeName(type) {
      const typeMap = {
        'full': '全场券',
        'category': '品类券',
        'brand': '品牌券',
        'newuser': '新人券'
      }
      return typeMap[type] || '优惠券'
    },
    toggleFavorite() {
      this.isFavorited = !this.isFavorited
      this.$emit('toggle-favorite', this.coupon, this.isFavorited)
    },
    checkFavorite() {
      const favorites = JSON.parse(localStorage.getItem('couponFavorites') || '[]')
      this.isFavorited = favorites.some(item => item.id === this.coupon.id)
    },
    receiveCoupon() {
      if (!this.coupon.expired && !this.coupon.received) {
        this.$emit('receive', this.coupon)
      }
    }
  }
}
</script>

<style scoped>
.coupon-card {
  position: relative;
  width: 320px;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.coupon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.coupon-card.expired {
  opacity: 0.6;
  filter: grayscale(50%);
}

.coupon-card.received .coupon-main {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.coupon-main {
  display: flex;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe4e4 100%);
  padding: 15px;
  position: relative;
}

.coupon-left {
  width: 100px;
  text-align: center;
  border-right: 2px dashed #ff6b6b;
  padding-right: 15px;
}

.coupon-value {
  color: #ff4757;
  font-weight: bold;
}

.coupon-value .symbol {
  font-size: 16px;
}

.coupon-value .amount {
  font-size: 36px;
}

.coupon-condition {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.coupon-right {
  flex: 1;
  padding-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.coupon-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.coupon-type {
  display: inline-block;
  background: #ff6b6b;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-bottom: 5px;
  width: fit-content;
}

.coupon-time {
  font-size: 12px;
  color: #999;
}

.coupon-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff6b6b;
  color: white;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 0 8px 0 10px;
}

.coupon-expand {
  background: white;
  padding: 15px;
  border-top: 1px dashed #eee;
}

.coupon-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.coupon-desc p {
  margin: 5px 0;
}

.coupon-actions {
  display: flex;
  justify-content: space-between;
}

.favorite-icon {
  position: absolute;
  top: 35px;
  right: 15px;
  font-size: 20px;
  color: #ff6b6b;
  cursor: pointer;
  z-index: 10;
}

.favorite-icon:hover {
  transform: scale(1.2);
}
</style>
