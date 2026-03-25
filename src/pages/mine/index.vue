<template>
  <view class="mine-page">
    <view class="main-content">
      <!-- 未登录：显示微信登录按钮 -->
      <view v-if="!isLogin" class="no-login">
        <view class="login-tip">还没有登录，请先登录</view>
        <button class="btn-login" @click="uni.navigateTo({ url: '/pages/login/index' })">登录</button>
      </view>
      <view v-else class="login-content">
        <!-- 顶部：头像 + 昵称 -->
        <view class="user-section">
          <image 
            class="avatar" 
            :src="userInfo.avatarUrl || '/static/default-avatar.jpg'" 
            mode="aspectFill"
          ></image>
          <text class="nickname">{{ userInfo.nickName || '微信昵称' }}</text>
        </view>

        <!-- 功能区：3列网格 -->
        <view class="menu-grid">
          <!-- 交易管理 -->
          <view class="grid-group">
            <text class="group-title">交易管理</text>
            <view class="grid-container">
              <view class="grid-item" @click="uni.navigateTo({ url: '/pages/orders/order-list?type=buy' })">
                <view class="icon-wrapper">
                <uni-icons type="gift" size="24" color="#666"></uni-icons>
                </view>
                <text class="item-text">我的订单</text>
              </view>
              <view class="grid-item" @click="uni.navigateTo({ url: '/pages/mine/publish-list' })">
                <view class="icon-wrapper">
                  <uni-icons type="shop" size="24" color="#666"></uni-icons>
                </view>
                <text class="item-text">我发布的</text>
              </view>
              <view class="grid-item" @click="uni.navigateTo({ url: '/pages/mine/collection-list' })">
                <view class="icon-wrapper">
                  <uni-icons type="star" size="24" color="#666"></uni-icons>
                </view>
                <text class="item-text">我的收藏</text>
              </view>
            </view>
          </view>

          <!-- 偏好管理 -->
          <view class="grid-group">
            <text class="group-title">偏好管理</text>
            <view class="grid-container">
              <view class="grid-item" @click="uni.navigateTo({ url: '/pages/mine/address-list' })">
                <view class="icon-wrapper">
                  <uni-icons type="location" size="24" color="#666"></uni-icons>
                </view>
                <text class="item-text">地址管理</text>
              </view>
              <view class="grid-item" @click="uni.navigateTo({ url: '/pages/mine/message-list' })">
                <view class="icon-wrapper">
                  <uni-icons type="chat" size="24" color="#666"></uni-icons>
                </view>
                <text class="item-text">我的消息</text>
              </view>
              <view class="grid-item"></view>
            </view>
          </view>

          <!-- 设置 -->
          <view class="grid-group">
            <text class="group-title">设置</text>
            <view class="grid-container">
              <view class="grid-item" @click="goToSecurity">
                <view class="icon-wrapper">
                  <uni-icons type="locked" size="24" color="#666"></uni-icons>
                </view>
                <text class="item-text">账号与安全</text>
              </view>
              <view class="grid-item" @click="goToPrivacy">
                <view class="icon-wrapper">
                  <uni-icons type="eye" size="24" color="#666"></uni-icons>
                </view>
                <text class="item-text">隐私设置</text>
              </view>
              <view class="grid-item" @click="goToHelp">
                <view class="icon-wrapper">
                  <uni-icons type="help" size="24" color="#666"></uni-icons>
                </view>
                <text class="item-text">帮助与客服</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部：退出登录 -->
        <view class="logout-section" v-if="isLogin">
          <text class="logout-btn" @click="handleLogout">退出登录</text>
        </view>
      </view>
    </view>
    <TabBar  defaultTab="mine" />
  </view>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
export default {
  name: 'MinePage',
  components: {  TabBar },
  data() {
    return {
      userInfo: uni.getStorageSync('userInfo') || {},
      isLogin: !!uni.getStorageSync('token')
    }
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo') || {};
    this.isLogin = !!uni.getStorageSync('token');
  },
  methods: {
    // 退出登录
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            this.isLogin = false;
            this.userInfo = {};
            // 清除本地存储
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
            uni.removeStorageSync('userId');
            uni.showToast({ title: '已退出登录' });
            uni.navigateTo({ url: '/pages/login/index' });
          }
        }
      });
    },
  }
}
</script>

<style scoped lang="scss">
.mine-page {
  display: flex;
  height: calc(100vh - 90rpx);
  flex-direction: column;
  background-color: #f5f7fa;
  /* min-height: 100vh; */
  /* padding: 40rpx 30rpx; */
}

/* 顶部用户区 */
.user-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40rpx 0 60rpx;
}
.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
  margin-bottom: 20rpx;
}
.nickname {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

/* 功能网格区 */
.menu-grid {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}
.grid-group {
  margin-bottom: 40rpx;
}
.grid-group:last-child {
  margin-bottom: 0;
}
.group-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30rpx;
}
.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon-wrapper {
  width: 60rpx;
  height: 60rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}
.item-text {
  font-size: 28rpx;
  color: #666;
}

/* 底部退出登录 */
.logout-section {
  margin-top: 60rpx;
  text-align: center;
}
.logout-btn {
  font-size: 28rpx;
  color: #999;
}

.main-content{
  flex: 1;
  .no-login {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    height: 500rpx;
    .login-tip {
      color: #999;
      margin-bottom: 20rpx;
    }
  }
  .login-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}
</style>