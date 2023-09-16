"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WisdomPackage = void 0;
const bianfuren_1 = require("./bianfuren");
const chenzhen_1 = require("./chenzhen");
const feiyi_1 = require("./feiyi");
const luotong_1 = require("./luotong");
const zhi_duyu_1 = require("./zhi_duyu");
const zhi_sunshao_1 = require("./zhi_sunshao");
const zhi_wangcan_1 = require("./zhi_wangcan");
const zhi_xunchen_1 = require("./zhi_xunchen");
const WisdomPackage = index => [
    new zhi_wangcan_1.ZhiWangCan(index++),
    new bianfuren_1.BianFuRen(index++),
    new chenzhen_1.ChenZhen(index++),
    new feiyi_1.FeiYi(index++),
    new luotong_1.LuoTong(index++),
    new zhi_xunchen_1.ZhiXunChen(index++),
    new zhi_duyu_1.ZhiDuYu(index++),
    new zhi_sunshao_1.ZhiSunShao(index++),
];
exports.WisdomPackage = WisdomPackage;
