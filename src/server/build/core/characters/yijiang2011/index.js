"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJiang2011Package = void 0;
const caozhi_1 = require("./caozhi");
const chengong_1 = require("./chengong");
const fazheng_1 = require("./fazheng");
const gaoshun_1 = require("./gaoshun");
const lingtong_1 = require("./lingtong");
const masu_1 = require("./masu");
const wuguotai_1 = require("./wuguotai");
const xusheng_1 = require("./xusheng");
const xushu_1 = require("./xushu");
const yujin_1 = require("./yujin");
const zhangchunhua_1 = require("./zhangchunhua");
const YiJiang2011Package = index => [
    new caozhi_1.CaoZhi(index++),
    new zhangchunhua_1.ZhangChunHua(index++),
    new yujin_1.YuJin(index++),
    new fazheng_1.FaZheng(index++),
    new masu_1.MaSu(index++),
    new xushu_1.XuShu(index++),
    new xusheng_1.XuSheng(index++),
    new wuguotai_1.WuGuoTai(index++),
    new lingtong_1.LingTong(index++),
    new chengong_1.ChenGong(index++),
    new gaoshun_1.GaoShun(index++),
];
exports.YiJiang2011Package = YiJiang2011Package;
