<template>
  <view class="detail-page">
    <!-- 订单状态 -->
    <view class="status-bar">
      <text class="status-text">{{ getStatusText(orderInfo.status) }}</text>
    </view>

    <!-- 商品信息 -->
    <view class="goods-card">
      <image :src="orderInfo.image_url" mode="aspectFill" class="goods-img"></image>
      <view class="goods-info">
        <text class="name">{{ orderInfo.name }}</text>
        <text class="price">¥{{ orderInfo.price }}</text>
      </view>
    </view>

    <!-- 交易信息（核心：地点、时间、双方信息） -->
    <view class="info-card">
      <view class="info-item">
        <text class="label">订单号</text>
        <text class="value">{{ orderInfo.order_sn }}</text>
      </view>
      <view class="info-item">
        <text class="label">交易时间</text>
        <text class="value">{{ orderInfo.created_time }}</text>
      </view>
      <view class="info-item">
        <text class="label">交易地点</text>
        <text class="value">{{ orderInfo.trade_address || '待协商' }}</text>
      </view>
      <view class="info-item">
        <text class="label">约定交割时间</text>
        <text class="value">{{ orderInfo.trade_time || '待协商' }}</text>
      </view>
      <view class="info-item">
        <text class="label">{{ isBuyer ? '卖家' : '买家' }}</text>
        <text class="value">{{ orderInfo.opposite_nickname }}</text>
      </view>
      <view class="info-item">
        <text class="label">联系电话</text>
        <text class="value">{{ orderInfo.opposite_phone || '沟通后可见' }}</text>
      </view>
    </view>

    <!-- 底部操作栏（沟通+状态按钮） -->
    <view class="bottom-bar">
      <button 
        class="btn chat"
        @click="goChat(orderInfo.opposite_user_id, orderInfo.order_id, orderInfo.opposite_nickname)"
      >
        沟通
      </button>
      <!-- 状态按钮（根据身份+状态动态显示） -->
      <button 
        v-if="isSeller && orderInfo.status === 1" 
        class="btn confirm"
        @click="confirmOrder(orderInfo.order_id)"
      >
        确认交易
      </button>
      <button 
        v-if="isBuyer && orderInfo.status === 3" 
        class="btn confirm"
        @click="confirmFinish(orderInfo.order_id)"
      >
        确认完成
      </button>
      <button 
        v-if="orderInfo.status !== 4 && orderInfo.status !== 5" 
        class="btn cancel"
        @click="cancelOrder(orderInfo.order_id)"
      >
        取消订单
      </button>
    </view>
  </view>
</template>

<script>
import request from '@/utils/https'
import { orderApi } from '@/api/order'
export default {
  data() {
    return {
      order_id: '',
      orderInfo: {},
      userInfo: {},
      isBuyer: false, // 是否是买家
      isSeller: false // 是否是卖家
    }
  },
  onLoad(options) {
    this.order_id = options.order_id
    this.userInfo = uni.getStorageSync('userInfo') || {}
    this.getOrderDetail()
  },
  methods: {
    // 获取订单详情
    async getOrderDetail() {
      try {
        const res = await orderApi.getOrderDetail({order_id: this.order_id || 49, user_id: this.userInfo.user_id || 9  })
        if (res.code === 200) {
          this.orderInfo = res.data
          // 判断身份：买家=当前用户是订单的buyer_id，卖家=seller_id
          this.isBuyer = this.orderInfo.buyer_id === this.userInfo.user_id
          this.isSeller = this.orderInfo.seller_id === this.userInfo.user_id
        }
      } catch (err) {
        console.error('获取详情失败', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
        uni.navigateBack()
      }
    },
    // 跳聊天页
    goChat(toUserId, orderId, nickname) {
      uni.navigateTo({ 
        url: `/pages/chat/chat?to_user_id=${toUserId}&order_id=${orderId}&nickname=${nickname}` 
      })
    },
    // 订单状态文字
    getStatusText(status) {
      const map = {1:'待确认',2:'待交割',3:'待收货',4:'已完成',5:'已取消'}
      return map[status] || '未知'
    },
    // 确认交易（卖家）
    async confirmOrder(order_id) {
      try {
        await request({
          url: '/api/order/updateStatus',
          method: 'POST',
          data: { order_id, status: 2, user_id: this.userInfo.user_id }
        })
        uni.showToast({ title: '确认成功', icon: 'none' })
        this.getOrderDetail()
      } catch (err) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    // 确认完成（买家）
    async confirmFinish(order_id) {
      try {
        await request({
          url: '/api/order/updateStatus',
          method: 'POST',
          data: { order_id, status: 4, user_id: this.userInfo.user_id }
        })
        uni.showToast({ title: '确认完成', icon: 'none' })
        this.getOrderDetail()
      } catch (err) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    // 取消订单
    async cancelOrder(order_id) {
      try {
        await request({
          url: '/api/order/updateStatus',
          method: 'POST',
          data: { order_id, status: 5, user_id: this.userInfo.user_id }
        })
        uni.showToast({ title: '取消成功', icon: 'none' })
        this.getOrderDetail()
      } catch (err) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.detail-page {
  background: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
/* 状态栏 */
.status-bar {
  background: #fff;
  padding: 30rpx;
  text-align: center;
}
.status-text {
  font-size: 32rpx;
  color: #007aff;
  font-weight: bold;
}
/* 商品卡片 */
.goods-card {
  display: flex;
  background: #fff;
  margin: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
}
.goods-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.name {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 10rpx;
}
.price {
  font-size: 32rpx;
  color: #ff3333;
  font-weight: bold;
}
/* 信息卡片 */
.info-card {
  background: #fff;
  margin: 0 20rpx 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
}
.info-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}
.info-item:last-child {
  border-bottom: none;
}
.label {
  font-size: 28rpx;
  color: #666;
}
.value {
  font-size: 28rpx;
  color: #333;
  max-width: 60%;
  text-align: right;
}
/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx;
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}
.btn {
  font-size: 28rpx;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  border: none;
}
.chat {
  background: #f0f0f0;
  color: #333;
}
.confirm {
  background: #07c160;
  color: #fff;
}
.cancel {
  background: #f0f0f0;
  color: #666;
}
</style>