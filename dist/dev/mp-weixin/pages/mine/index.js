"use strict";
const common_vendor = require("../../common/vendor.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  name: "MinePage",
  components: { TabBar },
  data() {
    return {
      userInfo: {},
      isLogin: !!common_vendor.index.getStorageSync("token")
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.isLogin = !!common_vendor.index.getStorageSync("token");
  },
  methods: {
    // 退出登录
    handleLogout() {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            this.isLogin = false;
            this.userInfo = {};
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("userId");
            common_vendor.index.showToast({ title: "已退出登录" });
            common_vendor.index.navigateTo({ url: "/pages/login/index" });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  (_easycom_uni_icons2 + _component_TabBar)();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isLogin
  }, !$data.isLogin ? {
    b: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: "/pages/login/index"
    }))
  } : common_vendor.e({
    c: $data.userInfo.avatarUrl || "/static/default-avatar.png",
    d: common_vendor.t($data.userInfo.nickName || "微信昵称"),
    e: common_vendor.p({
      type: "gift",
      size: "24",
      color: "#666"
    }),
    f: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: "/pages/orders/order-list?type=buy"
    })),
    g: common_vendor.p({
      type: "shop",
      size: "24",
      color: "#666"
    }),
    h: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: "/pages/mine/publish-list"
    })),
    i: common_vendor.p({
      type: "star",
      size: "24",
      color: "#666"
    }),
    j: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: "/pages/mine/collection-list"
    })),
    k: common_vendor.p({
      type: "location",
      size: "24",
      color: "#666"
    }),
    l: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: "/pages/mine/address-list"
    })),
    m: $data.isLogin
  }, $data.isLogin ? {
    n: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {}), {
    o: common_vendor.p({
      defaultTab: "mine"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9023ef44"]]);
wx.createPage(MiniProgramPage);
