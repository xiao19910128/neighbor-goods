"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const _sfc_main = {
  data() {
    return {
      addressForm: {
        address_id: 0,
        name: "",
        phone: "",
        province: "上海市",
        city: "上海市",
        county: "闵行区",
        detail: "",
        is_default: 0
      }
    };
  },
  onLoad(options) {
    if (options.address) {
      let addr = JSON.parse(decodeURIComponent(options.address));
      this.addressForm = addr;
    }
  },
  methods: {
    onDefaultChange(e) {
      this.addressForm.is_default = e.detail.value.length ? 1 : 0;
    },
    async save() {
      const user = common_vendor.index.getStorageSync("userInfo");
      if (!user || !user.user_id) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/login/index" });
        }, 300);
        return;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.addressForm.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的11位手机号",
          icon: "none"
        });
        return;
      }
      const params = {
        ...this.addressForm,
        user_id: user.user_id
      };
      try {
        if (this.addressForm.address_id) {
          await api_address.addressApi.updateAddress(params);
          common_vendor.index.showToast({ title: "修改成功", icon: "none" });
        } else {
          await api_address.addressApi.addAddress(params);
          common_vendor.index.showToast({ title: "添加成功", icon: "none" });
        }
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      } catch (err) {
        console.error("❌ 保存失败：", err);
        common_vendor.index.showToast({ title: "保存失败", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.addressForm.name,
    b: common_vendor.o(($event) => $data.addressForm.name = $event.detail.value),
    c: $data.addressForm.phone,
    d: common_vendor.o(($event) => $data.addressForm.phone = $event.detail.value),
    e: $data.addressForm.detail,
    f: common_vendor.o(($event) => $data.addressForm.detail = $event.detail.value),
    g: $data.addressForm.is_default == 1,
    h: common_vendor.o((...args) => $options.onDefaultChange && $options.onDefaultChange(...args)),
    i: common_vendor.o((...args) => $options.save && $options.save(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-993447c4"]]);
wx.createPage(MiniProgramPage);
