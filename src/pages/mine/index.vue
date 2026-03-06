<template>
  <div class="mine-page">
    <!-- 顶部用户信息区域 -->
    <div class="user-info-section">
      <div class="avatar-container">
        <div class="avatar">👤</div>
        <div class="user-details">
          <div class="username">用户名 </div>
        </div>
      </div>
    </div>

    <!-- 功能模块区域 -->
    <!-- 常用工具区域 -->
    <div class="common-tools">
      <div class="module-item">
        <span class="module-icon">📦</span>
        <span class="module-text">我卖出的</span>
        <span class="module-count">10</span>
        <span class="module-arrow">></span>
      </div>

      <div class="tool-item">
        <span class="tool-icon">📤</span>
        <span class="tool-text">我发布的</span>
        <span class="tool-arrow">></span>
      </div>

      <div class="tool-item">
        <span class="tool-icon">⭐</span>
        <span class="tool-text">我的收藏</span>
        <span class="tool-arrow">></span>
      </div>
      <div class="tool-item">
        <span class="tool-icon">🔔</span>
        <span class="tool-text">订阅中心</span>
        <span class="tool-arrow">></span>
      </div>
      <div class="tool-item">
        <span class="tool-icon">📍</span>
        <span class="tool-text">收货地址</span>
        <span class="tool-arrow">></span>
      </div>
    </div>

    
    <TabBar  defaultTab="mine" />
  </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
export default {
  name: 'MinePage',
  components: {  TabBar },
}
</script>

<style scoped>
.mine-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90rpx);
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 用户信息区域 */
.user-info-section {
  background-color: #ceec9d;
  color: #333;
  padding: 20px;
}

.avatar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 15px;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.fish-power {
  font-size: 14px;
  color: #666;
}

.settings-btn {
  font-size: 16px;
  cursor: pointer;
}

.fish-ball-section {
  background-color: #fff3cd;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fish-ball-info {
  font-size: 16px;
  font-weight: bold;
}

.fish-ball-action {
  font-size: 14px;
  color: #fff;
  background-color: #ceec9d;
  padding: 5px 10px;
  border-radius: 20px;
}

.module-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
}

.module-icon {
  font-size: 24px;
  margin-right: 15px;
}

.module-text {
  flex: 1;
}

.module-action {
  background-color: #4cd964;
  color: #fff;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 14px;
}

.module-count {
  color: #ff4400;
  margin-right: 5px;
}

.module-arrow {
  font-size: 18px;
  color: #999;
}

/* 常用工具区域 */
.common-tools {
  flex: 1;
  overflow: auto;
  padding: 0 20px 20px;
}

.tool-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
}

.tool-icon {
  font-size: 24px;
  margin-right: 15px;
}

.tool-text {
  flex: 1;
}

.tool-arrow {
  font-size: 18px;
  color: #999;
}

/* 底部导航栏 */
.bottom-tab {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 5px 0;
  border-top: 1px solid #eee;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: #666;
}

.tab-item.active {
  color: #ceec9d;
}

.sell-tab {
  position: relative;
}

.sell-tab .icon-sell {
  background-color: #ff4400;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -20px;
  font-size: 20px;
}

.sell-tab .text {
  margin-top: 25px;
}
</style>