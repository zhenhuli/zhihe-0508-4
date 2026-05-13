<template>
  <div class="app-container">
    <header class="header">
      <h1>优惠券领券广场</h1>
      <div class="header-actions">
        <el-badge :value="favoriteCount" class="item">
          <el-button icon="el-icon-star-on" @click="showFavorites = !showFavorites" size="small">
            我的收藏
          </el-button>
        </el-badge>
      </div>
    </header>

    <div class="filter-section">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="全场券" name="full"></el-tab-pane>
        <el-tab-pane label="品类券" name="category"></el-tab-pane>
        <el-tab-pane label="品牌券" name="brand"></el-tab-pane>
        <el-tab-pane label="新人券" name="newuser"></el-tab-pane>
      </el-tabs>
      <div class="filter-extra">
        <el-checkbox v-model="showOnlyValid" @change="filterCoupons">仅显示可用</el-checkbox>
      </div>
    </div>

    <div class="coupon-list">
      <coupon-card
        v-for="coupon in filteredCoupons"
        :key="coupon.id"
        :coupon="coupon"
        @toggle-favorite="handleToggleFavorite"
        @receive="handleReceive"
      ></coupon-card>
      <div v-if="filteredCoupons.length === 0" class="empty-state">
        <el-empty description="暂无优惠券"></el-empty>
      </div>
    </div>

    <el-dialog
      title="我的收藏"
      :visible.sync="showFavorites"
      width="80%"
    >
      <div class="favorite-list">
        <coupon-card
          v-for="coupon in favoriteCoupons"
          :key="coupon.id"
          :coupon="coupon"
          @toggle-favorite="handleToggleFavorite"
          @receive="handleReceive"
        ></coupon-card>
        <div v-if="favoriteCoupons.length === 0" class="empty-state">
          <el-empty description="暂无收藏的优惠券"></el-empty>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CouponCard from './components/CouponCard.vue'

export default {
  name: 'App',
  components: {
    CouponCard
  },
  data() {
    return {
      activeTab: 'all',
      showOnlyValid: false,
      showFavorites: false,
      coupons: [
        {
          id: 1,
          name: '新人专享券',
          value: 50,
          threshold: 200,
          type: 'newuser',
          tag: '限时',
          validTime: '2024.01.01 - 2024.12.31',
          description: '新用户首单专享，全场通用',
          scope: '全场通用',
          expired: false,
          received: false
        },
        {
          id: 2,
          name: '618大促券',
          value: 100,
          threshold: 500,
          type: 'full',
          tag: '热卖',
          validTime: '2024.06.01 - 2024.06.20',
          description: '618大促专属优惠券',
          scope: '全场通用',
          expired: false,
          received: false
        },
        {
          id: 3,
          name: '数码品类券',
          value: 30,
          threshold: 300,
          type: 'category',
          validTime: '2024.05.01 - 2024.05.31',
          description: '数码家电品类专用',
          scope: '手机、电脑、数码配件',
          expired: false,
          received: false
        },
        {
          id: 4,
          name: '服装品类券',
          value: 20,
          threshold: 150,
          type: 'category',
          validTime: '2024.05.15 - 2024.06.15',
          description: '服装鞋包品类专用',
          scope: '服装、鞋靴、箱包',
          expired: false,
          received: false
        },
        {
          id: 5,
          name: '苹果品牌券',
          value: 200,
          threshold: 2000,
          type: 'brand',
          tag: '专属',
          validTime: '2024.04.01 - 2024.04.30',
          description: 'Apple产品专享',
          scope: 'iPhone、iPad、Mac',
          expired: true,
          received: false
        },
        {
          id: 6,
          name: '小米品牌券',
          value: 50,
          threshold: 500,
          type: 'brand',
          validTime: '2024.05.01 - 2024.05.31',
          description: '小米品牌全系列可用',
          scope: '小米手机、小米生态链产品',
          expired: false,
          received: true
        },
        {
          id: 7,
          name: '食品生鲜券',
          value: 15,
          threshold: 99,
          type: 'category',
          validTime: '2024.05.20 - 2024.06.20',
          description: '食品生鲜品类专享',
          scope: '食品、生鲜、零食',
          expired: false,
          received: false
        },
        {
          id: 8,
          name: '美妆个护券',
          value: 25,
          threshold: 199,
          type: 'category',
          tag: '爆款',
          validTime: '2024.05.10 - 2024.06.10',
          description: '美妆个护品类专用',
          scope: '化妆品、护肤品、个人护理',
          expired: false,
          received: false
        }
      ]
    }
  },
  computed: {
    filteredCoupons() {
      let list = [...this.coupons]
      if (this.activeTab !== 'all') {
        list = list.filter(item => item.type === this.activeTab)
      }
      if (this.showOnlyValid) {
        list = list.filter(item => !item.expired)
      }
      return list
    },
    favoriteCoupons() {
      const favorites = JSON.parse(localStorage.getItem('couponFavorites') || '[]')
      return this.coupons.filter(coupon => 
        favorites.some(fav => fav.id === coupon.id)
      )
    },
    favoriteCount() {
      return this.favoriteCoupons.length
    }
  },
  methods: {
    handleTabClick() {
      this.filterCoupons()
    },
    filterCoupons() {
    },
    handleToggleFavorite(coupon, isFavorited) {
      let favorites = JSON.parse(localStorage.getItem('couponFavorites') || '[]')
      if (isFavorited) {
        if (!favorites.some(item => item.id === coupon.id)) {
          favorites.push({ id: coupon.id, time: Date.now() })
        }
        this.$message.success('收藏成功')
      } else {
        favorites = favorites.filter(item => item.id !== coupon.id)
        this.$message.info('已取消收藏')
      }
      localStorage.setItem('couponFavorites', JSON.stringify(favorites))
    },
    handleReceive(coupon) {
      const index = this.coupons.findIndex(item => item.id === coupon.id)
      if (index !== -1) {
        this.$confirm('确定要领取这张优惠券吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.coupons[index].received = true
          this.$message({
            type: 'success',
            message: '领取成功！'
          })
        }).catch(() => {
        })
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f5f5;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ff6b6b 0%, #fff5f5 200px);
}

.header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
}

.filter-section {
  padding: 0 20px 20px;
  background: white;
  border-radius: 20px 20px 0 0;
  margin-top: -10px;
}

.filter-section .el-tabs__header {
  margin-bottom: 10px;
}

.filter-extra {
  text-align: right;
  padding: 10px 0;
}

.coupon-list {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.empty-state {
  width: 100%;
  padding: 60px 0;
}

.favorite-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px 0;
}
</style>
