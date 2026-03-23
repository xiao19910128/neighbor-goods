"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  name: "MinePage",
  components: { TabBar },
  data() {
    return {
      userInfo: common_vendor.index.getStorageSync("userInfo") || {},
      isLogin: !!common_vendor.index.getStorageSync("token")
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.isLogin = !!common_vendor.index.getStorageSync("token");
  },
  methods: {
    // 微信登录
    async wxLogin() {
      try {
        const profileRes = await new Promise((resolve, reject) => {
          common_vendor.index.getUserProfile({
            desc: "用于完善您的个人资料",
            success: resolve,
            fail: reject
          });
        });
        common_vendor.index.login({
          provider: "weixin",
          success: async (res) => {
            var _a, _b, _c, _d;
            const wxRes = await api_user.userApi.wxLogin({
              code: res.code,
              // 微信登录 code
              nickName: profileRes.userInfo.nickName,
              // 授权获取的昵称
              avatarUrl: profileRes.userInfo.avatarUrl
              // 授权获取的头像
            });
            this.isLogin = !!((_a = wxRes == null ? void 0 : wxRes.data) == null ? void 0 : _a.token);
            this.userInfo = ((_b = wxRes == null ? void 0 : wxRes.data) == null ? void 0 : _b.userInfo) || {};
            common_vendor.index.setStorageSync("token", (_c = wxRes == null ? void 0 : wxRes.data) == null ? void 0 : _c.token);
            common_vendor.index.setStorageSync("userInfo", (_d = wxRes == null ? void 0 : wxRes.data) == null ? void 0 : _d.userInfo);
          },
          fail: (err2) => {
            console.error("uni.login 失败:", err2);
            common_vendor.index.showToast({ title: "登录失败", icon: "none" });
          }
        });
      } catch (error) {
        if (err.errMsg.includes("getUserProfile:fail")) {
          common_vendor.index.showToast({ title: "您取消了授权，无法登录", icon: "none" });
        } else {
          common_vendor.index.showToast({ title: "登录失败", icon: "none" });
        }
      }
    },
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
            common_vendor.index.reLaunch({ url: "/pages/index/index" });
          }
        }
      });
    },
    // 页面跳转（根据实际路由修改）
    goToMySold() {
      common_vendor.index.navigateTo({ url: "/pages/mine/my-sold" });
    },
    goToMyPublish() {
      common_vendor.index.navigateTo({ url: "/pages/mine/my-publish" });
    },
    goToMyCollect() {
      common_vendor.index.navigateTo({ url: "/pages/mine/my-collect" });
    },
    goToAddress() {
      common_vendor.index.navigateTo({ url: "/pages/mine/address" });
    },
    goToMessage() {
      common_vendor.index.navigateTo({ url: "/pages/mine/message" });
    },
    goToSecurity() {
      common_vendor.index.navigateTo({ url: "/pages/mine/security" });
    },
    goToPrivacy() {
      common_vendor.index.navigateTo({ url: "/pages/mine/privacy" });
    },
    goToHelp() {
      common_vendor.index.navigateTo({ url: "/pages/mine/help" });
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
    b: common_vendor.o((...args) => $options.wxLogin && $options.wxLogin(...args))
  } : common_vendor.e({
    c: $data.userInfo.avatarUrl || "/static/default-avatar.jpg",
    d: common_vendor.t($data.userInfo.nickName || "微信昵称"),
    e: common_vendor.p({
      type: "gift",
      size: "24",
      color: "#666"
    }),
    f: common_vendor.o((...args) => $options.goToMySold && $options.goToMySold(...args)),
    g: common_vendor.p({
      type: "shop",
      size: "24",
      color: "#666"
    }),
    h: common_vendor.o((...args) => $options.goToMyPublish && $options.goToMyPublish(...args)),
    i: common_vendor.p({
      type: "star",
      size: "24",
      color: "#666"
    }),
    j: common_vendor.o((...args) => $options.goToMyCollect && $options.goToMyCollect(...args)),
    k: common_vendor.p({
      type: "location",
      size: "24",
      color: "#666"
    }),
    l: common_vendor.o((...args) => $options.goToAddress && $options.goToAddress(...args)),
    m: common_vendor.p({
      type: "chat",
      size: "24",
      color: "#666"
    }),
    n: common_vendor.o((...args) => $options.goToMessage && $options.goToMessage(...args)),
    o: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#666"
    }),
    p: common_vendor.o((...args) => $options.goToSecurity && $options.goToSecurity(...args)),
    q: common_vendor.p({
      type: "eye",
      size: "24",
      color: "#666"
    }),
    r: common_vendor.o((...args) => $options.goToPrivacy && $options.goToPrivacy(...args)),
    s: common_vendor.p({
      type: "help",
      size: "24",
      color: "#666"
    }),
    t: common_vendor.o((...args) => $options.goToHelp && $options.goToHelp(...args)),
    v: $data.isLogin
  }, $data.isLogin ? {
    w: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {}), {
    x: common_vendor.p({
      defaultTab: "mine"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9023ef44"]]);
wx.createPage(MiniProgramPage);
