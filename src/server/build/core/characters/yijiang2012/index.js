"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJiang2012Package = void 0;
const bulianshi_1 = require("./bulianshi");
const chengpu_1 = require("./chengpu");
const guanxingzhangbao_1 = require("./guanxingzhangbao");
const handang_1 = require("./handang");
const liaohua_1 = require("./liaohua");
const liubiao_1 = require("./liubiao");
const madai_1 = require("./madai");
const wangyi_1 = require("./wangyi");
const xunyou_1 = require("./xunyou");
const zhonghui_1 = require("./zhonghui");
const YiJiang2012Package = index => [
    new xunyou_1.XunYou(index++),
    new zhonghui_1.ZhongHui(index++),
    new wangyi_1.WangYi(index++),
    new liaohua_1.LiaoHua(index++),
    new madai_1.MaDai(index++),
    new guanxingzhangbao_1.GuanXingZhangBao(index++),
    new handang_1.HanDang(index++),
    new chengpu_1.ChengPu(index++),
    new bulianshi_1.BuLianShi(index++),
    new liubiao_1.LiuBiao(index++),
];
exports.YiJiang2012Package = YiJiang2012Package;
