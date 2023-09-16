"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJiang2013Package = void 0;
const caochong_1 = require("./caochong");
const fuhuanghou_1 = require("./fuhuanghou");
const guanping_1 = require("./guanping");
const guohuai_1 = require("./guohuai");
const jianyong_1 = require("./jianyong");
const liru_1 = require("./liru");
const liufeng_1 = require("./liufeng");
const manchong_1 = require("./manchong");
const panzhangmazhong_1 = require("./panzhangmazhong");
const yufan_1 = require("./yufan");
const zhuran_1 = require("./zhuran");
const YiJiang2013Package = index => [
    new caochong_1.CaoChong(index++),
    new guanping_1.GuanPing(index++),
    new fuhuanghou_1.FuHuangHou(index++),
    new guohuai_1.GuoHuai(index++),
    new liru_1.LiRu(index++),
    new jianyong_1.JianYong(index++),
    new liufeng_1.LiuFeng(index++),
    new manchong_1.ManChong(index++),
    new panzhangmazhong_1.PanZhangMaZhong(index++),
    new yufan_1.YuFan(index++),
    new zhuran_1.ZhuRan(index++),
];
exports.YiJiang2013Package = YiJiang2013Package;
