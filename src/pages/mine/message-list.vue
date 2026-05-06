<template>
  <view class="message-page">
    <!-- 未登录：显示微信登录按钮 -->
    <view v-if="!isLogin" class="no-login">
      <view class="login-tip">还没有登录，请先登录</view>
      <button class="go-login" @click="uni.navigateTo({ url: '/pages/login/index' })">登录</button>
    </view>
    <template v-else>
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
              <text class="last-msg">{{ item?.msg_type === 1 ? '[图片]' : item.content  }}</text>
              <text class="unread" v-if="item.unread_count > 0">{{ item.unread_count }}</text>
            </view>
          </view>
        </view>
      </view>
    </template>
    <!-- <TabBar defaultTab="publish" /> -->
  </view>
</template>
<script>
import TabBar from '@/components/TabBar.vue'
import { messageApi } from '@/api/message.js';
export default {
  name: 'MessageListPage',
  components: { TabBar },
  data() {
    return {
      sessionList: [],
      userInfo: {},
      timer: null, // 清楚轮询的定时器
      isLogin: !!uni.getStorageSync('token')
    }
  },

  onShow() {
    this.userInfo = uni.getStorageSync('userInfo') || {}
    this.isLogin = !!uni.getStorageSync('token')

    // 页面显示 → 重启定时器
    if (this.userInfo?.user_id) {
      this.getSessionList()
      this.startTimer()
    }
  },

  onLoad() {
    // 只做初始化，不启动定时器
    this.userInfo = uni.getStorageSync('userInfo') || {}
    this.isLogin = !!uni.getStorageSync('token')
  },

  // 页面隐藏 → 清除定时器
  onHide() {
    this.clearTimer()
  },

  // 页面卸载 → 清除定时器
  onUnload() {
    this.clearTimer()
  },

  methods: {
    // 启动定时器
    startTimer() {
      // 先清旧的
      this.clearTimer()
      // 3秒刷新一次会话列表
      this.timer = setInterval(() => {
        this.getSessionList()
      }, 3000)
    },

    // 安全清除定时器
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    // 获取会话列表
    async getSessionList() {
      try {
        if (!this.userInfo?.user_id) return
        const res = await messageApi.messageLists({
          user_id: this.userInfo?.user_id
        })
        if (res.code === 200) {
          this.sessionList = res.data
        }
      } catch (err) {}
    },

    // 跳聊天页
    goChat({ other_user_id, order_id = '', username, session_id }) {
      try {
        let url = `/pages/chat/chat?to_user_id=${other_user_id}&order_id=${order_id}&nickname=${username}&session_id=${session_id}`
        uni.navigateTo({ url })
      } catch (e) {}
    }
  }
}
</script>
<style scoped lang="scss">
.message-page {
  background: #f7f8fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 关键：给底部加一条上阴影，和tabBar形成分割 */
.message-page::after {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  bottom: 6rpx;
  height: 10rpx;
  background: linear-gradient(to top, rgba(0,0,0,0.08), transparent);
  pointer-events: none; /* 不影响点击 */
}
.session-list {
  // flex: 1;
  overflow: auto;
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

  .no-login {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    height: 500rpx;
    .login-tip {
      font-size: 36rpx;
      margin-bottom: 20rpx;
    }
    .go-login {
      width: 60%;
      color: #fff;
      background: #F44336;
    }
  }
</style>