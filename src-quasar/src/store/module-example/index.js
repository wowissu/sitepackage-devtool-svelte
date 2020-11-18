"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
const actions_1 = require("./actions");
const getters_1 = require("./getters");
const mutations_1 = require("./mutations");
const exampleModule = {
    namespaced: true,
    actions: actions_1.default,
    getters: getters_1.default,
    mutations: mutations_1.default,
    state: state_1.default
};
exports.default = exampleModule;
//# sourceMappingURL=index.js.map