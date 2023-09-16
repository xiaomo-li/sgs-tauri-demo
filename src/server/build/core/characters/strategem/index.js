"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategemPackage = void 0;
const mou_huaxiong_1 = require("./mou_huaxiong");
const mou_lvmeng_1 = require("./mou_lvmeng");
const mou_sunquan_1 = require("./mou_sunquan");
const mou_yujin_1 = require("./mou_yujin");
const mou_huangzhong_1 = require("../strategem/mou_huangzhong");
const StrategemPackage = index => [
    new mou_yujin_1.MouYuJin(index++),
    new mou_huangzhong_1.MouHuangZhong(index++),
    new mou_sunquan_1.MouSunQuan(index++),
    new mou_lvmeng_1.MouLvMeng(index++),
    new mou_huaxiong_1.MouHuaXiong(index++),
];
exports.StrategemPackage = StrategemPackage;
