"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PvePackage = void 0;
const pve_longshen_1 = require("./pve_longshen");
const pve_soldier_1 = require("./pve_soldier");
const guansuo_1 = require("../limited/guansuo");
const PvePackage = index => [
    new pve_longshen_1.PveLongShen(index++),
    new pve_soldier_1.PveSoldier(index++),
    new pve_soldier_1.PveQiSha(index++),
    new pve_soldier_1.PveTianJi(index++),
    new pve_soldier_1.PveTianLiang(index++),
    new pve_soldier_1.PveTianTong(index++),
    new pve_soldier_1.PveTianXiang(index++),
    new pve_soldier_1.PveLianZhen(index++),
    new guansuo_1.GuanSuo(index++),
];
exports.PvePackage = PvePackage;
