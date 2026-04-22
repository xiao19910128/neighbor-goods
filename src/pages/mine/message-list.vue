<template>
  <view class="message-page">
    <!-- 会话列表 -->
    <view v-if="!sessionList?.length" class="empty-tip">
      <uni-icons type="chatboxes-filled" size="60" color="#999"></uni-icons>
      <text>暂无信息</text>
    </view>
    <view class="session-list">
      <view 
        class="session-item" 
        v-for="item in sessionList" 
        :key="item.to_user_id"
        @click="goChat(item)"
      >
        <image :src="item.avatar_url" class="avatar"></image>
        <view class="session-info">
          <view class="top">
            <text class="nickname">{{ item.username }}</text>
            <text class="time">{{ item.last_time }}</text>
          </view>
          <view class="bottom">
            <text class="last-msg">{{ item.content }}</text>
            <text class="unread" v-if="item.unread_count > 0">{{ item.unread_count }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { messageApi } from '@/api/message.js';
export default {
data() {
    return {
      sessionList: [],
      userInfo: {}
    }
  },
  onLoad() {
    this.userInfo = uni.getStorageSync('userInfo') || {}
    const { user_id } = this.userInfo
    if (!user_id) {
      uni.navigateTo({ url: '/pages/login/index' })
      return 
    }
    this.getSessionList()
    // 定时刷新会话列表（实时更新未读）
    this.timer = setInterval(() => this.getSessionList(), 3000)
  },
  onUnload() {
    clearInterval(this.timer)
  },
  methods: {
    // 获取会话列表
    async getSessionList() {
      try {
        const res = await messageApi.messageLists({ user_id: this.userInfo?.user_id  })
        if (res.code === 200) {
          this.sessionList = res.data
        }
      } catch (err) {}
    },
    // 跳聊天页
    goChat({ other_user_id, order_id='', username, session_id }) {
      let url = `/pages/chat/chat?to_user_id=${other_user_id}&order_id=${order_id}&nickname=${username}&session_id=${session_id}`
      if (!order_id &&  !['null', 'undefined'].includes(order_id))
      uni.navigateTo({ 
        url: `/pages/chat/chat?to_user_id=${other_user_id}&order_id=${order_id}&nickname=${username}&session_id=${session_id}` 
      })
    }
  }
}
</script>

<style scoped>
.message-page {
  background: #f7f8fa;
  min-height: 100vh;
}
.session-list {
  padding: 20rpx;
}
.session-item {
  display: flex;
  gap: 20rpx;
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  /* margin-right: 20rpx; */
}
.session-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.nickname {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}
.time {
  font-size: 24rpx;
  color: #999;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.last-msg {
  font-size: 26rpx;
  color: #666;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.unread {
  background: #ff3333;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  min-width: 30rpx;
  text-align: center;
}

/* 空状态 */
.empty-tip {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
}

</style>