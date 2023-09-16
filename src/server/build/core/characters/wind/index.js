"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindCharacterPackage = void 0;
const caoren_1 = require("./caoren");
const huangzhong_1 = require("./huangzhong");
const weiyan_1 = require("./weiyan");
const xiahouyuan_1 = require("./xiahouyuan");
const xiaoqiao_1 = require("./xiaoqiao");
const yuji_1 = require("./yuji");
const zhangjiao_1 = require("./zhangjiao");
const zhoutai_1 = require("./zhoutai");
const WindCharacterPackage = index => [
    new caoren_1.CaoRen(index++),
    new xiahouyuan_1.XiaHouYuan(index++),
    new weiyan_1.Weiyan(index++),
    new huangzhong_1.HuangZhong(index++),
    new zhoutai_1.ZhouTai(index++),
    new yuji_1.YuJi(index++),
    new zhangjiao_1.ZhangJiao(index++),
    new xiaoqiao_1.XiaoQiao(index++),
];
exports.WindCharacterPackage = WindCharacterPackage;
