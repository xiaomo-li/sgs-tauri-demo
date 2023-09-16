"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowCharacterPackage = void 0;
const kuaiyuekuailiang_1 = require("./kuaiyuekuailiang");
const luji_1 = require("./luji");
const luzhi_1 = require("./luzhi");
const sunliang_1 = require("./sunliang");
const wangji_1 = require("./wangji");
const wangping_1 = require("./wangping");
const xuyou_1 = require("./xuyou");
const yanyan_1 = require("./yanyan");
const ShadowCharacterPackage = index => [
    new wangji_1.WangJi(index++),
    new kuaiyuekuailiang_1.KuaiYueKuaiLiang(index++),
    new yanyan_1.YanYan(index++),
    new wangping_1.WangPing(index++),
    new luji_1.LuJi(index++),
    new sunliang_1.SunLiang(index++),
    new xuyou_1.XuYou(index++),
    new luzhi_1.LuZhi(index++),
];
exports.ShadowCharacterPackage = ShadowCharacterPackage;
