<template>
  <view class="publish-page">
    <!-- 未登录 -->
    <view v-if="!isLogin" class="no-login">
      <view class="login-tip">还没有登录，请先登录</view>
      <button class="go-login" @click="uni.navigateTo({ url: '/pages/login/index' })">登录</button>
    </view>
    <!-- 已登录--可发布闲置 -->
    <view v-else class="main-publish">
      <view class="form-container">
        <!-- 商品图片上传 -->
        <view class="form-item">
          <view class="upload-title">添加商品图片（最多9张）</view>
          <view class="upload-list">
            <!-- 已上传图片 -->
            <view 
              class="upload-item" 
              v-for="(item, index) in goodsImages" 
              :key="index"
              @click.stop="handlePreview(item, index)"
            >
              <image :src="item" class="upload-img" mode="aspectFill" crossorigin="anonymous" />
              <view class="upload-delete" @click.stop="handleDelete(index)">×</view>
            </view>
            <!-- 添加图片按钮 -->
            <view 
              class="upload-item upload-add" 
              v-if="goodsImages.length < 9"
              @click.stop="handleChooseImage"
            >
              <view class="upload-add-icon">+</view>
            </view>
          </view>
        </view>

        <!-- 商品标题 -->
        <view class="form-item">
          <text class="label">商品标题</text>
          <input v-model="form.name" placeholder="请输入商品标题" />
        </view>

        <!-- 商品价格 -->
        <view class="form-item">
          <text class="label">价格（元）</text>
          <input
            :key="inputKey"
            :value="form.price"
            type="digit"
            placeholder="0.00"
            @input="handlePriceInput"
            maxlength="10"
          />
        </view>
        <!-- 地址区域配置 -->
        <view class="address-section form-item">
          <text class="label">自提地址（地址库/手动创建二选一）</text>
          <view class="address-content">
            <!-- 2. 街道/社区选择 -->
            <picker :range="streetList" @change="handleStreetChange">
              <view class="picker-text">当前社区：{{ form?.street || form?.streetName }}</view>
            </picker>
              <button 
                v-if="addressLists.length"
                class="choose-address-btn"
                @click="handleChooseAddress"
              >选择自提地址</button>
            </view>

          <!-- 3. 详细地址（精确到小区/门口） -->
          <input 
            placeholder="请输入详细地址（如：阳光花园3栋）" 
            v-model="form.detail_address" 
          />
        </view>

        <!-- 平铺分类选择 -->
        <view class="form-item">
          <text class="label">商品分类</text>
          <view class="category-list">
            <view
              v-for="cat in categoryList"
              :key="cat.category_id"
              :class="['category-item', { active: form.category_id === cat.category_id }]"
              @click.stop="selectCategory(cat.category_id)"
            >
              {{ cat.name }}
            </view>
          </view>
        </view>

        <!-- 商品描述（包含成色/品牌等信息） -->
        <view class="form-item">
          <text class="label">商品描述（可填写成色、品牌、使用情况等）</text>
          <textarea v-model="form.description" placeholder="例如：99新小米14，全套配件，无拆无修..." />
        </view>
      </view>
      <view class="footer-box">
        <button class="publish-btn" @click.stop="publishGoods">发布闲置</button>
      </view>
    </view>

    <!-- 地址选择抽屉 -->
    <view class="address-drawer" :class="{ show: showAddressDrawer }" @click="closeAddressDrawer">
      <view class="drawer-content" @click.stop>
        <view class="drawer-header">
          <text>选择自提地址</text>
          <text class="close" @click="closeAddressDrawer">关闭</text>
        </view>

        <scroll-view scroll-y class="address-list">
          <view 
            class="address-item" 
            v-for="item in addressLists" 
            :key="item.address_id"
            @click="selectAddress(item)"
          >
            <view class="name">{{ item.contact_name }}</view>
            <view class="phone">{{ item.contact_phone }}</view>
            <view class="addr">
              {{ item.province }} {{ item.city }} {{ item.district }} {{ item.street }} {{ item.detail_address }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- <TabBar defaultTab="publish" /> -->
  </view>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import { goodsApi } from '@/api/goods';
import { categoryApi } from '@/api/category';
import { addressApi } from '@/api/address';
const initialData = {
  price: '',
  category_id: null, // 选中的分类ID
  description: '',
  province: '',
  city: '',
  name: '',
  contact_name: '',
  contact_phone: '',
  district: '',
  address_id: null,
  street: '梅陇镇',
  detail_address: '',
  streetName: '梅陇镇',
};
export default {
  name: 'PublishPage',
  components: {  TabBar },
  data() {
    return {
      categoryList: [], // 分类列表
      goodsImages: [], // 存储已上传的图片信息
      form: { ...initialData},
      // 省市区联动
      regionValue: ['上海市', '上海市', '闵行区'],
      // 街道列表（可以根据 district 动态加载）
      streetList: ['梅陇镇','莘庄镇', '七宝镇', '颛桥镇', '华漕镇', '虹桥镇', '吴泾镇', '马桥镇', '浦江镇', '江川路街道', '古美街道', '新虹街道', '浦锦街道', '莘庄工业区'], 
      streetId: '',
      goodsId: '', // 编辑模式下，商品的ID
      isLogin: !!uni.getStorageSync('token'),
      userInfo: {}, // 用户信息
      isUploadingImage: false, // 控制是否清空--uni-app机制问题优化（chooseImage/uploadFile，系统会触发页面的onShow生命周期），要标记这种情况不清空页面的数据
      addressLists: [],
      showAddressDrawer: false, // 控制抽屉显示/隐藏
      inputKey: 0, // 解决input输入框无法更新的问题
    };
  },
  
  async onShow() {
    // 从登录页返回时需要更新token状态，重新判断是否登录
    this.isLogin = !!uni.getStorageSync('token');
    this.userInfo = uni.getStorageSync('userInfo') || {};
    const goods_id = uni.getStorageSync('edit_goods_id');    
    await this.loadCategories();
    await this.getAddressLists()
    // 【正在上传图片】→ 绝对不清空任何数据
    if (this.isUploadingImage) {
      setTimeout(() => {
        this.isUploadingImage = false;
      }, 100);
      return;
    }
    if (goods_id) {
      this.goodsId = goods_id || '';
      this.isUploadingImage = true // 详情查看无需清空
      // 有参数，说明是编辑商品，加载商品数据
      this.getGoodsDetail(goods_id);
      // 读取后立刻清空，避免下次进入还带着旧参数
      uni.removeStorageSync('edit_goods_id');
      return
    } 
    // 【只有全新发布时】→ 才清空表单和图片！
    if (!this.goodsId && !edit_goods_id) {
      this.form = { ...initialData };
      this.goodsImages = [];
    }

    // 上传图片时不清空
    if (this.isUploadingImage) {
      setTimeout(()=>{
        this.isUploadingImage = false;
      }, 100)
      return
    };
    this.goodsImages = []; // 清空图片列表，避免编辑时残留旧数据
    this.form = { ...initialData };
  },
  methods: {
    // 加载分类列表
    async loadCategories() {
      try {
        const res = await categoryApi.getCategoryList();
        if (res?.code === 200) {
          this.categoryList = res?.data;
        }
      } catch (err) {
        uni.showToast({ title: '加载分类失败', icon: 'none' });
      }
    },
    // 选择分类
    selectCategory(id) {
      this.form.category_id = id;
    },
    // 发布商品
    async publishGoods() {
      // 简单校验
      if (!this.form?.name) return uni.showToast({ title: '请输入商品标题', icon: 'none' });
      if (!this.form?.price) return uni.showToast({ title: '请输入商品价格', icon: 'none' });
      if (!this.form?.category_id) return uni.showToast({ title: '请选择商品分类', icon: 'none' });
      if (!this.form?.street) return uni.showToast({ title: '请选择社区信息', icon: 'none' });
      if (!this?.goodsImages?.length) return uni.showToast({ title: '请补充商品图片信息', icon: 'none' });
      const  nickName  = this.userInfo?.nickName || this.userInfo?.nick_name;
      const  phone  = this.userInfo?.phone || '13312345678';
      try {
        const params = {
          ...this.form,
          image_url: this.goodsImages?.join(','),
          publisher_name: this.form?.contact_name || nickName,
          user_id:this.userInfo?.user_id,
          publisher_id:this.userInfo?.user_id,
          address_id: this.form?.address_id || 0, // 关键：发布时绑定地址
          contact_name: this.form?.contact_name || nickName,
          contact_phone: this.form?.contact_phone || phone,
        }
        let publishRes = null;        
        if (this.goodsId) {
          // 编辑模式：调用更新接口
          publishRes = await goodsApi.updateGoods({
            ...params,
            goods_id: this.goodsId,
          });
        } else {
          // 发布模式：调用发布接口
          publishRes = await goodsApi.publishGoods(params);
        }        
        if (publishRes?.code === 200) {
          uni.showToast({ title: '发布成功，等待审核', icon: 'none' });
          // 重置表单
          this.form = { ...initialData };
          // 跳转到我的发布列表
          uni.navigateTo({ url: '/pages/mine/publish-list?from=publish' });
        } else {
          uni.showToast({ title: publishRes.msg, icon: 'none' });
        }
      } catch (err) {
        // 异常状态提示信息--账户禁用等
        uni.showToast({ title:  err?.message || err?.msg, icon: 'none' });
      }
    },
    
    // 查询闲置详情
    async getGoodsDetail(goodsId) {
      this.form = { ...initialData };
      if (!goodsId) return
      try {
        const res = await goodsApi.getGoodsDetail({ goods_id: goodsId });
        const {data, code} = res
        if (code === 200) {
          // 回填表单数据
          this.form = {
            ...data,
          };
          this.goodsImages = data?.image_url?.length ? data?.image_url?.split(',') : [];
          // 页面标题改为“编辑闲置”
          uni.setNavigationBarTitle({ title: '编辑闲置' });
          // 按钮文字改为“更新闲置”
          this.btnText = '更新闲置';
        }
      } catch (err) {
        uni.showToast({ title: '获取商品详情失败', icon: 'none' });
      }
    },
    async handleChooseImage() {
      try {
        this.isUploadingImage = true; // 标记上传图片，无需清空页面填的信息
        // 强制保证数组永远不为空--防止编辑时丢失图片
        const currentImages = this.goodsImages || [];
        const remain = 9 - currentImages.length;
        // 没位置了直接提示
        if (remain <= 0) {
          uni.showToast({ title: '最多上传9张', icon: 'none' });
          return;
        }
        // 1. 选择图片
        const res = await uni.chooseImage({
          count: remain,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        });

        const tempFilePaths = res.tempFilePaths;
        if (!tempFilePaths || tempFilePaths.length === 0) return;

        // 2. 串行上传
        const newImages = [];
        for (const path of tempFilePaths) {
          const url = await this.uploadImage(path);
          if (url && typeof url === 'string') {
            newImages.push(url);
          }
        }

        // 永远基于旧数组拼接，绝对不覆盖
        const finalImages = [...currentImages, ...newImages];
        this.$set(this, 'goodsImages', finalImages);
        uni.showToast({
          title: `成功上传 ${newImages.length} 张`,
          icon: 'none'
        });
      } catch (err) {
        console.error('取消上传：', err);
      } finally {
        // this.isUploadingImage = false;
      }
    },

    // 上传图片方法，封装上传逻辑
    async uploadImage(path) {
      return new Promise((resolve) => {
        uni.uploadFile({
          url: 'http://192.168.3.116:3000/api/upload/image',
          filePath: path,
          name: 'file',
          success: (uploadRes) => {
            try {
              const data = JSON.parse(uploadRes.data);
              if (data?.code === 200) {
                const url = typeof data.data === 'string' ? data.data : data.data?.url;
                resolve(url || null);
              } else {
                resolve(null);
              }
            } catch (e) {
              resolve(null);
            }
          },
          fail: () => resolve(null)
        });
      });
    },

    // 上传图片到服务器
    uploadImageToServer(tempFilePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: 'http://localhost:5173/api/upload/image', 
          filePath: tempFilePath,
          name: 'file',
          success: (uploadRes) => {
            const data = JSON.parse(uploadRes.data);
            if (data.code === 200) {
              // 直接使用后端返回的公共 URL，不需要替换
              resolve(data.data.url);
            } else {
              uni.showToast({ title: data.message, icon: 'none' });
              reject();
            }
          },
          fail: (err) => {
            uni.showToast({ title: '图片上传失败', icon: 'none' });
            reject(err);
          }
        });
      });
    },

    // 图片预览核心方法
    handlePreview(currentImg, currentIndex) {
      // 调用 uni-app 原生预览图片 API
      uni.previewImage({
        current: currentIndex,  // 当前预览图片的索引
        urls: this.goodsImages,    // 所有可预览的图片 URL 数组
        loop: true,             // 支持循环预览
        longPressActions: {     // 长按图片操作（可选）
          itemList: ['保存图片', '取消'],
          success: (res) => {
            if (res.tapIndex === 0) {
              // 保存图片到本地
              uni.saveImageToPhotosAlbum({
                filePath: currentImg,
                success: () => {
                  uni.showToast({ title: '保存成功', icon: 'success' });
                },
                fail: () => {
                  uni.showToast({ title: '保存失败', icon: 'none' });
                }
              });
            }
          }
        }
      });
    },
    // 删除图片
    handleDelete(index) {
      this.goodsImages.splice(index, 1);
    },
    async getUserLocation() {
      try {
        // 不管是浏览器还是真机，都直接固定为梅陇镇
        this.regionValue = ['上海市', '上海市', '闵行区'];
        this.detailAddress = '请输入小区/楼栋';
        uni.showToast({ title: '已定位到梅陇镇（社区默认）', icon: 'none' });
      } catch (err) {
        uni.showToast({ title: '定位失败，默认选择梅陇镇', icon: 'none' });
          uni.hideLoading();
        }
    },


    // 1. 处理省市区变化
    handleRegionChange(e) {
      const { code, value } = e.detail;
      this.form.province = value[0];
      this.form.city = value[1];
      this.form.district = value[2];
    },

    // 2. 处理街道/社区变化
    handleStreetChange(e) {
      this.form.street = this.streetList[e.detail.value];
      this.form.streetName = this.streetList[e.detail.value];
    },


    // 获取地址列表
    async getAddressLists() {
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

    // 打开地址抽屉
    handleChooseAddress() {
      this.showAddressDrawer = true;
    },

    // 关闭地址抽屉
    closeAddressDrawer() {
      this.showAddressDrawer = false;
    },
    // 选择地址 → 自动回填
    selectAddress(item) {
      this.form = { ...this.form, ...item }
      this.showAddressDrawer = false;
    },

    handlePriceInput(e) {
      let value = e.detail.value || '';
      // 只保留数字和小数点
      value = value.replace(/[^\d.]/g, '');
      let filteredValue = value;
      // 只保留一个小数点
      const pointCount = value?.split('.').length - 1;
      if (pointCount > 1) {
        value = value.substring(0, value.lastIndexOf('.'));
      }
      // 限制两位小数
      const pointIndex = value.indexOf('.');
      if (pointIndex !== -1) {
        value = value.substring(0, pointIndex + 3);
      }
      // 禁止负数
      value = value.replace(/-/g, '');
      // 清理开头多余的 0
      value = value.replace(/^0+/, '') || '0';
    
      if (filteredValue !== value) {
        this.inputKey++; // 每次过滤后，key自增，强制刷新input组件
      }
      // 强制更新视图（解决不刷新问题）
      this.$nextTick(() => {
        this.form.price = value;
        
      });
    }
  }
};
</script>

<style scoped lang="scss">

/* 基础布局 */
.publish-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 关键：给底部加一条上阴影，和tabBar形成分割 */
.publish-page::after {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  bottom: 6rpx;
  height: 10rpx;
  background: linear-gradient(to top, rgba(0,0,0,0.08), transparent);
  pointer-events: none; /* 不影响点击 */
}
/* 表单内容区 */
.form-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}


.upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.upload-item {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}

.upload-img {
  width: 100%;
  height: 100%;
}

.upload-delete {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  font-size: 24rpx;
}

.upload-add {
  border: 2rpx dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-add-icon {
  font-size: 48rpx;
  color: #ccc;
}

.form-item {
  margin: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 8rpx;
}
.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}
input, textarea {
  width: 100%;
  padding: 15rpx;
  border: 1px solid #eee;
  border-radius: 6rpx;
  font-size: 26rpx;
}
textarea {
  min-height: 200rpx;
  resize: none;
}
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  margin-top: 10rpx;
}
.category-item {
  padding: 12rpx 24rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
}
.category-item.active {
  background: #d6e9c6;
  color: #3c763d;
}

.footer-box {
  display: flex;
  padding: 10px 0;
  // background-color: rgb(206, 236, 157);
  uni-button {
    flex: 1;
    text-align: center;
    font-weight: bolder;
  }
}
.publish-btn {
  width: 100%;
  margin: 20rpx;
  background: #5cb85c;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  padding: 15rpx;
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


.no-login {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
.main-publish {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.choose-address-btn {
  margin: 0;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 30rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  background: #f2f3f5;
  background: #07c160;
  color: #fff;
  border: none;
}
.address-content {
  display: flex;
  align-items: center;
  padding-bottom: 20rpx;
  justify-content: space-between;
}

/* 地址抽屉遮罩 */
.address-drawer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.address-drawer.show {
  opacity: 1;
  visibility: visible;
}

/* 抽屉内容 */
.drawer-content {
  width: 100%;
  max-height: 70vh;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
.address-drawer.show .drawer-content {
  transform: translateY(0);
}

/* 头部 */
.drawer-header {
  padding: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  border-bottom: 1rpx solid #eee;
}
.drawer-header .close {
  color: #666;
  font-size: 28rpx;
}

/* 地址列表 */
.address-list {
  max-height: 60vh;
  padding: 20rpx;
}
.address-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.address-item .name {
  font-size: 30rpx;
  font-weight: 500;
}
.address-item .phone {
  font-size: 26rpx;
  color: #666;
  margin: 10rpx 0;
}
.address-item .addr {
  font-size: 26rpx;
  color: #999;
}

.empty {
  padding: 100rpx 0;
  text-align: center;
  color: #999;
}
</style>