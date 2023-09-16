"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiographiesPackage = void 0;
const caoanmin_1 = require("./caoanmin");
const caosong_1 = require("./caosong");
const dingyuan_1 = require("./dingyuan");
const dongcheng_1 = require("./dongcheng");
const hucheer_1 = require("./hucheer");
const qiuliju_1 = require("./qiuliju");
const wangrong_1 = require("./wangrong");
const xushao_1 = require("./xushao");
const yanrou_1 = require("./yanrou");
const BiographiesPackage = index => [
    new caosong_1.CaoSong(index++),
    new caoanmin_1.CaoAnMin(index++),
    new yanrou_1.YanRou(index++),
    new xushao_1.XuShao(index++),
    new wangrong_1.WangRong(index++),
    new dingyuan_1.DingYuan(index++),
    new dongcheng_1.DongCheng(index++),
    new hucheer_1.HuCheEr(index++),
    new qiuliju_1.QiuLiJu(index++),
];
exports.BiographiesPackage = BiographiesPackage;
