"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const api_message = require("../../api/message.js");
const _sfc_main = {
  data() {
    return {
      order_id: "",
      orderInfo: {},
      userInfo: {},
      isBuyer: false,
      // 是否是买家
      isSeller: false,
      // 是否是卖家
      currentType: "",
      statusMap: {
        1: {
          text: "待确认",
          order_status: "primary"
        },
        2: {
          text: "待自提",
          order_status: "warning"
        },
        3: {
          text: "待收货",
          order_status: "primary"
        },
        4: {
          text: "已完成",
          order_status: "success"
        },
        5: {
          text: "已取消",
          order_status: "error"
        }
      }
    };
  },
  onLoad(options) {
    this.order_id = options.order_id;
    this.currentType = (options == null ? void 0 : options.currentType) || "";
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.getOrderDetail();
  },
  methods: {
    // 获取订单详情
    async getOrderDetail() {
      var _a, _b;
      try {
        const res = await api_order.orderApi.getOrderDetail({ order_id: this.order_id || 49, user_id: this.userInfo.user_id || 9 });
        if (res.code === 200) {
          this.orderInfo = {
            ...res.data,
            imageUrl: ((_b = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.image_url) == null ? void 0 : _b.split(",")[0]) || ""
          };
          this.isBuyer = this.orderInfo.buyer_id === this.userInfo.user_id;
          this.isSeller = this.orderInfo.seller_id === this.userInfo.user_id;
        }
      } catch (err) {
        console.error("获取详情失败", err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        common_vendor.index.navigateBack();
      }
    },
    // 跳聊天页
    async goChat({ seller_id, order_id, opposite_nickname, user_id }) {
      const new_buy_id = this.currentType === "sell" ? seller_id : user_id;
      const new_seller_id = this.currentType === "buy" ? seller_id : user_id;
      const res = await api_message.messageApi.getSessionByUserPair({
        user1_id: new_buy_id,
        user2_id: new_seller_id
      });
      if (res.code === 200 && (res == null ? void 0 : res.session_id)) {
        common_vendor.index.navigateTo({
          url: `/pages/chat/chat?to_user_id=${new_seller_id}&order_id=${order_id}&nickname=${opposite_nickname}&session_id=${res.session_id}`
        });
      } else {
        common_vendor.index.showToast({ title: "获取会话失败", icon: "none" });
      }
    },
    // 修改订单状态
    async updateStatus(order_id, order_status) {
      try {
        const { user_id = "" } = this.userInfo;
        if (!user_id)
          return;
        await api_order.orderApi.updateOrderStatus({ order_id, order_status, user_id });
        common_vendor.index.showToast({ title: "操作成功" });
        this.getOrderDetail();
      } catch (err) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    },
    // 退单
    async refundOrder(order_id) {
      common_vendor.index.showModal({
        title: "确认退单",
        content: "确定要取消该订单吗？",
        success: async (res) => {
          if (res.confirm) {
            this.updateStatus(order_id, 5);
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d;
  return common_vendor.e({
    a: $data.orderInfo.imageUrl,
    b: common_vendor.t($data.orderInfo.goods_name),
    c: common_vendor.t($data.orderInfo.goods_price),
    d: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: `/pages/index/goods-detail?goods_id=${$data.orderInfo.goods_id}&from_order=yes`
    })),
    e: common_vendor.t($data.orderInfo.buyer_name || "匿名用户"),
    f: common_vendor.t($data.orderInfo.buyer_phone || "无"),
    g: common_vendor.t($data.orderInfo.seller_name || "匿名用户"),
    h: common_vendor.t($data.orderInfo.seller_phone || "无"),
    i: common_vendor.t((_b = $data.statusMap[(_a = $data.orderInfo) == null ? void 0 : _a.order_status]) == null ? void 0 : _b.text),
    j: common_vendor.n((_d = $data.statusMap[(_c = $data.orderInfo) == null ? void 0 : _c.order_status]) == null ? void 0 : _d.order_status),
    k: common_vendor.t($data.orderInfo.goods_price),
    l: common_vendor.t($data.orderInfo.order_no),
    m: common_vendor.t($data.orderInfo.created_time),
    n: $data.orderInfo.order_status !== 4 && $data.orderInfo.order_status !== 5
  }, $data.orderInfo.order_status !== 4 && $data.orderInfo.order_status !== 5 ? common_vendor.e({
    o: $data.currentType === "buy"
  }, $data.currentType === "buy" ? common_vendor.e({
    p: $data.orderInfo.order_status === 1
  }, $data.orderInfo.order_status === 1 ? {
    q: common_vendor.o(($event) => $options.updateStatus($data.orderInfo.order_id, 5))
  } : {}, {
    r: $data.orderInfo.order_status === 2
  }, $data.orderInfo.order_status === 2 ? {
    s: common_vendor.o(($event) => $options.updateStatus($data.orderInfo.order_id, 3))
  } : {}, {
    t: $data.orderInfo.order_status === 2
  }, $data.orderInfo.order_status === 2 ? {
    v: common_vendor.o(($event) => $options.refundOrder($data.orderInfo.order_id))
  } : {}) : {}, {
    w: $data.currentType === "sell"
  }, $data.currentType === "sell" ? common_vendor.e({
    x: $data.orderInfo.order_status === 1
  }, $data.orderInfo.order_status === 1 ? {
    y: common_vendor.o(($event) => $options.updateStatus($data.orderInfo.order_id, 2))
  } : {}, {
    z: $data.orderInfo.order_status === 3 && $data.orderInfo.seller_id === $data.userInfo.user_id
  }, $data.orderInfo.order_status === 3 && $data.orderInfo.seller_id === $data.userInfo.user_id ? {
    A: common_vendor.o(($event) => $options.updateStatus($data.orderInfo.order_id, 4))
  } : {}) : {}) : {}, {
    B: common_vendor.o(($event) => $options.goChat($data.orderInfo))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9f5624b7"]]);
wx.createPage(MiniProgramPage);
