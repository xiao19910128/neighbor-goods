"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "TabBar",
  props: {
    defaultTab: {
      type: String,
      default: "home"
    }
  },
  data() {
    return {
      currentTab: this.defaultTab,
      // 底部tab的名称列表，用于动态生成底部导航项
      tabs: [
        { name: "闲置中心", type: "home", icon: "home-filled", url: "/pages/index/index" },
        { name: "发布", type: "publish", icon: "cloud-upload-filled", url: "/pages/publish/index" },
        // { name: '消息', type:'chatboxes', icon: 'chatboxes-filled', url: '/pages/message/index' },
        { name: "我的", type: "mine", icon: "person-filled", url: "/pages/mine/index" }
      ]
    };
  },
  methods: {
    switchBottomTab({ type = "", url = "/pages/index/index" }) {
      this.currentTab = type;
      common_vendor.index.navigateTo({ url });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.tabs, (item, index, i0) => {
      return {
        a: "7d9a6b19-0-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "30"
        }),
        c: common_vendor.t(item.name),
        d: common_vendor.n($data.currentTab === item.type ? "active" : ""),
        e: index,
        f: common_vendor.o(($event) => $options.switchBottomTab(item), index)
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7d9a6b19"]]);
wx.createComponent(Component);
