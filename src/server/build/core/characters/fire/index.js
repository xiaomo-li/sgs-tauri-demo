"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireCharacterPackage = void 0;
const dianwei_1 = require("./dianwei");
const pangde_1 = require("./pangde");
const pangtong_1 = require("./pangtong");
const taishici_1 = require("./taishici");
const wolong_1 = require("./wolong");
const xunyu_1 = require("./xunyu");
const yanliangwenchou_1 = require("./yanliangwenchou");
const yuanshao_1 = require("./yuanshao");
const FireCharacterPackage = index => [
    new dianwei_1.DianWei(index++),
    new xunyu_1.XunYu(index++),
    new wolong_1.WoLong(index++),
    new pangtong_1.PangTong(index++),
    new taishici_1.TaiShiCi(index++),
    new yuanshao_1.YuanShao(index++),
    new pangde_1.Pangde(index++),
    new yanliangwenchou_1.YanLiangWenChou(index++),
];
exports.FireCharacterPackage = FireCharacterPackage;
