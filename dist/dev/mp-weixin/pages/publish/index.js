"use strict";
const common_vendor = require("../../common/vendor.js");
const api_goods = require("../../api/goods.js");
const api_category = require("../../api/category.js");
const api_address = require("../../api/address.js");
const TabBar = () => "../../components/TabBar.js";
const initialData = {
  price: "",
  category_id: null,
  // 选中的分类ID
  description: "",
  province: "",
  city: "",
  name: "",
  contact_name: "",
  contact_phone: "",
  district: "",
  address_id: null,
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
      streetList: ["梅陇镇", "莘庄镇", "七宝镇", "颛桥镇", "华漕镇", "虹桥镇", "吴泾镇", "马桥镇", "浦江镇", "江川路街道", "古美街道", "新虹街道", "浦锦街道", "莘庄工业区"],
      streetId: "",
      goodsId: "",
      // 编辑模式下，商品的ID
      isLogin: !!common_vendor.index.getStorageSync("token"),
      userInfo: {},
      // 用户信息
      isUploadingImage: false,
      // 控制是否清空--uni-app机制问题优化（chooseImage/uploadFile，系统会触发页面的onShow生命周期），要标记这种情况不清空页面的数据
      addressLists: [],
      showAddressDrawer: false,
      // 控制抽屉显示/隐藏
      inputKey: 0
      // 解决input输入框无法更新的问题
    };
  },
  async onShow() {
    this.isLogin = !!common_vendor.index.getStorageSync("token");
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    if (this.isUploadingImage) {
      setTimeout(() => {
        this.isUploadingImage = false;
      }, 100);
      return;
    }
    this.goodsImages = [];
    this.form = { ...initialData };
  },
  async onLoad(options = {}) {
    await this.loadCategories();
    await this.getAddressLists();
    this.goodsId = (options == null ? void 0 : options.goods_id) || "";
    if (options.goods_id) {
      this.isUploadingImage = true;
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
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      if (!((_a = this.form) == null ? void 0 : _a.name))
        return common_vendor.index.showToast({ title: "请输入商品标题", icon: "none" });
      if (!((_b = this.form) == null ? void 0 : _b.price))
        return common_vendor.index.showToast({ title: "请输入商品价格", icon: "none" });
      if (!((_c = this.form) == null ? void 0 : _c.category_id))
        return common_vendor.index.showToast({ title: "请选择商品分类", icon: "none" });
      if (!((_d = this.form) == null ? void 0 : _d.street))
        return common_vendor.index.showToast({ title: "请选择社区信息", icon: "none" });
      if (!((_e = this == null ? void 0 : this.goodsImages) == null ? void 0 : _e.length))
        return common_vendor.index.showToast({ title: "请补充商品图片信息", icon: "none" });
      const nickName = ((_f = this.userInfo) == null ? void 0 : _f.nickName) || ((_g = this.userInfo) == null ? void 0 : _g.nick_name);
      const phone = ((_h = this.userInfo) == null ? void 0 : _h.phone) || "13312345678";
      try {
        const params = {
          ...this.form,
          image_url: (_i = this.goodsImages) == null ? void 0 : _i.join(","),
          publisher_name: ((_j = this.form) == null ? void 0 : _j.contact_name) || nickName,
          user_id: (_k = this.userInfo) == null ? void 0 : _k.user_id,
          publisher_id: (_l = this.userInfo) == null ? void 0 : _l.user_id,
          address_id: ((_m = this.form) == null ? void 0 : _m.address_id) || 0,
          // 关键：发布时绑定地址
          contact_name: ((_n = this.form) == null ? void 0 : _n.contact_name) || nickName,
          contact_phone: ((_o = this.form) == null ? void 0 : _o.contact_phone) || phone
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
          common_vendor.index.showToast({ title: "发布成功，等待审核", icon: "none" });
          this.form = { ...initialData };
          if (this.goodsId) {
            common_vendor.index.navigateBack({ delta: 1 });
          } else {
            common_vendor.index.redirectTo({ url: "/pages/mine/publish-list?from=publish" });
          }
        } else {
          common_vendor.index.showToast({ title: publishRes.msg, icon: "none" });
        }
      } catch (err) {
        common_vendor.index.showToast({ title: (err == null ? void 0 : err.message) || (err == null ? void 0 : err.msg), icon: "none" });
      }
    },
    // 查询闲置详情
    async getGoodsDetail(goodsId) {
      var _a, _b;
      this.form = { ...initialData };
      if (!goodsId)
        return;
      try {
        const res = await api_goods.goodsApi.getGoodsDetail({ goods_id: goodsId });
        const { data, code } = res;
        if (code === 200) {
          this.form = {
            ...data
          };
          this.goodsImages = ((_a = data == null ? void 0 : data.image_url) == null ? void 0 : _a.length) ? (_b = data == null ? void 0 : data.image_url) == null ? void 0 : _b.split(",") : [];
          common_vendor.index.setNavigationBarTitle({ title: "编辑闲置" });
          this.btnText = "更新闲置";
        }
      } catch (err) {
        common_vendor.index.showToast({ title: "获取商品详情失败", icon: "none" });
      }
    },
    async handleChooseImage() {
      try {
        this.isUploadingImage = true;
        const currentImages = this.goodsImages || [];
        const remain = 9 - currentImages.length;
        if (remain <= 0) {
          common_vendor.index.showToast({ title: "最多上传9张", icon: "none" });
          return;
        }
        const res = await common_vendor.index.chooseImage({
          count: remain,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        const tempFilePaths = res.tempFilePaths;
        if (!tempFilePaths || tempFilePaths.length === 0)
          return;
        const newImages = [];
        for (const path of tempFilePaths) {
          const url = await this.uploadImage(path);
          if (url && typeof url === "string") {
            newImages.push(url);
          }
        }
        const finalImages = [...currentImages, ...newImages];
        this.$set(this, "goodsImages", finalImages);
        common_vendor.index.showToast({
          title: `成功上传 ${newImages.length} 张`,
          icon: "none"
        });
      } catch (err) {
        console.error("取消上传：", err);
      } finally {
      }
    },
    // 上传图片方法，封装上传逻辑
    async uploadImage(path) {
      return new Promise((resolve) => {
        common_vendor.index.uploadFile({
          url: "http://192.168.3.116:3000/api/upload/image",
          filePath: path,
          name: "file",
          success: (uploadRes) => {
            var _a;
            try {
              const data = JSON.parse(uploadRes.data);
              if ((data == null ? void 0 : data.code) === 200) {
                const url = typeof data.data === "string" ? data.data : (_a = data.data) == null ? void 0 : _a.url;
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
      this.form.streetName = this.streetList[e.detail.value];
    },
    // 获取地址列表
    async getAddressLists() {
      const { user_id = "" } = this.userInfo;
      if (!user_id)
        return;
      const res = await api_address.addressApi.getAddressList({ user_id });
      if ((res == null ? void 0 : res.code) === 200) {
        this.addressLists = res.data;
        const defaultAddr = res.data.find((item) => item.is_default === 1);
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
      this.form = { ...this.form, ...item };
      this.showAddressDrawer = false;
    },
    handlePriceInput(e) {
      let value = e.detail.value || "";
      value = value.replace(/[^\d.]/g, "");
      let filteredValue = value;
      const pointCount = (value == null ? void 0 : value.split(".").length) - 1;
      if (pointCount > 1) {
        value = value.substring(0, value.lastIndexOf("."));
      }
      const pointIndex = value.indexOf(".");
      if (pointIndex !== -1) {
        value = value.substring(0, pointIndex + 3);
      }
      value = value.replace(/-/g, "");
      value = value.replace(/^0+/, "") || "0";
      if (filteredValue !== value) {
        this.inputKey++;
      }
      this.$nextTick(() => {
        this.form.price = value;
      });
    }
  }
};
if (!Array) {
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  _component_TabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b;
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
    h: $data.inputKey,
    i: $data.form.price,
    j: common_vendor.o((...args) => $options.handlePriceInput && $options.handlePriceInput(...args)),
    k: common_vendor.t(((_a = $data.form) == null ? void 0 : _a.street) || ((_b = $data.form) == null ? void 0 : _b.streetName)),
    l: $data.streetList,
    m: common_vendor.o((...args) => $options.handleStreetChange && $options.handleStreetChange(...args)),
    n: $data.addressLists.length
  }, $data.addressLists.length ? {
    o: common_vendor.o((...args) => $options.handleChooseAddress && $options.handleChooseAddress(...args))
  } : {}, {
    p: $data.form.detail_address,
    q: common_vendor.o(($event) => $data.form.detail_address = $event.detail.value),
    r: common_vendor.f($data.categoryList, (cat, k0, i0) => {
      return {
        a: common_vendor.t(cat.name),
        b: cat.category_id,
        c: common_vendor.n({
          active: $data.form.category_id === cat.category_id
        }),
        d: common_vendor.o(($event) => $options.selectCategory(cat.category_id), cat.category_id)
      };
    }),
    s: $data.form.description,
    t: common_vendor.o(($event) => $data.form.description = $event.detail.value),
    v: common_vendor.o((...args) => $options.publishGoods && $options.publishGoods(...args))
  }), {
    w: common_vendor.o((...args) => $options.closeAddressDrawer && $options.closeAddressDrawer(...args)),
    x: common_vendor.f($data.addressLists, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.contact_name),
        b: common_vendor.t(item.contact_phone),
        c: common_vendor.t(item.province),
        d: common_vendor.t(item.city),
        e: common_vendor.t(item.district),
        f: common_vendor.t(item.street),
        g: common_vendor.t(item.detail_address),
        h: item.address_id,
        i: common_vendor.o(($event) => $options.selectAddress(item), item.address_id)
      };
    }),
    y: common_vendor.o(() => {
    }),
    z: $data.showAddressDrawer ? 1 : "",
    A: common_vendor.o((...args) => $options.closeAddressDrawer && $options.closeAddressDrawer(...args)),
    B: common_vendor.p({
      defaultTab: "publish"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ce8f53b1"]]);
wx.createPage(MiniProgramPage);
