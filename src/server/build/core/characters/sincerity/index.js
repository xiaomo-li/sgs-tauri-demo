"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SincerityCharacterPackage = void 0;
const kongrong_1 = require("./kongrong");
const mifuren_1 = require("./mifuren");
const wangfuzhaolei_1 = require("./wangfuzhaolei");
const wangling_1 = require("./wangling");
const wujing_1 = require("./wujing");
const xin_xinpi_1 = require("./xin_xinpi");
const zhouchu_1 = require("./zhouchu");
const SincerityCharacterPackage = index => [
    new wangling_1.WangLing(index++),
    new xin_xinpi_1.XinXinPi(index++),
    new wangfuzhaolei_1.WangFuZhaoLei(index++),
    new mifuren_1.MiFuRen(index++),
    new wujing_1.WuJing(index++),
    new zhouchu_1.ZhouChu(index++),
    new kongrong_1.KongRong(index++),
];
exports.SincerityCharacterPackage = SincerityCharacterPackage;
