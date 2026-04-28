"use strict";
const common_vendor = require("../../common/vendor.js");
const api_goods = require("../../api/goods.js");
const api_collection = require("../../api/collection.js");
const api_order = require("../../api/order.js");
const _sfc_main = {
  data() {
    return {
      goods_id: 0,
      detail: {},
      imgs: [],
      isCollect: false,
      userInfo: {},
      from_by: ""
      // 订单详情页/收藏列表跳转过来的标识--已删除的商品，仍然可以查看商品详情
    };
  },
  onShow() {
    var _a;
    if (!((_a = this.userInfo) == null ? void 0 : _a.user_id)) {
      this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    }
  },
  onLoad(options) {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.goods_id = options.goods_id;
    this.from_by = options.from_by || "";
    this.getDetail();
    this.getCollectStatus();
  },
  methods: {
    // 加载商品详情
    async getDetail() {
      var _a;
      try {
        const res = await api_goods.goodsApi.getGoodsDetail({ goods_id: this.goods_id, delete_detail: ["order", "collection"].includes(this.from_by) || false });
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
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/login/index" });
        }, 300);
        return;
      }
      const res = await api_collection.collectionsApi.toggleCollection({ user_id: (_b = this.userInfo) == null ? void 0 : _b.user_id, goods_id: this.goods_id });
      this.isCollect = res.isCollect;
      common_vendor.index.showToast({ title: res.msg, icon: "none" });
    },
    // 立即购买（完善版：选择收货地址+下单）
    async toBuy() {
      var _a, _b;
      if (!((_a = this.userInfo) == null ? void 0 : _a.user_id)) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/login/index" });
        }, 300);
        return;
      }
      try {
        const res = await api_order.orderApi.createOrder({
          goods_id: this.goods_id,
          user_id: (_b = this.userInfo) == null ? void 0 : _b.user_id
        });
        if (res.code === 200) {
          common_vendor.index.showToast({ title: "下单成功" });
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/orders/order-list?type=buy" });
          }, 1e3);
        } else {
          common_vendor.index.showToast({ title: res.msg || "下单失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.showToast({ title: (err == null ? void 0 : err.message) || (err == null ? void 0 : err.msg), icon: "none" });
      }
    },
    // 图片加载失败兜底
    handleImgError(e) {
      e.target.src = "/static/default-goods.png";
    }
  }
};
if (!Array) {
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  _easycom_uni_tag2();
}
const _easycom_uni_tag = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-tag/uni-tag.js";
if (!Math) {
  _easycom_uni_tag();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.imgs, (img, idx, i0) => {
      return {
        a: img,
        b: common_vendor.o((...args) => $options.handleImgError && $options.handleImgError(...args), idx),
        c: idx
      };
    }),
    b: common_vendor.t($data.detail.title || $data.detail.name),
    c: common_vendor.t($data.detail.price),
    d: common_vendor.t($data.detail.category_name),
    e: $data.detail.avatar_url || "/static/default-avatar.png",
    f: common_vendor.t($data.detail.publisher_name || "匿名卖家"),
    g: $data.detail.publisher_id === $data.userInfo.user_id
  }, $data.detail.publisher_id === $data.userInfo.user_id ? {
    h: common_vendor.p({
      mark: true,
      text: "我发布的",
      type: "success",
      size: "mini"
    })
  } : {}, {
    i: common_vendor.t($data.detail.description || $data.detail.content),
    j: common_vendor.t($data.detail.province || "上海市"),
    k: common_vendor.t($data.detail.city || "上海市"),
    l: common_vendor.t($data.detail.district || "闵行区"),
    m: common_vendor.t($data.detail.street || "梅陇镇"),
    n: common_vendor.t($data.detail.detail_address || ""),
    o: $data.detail.publisher_id !== $data.userInfo.user_id && $data.detail.is_deleted !== 1
  }, $data.detail.publisher_id !== $data.userInfo.user_id && $data.detail.is_deleted !== 1 ? {
    p: $data.isCollect ? 1 : "",
    q: common_vendor.t($data.isCollect ? "已收藏" : "收藏"),
    r: common_vendor.o((...args) => $options.doCollect && $options.doCollect(...args)),
    s: common_vendor.o((...args) => $options.toBuy && $options.toBuy(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9c1ceb90"]]);
wx.createPage(MiniProgramPage);
