"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThunderCharacterPackage = void 0;
const chendao_1 = require("./chendao");
const guanqiujian_1 = require("./guanqiujian");
const haozhao_1 = require("./haozhao");
const lei_yuanshu_1 = require("./lei_yuanshu");
const lukang_1 = require("./lukang");
const zhangxiu_1 = require("./zhangxiu");
const zhoufei_1 = require("./zhoufei");
const zhugezhan_1 = require("./zhugezhan");
const ThunderCharacterPackage = index => [
    new haozhao_1.HaoZhao(index++),
    new guanqiujian_1.GuanQiuJian(index++),
    new chendao_1.ChenDao(index++),
    new zhugezhan_1.ZhuGeZhan(index++),
    new lukang_1.LuKang(index++),
    new zhoufei_1.ZhouFei(index++),
    new lei_yuanshu_1.LeiYuanShu(index++),
    new zhangxiu_1.ZhangXiu(index++),
];
exports.ThunderCharacterPackage = ThunderCharacterPackage;
