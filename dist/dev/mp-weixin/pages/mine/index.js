"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  name: "MinePage",
  components: { TabBar },
  data() {
    return {
      isLogin: false,
      userInfo: {}
    };
  },
  onLoad() {
    this.isLogin = !!common_vendor.index.getStorageSync("token");
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
  },
  methods: {
    // 微信登录
    async wxLogin() {
      common_vendor.index.login({
        provider: "weixin",
        success: async (res) => {
          var _a, _b, _c, _d;
          const wxRes = await api_user.userApi.wxLogin({ code: res.code });
          this.isLogin = !!((_a = wxRes == null ? void 0 : wxRes.data) == null ? void 0 : _a.token);
          this.userInfo = ((_b = wxRes == null ? void 0 : wxRes.data) == null ? void 0 : _b.userInfo) || {};
          common_vendor.index.setStorageSync("token", (_c = wxRes == null ? void 0 : wxRes.data) == null ? void 0 : _c.token);
          common_vendor.index.setStorageSync("userInfo", (_d = wxRes == null ? void 0 : wxRes.data) == null ? void 0 : _d.userInfo);
        },
        fail: (err) => {
          console.error("uni.login 失败:", err);
          common_vendor.index.showToast({ title: "登录失败", icon: "none" });
        }
      });
    },
    // 退出登录
    logout() {
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
            common_vendor.index.reLaunch({ url: "/pages/index/index" });
          }
        }
      });
    },
    toDetail(path) {
      if (!this.isLogin) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      common_vendor.wx$1.navigateTo({ url: `/pages/mine/${path}` });
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
    b: common_vendor.o((...args) => $options.wxLogin && $options.wxLogin(...args))
  } : {
    c: common_vendor.t($data.userInfo.nickName),
    d: common_vendor.o(($event) => $options.toDetail("publish-list")),
    e: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  }, {
    f: common_vendor.p({
      defaultTab: "mine"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9023ef44"]]);
wx.createPage(MiniProgramPage);
