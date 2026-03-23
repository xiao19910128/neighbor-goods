"use strict";
const utils_https = require("../utils/https.js");
const userApi = {
  wxLogin(data) {
    return utils_https.service({
      url: "/users/wxLogin",
      method: "post",
      data
    });
  },
  wxLogout(data) {
    return utils_https.service({
      url: "/users/wxLogout",
      method: "post",
      data
    });
  },
  getSmsCode(data) {
    return utils_https.service({
      url: "/users/getSmsCode",
      method: "post",
      data
    });
  },
  phoneLogin(data) {
    return utils_https.service({
      url: "/users/phoneLogin",
      method: "post",
      data
    });
  }
};
exports.userApi = userApi;
