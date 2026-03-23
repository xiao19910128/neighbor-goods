<template>
  <view class="mine-page">
    <view class="main-content">
      <!-- 未登录：显示微信登录按钮 -->
      <view v-if="!isLogin" class="no-login">
        <view class="login-tip">还没有登录，请先登录</view>
        <button class="btn-login" @click="wxLogin">微信登录</button>
      </view>
      <!-- 已登录：显示退出登录按钮 -->
      <view  v-else class="login-content">
        <!-- 顶部用户信息区域 -->
        <view class="user-info-section">
          <view class="avatar-container">
            <!-- <img :src="userInfo.avatarUrl" alt="用户头像" class="avatar" /> -->
            <view class="user-details">
              <view class="username">{{userInfo.nickName}} </view>
            </view>
          </view>
        </view>

        <!-- 功能模块区域 -->
        <view class="common-tools">
          <view class="module-item">
            <span class="module-icon">📦</span>
            <span class="module-text">我卖出的</span>
            <span class="module-count">10</span>
            <span class="module-arrow">></span>
          </view>

          <view class="tool-item" @click="toDetail('publish-list')">
            <span class="tool-icon">📤</span>
            <span class="tool-text">我发布的</span>
            <span class="tool-arrow">></span>
          </view>

          <view class="tool-item">
            <span class="tool-icon">⭐</span>
            <span class="tool-text">我的收藏</span>
            <span class="tool-arrow">></span>
          </view>
        </view>
        <button class="btn-logout" @click="logout">
          退出登录
        </button>
      </view>
      
    </view>
    <TabBar  defaultTab="mine" />
  </view>
</template>

<script>
import { userApi } from '@/api/user';
import TabBar from '@/components/TabBar.vue'
export default {
  name: 'MinePage',
  components: {  TabBar },

  data() {
    return {
      isLogin: false,
      userInfo: {},
    }
  },

  onLoad() {
    this.isLogin = !!uni.getStorageSync('token');
    this.userInfo = uni.getStorageSync('userInfo');
  },

  methods: {
     // 微信登录
    async wxLogin() {
      uni.login({
        provider: 'weixin',
        success: async (res) => {
          const wxRes = await userApi.wxLogin({ code: res.code });
          this.isLogin = !!wxRes?.data?.token;
          this.userInfo = wxRes?.data?.userInfo || {};
          uni.setStorageSync('token', wxRes?.data?.token);
          uni.setStorageSync('userInfo', wxRes?.data?.userInfo);
        },
        fail: (err) => {
          console.error('uni.login 失败:', err);
          uni.showToast({ title: '登录失败', icon: 'none' });
        }
      });
    },
    // 退出登录
    logout() {
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
            // 跳转到首页或登录页
            uni.reLaunch({ url: '/pages/index/index' });
          }
        }
      });
    },


    toDetail(path) {
      if (!this.isLogin) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      wx.navigateTo({ url: `/pages/mine/${path}` });
    },
  },
}
</script>

<style scoped lang="scss">
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


.user-info {
  background-color: #fff;
  padding: 40rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 30rpx;
}
.menu-list {
  background-color: #fff;
}
.menu-item {
  padding: 30rpx;
  border-bottom: 1px solid #eee;
  font-size: 32rpx;
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
  .nickname {
    font-size: 32rpx;
    font-weight: 500;
  }
  .tip {
    font-size: 28rpx;
    color: #999;
  }
  .btn-login, .btn-logout {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
  }
  .btn-login {
    background-color: #09bb07; 
    color: #fff;
  }
  .btn-logout {
    background-color: #fff;
    color: #ff4d4f;
    border: 1px solid #ff4d4f;
  }
}
</style>