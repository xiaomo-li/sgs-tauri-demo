"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerConfig = void 0;
function getServerConfig(flavor) {
    switch (flavor) {
        case "dev" /* Dev */:
            return {
                mode: "dev" /* Dev */,
                port: 2020,
                language: "zh-CN" /* ZH_CN */,
            };
        case "prod" /* Prod */:
            return {
                mode: "prod" /* Prod */,
                port: 2020,
                language: "zh-CN" /* ZH_CN */,
            };
        default:
            throw Error(`invalid flavor: ${flavor}`);
    }
}
exports.getServerConfig = getServerConfig;
