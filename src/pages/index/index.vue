  <template>
  <div class="idle-fish-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="search-container">
        <uni-search-bar
          v-model="searchValue"
          cancelButton="none"
          clearButton="always" 
          placeholder="请输入名称筛选商品"
          @confirm="handleSearch"
          @clear="handleClear"
        />
      </div>
      <!-- <div class="nav-tabs">
        <span class="active" @click="navigateTo('猜你喜欢', $event)">猜你喜欢</span>
        <span @click="navigateTo('最新发布', $event)">最新发布</span>
        <span @click="navigateTo('美妆小样', $event)">美妆小样</span>
        <span @click="navigateTo('稀缺潮玩', $event)">稀缺潮玩</span>
        <span @click="navigateTo('自用数码', $event)">自用数码</span>
      </div> -->
    </div>

    <!-- 中部商品展示区 -->
    <div class="product-display">
      <div class="product-grid" :class="viewMode === 'single' ? 'single-column' : 'double-column'" v-if="products.length">
        <div class="product-card" v-for="(product, index) in products" :key="index" @click="toDetail(product)">
          <img :src="product.image_url" alt="商品图片" class="product-image" />
          <div class="product-title">{{ product.name }}</div>
          <div class="product-meta">
            <span class="want-count">{{ product.description }}</span>
          </div>
          <div class="product-price">￥{{ product.price }}</div>
          <!-- <div class="product-meta">
            <span class="want-count">{{ product.wantCount || 2 }}人想要</span>
            <span class="seller-info">{{ product.seller || 1 }}</span>
          </div> -->
        </div>
      </div>

    <view class="empty-container" v-else>
      <uni-icons type="info" size="60" color="#999"></uni-icons>
      <text class="empty-text">暂无相关商品，换个关键词试试吧</text>
    </view>
    </div>

    <!-- 底部提示栏 -->
    <!-- <div class="bottom-tip">
      <span class="tip-text">暂无信息，请先登录</span>
      <button class="login-btn">马上登录</button>
    </div> -->
    <TabBar defaultTab="home" />
  </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import { goodsApi } from '@/api/goods.js'
export default {
  name: 'IdleFishIndex',
  components: {  TabBar },
  data() {
    return {
      products: [],
      // products: [
      //   {
      //     image: '/src/static/logo.png',
      //     title: '个人出售dji大疆osmo pocket',
      //     price: '¥20',
      //     wantCount: 417,
      //     seller: 'mrten先生 芝麻信用极好'
      //   },
      //   {
      //     image: '/src/static/logo.png',
      //     title: 'AirPods Pro 2 个人闲置',
      //     price: '¥300',
      //     wantCount: 523,
      //     seller: '青岛优... 芝麻信用优秀'
      //   },
      //   {
      //     image: '/src/static/logo.png',
      //     title: '全新未拆封iPhone 14 Pro',
      //     price: '¥8500',
      //     wantCount: 1245,
      //     seller: '科技爱好者 芝麻信用极好'
      //   },
      //   {
      //     image: '/src/static/logo.png',
      //     title: 'Nike Air Max 90 全新',
      //     price: '¥650',
      //     wantCount: 328,
      //     seller: '运动达人 芝麻信用优秀'
      //   }
      // ],
      searchValue: '',
      viewMode: 'double' // 初始为双排模式
    };
  },

   mounted() {
    this.getGoodsList()
  },

  methods: {
    async getGoodsList() {
      const listRes = await goodsApi.getGoodsList({name: this.searchValue})
      this.products = listRes.data?.map(item => ({
        ...item,
        image_url: item.image_url?.split(',')[0], // 首页只展示第一张图片
      }))
    },

    handleClear(){
      this.searchValue = ''
      this.getGoodsList()
    },
    handleSearch(){
      this.getGoodsList()
    },
    navigateTo(tabName, event) {
      // 移除所有活动状态
      const tabs = document.querySelectorAll('.nav-tabs span');
      tabs.forEach(tab => tab.classList.remove('active'));
      
      // 为当前点击的标签添加活动状态
      if (event && event.target) {
        event.target.classList.add('active');
      }
      
      // 这里可以添加切换标签页的具体逻辑
      console.log('切换到标签:', tabName);
    },
    toDetail(product) {
      uni.navigateTo({url: `/pages/index/goods-detail?goods_id=${product.goods_id}`})
    },
  }
};
</script>

<style scoped>
/* 基础布局 */
.idle-fish-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90rpx);
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  background-color: #ceec9d;
  padding: 10px;
}

.search-container {
  background-color: #fff;
  border-radius: 20px;
  padding: 5px 15px;
  margin-bottom: 10px;
}

.search-box {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 5px 0;
}

.nav-tabs {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding-bottom: 5px;
}

.nav-tabs span {
  white-space: nowrap;
  font-size: 14px;
  color: #333;
  padding: 3px 0;
}

.nav-tabs span.active {
  font-weight: bold;
  border-bottom: 2px solid #333;
}

/* 商品展示区 */
.product-display {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.view-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  gap: 10px;
}

.view-toggle button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

.view-toggle button:hover {
  background-color: #ceec9d;
  color: #333;
  transform: scale(1.05);
}

.view-toggle button.active {
  background-color: #ceec9d;
  color: #333;
  border-color: #ceec9d;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.single-column .product-card {
  width: 100%;
  margin-bottom: 10px;
}

.double-column .product-card {
  width: calc(50% - 5px);
  margin-bottom: 10px;
}

/* 添加图标样式 */
.icon-single, .icon-double {
  font-size: 24px;
}

.product-card {
  width: calc(50% - 5px);
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  padding-bottom: 10rpx;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.product-title {
  font-size: 13px;
  padding: 8px;
  line-height: 1.4;
  /* height: 40px; */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  color: #ff4400;
  font-size: 16px;
  font-weight: bold;
  padding: 0 8px;
}

.product-meta {
  font-size: 11px;
  color: #999;
  padding: 5px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  height: 72rpx;
}

/* 底部提示栏 */
.bottom-tip {
  background-color: #ceec9d;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
}

.tip-icon {
  font-size: 20px;
}

.tip-text {
  flex: 1;
  font-size: 14px;
}

.login-btn {
  background-color: #000;
  color: #ceec9d;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #999;
}
.empty-text {
  margin-top: 20rpx;
  font-size: 28rpx;
}
.empty-btn {
  margin-top: 30rpx;
  padding: 10rpx 30rpx;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
}

</style>