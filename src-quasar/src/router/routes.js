"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = [
    {
        path: '/',
        component: () => Promise.resolve().then(() => require('layouts/MainLayout.vue')),
        children: [
            { path: '', component: () => Promise.resolve().then(() => require('pages/Index.vue')) }
        ]
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '*',
        component: () => Promise.resolve().then(() => require('pages/Error404.vue'))
    }
];
exports.default = routes;
//# sourceMappingURL=routes.js.map