<template>
  <view class="order-page">
    <!-- tab 切换：我买到的 / 我卖出的 -->
    <view class="tab-box">
      <view 
        class="tab-item" 
        :class="{ active: currentType === 'buy' }"
        @click="switchTab('buy')"
      >
        我买到的
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentType === 'sell' }"
        @click="switchTab('sell')"
      >
        我卖出的
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <!-- 空状态 -->
      <view v-if="list.length === 0" class="empty-box">
        <image src="/static/empty-order.png" class="empty-img" mode="aspectFit"></image>
        <text class="empty-text">暂无订单</text>
      </view>

      <!-- 订单卡片 -->
      <view class="order-card" v-for="item in list" :key="item.order_id">
        <!-- 订单头 -->
        <view class="order-header">
          <text class="order-no">订单号：{{ item.order_no }}</text>
          <text :class="['order-status', statusMap[item.status].status]">{{ statusMap[item.status].text }}</text>
        </view>

        <!-- 商品信息 -->
        <view class="goods-box">
          <image 
            class="goods-img" 
            :src="item.images[0]"
            mode="aspectFill"
            @error="handleImgErr"
          ></image>
          <view class="goods-info">
            <text class="goods-title">{{ item.goods_title }}</text>
            <text class="goods-price">¥{{ item.goods_price }}</text>
          </view>
        </view>

        <!-- 操作按钮（根据身份 + 状态自动显示） -->
        <view class="btn-box" v-if="item.status !== 4 && item.status !== 5">
          <!-- 我买到的 → 按钮 -->
          <template v-if="currentType === 'buy'">
            <button 
              class="order-btn"
              v-if="item.status === 1"
              @click="updateStatus(item.order_id, 5)"
            >取消订单</button>
            <button 
              v-if="item.status === 2"
              class="order-btn warning"
              @click="updateStatus(item.order_id, 3)"
            >已自提</button>
            <button 
              v-if="item.status === 3"
              class="order-btn primary"
              @click="updateStatus(item.order_id, 4)"
            > 确认完成</button>
          </template>

          <!-- 我卖出的 → 按钮 -->
          <template v-if="currentType === 'sell'">
            <button 
              class="order-btn primary"
              v-if="item.status === 1"
              @click="updateStatus(item.order_id, 2)"
            >确认交易</button>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { orderApi } from '@/api/order'
export default {
  data() {
    return {
      currentType: 'buy', // buy 我买到的 | sell 我卖出的
      list: [],
      statusMap: {
        1: {
          text: '待确认',
          status: 'primary',
        },
        2: {
          text: '待自提',
          status: 'warning',
        },
        3: {
          text: '待收货',
          status: 'primary',
        },
        4: {
          text: '已完成',
          status: 'success',
        },
        5: {
          text: '已取消',
          status: 'error',
        }
      }
    }
  },
  methods: {
    switchTab(tab) {
      this.currentType = tab
      this.getList()
    },

    // 获取订单列表
    async getList() {
      const user = uni.getStorageSync('userInfo')
      if (!user?.user_id) return

      const res = await orderApi.getOrderList({user_id: user.user_id, type: this.currentType })
      if (res.code === 200) {
        this.list = res.data?.map(item=>({
          ...item,
          images: item?.image_url?.split(',') || []
        }))
      }
    },

    // 修改订单状态
    async updateStatus(order_id, status) {
      try {
        const user = uni.getStorageSync('userInfo')
        if (!user?.user_id) return
        await orderApi.updateOrderStatus({order_id, status, user_id: user?.user_id })
        uni.showToast({ title: '操作成功' })
        this.getList()
      } catch (err) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },

    // 图片失败兜底
    handleImgErr(e) {
      e.target.src = '/static/default.png'
    }
  },

  onLoad(options) {
    this.currentType = options.type || ''
    this.getList()
  },
}
</script>

<style scoped lang="scss">
/* 页面 */
.order-page {
  background: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 20rpx;
}

/* tab */
.tab-box {
  display: flex;
  background: #fff;
  margin-bottom: 20rpx;
}
.tab-item {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 30rpx;
  color: #666;
  position: relative;
}
.tab-item.active {
  color: #07c160;
  font-weight: 500;
}
.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background: #07c160;
  border-radius: 3rpx;
}

/* 订单卡片 */
.order-card {
  background: #fff;
  border-radius: 16rpx;
  margin: 0 20rpx 20rpx;
  overflow: hidden;
}

/* 订单头 */
.order-header {
  padding: 24rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f2f3f5;
}
.order-no {
  font-size: 26rpx;
  color: #333;
}
.order-status {
  font-size: 26rpx;
  color: #1ea2f1;
  font-weight: 500;
  &.warning {
    color: #efb240;
  }
  &.error {
    color: #ff3b30;
  }
  &.success {
    color: #07c160;
  }
}

/* 商品区域 */
.goods-box {
  padding: 30rpx;
  display: flex;
  align-items: center;
}
.goods-img {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background: #f2f3f5;
  margin-right: 24rpx;
}
.goods-info {
  flex: 1;
}
.goods-title {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.goods-price {
  font-size: 32rpx;
  color: #ff3b30;
  font-weight: bold;
}

/* 按钮区 */
.btn-box {
  padding: 0 30rpx 30rpx;
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}
.order-btn {
  margin: 0;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 30rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  background: #f2f3f5;
  color: #666;
  border: none;
  &.primary {
    background: #07c160;
    color: #fff;
  }
  &.warning {
    background: #efb240;
    color: #fff;
  }
}

/* 空状态 */
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}
.empty-img {
  width: 300rpx;
  height: 300rpx;
  // opacity: 0.4;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>