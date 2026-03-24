"use strict";
const common_vendor = require("../../common/vendor.js");
const api_goods = require("../../api/goods.js");
const api_collection = require("../../api/collection.js");
require("../../utils/https.js");
const _sfc_main = {
  data() {
    return {
      goods_id: 0,
      detail: {},
      imgs: [],
      isCollect: false
    };
  },
  computed: {
    userInfo() {
      return common_vendor.index.getStorageSync("userInfo") || {};
    }
  },
  onLoad(options) {
    this.goods_id = options.goods_id;
    this.getDetail();
    this.getCollectStatus();
  },
  methods: {
    // 加载商品详情
    async getDetail() {
      var _a;
      try {
        const res = await api_goods.goodsApi.getGoodsDetail({ goods_id: this.goods_id });
        if (res.code === 200) {
          this.detail = res.data;
          this.imgs = ((_a = res.data.image_url) == null ? void 0 : _a.split(",")) || [];
        }
      } catch (err) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    },
    // 获取收藏状态
    async getCollectStatus() {
      var _a, _b;
      if (!((_a = this.userInfo) == null ? void 0 : _a.user_id))
        return;
      const res = await api_collection.collectionsApi.getCollectStatus({ user_id: (_b = this.userInfo) == null ? void 0 : _b.user_id, goods_id: this.goods_id });
      this.isCollect = res.isCollect;
    },
    // 收藏/取消收藏
    async doCollect() {
      var _a, _b;
      if (!((_a = this.userInfo) == null ? void 0 : _a.user_id)) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      const res = await api_collection.collectionsApi.toggleCollection({ user_id: (_b = this.userInfo) == null ? void 0 : _b.user_id, goods_id: this.goods_id });
      this.isCollect = res.isCollect;
      common_vendor.index.showToast({ title: res.msg, icon: "none" });
    },
    // 立即购买（完善版：选择收货地址+下单）
    async toBuy() {
      var _a;
      if (!((_a = this.userInfo) == null ? void 0 : _a.user_id)) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/mine/address-list?from=buy&goods_id=${this.goods_id}`
      });
    },
    // 图片加载失败兜底
    handleImgError(e) {
      e.target.src = "/static/default-goods.png";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.imgs, (img, idx, i0) => {
      return {
        a: img,
        b: common_vendor.o((...args) => $options.handleImgError && $options.handleImgError(...args), idx),
        c: idx
      };
    }),
    b: common_vendor.t($data.detail.title || $data.detail.name),
    c: common_vendor.t($data.detail.price),
    d: $data.detail.avatar_url || "/static/default-avatar.png",
    e: common_vendor.t($data.detail.nick_name || "匿名卖家"),
    f: common_vendor.t($data.detail.description || $data.detail.content),
    g: common_vendor.t($data.detail.province || "上海市"),
    h: common_vendor.t($data.detail.city || "上海市"),
    i: common_vendor.t($data.detail.district || "闵行区"),
    j: common_vendor.t($data.detail.street || "梅陇镇"),
    k: common_vendor.t($data.detail.detail_address || ""),
    l: $data.isCollect ? 1 : "",
    m: common_vendor.t($data.isCollect ? "已收藏" : "收藏"),
    n: common_vendor.o((...args) => $options.doCollect && $options.doCollect(...args)),
    o: common_vendor.o((...args) => $options.toBuy && $options.toBuy(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9c1ceb90"]]);
wx.createPage(MiniProgramPage);
