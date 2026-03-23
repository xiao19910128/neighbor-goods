"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const _sfc_main = {
  data() {
    return {
      loginType: "wechat",
      // 默认微信登录
      phone: "",
      smsCode: "",
      countDown: 0,
      // 验证码倒计时
      timer: null
      // 定时器
    };
  },
  methods: {
    // 微信登录（整合之前的授权逻辑）
    async wxLogin(e) {
      try {
        const profile = e.detail.userInfo;
        if (!profile)
          throw new Error("取消授权");
        console.log(111, profile);
        const loginRes = await new Promise((resolve) => {
          common_vendor.index.login({ provider: "weixin", success: resolve });
        });
        console.log(33333, loginRes);
        const res = await api_user.userApi.wxLogin({
          code: loginRes.code,
          nickName: profile.nickName,
          avatarUrl: profile.avatarUrl
        });
        console.log(33333, res);
        common_vendor.index.setStorageSync("token", res.data.token);
        common_vendor.index.setStorageSync("userInfo", res.data.userInfo);
        common_vendor.index.showToast({ title: "登录成功" });
        common_vendor.index.navigateBack();
      } catch (err) {
        common_vendor.index.showToast({ title: "登录失败", icon: "none" });
      }
    },
    // 获取验证码
    async getSmsCode() {
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.phone)) {
        return common_vendor.index.showToast({ title: "手机号格式错误", icon: "none" });
      }
      const res = await api_user.userApi.getSmsCode({ phone: this.phone });
      if (res.code === 200) {
        this.countDown = 60;
        this.timer = setInterval(() => {
          this.countDown--;
          if (this.countDown <= 0) {
            clearInterval(this.timer);
          }
        }, 1e3);
      }
    },
    // 手机号登录
    async phoneLogin() {
      if (!this.phone || !this.smsCode) {
        return common_vendor.index.showToast({ title: "手机号/验证码不能为空", icon: "none" });
      }
      const res = await api_user.userApi.phoneLogin({
        phone: this.phone,
        smsCode: this.smsCode
      });
      if (res.code === 200) {
        common_vendor.index.setStorageSync("token", res.data.token);
        common_vendor.index.setStorageSync("userInfo", res.data.userInfo);
        common_vendor.index.showToast({ title: "登录成功" });
        common_vendor.index.navigateBack();
      }
    }
  },
  onUnload() {
    if (this.timer)
      clearInterval(this.timer);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loginType === "wechat" ? 1 : "",
    b: common_vendor.o(($event) => $data.loginType = "wechat"),
    c: $data.loginType === "phone" ? 1 : "",
    d: common_vendor.o(($event) => $data.loginType = "phone"),
    e: $data.loginType === "wechat"
  }, $data.loginType === "wechat" ? {
    f: common_vendor.o((...args) => $options.wxLogin && $options.wxLogin(...args))
  } : {}, {
    g: $data.loginType === "phone"
  }, $data.loginType === "phone" ? {
    h: $data.phone,
    i: common_vendor.o(($event) => $data.phone = $event.detail.value),
    j: $data.smsCode,
    k: common_vendor.o(($event) => $data.smsCode = $event.detail.value),
    l: common_vendor.t($data.countDown > 0 ? `${$data.countDown}s后重新获取` : "获取验证码"),
    m: common_vendor.o((...args) => $options.getSmsCode && $options.getSmsCode(...args)),
    n: $data.countDown > 0,
    o: common_vendor.o((...args) => $options.phoneLogin && $options.phoneLogin(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-45258083"]]);
wx.createPage(MiniProgramPage);
