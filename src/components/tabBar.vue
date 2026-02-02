<template>
  <!-- 底部导航栏 -->
  <div class="bottom-tab">
    <div :class="[currentTab === item.type?'active':'', 'tab-item']" v-for="(item,index) in tabs" :key="index" @click="switchBottomTab(item)">
      <uni-icons :type="item.icon" size="30"></uni-icons>
      <span class="text">{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    defaultTab: {
      type: String,
      default: 'home'
    }
  },
data() {
    return {
      currentTab: this.defaultTab,
      // 底部tab的名称列表，用于动态生成底部导航项
      tabs: [
        { name: '闲置中心', type:'home', icon: 'home-filled', url: '/pages/index/index' }, 
        { name: '发布', type:'publish', icon: 'cloud-upload-filled', url: '/pages/publish/index' },
        { name: '消息', type:'chatboxes', icon: 'chatboxes-filled', url: '/pages/message/index' },
        { name: '我的', type:'mine', icon: 'person-filled', url: '/pages/mine/index' }
      ]
    }
  },
  methods: {
    switchBottomTab({type='', url='/pages/index/index'}) {      
      this.currentTab = type;
      uni.navigateTo({ url });
    }
  }
}
</script>

<style scoped>

/* 底部tab栏 */
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
  color: #ff7676;
}
.tab-item.active  .uni-icons {
  color: #fbeaea!important;
}

.sell-tab {
  position: relative;
}

.sell-tab .icon-sell {
  background-color: #cf4310;
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
</style>