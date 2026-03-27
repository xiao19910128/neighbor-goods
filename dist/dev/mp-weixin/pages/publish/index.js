"use strict";
const common_vendor = require("../../common/vendor.js");
const api_goods = require("../../api/goods.js");
const api_category = require("../../api/category.js");
const TabBar = () => "../../components/TabBar.js";
const initialData = {
  price: "",
  category_id: null,
  // 选中的分类ID
  description: "",
  province: "",
  city: "",
  name: "",
  district: "",
  street: "梅陇镇",
  detail_address: "",
  streetName: "梅陇镇"
};
const _sfc_main = {
  name: "PublishPage",
  components: { TabBar },
  data() {
    return {
      categoryList: [],
      // 分类列表
      goodsImages: [],
      // 存储已上传的图片信息
      form: { ...initialData },
      // 省市区联动
      regionValue: ["上海市", "上海市", "闵行区"],
      // 街道列表（可以根据 district 动态加载）
      streetList: ["梅陇镇", "吴泾镇", "颛桥镇", "华漕镇"],
      streetId: "",
      goodsId: "",
      // 编辑模式下，商品的ID
      isLogin: !!common_vendor.index.getStorageSync("token"),
      userInfo: {}
      // 用户信息
    };
  },
  async onShow() {
    this.goodsImages = [];
    this.form = { ...initialData };
    await this.loadCategories();
    this.isLogin = !!common_vendor.index.getStorageSync("token");
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
  },
  async onLoad(options = {}) {
    if (options.goods_id) {
      this.goodsId = options.goods_id;
      this.getGoodsDetail(this.goodsId);
    }
  },
  methods: {
    // 加载分类列表
    async loadCategories() {
      try {
        const res = await api_category.categoryApi.getCategoryList();
        if ((res == null ? void 0 : res.code) === 200) {
          this.categoryList = res == null ? void 0 : res.data;
        }
      } catch (err) {
        common_vendor.index.showToast({ title: "加载分类失败", icon: "none" });
      }
    },
    // 选择分类
    selectCategory(id) {
      this.form.category_id = id;
    },
    // 发布商品
    async publishGoods() {
      var _a, _b;
      if (!this.form.name)
        return common_vendor.index.showToast({ title: "请输入商品标题", icon: "none" });
      if (!this.form.price)
        return common_vendor.index.showToast({ title: "请输入商品价格", icon: "none" });
      if (!this.form.category_id)
        return common_vendor.index.showToast({ title: "请选择商品分类", icon: "none" });
      if (!this.form.street)
        return common_vendor.index.showToast({ title: "请选择社区信息", icon: "none" });
      try {
        const params = {
          ...this.form,
          image_url: (_a = this.goodsImages) == null ? void 0 : _a.join(","),
          user_id: (_b = this.userInfo) == null ? void 0 : _b.user_id
        };
        let publishRes = null;
        if (this.goodsId) {
          publishRes = await api_goods.goodsApi.updateGoods({
            ...params,
            goods_id: this.goodsId
          });
        } else {
          publishRes = await api_goods.goodsApi.publishGoods(params);
        }
        if ((publishRes == null ? void 0 : publishRes.code) === 200) {
          common_vendor.index.showToast({ title: "商品信息提交成功", icon: "none" });
          this.form = { name: "", price: 0, category_id: null, description: "" };
          common_vendor.wx$1.navigateTo({ url: "/pages/mine/publish-list?from=publish" });
        } else {
          common_vendor.index.showToast({ title: publishRes.msg, icon: "none" });
        }
      } catch (err) {
        common_vendor.index.showToast({ title: (err == null ? void 0 : err.message) || (err == null ? void 0 : err.msg), icon: "none" });
      }
    },
    // 查询闲置详情
    async getGoodsDetail(goodsId) {
      var _a;
      try {
        const res = await api_goods.goodsApi.getGoodsDetail({ goods_id: goodsId });
        const { data, code } = res;
        if (code === 200) {
          this.form = {
            ...data
            // streetName: 
          };
          this.goodsImages = (_a = data == null ? void 0 : data.image_url) == null ? void 0 : _a.split(",");
          common_vendor.index.setNavigationBarTitle({ title: "编辑闲置" });
          this.btnText = "更新闲置";
        }
      } catch (err) {
        common_vendor.index.showToast({ title: "获取商品详情失败", icon: "none" });
      }
    },
    async handleChooseImage() {
      try {
        const res = await common_vendor.index.chooseImage({
          count: 9 - this.goodsImages.length,
          // 剩余可选择数量 = 9 - 已选数量
          sizeType: ["compressed"],
          // 压缩图片，减少上传体积
          sourceType: ["album", "camera"]
          // 允许相册/相机
        });
        const tempFilePaths = res.tempFilePaths;
        const uploadTasks = tempFilePaths.map((path) => this.uploadImage(path));
        const newImageUrls = await Promise.all(uploadTasks);
        const validUrls = newImageUrls.filter((url) => url !== null);
        this.goodsImages = [...this.goodsImages, ...validUrls];
        common_vendor.index.showToast({
          title: `成功上传 ${validUrls.length} 张`,
          icon: "none"
        });
      } catch (err) {
        console.error("选择/上传图片失败:", err);
        common_vendor.index.showToast({
          title: "图片操作失败",
          icon: "none"
        });
      }
    },
    // 上传图片方法（完全适配微信小程序/uni-app，直接复制）
    async uploadImage(tempFilePath) {
      var _a;
      try {
        const res = await common_vendor.index.uploadFile({
          url: "http://localhost:3000/api/upload/image",
          filePath: tempFilePath,
          // 选择图片后返回的临时路径
          name: "file",
          formData: {
            user_id: common_vendor.index.getStorageSync("userInfo").user_id
          },
          timeout: 1e4
          // 超时时间
        });
        const data = JSON.parse(res == null ? void 0 : res.data);
        if ((data == null ? void 0 : data.code) === 200) {
          common_vendor.index.showToast({
            title: "上传成功",
            icon: "none",
            duration: 1500
          });
          return (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.url;
        } else {
          common_vendor.index.showToast({
            title: (data == null ? void 0 : data.message) || "上传失败",
            icon: "none",
            duration: 2e3
          });
          return null;
        }
      } catch (err) {
        common_vendor.index.showToast({
          title: "上传失败，请重试",
          icon: "none",
          duration: 2e3
        });
        return null;
      }
    },
    // 上传图片到服务器
    uploadImageToServer(tempFilePath) {
      return new Promise((resolve, reject) => {
        common_vendor.index.uploadFile({
          url: "http://localhost:5173/api/upload/image",
          filePath: tempFilePath,
          name: "file",
          success: (uploadRes) => {
            const data = JSON.parse(uploadRes.data);
            if (data.code === 200) {
              resolve(data.data.url);
            } else {
              common_vendor.index.showToast({ title: data.message, icon: "none" });
              reject();
            }
          },
          fail: (err) => {
            common_vendor.index.showToast({ title: "图片上传失败", icon: "none" });
            reject(err);
          }
        });
      });
    },
    // 图片预览核心方法
    handlePreview(currentImg, currentIndex) {
      common_vendor.index.previewImage({
        current: currentIndex,
        // 当前预览图片的索引
        urls: this.goodsImages,
        // 所有可预览的图片 URL 数组
        loop: true,
        // 支持循环预览
        longPressActions: {
          // 长按图片操作（可选）
          itemList: ["保存图片", "取消"],
          success: (res) => {
            if (res.tapIndex === 0) {
              common_vendor.index.saveImageToPhotosAlbum({
                filePath: currentImg,
                success: () => {
                  common_vendor.index.showToast({ title: "保存成功", icon: "success" });
                },
                fail: () => {
                  common_vendor.index.showToast({ title: "保存失败", icon: "none" });
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
        this.regionValue = ["上海市", "上海市", "闵行区"];
        this.detailAddress = "请输入小区/楼栋";
        common_vendor.index.showToast({ title: "已定位到梅陇镇（社区默认）", icon: "none" });
      } catch (err) {
        common_vendor.index.showToast({ title: "定位失败，默认选择梅陇镇", icon: "none" });
        common_vendor.index.hideLoading();
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
      this.form.streetName = this.form.street;
    }
  }
};
if (!Array) {
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  _component_TabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isLogin
  }, !$data.isLogin ? {
    b: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: "/pages/login/index"
    }))
  } : common_vendor.e({
    c: common_vendor.f($data.goodsImages, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.handleDelete(index), index),
        c: index,
        d: common_vendor.o(($event) => $options.handlePreview(item, index), index)
      };
    }),
    d: $data.goodsImages.length < 9
  }, $data.goodsImages.length < 9 ? {
    e: common_vendor.o((...args) => $options.handleChooseImage && $options.handleChooseImage(...args))
  } : {}, {
    f: $data.form.name,
    g: common_vendor.o(($event) => $data.form.name = $event.detail.value),
    h: $data.form.price,
    i: common_vendor.o(common_vendor.m(($event) => $data.form.price = $event.detail.value, {
      number: true
    })),
    j: common_vendor.t($data.form.streetName),
    k: $data.streetList,
    l: common_vendor.o((...args) => $options.handleStreetChange && $options.handleStreetChange(...args)),
    m: $data.form.detail_address,
    n: common_vendor.o(($event) => $data.form.detail_address = $event.detail.value),
    o: common_vendor.f($data.categoryList, (cat, k0, i0) => {
      return {
        a: common_vendor.t(cat.name),
        b: cat.category_id,
        c: common_vendor.n({
          active: $data.form.category_id === cat.category_id
        }),
        d: common_vendor.o(($event) => $options.selectCategory(cat.category_id), cat.category_id)
      };
    }),
    p: $data.form.description,
    q: common_vendor.o(($event) => $data.form.description = $event.detail.value),
    r: common_vendor.o((...args) => $options.publishGoods && $options.publishGoods(...args))
  }), {
    s: common_vendor.p({
      defaultTab: "publish"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ce8f53b1"]]);
wx.createPage(MiniProgramPage);
