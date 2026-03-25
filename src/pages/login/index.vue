<template>
  <view class="login-page">
    <!-- 登录方式切换 -->
    <view class="tab-bar">
      <text 
        class="tab-item" 
        :class="{ active: loginType === 'wechat' }"
        @click="loginType = 'wechat'"
      >微信登录</text>
      <text 
        class="tab-item" 
        :class="{ active: loginType === 'phone' }"
        @click="loginType = 'phone'"
      >手机号登录</text>
    </view>

    <!-- 微信登录 -->
    <view v-if="loginType === 'wechat'" class="wechat-login">
      <button class="wechat-btn" @click="wxLogin">
        微信授权登录
      </button>
    </view>

    <!-- 手机号登录 -->
    <view v-if="loginType === 'phone'" class="phone-login">
      <view class="input-item">
        <input 
          type="number" 
          placeholder="请输入手机号" 
          v-model="phone"
          maxlength="11"
        />
      </view>
      <view class="input-item code-item">
        <input 
          type="number" 
          placeholder="请输入验证码" 
          v-model="smsCode"
          maxlength="6"
        />
        <button 
          class="get-code-btn" 
          @click="getSmsCode"
          :disabled="countDown > 0"
        >
          {{ countDown > 0 ? `${countDown}s后重新获取` : '获取验证码' }}
        </button>
      </view>
      <button class="login-btn" @click="phoneLogin">登录</button>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api/user.js';
export default {
  data() {
    return {
      loginType: 'wechat', // 默认微信登录
      phone: '',
      smsCode: '',
      countDown: 0, // 验证码倒计时
      timer: null // 定时器
    };
  },
  methods: {
    // 微信登录（整合之前的授权逻辑）
    async wxLogin() {
      try {
        // 1. 手动调用 uni.getUserProfile() 获取用户授权
        const profileRes = await new Promise((resolve, reject) => {
          uni.getUserProfile({
            desc: '用于完善您的个人资料', // 必须填写，否则授权失败
            success: resolve,
            fail: reject
          });
        });
        const profile = profileRes.userInfo;
        if (!profile) throw new Error('取消授权');
        // 2. 获取 code
        const loginRes = await new Promise((resolve) => {
          uni.login({ provider: 'weixin', success: resolve });
        });
        // 3. 调用后端微信登录接口
        const res = await userApi.wxLogin({
          code: loginRes.code,
          nickName: profile.nickName,
          avatarUrl: profile.avatarUrl
        });

        // 4. 存储数据
        uni.setStorageSync('token', res.data.token);
        uni.setStorageSync('userInfo', res.data.userInfo);
        uni.showToast({ title: '登录成功' });
        uni.navigateBack(); // 返回上一页
      } catch (err) {
        if (err.errMsg.includes('getUserProfile:fail')) {
          uni.showToast({ title: '您取消了授权，无法登录', icon: 'none' });
        } else {
          uni.showToast({ title: '登录失败', icon: 'none' });
        }
      }
    },

    // 获取验证码
    async getSmsCode() {
      // 校验手机号
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.phone)) {
        return uni.showToast({ title: '手机号格式错误', icon: 'none' });
      }

      // 调用接口
      const res = await userApi.getSmsCode({ phone: this.phone });
      if (res.code === 200) {
        // 启动倒计时
        this.countDown = 60;
        this.timer = setInterval(() => {
          this.countDown--;
          if (this.countDown <= 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      }
    },

    // 手机号登录
    async phoneLogin() {
      if (!this.phone || !this.smsCode) {
        return uni.showToast({ title: '手机号/验证码不能为空', icon: 'none' });
      }

      const res = await userApi.phoneLogin({
        phone: this.phone,
        smsCode: this.smsCode
      });

      if (res.code === 200) {
        uni.setStorageSync('token', res.data.token);
        uni.setStorageSync('userInfo', res.data.userInfo);
        uni.showToast({ title: '登录成功' });
        uni.navigateBack();
      }
    },
  },
  onUnload() {
    // 清除定时器
    if (this.timer) clearInterval(this.timer);
  }
};
</script>

<style scoped>
.login-page {
  padding: 60rpx 30rpx;
}
.tab-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 60rpx;
}
.tab-item {
  font-size: 32rpx;
  margin: 0 30rpx;
  padding-bottom: 10rpx;
}
.tab-item.active {
  color: #07c160;
  border-bottom: 2rpx solid #07c160;
}
.wechat-login {
  text-align: center;
}
.wechat-btn {
  background-color: #07c160;
  color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
}
.phone-login {
  gap: 30rpx;
  display: flex;
  flex-direction: column;
}
.input-item {
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
}
.code-item {
  justify-content: space-between;
}
.get-code-btn {
  margin: 0;
  background-color: #f5f5f5;
  color: #666;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}
.login-btn {
  width: 100%;
  background-color: #07c160;
  color: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-top: 40rpx;
}
</style>