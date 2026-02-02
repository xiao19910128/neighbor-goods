<template>
  <div class="publish-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <span class="back-btn" @click="goBack">← 返回</span>
      <span class="page-title">发布闲置</span>
      <span class="submit-btn" @click="submitForm">发布</span>
    </div>

    <!-- 表单内容区 -->
    <div class="form-container">
      <!-- 商品图片上传 -->
      <div class="image-upload-section">
        <div class="upload-title">添加商品图片（最多9张）</div>
        <div class="image-upload-area">
          <div class="add-image-btn">+</div>
          <!-- 已上传图片占位符 -->
          <div class="uploaded-image" v-for="i in 3" :key="i">
            <img src="/src/static/logo.png" alt="商品图片" />
            <span class="delete-image-btn">×</span>
          </div>
        </div>
      </div>

      <!-- 商品信息表单 -->
      <form class="product-form">
        <!-- 商品标题 -->
        <div class="form-group">
          <label class="form-label">商品标题</label>
          <input type="text" class="form-input" placeholder="请输入商品标题，清晰描述商品特点" />
        </div>

        <!-- 商品描述 -->
        <div class="form-group">
          <label class="form-label">商品描述</label>
          <textarea class="form-textarea" placeholder="请详细描述商品情况，包括品牌、型号、使用时间、成色等信息"></textarea>
        </div>

        <!-- 商品分类 -->
        <div class="form-group">
          <label class="form-label">商品分类</label>
          <select class="form-select">
            <option value="">请选择分类</option>
            <option value="digital">数码产品</option>
            <option value="clothes">服装鞋帽</option>
            <option value="home">家居用品</option>
            <option value="beauty">美妆护肤</option>
            <option value="other">其他分类</option>
          </select>
        </div>

        <!-- 商品价格 -->
        <div class="form-group price-group">
          <label class="form-label">商品价格</label>
          <div class="price-input-container">
            <span class="currency-symbol">¥</span>
            <input type="number" class="price-input" placeholder="0" />
          </div>
        </div>

        <!-- 商品状态 -->
        <div class="form-group">
          <label class="form-label">商品状态</label>
          <div class="status-options">
            <label class="status-option">
              <input type="radio" name="status" value="new" /> 全新未使用
            </label>
            <label class="status-option">
              <input type="radio" name="status" value="like-new" /> 几乎全新
            </label>
            <label class="status-option">
              <input type="radio" name="status" value="used" /> 轻微使用痕迹
            </label>
            <label class="status-option">
              <input type="radio" name="status" value="heavily-used" /> 明显使用痕迹
            </label>
          </div>
        </div>

        <!-- 交易方式 -->
        <div class="form-group">
          <label class="form-label">交易方式</label>
          <div class="trade-options">
            <label class="trade-option">
              <input type="checkbox" name="trade-type" value="online" /> 线上交易
            </label>
            <label class="trade-option">
              <input type="checkbox" name="trade-type" value="offline" /> 当面交易
            </label>
          </div>
        </div>
      </form>
    </div>

    <TabBar defaultTab="publish" />
  </div>
</template>

<script>
import TabBar from '../../components/TabBar.vue'
export default {
  name: 'PublishPage',
  components: {  TabBar },
  methods: {
    goBack() {
      // 返回上一页逻辑
      console.log('返回上一页');
    },
    submitForm() {
      // 提交表单逻辑
      console.log('提交发布表单');
    }
  }
};
</script>

<style scoped>
/* 基础布局 */
.publish-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90rpx);
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  background-color: #fbeaea;
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.submit-btn {
  font-size: 16px;
  color: #ff4400;
  font-weight: bold;
  cursor: pointer;
}

/* 表单内容区 */
.form-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

/* 图片上传区域 */
.image-upload-section {
  margin-bottom: 20px;
}

.upload-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.image-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.add-image-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.uploaded-image {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0,0,0,0.5);
  color: #fff;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

/* 表单样式 */
.product-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-input, .form-textarea, .form-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.price-group {
  position: relative;
}

.price-input-container {
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 10px;
  top: 35px;
  font-size: 14px;
  color: #333;
}

.price-input {
  padding-left: 25px;
  width: 100%;
}

.status-options, .trade-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.status-option, .trade-option {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #333;
}

.status-option input, .trade-option input {
  margin: 0;
}
</style>