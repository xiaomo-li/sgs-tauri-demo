"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodCharacterPackage = void 0;
const god_caocao_1 = require("./god_caocao");
const god_ganning_1 = require("./god_ganning");
const god_guanyu_1 = require("./god_guanyu");
const god_guojia_1 = require("./god_guojia");
const god_jiangwei_1 = require("./god_jiangwei");
const god_liubei_1 = require("./god_liubei");
const god_luxun_1 = require("./god_luxun");
const god_lvbu_1 = require("./god_lvbu");
const god_lvmeng_1 = require("./god_lvmeng");
const god_simayi_1 = require("./god_simayi");
const god_sunce_1 = require("./god_sunce");
const god_taishici_1 = require("./god_taishici");
const god_xunyu_1 = require("./god_xunyu");
const god_zhangliao_1 = require("./god_zhangliao");
const god_zhaoyun_1 = require("./god_zhaoyun");
const god_zhouyu_1 = require("./god_zhouyu");
const god_zhugeliang_1 = require("./god_zhugeliang");
const GodCharacterPackage = index => [
    new god_guanyu_1.GodGuanYu(index++),
    new god_lvmeng_1.GodLvMeng(index++),
    new god_zhouyu_1.GodZhouYu(index++),
    new god_zhugeliang_1.GodZhuGeLiang(index++),
    new god_caocao_1.GodCaoCao(index++),
    new god_lvbu_1.GodLvBu(index++),
    new god_zhaoyun_1.GodZhaoYun(index++),
    new god_simayi_1.GodSiMaYi(index++),
    new god_liubei_1.GodLiuBei(index++),
    new god_luxun_1.GodLuXun(index++),
    new god_zhangliao_1.GodZhangLiao(index++),
    new god_ganning_1.GodGanNing(index++),
    new god_guojia_1.GodGuoJia(index++),
    new god_taishici_1.GodTaiShiCi(index++),
    new god_sunce_1.GodSunCe(index++),
    new god_xunyu_1.GodXunYu(index++),
    new god_jiangwei_1.GodJiangWei(index++),
];
exports.GodCharacterPackage = GodCharacterPackage;
