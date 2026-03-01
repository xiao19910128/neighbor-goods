"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  name: "PublishPage",
  components: { TabBar },
  methods: {
    goBack() {
      console.log("返回上一页");
    },
    submitForm() {
      console.log("提交发布表单");
    }
  }
};
if (!Array) {
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  _component_TabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    c: common_vendor.f(3, (i, k0, i0) => {
      return {
        a: i
      };
    }),
    d: common_assets._imports_0,
    e: common_vendor.p({
      defaultTab: "publish"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ce8f53b1"]]);
wx.createPage(MiniProgramPage);
