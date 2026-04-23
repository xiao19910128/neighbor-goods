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
      <view v-if="list.length === 0" class="empty-box" @click="getList">
        <uni-icons type="refreshempty" size="60"></uni-icons>
        <text class="empty-text">暂无订单</text>
      </view>

      <!-- 订单卡片 -->
      <view class="order-card" v-for="item in list" :key="item.order_id" @click="goDetail(item)">
        <!-- 订单头 -->
        <view class="order-header">
          <text class="order-no">订单号：{{ item.order_no }}</text>
          <text :class="['order-status', statusMap[item.order_status].order_status]">{{ statusMap[item.order_status]?.text }}</text>
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
        <view class="btn-box">
          <template v-if="item.order_status !== 4 && item.order_status !== 5">
            <!-- 我买到的 → 按钮 -->
            <template v-if="currentType === 'buy'">
              <button 
                class="order-btn"
                v-if="item.order_status === 1"
                @click.stop="updateStatus(item.order_id, 5)"
              >取消订单</button>
              <button 
                v-if="item.order_status === 2"
                class="order-btn warning"
                @click.stop="updateStatus(item.order_id, 3)"
              >已自提</button>
              <button 
                class="order-btn error"
                v-if="item.order_status === 2"
                @click.stop="refundOrder(item.order_id)"
              >退单</button>
            </template>

            <!-- 我卖出的 → 按钮 -->
            <template v-if="currentType === 'sell'">
              <button 
                class="order-btn primary"
                v-if="item.order_status === 1"
                @click.stop="updateStatus(item.order_id, 2)"
              >确认交易</button>
              <!-- 卖家确认完成，订单结束 -->
              <button 
                v-if="item.order_status === 3 && item.seller_id === userInfo.user_id"
                class="order-btn warning"
                @click.stop="updateStatus(item.order_id, 4)"
              > 确认完成</button>
            </template>
          </template>
          <button 
            class="order-btn primary"
            @click.stop="goChat(item)"
          >沟通</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { orderApi } from '@/api/order'
import { messageApi } from '@/api/message.js';
export default {
  data() {
    return {
      userInfo: uni.getStorageSync('userInfo') || {},
      currentType: 'buy', // buy 我买到的 | sell 我卖出的
      list: [],
      statusMap: {
        1: {
          text: '待确认',
          order_status: 'primary',
        },
        2: {
          text: '待自提',
          order_status: 'warning',
        },
        3: {
          text: '待收货',
          order_status: 'primary',
        },
        4: {
          text: '已完成',
          order_status: 'success',
        },
        5: {
          text: '已取消',
          order_status: 'error',
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
        const { user_id = '' } = this.userInfo
      if (!user_id) return

      const res = await orderApi.getOrderList({user_id, type: this.currentType })
      if (res.code === 200) {
        this.list = res.data?.map(item=>({
          ...item,
          images: item?.image_url?.split(',') || []
        }))
      }
    },

    // 修改订单状态
    async updateStatus(order_id, order_status) {
      try {
        const { user_id = '' } = this.userInfo
        if (!user_id) return
        await orderApi.updateOrderStatus({order_id, order_status, user_id })
        uni.showToast({ title: '操作成功' })
        this.getList()
      } catch (err) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    // 退单
    async refundOrder(order_id) {
      uni.showModal({
        title: '确认退单',
        content: '确定要取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            this.updateStatus(order_id, 5)
          }
        }
      })
    },

    // 图片失败兜底
    handleImgErr(e) {
      e.target.src = '/static/default.png'
    },

    // 跳订单详情
    goDetail({order_id}) {
      uni.navigateTo({ url: `/pages/orders/detail?order_id=${order_id}&currentType=${this.currentType}` })
    },
    // 跳聊天页（传对方ID、订单ID、对方昵称）
    async goChat({ seller_id, order_id, opposite_nickname, user_id }) {
      const new_buy_id = this.currentType === 'sell' ? seller_id : user_id
      const new_seller_id = this.currentType === 'buy' ? seller_id : user_id
      // 调用接口获取 session_id
      const res = await messageApi.getSessionByUserPair({
        user1_id: new_buy_id,
        user2_id: new_seller_id
      });  
      if (res.code === 200 && res?.session_id) {        
        uni.navigateTo({ 
          url: `/pages/chat/chat?to_user_id=${new_seller_id}&order_id=${order_id}&nickname=${opposite_nickname}&session_id=${res.session_id}` 
        })
      } else {
        uni.showToast({ title: '获取会话失败', icon: 'none' })
      }
    },
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo')
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