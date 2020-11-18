"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrappers_1 = require("quasar/wrappers");
const vuex_1 = require("vuex");
exports.default = wrappers_1.store(function ({ Vue }) {
    Vue.use(vuex_1.default);
    const Store = new vuex_1.default.Store({
        modules: {
        // example
        },
        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: !!process.env.DEBUGGING
    });
    return Store;
});
//# sourceMappingURL=index.js.map