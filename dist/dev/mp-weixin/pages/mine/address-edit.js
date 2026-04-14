"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const _sfc_main = {
  data() {
    return {
      addressForm: {
        address_id: 0,
        contact_name: "",
        contact_phone: "",
        province: "上海市",
        city: "上海市",
        district: "闵行区",
        detail_address: "",
        is_default: 0,
        street: "梅陇镇",
        streetName: "梅陇镇"
      },
      streetList: ["梅陇镇", "莘庄镇", "七宝镇", "颛桥镇", "华漕镇", "虹桥镇", "吴泾镇", "马桥镇", "浦江镇", "江川路街道", "古美街道", "新虹街道", "浦锦街道", "莘庄工业区"]
      // 街道列表
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
      var _a;
      const user = common_vendor.index.getStorageSync("userInfo");
      if (!user || !user.user_id) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/login/index" });
        }, 300);
        return;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test((_a = this.addressForm) == null ? void 0 : _a.contact_phone)) {
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
    },
    // 2. 处理街道/社区变化
    handleStreetChange(e) {
      this.addressForm.street = this.streetList[e.detail.value];
      this.addressForm.streetName = this.addressForm.street;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.addressForm.contact_name,
    b: common_vendor.o(($event) => $data.addressForm.contact_name = $event.detail.value),
    c: $data.addressForm.contact_phone,
    d: common_vendor.o(($event) => $data.addressForm.contact_phone = $event.detail.value),
    e: common_vendor.t($data.addressForm.streetName),
    f: $data.streetList,
    g: common_vendor.o((...args) => $options.handleStreetChange && $options.handleStreetChange(...args)),
    h: $data.addressForm.detail_address,
    i: common_vendor.o(($event) => $data.addressForm.detail_address = $event.detail.value),
    j: $data.addressForm.is_default == 1,
    k: common_vendor.o((...args) => $options.onDefaultChange && $options.onDefaultChange(...args)),
    l: common_vendor.o((...args) => $options.save && $options.save(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-993447c4"]]);
wx.createPage(MiniProgramPage);
