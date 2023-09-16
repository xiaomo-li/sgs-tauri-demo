"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yuan6Package = void 0;
const cenhun_1 = require("./cenhun");
const liyan_1 = require("./liyan");
const sundeng_1 = require("./sundeng");
const sunziliufang_1 = require("./sunziliufang");
const zhangrang_1 = require("./zhangrang");
const Yuan6Package = index => [
    new sunziliufang_1.SunZiLiuFang(index++),
    new liyan_1.LiYan(index++),
    new sundeng_1.SunDeng(index++),
    new cenhun_1.CenHun(index++),
    new zhangrang_1.ZhangRang(index++),
];
exports.Yuan6Package = Yuan6Package;
