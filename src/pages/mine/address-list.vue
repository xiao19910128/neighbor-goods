<template>
  <view class="address-page">
    <!-- 地址列表区 -->
    <view class="address-list">
      <!-- 空状态 -->
      <view v-if="addressLists.length === 0" class="empty-tip">
        <text>暂无地址，可通过微信快速添加</text>
      </view>

      <!-- 地址项（支持点击选择） -->
      <view 
        class="address-item" 
        v-for="item in addressLists" 
        :key="item.address_id"
        :class="{ 'selected': isSelectMode && selectedId === item.address_id }"
        @click="handleSelect(item)"
      >
        <view class="address-info">
          <view class="address-top">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.phone }}</text>
            <text class="default-tag" v-if="item.is_default === 1">默认</text>
          </view>
          <text class="address-detail">
            {{ item.province }}{{ item.city }}{{ item.county }}{{ item.detail }}
          </text>
        </view>

        <!-- 仅在非选择模式下显示编辑/删除 -->
        <view class="address-action" v-if="!isSelectMode">
          <button class="edit-btn" @click.stop="edit(item)">编辑</button>
          <button class="del-btn" @click.stop="del(item.address_id)">删除</button>
        </view>

        <!-- 选择模式下显示选中标记 -->
        <view class="select-tag" v-if="isSelectMode && selectedId === item.address_id">
          ✓
        </view>
      </view>
    </view>

    <!-- 操作按钮区 -->
    <view class="action-bar">
      <button class="wechat-btn" @click="getWechatAddress">
        <text class="icon">📍</text>
        微信获取地址
      </button>
      <button class="add-btn" @click="add">
        <text class="icon">+</text>
        新增地址
      </button>
    </view>

    <!-- 选择模式下的底部确认按钮 -->
    <view class="confirm-bar" v-if="isSelectMode">
      <button class="confirm-btn" @click="confirmSelect" :disabled="!selectedId">
        确认选择
      </button>
    </view>
  </view>
</template>

<script>
import { addressApi } from '@/api/address.js';
import { orderApi } from '@/api/order.js';

export default {
  data() {
    return {
      addressLists: [],
      isSelectMode: false, // 是否为选择模式（从商品详情跳转）
      selectedId: 0,      // 选中的地址ID
      goods_id: 0,       // 下单的商品ID
      userInfo: {},
    };
  },

  onLoad(options) {
    if (options.from === 'buy') {
      this.isSelectMode = true;
      this.goods_id = options.goods_id;
      // 设置导航栏标题
      uni.setNavigationBarTitle({ title: '选择收货地址' });
    }
    this.getList();
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo') || {};
    this.getList();
  },
  methods: {
    // 获取地址列表
    async getList() {
      const { user_id = '' } = this.userInfo;
      if (!user_id) return;
      const res = await addressApi.getAddressList({user_id});
      if (res?.code === 200) {
        this.addressLists = res.data;
        // 自动选中默认地址
        const defaultAddr = res.data.find(item => item.is_default === 1);
        if (defaultAddr) {
          this.selectedId = defaultAddr.address_id;
        }
      }
    },

    // 点击地址项选择
    handleSelect(item) {
      if (!this.isSelectMode) return; // 非选择模式不触发
      this.selectedId = item.address_id;
    },

    // 确认选择（创建订单）
    async confirmSelect() {
      if (!this.selectedId) {
        uni.showToast({ title: '请选择地址', icon: 'none' });
        return;
      }
      const { user_id = '' } = this.userInfo;
      if (!user_id) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        setTimeout(() => {
          uni.navigateTo({ url: '/pages/login/index' })
        }, 300)
        return;
      }
      try {
        // 调用创建订单接口
        const res = await orderApi.createOrder({
          user_id,
          goods_id: this.goods_id,
          address_id: this.selectedId
        });
        if (res.code === 200) {
          uni.showToast({ title: '下单成功' });
          // 跳转到订单列表
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/orders/order-list?type=buy' });
          }, 1000);
        } else {
          uni.showToast({ title: res.msg || '下单失败', icon: 'none' });
        }

      } catch (err) {
        // 异常状态提示信息--账户禁用等
        uni.showToast({ title:  err?.message || err?.msg, icon: 'none' });
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
          const { user_id = '' } = this.userInfo;
          if (!user_id) {
            uni.showToast({ title: '请先登录', icon: 'none' });
            setTimeout(() => {
              uni.navigateTo({ url: '/pages/login/index' })
            }, 300)
            return;
          }
          await addressApi.deleteAddress({ address_id,user_id });
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
        const { user_id = '' } = this.userInfo;
        if (!user_id) {
          uni.showToast({ title: '请先登录', icon: 'none' });
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/index' })
          }, 300)
          return;
        }
        
        await addressApi.addAddress({
          user_id,
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
  padding-bottom: 180rpx;
}

/* 地址列表 */
.address-list {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}
.address-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}
.address-item:last-child {
  border-bottom: none;
}
/* 选中态样式 */
.address-item.selected {
  background-color: #f0f9f4;
  border-radius: 8rpx;
  margin: -20rpx 0;
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

/* 选中标记 */
.select-tag {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #07c160;
  color: #fff;
  text-align: center;
  line-height: 40rpx;
  font-size: 24rpx;
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

/* 底部确认栏 */
.confirm-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;
}
.confirm-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #07c160;
  color: #fff;
  border-radius: 12rpx;
  font-size: 32rpx;
}
.confirm-btn[disabled] {
  background-color: #ccc;
  color: #fff;
}
</style>