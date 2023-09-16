"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJiang2014Package = void 0;
const caifuren_1 = require("./caifuren");
const caozhen_1 = require("./caozhen");
const chenqun_1 = require("./chenqun");
const guyong_1 = require("./guyong");
const hanhaoshihuan_1 = require("./hanhaoshihuan");
const sunluban_1 = require("./sunluban");
const wuyi_1 = require("./wuyi");
const yjcm_jushou_1 = require("./yjcm_jushou");
const zhangsong_1 = require("./zhangsong");
const zhoucang_1 = require("./zhoucang");
const zhuhuan_1 = require("./zhuhuan");
const YiJiang2014Package = index => [
    new caozhen_1.CaoZhen(index++),
    new hanhaoshihuan_1.HanHaoShiHuan(index++),
    new chenqun_1.ChenQun(index++),
    new wuyi_1.WuYi(index++),
    new zhangsong_1.ZhangSong(index++),
    new zhoucang_1.ZhouCang(index++),
    new guyong_1.GuYong(index++),
    new sunluban_1.SunLuBan(index++),
    new zhuhuan_1.ZhuHuan(index++),
    new yjcm_jushou_1.YjcmJuShou(index++),
    new caifuren_1.CaiFuRen(index++),
];
exports.YiJiang2014Package = YiJiang2014Package;
