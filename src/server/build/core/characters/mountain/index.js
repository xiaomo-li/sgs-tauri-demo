"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountainCharacterPackage = void 0;
const caiwenji_1 = require("./caiwenji");
const dengai_1 = require("./dengai");
const erzhang_1 = require("./erzhang");
const jiangwei_1 = require("./jiangwei");
const liushan_1 = require("./liushan");
const sunce_1 = require("./sunce");
const zhanghe_1 = require("./zhanghe");
const zuoci_1 = require("./zuoci");
const MountainCharacterPackage = index => [
    new dengai_1.DengAi(index++),
    new zhanghe_1.ZhangHe(index++),
    new caiwenji_1.CaiWenJi(index++),
    new jiangwei_1.JiangWei(index++),
    new liushan_1.LiuShan(index++),
    new sunce_1.SunCe(index++),
    new erzhang_1.ErZhang(index++),
    new zuoci_1.ZuoCi(index++),
];
exports.MountainCharacterPackage = MountainCharacterPackage;
