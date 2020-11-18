"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const wrappers_1 = require("quasar/wrappers");
exports.default = wrappers_1.boot(({ Vue }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Vue.prototype.$axios = axios_1.default;
});
//# sourceMappingURL=axios.js.map