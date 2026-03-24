"use strict";
const utils_https = require("../utils/https.js");
const collectionsApi = {
  toggleCollection(data) {
    return utils_https.service({
      url: "/collections/toggle",
      method: "post",
      data
    });
  },
  getCollectStatus(data) {
    return utils_https.service({
      url: "/collections/status",
      method: "get",
      data
    });
  }
};
exports.collectionsApi = collectionsApi;
