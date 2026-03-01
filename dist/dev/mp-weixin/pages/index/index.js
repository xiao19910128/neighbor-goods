"use strict";
const common_vendor = require("../../common/vendor.js");
const api_goods = require("../../api/goods.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  name: "IdleFishIndex",
  components: { TabBar },
  data() {
    return {
      products: [],
      // products: [
      //   {
      //     image: '/src/static/logo.png',
      //     title: '个人出售dji大疆osmo pocket',
      //     price: '¥20',
      //     wantCount: 417,
      //     seller: 'mrten先生 芝麻信用极好'
      //   },
      //   {
      //     image: '/src/static/logo.png',
      //     title: 'AirPods Pro 2 个人闲置',
      //     price: '¥300',
      //     wantCount: 523,
      //     seller: '青岛优... 芝麻信用优秀'
      //   },
      //   {
      //     image: '/src/static/logo.png',
      //     title: '全新未拆封iPhone 14 Pro',
      //     price: '¥8500',
      //     wantCount: 1245,
      //     seller: '科技爱好者 芝麻信用极好'
      //   },
      //   {
      //     image: '/src/static/logo.png',
      //     title: 'Nike Air Max 90 全新',
      //     price: '¥650',
      //     wantCount: 328,
      //     seller: '运动达人 芝麻信用优秀'
      //   }
      // ],
      searchValue: "",
      viewMode: "double"
      // 初始为双排模式
    };
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const listRes = await api_goods.goods.getGoodsList({ name: this.searchValue });
      this.products = listRes.data;
    },
    handleClear() {
      this.searchValue = "";
      this.getGoodsList();
    },
    handleSearch() {
      this.getGoodsList();
    },
    navigateTo(tabName, event) {
      const tabs = document.querySelectorAll(".nav-tabs span");
      tabs.forEach((tab) => tab.classList.remove("active"));
      if (event && event.target) {
        event.target.classList.add("active");
      }
      console.log("切换到标签:", tabName);
    },
    toDetail(product) {
      common_vendor.index.navigateTo({ url: "/pages/mine/index" });
    }
  }
};
if (!Array) {
  const _component_van_button = common_vendor.resolveComponent("van-button");
  const _component_van_search = common_vendor.resolveComponent("van-search");
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  (_component_van_button + _component_van_search + _component_TabBar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.handleSearch),
    b: common_vendor.p({
      size: "mini",
      type: "primary"
    }),
    c: common_vendor.o($options.handleSearch),
    d: common_vendor.o($options.handleClear),
    e: common_vendor.o(($event) => $data.searchValue = $event),
    f: common_vendor.p({
      placeholder: "请输入关键词筛选商品",
      shape: "round",
      background: "#f5f5f5",
      clearable: true,
      ["show-action"]: true,
      modelValue: $data.searchValue
    }),
    g: $data.products.length
  }, $data.products.length ? {
    h: common_vendor.f($data.products, (product, index, i0) => {
      return {
        a: product.image,
        b: common_vendor.t(product.name),
        c: common_vendor.t(product.price),
        d: index,
        e: common_vendor.o(($event) => $options.toDetail(product), index)
      };
    }),
    i: common_vendor.n($data.viewMode === "single" ? "single-column" : "double-column")
  } : {}, {
    j: common_vendor.p({
      defaultTab: "home"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
