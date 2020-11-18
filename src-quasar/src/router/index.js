"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrappers_1 = require("quasar/wrappers");
const vue_router_1 = require("vue-router");
const routes_1 = require("./routes");
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
exports.default = wrappers_1.route(function ({ Vue }) {
    Vue.use(vue_router_1.default);
    const Router = new vue_router_1.default({
        scrollBehavior: () => ({ x: 0, y: 0 }),
        routes: routes_1.default,
        // Leave these as is and change from quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        mode: process.env.VUE_ROUTER_MODE,
        base: process.env.VUE_ROUTER_BASE
    });
    return Router;
});
//# sourceMappingURL=index.js.map