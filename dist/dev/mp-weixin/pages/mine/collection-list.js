"use strict";
const common_vendor = require("../../common/vendor.js");
const api_collection = require("../../api/collection.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      collectList: [],
      userInfo: {}
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.getCollectList();
  },
  methods: {
    // 获取收藏列表
    async getCollectList() {
      var _a;
      const { user_id = "" } = this.userInfo || {};
      if (!user_id)
        return;
      const res = await api_collection.collectionsApi.getCollectionsList({ user_id });
      if (res.code === 200) {
        this.collectList = (_a = res.data) == null ? void 0 : _a.map((item) => {
          var _a2;
          return {
            ...item,
            images: (_a2 = item == null ? void 0 : item.image_url) == null ? void 0 : _a2.split(",")
          };
        });
      }
    },
    // 取消收藏
    async toggleCollect(goods_id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消收藏该商品吗？",
        success: async () => {
          const { user_id = "" } = this.userInfo || {};
          await api_collection.collectionsApi.toggleCollection({
            user_id,
            goods_id
          });
          common_vendor.index.showToast({ title: "取消收藏成功" });
          this.getCollectList();
        }
      });
    },
    // 跳转到商品详情
    goDetail(goods_id) {
      common_vendor.index.navigateTo({
        url: `/pages/goods/detail?goods_id=${goods_id}`
      });
    },
    // 图片加载失败兜底
    handleImgError(e) {
      e.target.src = "/static/default.png";
    },
    // 空状态跳转首页
    goHome() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.collectList, (item, k0, i0) => {
      return common_vendor.e({
        a: item.images[0] || "/static/default.png",
        b: common_vendor.o((...args) => $options.handleImgError && $options.handleImgError(...args), item.goods_id),
        c: common_vendor.t(item.name),
        d: common_vendor.t(item.price),
        e: item.district
      }, item.district ? {
        f: common_vendor.t(item.district)
      } : {}, {
        g: common_vendor.o(($event) => $options.toggleCollect(item.goods_id), item.goods_id),
        h: item.goods_id,
        i: common_vendor.o(($event) => $options.goDetail(item.goods_id), item.goods_id)
      });
    }),
    b: $data.collectList.length === 0
  }, $data.collectList.length === 0 ? {
    c: common_assets._imports_0
  } : {}, {
    d: common_vendor.o((...args) => $options.goHome && $options.goHome(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ea960b16"]]);
wx.createPage(MiniProgramPage);
