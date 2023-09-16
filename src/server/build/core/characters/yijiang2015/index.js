"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJiang2015Package = void 0;
const caorui_1 = require("./caorui");
const caoxiu_1 = require("./caoxiu");
const gongsunyuan_1 = require("./gongsunyuan");
const guotupangji_1 = require("./guotupangji");
const liuchen_1 = require("./liuchen");
const quancong_1 = require("./quancong");
const sunxiu_1 = require("./sunxiu");
const xiahoushi_1 = require("./xiahoushi");
const zhangni_1 = require("./zhangni");
const zhongyao_1 = require("./zhongyao");
const zhuzhi_1 = require("./zhuzhi");
const YiJiang2015Package = index => [
    new caorui_1.CaoRui(index++),
    new caoxiu_1.CaoXiu(index++),
    new zhongyao_1.ZhongYao(index++),
    new liuchen_1.LiuChen(index++),
    new xiahoushi_1.XiaHouShi(index++),
    new zhangni_1.ZhangNi(index++),
    new quancong_1.QuanCong(index++),
    new sunxiu_1.SunXiu(index++),
    new zhuzhi_1.ZhuZhi(index++),
    new gongsunyuan_1.GongSunYuan(index++),
    new guotupangji_1.GuoTuPangJi(index++),
];
exports.YiJiang2015Package = YiJiang2015Package;
