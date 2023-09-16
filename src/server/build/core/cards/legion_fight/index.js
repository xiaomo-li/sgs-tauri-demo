"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegionFightCardPackage = void 0;
const alcohol_1 = require("./alcohol");
const baiyinshizi_1 = require("./baiyinshizi");
const bingliangcunduan_1 = require("./bingliangcunduan");
const fire_attack_1 = require("./fire_attack");
const fire_slash_1 = require("./fire_slash");
const gudingdao_1 = require("./gudingdao");
const hualiu_1 = require("./hualiu");
const muniuliuma_1 = require("./muniuliuma");
const tengjia_1 = require("./tengjia");
const thunder_slash_1 = require("./thunder_slash");
const tiesuolianhuan_1 = require("./tiesuolianhuan");
const zhuqueyushan_1 = require("./zhuqueyushan");
const jink_1 = require("../standard/jink");
const peach_1 = require("../standard/peach");
const wuxiekeji_1 = require("../standard/wuxiekeji");
const LegionFightCardPackage = index => [
    new fire_attack_1.FireAttack(index++, 2, 2 /* Heart */),
    new fire_attack_1.FireAttack(index++, 3, 2 /* Heart */),
    new fire_attack_1.FireAttack(index++, 12, 4 /* Diamond */),
    new bingliangcunduan_1.BingLiangCunDuan(index++, 10, 1 /* Spade */),
    new bingliangcunduan_1.BingLiangCunDuan(index++, 4, 3 /* Club */),
    new gudingdao_1.GuDingDao(index++, 1, 1 /* Spade */),
    new zhuqueyushan_1.ZhuQueYuShan(index++, 1, 4 /* Diamond */),
    new tengjia_1.TengJia(index++, 2, 1 /* Spade */),
    new tengjia_1.TengJia(index++, 2, 3 /* Club */),
    new baiyinshizi_1.BaiYinShiZi(index++, 1, 3 /* Club */),
    new muniuliuma_1.MuNiuLiuMa(index++, 5, 4 /* Diamond */),
    new peach_1.Peach(index++, 5, 2 /* Heart */),
    new peach_1.Peach(index++, 6, 2 /* Heart */),
    new peach_1.Peach(index++, 2, 4 /* Diamond */),
    new peach_1.Peach(index++, 3, 4 /* Diamond */),
    new jink_1.Jink(index++, 8, 2 /* Heart */),
    new jink_1.Jink(index++, 9, 2 /* Heart */),
    new jink_1.Jink(index++, 11, 2 /* Heart */),
    new jink_1.Jink(index++, 12, 2 /* Heart */),
    new jink_1.Jink(index++, 6, 4 /* Diamond */),
    new jink_1.Jink(index++, 7, 4 /* Diamond */),
    new jink_1.Jink(index++, 8, 4 /* Diamond */),
    new jink_1.Jink(index++, 10, 4 /* Diamond */),
    new jink_1.Jink(index++, 11, 4 /* Diamond */),
    new wuxiekeji_1.WuXieKeJi(index++, 13, 1 /* Spade */),
    new wuxiekeji_1.WuXieKeJi(index++, 1, 2 /* Heart */),
    new wuxiekeji_1.WuXieKeJi(index++, 13, 2 /* Heart */),
    new thunder_slash_1.ThunderSlash(index++, 4, 1 /* Spade */),
    new thunder_slash_1.ThunderSlash(index++, 5, 1 /* Spade */),
    new thunder_slash_1.ThunderSlash(index++, 6, 1 /* Spade */),
    new thunder_slash_1.ThunderSlash(index++, 7, 1 /* Spade */),
    new thunder_slash_1.ThunderSlash(index++, 8, 1 /* Spade */),
    new thunder_slash_1.ThunderSlash(index++, 6, 3 /* Club */),
    new thunder_slash_1.ThunderSlash(index++, 7, 3 /* Club */),
    new thunder_slash_1.ThunderSlash(index++, 8, 3 /* Club */),
    new fire_slash_1.FireSlash(index++, 4, 2 /* Heart */),
    new fire_slash_1.FireSlash(index++, 7, 2 /* Heart */),
    new fire_slash_1.FireSlash(index++, 10, 2 /* Heart */),
    new fire_slash_1.FireSlash(index++, 4, 4 /* Diamond */),
    new fire_slash_1.FireSlash(index++, 5, 4 /* Diamond */),
    new tiesuolianhuan_1.TieSuoLianHuan(index++, 11, 1 /* Spade */),
    new tiesuolianhuan_1.TieSuoLianHuan(index++, 12, 1 /* Spade */),
    new tiesuolianhuan_1.TieSuoLianHuan(index++, 10, 3 /* Club */),
    new tiesuolianhuan_1.TieSuoLianHuan(index++, 11, 3 /* Club */),
    new tiesuolianhuan_1.TieSuoLianHuan(index++, 12, 3 /* Club */),
    new tiesuolianhuan_1.TieSuoLianHuan(index++, 13, 3 /* Club */),
    new alcohol_1.Alcohol(index++, 3, 1 /* Spade */),
    new alcohol_1.Alcohol(index++, 9, 1 /* Spade */),
    new alcohol_1.Alcohol(index++, 3, 3 /* Club */),
    new alcohol_1.Alcohol(index++, 9, 3 /* Club */),
    new alcohol_1.Alcohol(index++, 9, 4 /* Diamond */),
    new hualiu_1.HuaLiu(index++, 13, 4 /* Diamond */),
];
exports.LegionFightCardPackage = LegionFightCardPackage;
