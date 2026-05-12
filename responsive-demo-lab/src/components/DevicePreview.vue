<script setup>
import { computed } from 'vue'

const props = defineProps({
  dimensions: { type: Object, required: true },
  scale: { type: Number, required: true },
  deviceName: { type: String, required: true },
  template: { type: String, required: true }
})

const containerStyle = computed(() => ({
  width: `${props.dimensions.width}px`,
  height: `${props.dimensions.height}px`,
  transform: `scale(${props.scale})`
}))
</script>

<template>
  <div class="preview-container">
    <div class="device-label">{{ deviceName }} - {{ dimensions.width }}×{{ dimensions.height }}</div>
    <div class="device-frame" :style="containerStyle">
      <div v-if="template === 'grid'" class="grid-template">
        <header class="grid-header">Header</header>
        <nav class="grid-nav">Navigation</nav>
        <main class="grid-main">Main Content</main>
        <aside class="grid-sidebar">Sidebar</aside>
        <footer class="grid-footer">Footer</footer>
      </div>
      
      <div v-else-if="template === 'flex'" class="flex-template">
        <header class="flex-header">
          <div class="logo">Logo</div>
          <nav class="flex-nav">
            <a>首页</a>
            <a>产品</a>
            <a>关于</a>
          </nav>
        </header>
        <div class="flex-hero">Hero Banner</div>
        <div class="flex-cards">
          <div class="card">Card 1</div>
          <div class="card">Card 2</div>
          <div class="card">Card 3</div>
        </div>
        <footer class="flex-footer">Footer</footer>
      </div>
      
      <div v-else-if="template === 'dashboard'" class="dashboard-template">
        <aside class="dash-sidebar">
          <div class="dash-logo">📊 Dashboard</div>
          <nav class="dash-menu">
            <a>概览</a>
            <a>数据</a>
            <a>报告</a>
            <a>设置</a>
          </nav>
        </aside>
        <div class="dash-main">
          <header class="dash-header">仪表盘</header>
          <div class="dash-stats">
            <div class="stat">1,234</div>
            <div class="stat">5,678</div>
            <div class="stat">9,012</div>
          </div>
          <div class="dash-content">Content Area</div>
        </div>
      </div>
      
      <div v-else-if="template === 'blog'" class="blog-template">
        <header class="blog-header">
          <h1>我的博客</h1>
          <nav class="blog-nav">
            <a>首页</a>
            <a>文章</a>
            <a>归档</a>
          </nav>
        </header>
        <div class="blog-content">
          <article class="blog-post">
            <h2>文章标题</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </article>
          <aside class="blog-sidebar">侧边栏</aside>
        </div>
        <footer class="blog-footer">© 2024 My Blog</footer>
      </div>
      
      <div v-else-if="template === 'ecommerce'" class="ecommerce-template">
        <header class="shop-header">
          <div class="shop-logo">🛒 Shop</div>
          <div class="shop-search">搜索...</div>
          <div class="shop-cart">Cart</div>
        </header>
        <div class="shop-banner">促销横幅</div>
        <div class="shop-products">
          <div class="product" v-for="i in 6">Product {{ i }}</div>
        </div>
        <footer class="shop-footer">Shop Footer</footer>
      </div>
      
      <div v-else-if="template === 'profile'" class="profile-template">
        <div class="profile-cover"></div>
        <div class="profile-info">
          <div class="avatar">👤</div>
          <h2>用户名</h2>
          <p>个人简介信息</p>
        </div>
        <div class="profile-stats">
          <div class="stat-item"><strong>128</strong>帖子</div>
          <div class="stat-item"><strong>1.2k</strong>粉丝</div>
          <div class="stat-item"><strong>256</strong>关注</div>
        </div>
        <div class="profile-content">
          <div class="content-item">内容</div>
          <div class="content-item">内容</div>
          <div class="content-item">内容</div>
          <div class="content-item">内容</div>
          <div class="content-item">内容</div>
          <div class="content-item">内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.device-label {
  margin-bottom: 10px;
  padding: 6px 16px;
  background: rgba(0, 217, 255, 0.2);
  border: 1px solid #00d9ff;
  border-radius: 20px;
  font-size: 13px;
  color: #00d9ff;
}

.device-frame {
  background: #fff;
  border: 3px solid #333;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transform-origin: center center;
}

.grid-template {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main sidebar"
    "footer footer footer";
  grid-template-columns: 80px 1fr 100px;
  grid-template-rows: 50px 1fr 40px;
  height: 100%;
  gap: 2px;
  background: #e0e0e0;
}

.grid-header { grid-area: header; background: #4a90d9; }
.grid-nav { grid-area: nav; background: #5ba55b; }
.grid-main { grid-area: main; background: #f5f5f5; }
.grid-sidebar { grid-area: sidebar; background: #ffb347; }
.grid-footer { grid-area: footer; background: #6c5ce7; }

.grid-template > * {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  font-weight: 500;
}

.grid-main { color: #333; }

@media (max-width: 768px) {
  .grid-template {
    grid-template-areas:
      "header"
      "nav"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
    grid-template-rows: 50px 40px 1fr 60px 40px;
  }
}

@media (max-width: 480px) {
  .grid-template {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
    grid-template-rows: 50px 1fr 80px 40px;
  }
  .grid-nav { display: none; }
}

.flex-template {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
}

.flex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  color: #fff;
}

.logo { font-weight: bold; }

.flex-nav {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.flex-hero {
  flex: 0 0 100px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
}

.flex-cards {
  display: flex;
  gap: 8px;
  flex: 1;
}

.card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
}

.flex-footer {
  padding: 12px;
  background: #2d3748;
  border-radius: 8px;
  color: #fff;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 768px) {
  .flex-nav { gap: 8px; }
  .flex-cards { flex-direction: column; }
  .card { min-height: 60px; }
}

@media (max-width: 480px) {
  .flex-nav { display: none; }
  .flex-hero { flex-basis: 80px; }
}

.dashboard-template {
  display: flex;
  height: 100%;
}

.dash-sidebar {
  width: 180px;
  background: #1e293b;
  color: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dash-logo {
  font-weight: bold;
  font-size: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid #334155;
}

.dash-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dash-menu a {
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.dash-menu a:hover { background: #334155; }

.dash-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
}

.dash-header {
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  font-weight: bold;
  color: #1e293b;
}

.dash-stats {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.stat {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: #4f46e5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.dash-content {
  flex: 1;
  margin: 0 16px 16px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .dash-sidebar { width: 60px; }
  .dash-logo span, .dash-menu a span { display: none; }
  .dash-menu a { text-align: center; padding: 10px; }
  .dash-stats { flex-direction: column; }
}

@media (max-width: 480px) {
  .dashboard-template { flex-direction: column; }
  .dash-sidebar {
    width: 100%;
    flex-direction: row;
    padding: 8px 16px;
  }
  .dash-logo { padding: 0; border: none; }
  .dash-menu { flex-direction: row; gap: 4px; }
  .dash-menu a { padding: 6px 10px; font-size: 11px; }
}

.blog-template {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.blog-header {
  padding: 20px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
}

.blog-header h1 { font-size: 20px; margin-bottom: 12px; }

.blog-nav {
  display: flex;
  gap: 20px;
  font-size: 13px;
}

.blog-nav a { cursor: pointer; opacity: 0.9; }

.blog-content {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow: auto;
}

.blog-post {
  flex: 1;
  min-width: 0;
}

.blog-post h2 {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 12px;
}

.blog-post p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.7;
}

.blog-sidebar {
  width: 180px;
  flex-shrink: 0;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 12px;
}

.blog-footer {
  padding: 16px;
  background: #1f2937;
  color: #9ca3af;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 768px) {
  .blog-content { flex-direction: column; }
  .blog-sidebar { width: 100%; min-height: 100px; }
}

@media (max-width: 480px) {
  .blog-nav { display: none; }
  .blog-header { padding: 16px; }
  .blog-header h1 { font-size: 16px; }
}

.ecommerce-template {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

.shop-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.shop-logo {
  font-weight: bold;
  color: #ef4444;
  font-size: 18px;
}

.shop-search {
  flex: 1;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 12px;
  color: #94a3b8;
}

.shop-cart {
  padding: 8px 16px;
  background: #ef4444;
  color: #fff;
  border-radius: 6px;
  font-size: 12px;
}

.shop-banner {
  margin: 12px;
  padding: 40px;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  border-radius: 12px;
  color: #fff;
  text-align: center;
  font-weight: bold;
}

.shop-products {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 12px 12px;
  overflow: auto;
}

.product {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 12px;
}

.shop-footer {
  padding: 16px;
  background: #1e293b;
  color: #94a3b8;
  text-align: center;
  font-size: 12px;
}

@media (max-width: 768px) {
  .shop-products { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .shop-header { gap: 8px; padding: 10px 12px; }
  .shop-search { display: none; }
  .shop-products { grid-template-columns: 1fr; }
  .shop-banner { padding: 24px; margin: 8px; }
}

.profile-template {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.profile-cover {
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-info {
  margin-top: -40px;
  text-align: center;
  padding: 0 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 50%;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.profile-info h2 {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 4px;
}

.profile-info p {
  font-size: 12px;
  color: #6b7280;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  margin: 8px 12px;
  background: #fff;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
  font-size: 11px;
  color: #6b7280;
}

.stat-item strong {
  display: block;
  font-size: 16px;
  color: #1f2937;
  margin-bottom: 2px;
}

.profile-content {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 0 12px 12px;
  overflow: auto;
}

.content-item {
  background: #e5e7eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 11px;
}

@media (max-width: 480px) {
  .profile-cover { height: 100px; }
  .avatar { width: 64px; height: 64px; font-size: 28px; }
  .profile-stats { gap: 16px; }
  .profile-content { grid-template-columns: repeat(2, 1fr); }
}
</style>
