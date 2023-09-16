"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestCharacterPackage = void 0;
const caopi_1 = require("./caopi");
const dongzhuo_1 = require("./dongzhuo");
const jiaxu_1 = require("./jiaxu");
const lusu_1 = require("./lusu");
const menghuo_1 = require("./menghuo");
const sunjian_1 = require("./sunjian");
const xuhuang_1 = require("./xuhuang");
const zhurong_1 = require("./zhurong");
const ForestCharacterPackage = index => [
    new caopi_1.CaoPi(index++),
    new xuhuang_1.XuHuang(index++),
    new menghuo_1.MengHuo(index++),
    new zhurong_1.ZhuRong(index++),
    new sunjian_1.SunJian(index++),
    new lusu_1.Lusu(index++),
    new dongzhuo_1.DongZhuo(index++),
    new jiaxu_1.JiaXu(index++),
];
exports.ForestCharacterPackage = ForestCharacterPackage;
