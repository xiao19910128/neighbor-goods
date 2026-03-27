"use strict";
const common_vendor = require("../../common/vendor.js");
const api_goods = require("../../api/goods.js");
const _sfc_main = {
  data() {
    return {
      goodsList: [],
      // 我发布的商品列表
      page: 1,
      // 当前页码
      size: 10,
      // 每页条数
      loading: false,
      // 加载状态
      hasMore: true,
      // 是否有更多数据
      loadMoreStatus: "more",
      // 加载更多状态：more/noMore/loading
      userInfo: {}
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.getPublishedGoods();
  },
  onLoad(options) {
    if (options.from === "publish") {
      common_vendor.index.showToast({ title: "发布成功！", icon: "success" });
    }
  },
  methods: {
    // 获取我发布的商品列表
    async getPublishedGoods() {
      var _a, _b;
      try {
        this.loading = true;
        this.loadMoreStatus = "loading";
        const publishedRes = await api_goods.goodsApi.getGoodsPublished({
          page: this.page,
          size: this.size,
          user_id: (_a = this.userInfo) == null ? void 0 : _a.user_id
        });
        if ((publishedRes == null ? void 0 : publishedRes.code) === 200) {
          const { list, pagination } = publishedRes == null ? void 0 : publishedRes.data;
          const commonList = list.map((item) => {
            var _a2;
            return {
              ...item,
              fileList: ((_a2 = item.image_url) == null ? void 0 : _a2.split(",")) || []
            };
          });
          if (this.page === 1) {
            this.goodsList = [].concat(commonList);
          } else {
            this.goodsList = this.goodsList.concat(commonList);
          }
          this.hasMore = ((_b = this.goodsList) == null ? void 0 : _b.length) < pagination.total;
          this.loadMoreStatus = this.hasMore ? "more" : "noMore";
        }
      } catch (err) {
        common_vendor.index.showToast({ title: "获取数据失败", icon: "none" });
      } finally {
        this.loading = false;
        this.loadMoreStatus = "more";
      }
    },
    // 加载更多
    loadMore() {
      if (!this.hasMore)
        return;
      this.page++;
      this.getPublishedGoods();
    },
    // 格式化时间
    formatTime(time) {
      if (!time)
        return "";
      const date = new Date(time);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    // 跳转到发布页
    gotoPublish() {
      common_vendor.index.switchTab({ url: "/pages/publish/index" });
    },
    // 跳转到商品详情
    gotoDetail(goodsId) {
      common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${goodsId}` });
    },
    // 编辑商品
    editGoods(goods) {
      common_vendor.index.switchTab({ url: `/pages/publish/index?goods_id=${goods.goods_id}` });
    },
    // 删除商品
    async deleteGoods(goods_id) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "删除后无法恢复，确定要删除吗？",
        success: async (res) => {
          var _a;
          if (res.confirm) {
            try {
              const delRes = await api_goods.goodsApi.deleteGoods({ goods_id, user_id: (_a = this.userInfo) == null ? void 0 : _a.user_id });
              if ((delRes == null ? void 0 : delRes.code) === 200) {
                common_vendor.index.showToast({ title: "删除成功" });
                this.page = 1;
                this.getPublishedGoods();
              }
            } catch (err) {
              common_vendor.index.showToast({ title: (err == null ? void 0 : err.message) || (err == null ? void 0 : err.msg), icon: "none" });
            }
          }
        }
      });
    },
    // 映射审核状态文字
    getStatusText(status) {
      const statusMap = {
        0: "待审核",
        1: "审核通过",
        2: "审核拒绝",
        3: "已下架"
      };
      return statusMap[status] || "未知状态";
    },
    // 映射状态标签样式类
    getStatusClass(status) {
      const classMap = {
        0: "status-pending",
        1: "status-pass",
        2: "status-reject",
        3: "status-offline"
      };
      return classMap[status] || "status-default";
    }
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMore();
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.goodsList.length === 0 && !$data.loading
  }, $data.goodsList.length === 0 && !$data.loading ? {
    b: common_vendor.p({
      type: "shop",
      size: "40",
      color: "#666"
    }),
    c: common_vendor.o((...args) => $options.gotoPublish && $options.gotoPublish(...args))
  } : {
    d: common_vendor.f($data.goodsList, (item, k0, i0) => {
      return {
        a: item.fileList[0],
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.t(item.street),
        e: common_vendor.t($options.getStatusText(item.audit_status)),
        f: common_vendor.n($options.getStatusClass(item.audit_status)),
        g: common_vendor.o(($event) => $options.editGoods(item), item.goods_id),
        h: common_vendor.o(($event) => $options.deleteGoods(item.goods_id), item.goods_id),
        i: item.goods_id
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-46ffa584"]]);
wx.createPage(MiniProgramPage);
