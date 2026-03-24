<template>
  <view class="address-page">
    <!-- 地址列表区 -->
    <view v-if="addressLists.length > 0" class="address-list">
      <view class="address-item" v-for="item in addressLists" :key="item.address_id">
        <view class="address-info">
          <view class="address-top">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
            <text class="default-tag" v-if="item.is_default === 1">默认</text>
          </view>
          <text class="address-detail">{{ item.province }}{{ item.city }}{{ item.county }}{{ item.detail }}</text>
        </view>
        <view class="address-action">
          <button class="edit-btn" @click="edit(item)">编辑</button>
          <button class="del-btn" @click="del(item.address_id)">删除</button>
        </view>
      </view>
    </view>
    <view v-else class="empty-tip">
      <text>暂无地址，可通过微信快速添加</text>
    </view>

    <!-- 操作按钮区 -->
    <view class="action-bar">
      <button class="wechat-btn" @tap="getWechatAddress">
        <text class="icon">📍</text>
        微信获取地址
      </button>
      <button class="add-btn" @tap="add">
        <text class="icon">+</text>
        新增地址
      </button>
    </view>
  </view>
</template>

<script>
import { addressApi } from '@/api/address.js';
export default {
  data() {
    return {
      addressLists: []
    };
  },
  onShow() {
    this.getList();
  },
  methods: {
    // 获取地址列表
    async getList() {
      try {
        const user = uni.getStorageSync('userInfo');
        if (!user || !user.user_id) {
          return;
        }
        const res = await addressApi.getAddressList({user_id: user.user_id});
        if (res?.code === 200) {
          this.addressLists = res?.data;
        }
      } catch (err) {
      }
    },

    // 新增地址
    add() {
      uni.navigateTo({ url: '/pages/mine/address-edit' });
    },

    // 编辑地址
    edit(item) {
      uni.navigateTo({
        url: `/pages/mine/address-edit?address=${encodeURIComponent(JSON.stringify(item))}`
      });
    },

    // 删除地址
    async del(address_id) {
      uni.showModal({
        title: '提示',
        content: '确定删除该地址吗？',
        success: async () => {
          const user = uni.getStorageSync('userInfo');
          await addressApi.deleteAddress({ address_id, user_id: user.user_id });
          uni.showToast({ title: '删除成功', icon: 'none' });
          this.getList();
        }
      });
    },
    
    // 微信获取地址
    async getWechatAddress() {
      try {
        const res = await new Promise((resolve, reject) => {
          uni.chooseAddress({
            success: resolve,
            fail: reject
          });
        });
        const user = uni.getStorageSync('userInfo');
        
        await addressApi.addAddress({
          user_id: user.user_id,
          name: res.userName,
          phone: res.telNumber,
          province: res.provinceName,
          city: res.cityName,
          county: res.districtName,
          detail: res.detailInfo,
          is_default: 0
        });

        uni.showToast({ title: '添加成功', icon: 'none' });
        this.getList(); 
      } catch (err) {
        uni.showToast({ title: '获取失败', icon: 'none' });
      }
    }
  }
};
</script>

<style scoped>
/* 页面容器 */
.address-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
}

/* 地址列表 */
.address-list {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}
.address-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}
.address-item:last-child {
  border-bottom: none;
}
.address-top {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 10rpx;
}
.name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}
.phone {
  font-size: 28rpx;
  color: #666;
}
.default-tag {
  background-color: #07c160;
  color: #fff;
  font-size: 20rpx;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}
.address-detail {
  font-size: 26rpx;
  color: #999;
  display: block;
  line-height: 1.5;
}
.address-action {
  display: flex;
  gap: 10rpx;
}
.edit-btn, .del-btn {
  font-size: 24rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
}
.edit-btn {
  background-color: #f0f0f0;
  color: #666;
}
.del-btn {
  background-color: #ff4444;
  color: #fff;
}

/* 空状态 */
.empty-tip {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 操作按钮区 */
.action-bar {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}
.wechat-btn, .add-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}
.wechat-btn {
  background-color: #07c160;
  color: #fff;
}
.add-btn {
  background-color: #fff;
  color: #333;
  border: 1rpx solid #eee;
}
.icon {
  font-size: 32rpx;
}
</style>