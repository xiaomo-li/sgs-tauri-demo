"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobilePackage = void 0;
const dengzhi_1 = require("./dengzhi");
const fuqian_1 = require("./fuqian");
const gongsunkang_1 = require("./gongsunkang");
const hujinding_1 = require("./hujinding");
const jiakui_1 = require("./jiakui");
const lifeng_1 = require("./lifeng");
const lingcao_1 = require("./lingcao");
const liuzan_1 = require("./liuzan");
const maojie_1 = require("./maojie");
const mayuanyi_1 = require("./mayuanyi");
const mobile_furong_1 = require("./mobile_furong");
const mobile_sufei_1 = require("./mobile_sufei");
const simashi_1 = require("./simashi");
const simazhao_1 = require("./simazhao");
const sunru_1 = require("./sunru");
const wangyuanji_1 = require("./wangyuanji");
const xing_ganning_1 = require("./xing_ganning");
const xing_huangzhong_1 = require("./xing_huangzhong");
const yangbiao_1 = require("./yangbiao");
const yanghuiyu_1 = require("./yanghuiyu");
const yanpu_1 = require("./yanpu");
const zhuling_1 = require("./zhuling");
const MobilePackage = index => [
    new zhuling_1.ZhuLing(index++),
    new simazhao_1.SiMaZhao(index++),
    new wangyuanji_1.WangYuanJi(index++),
    new jiakui_1.JiaKui(index++),
    new simashi_1.SiMaShi(index++),
    new yanghuiyu_1.YangHuiYu(index++),
    new maojie_1.MaoJie(index++),
    new lifeng_1.LiFeng(index++),
    new dengzhi_1.DengZhi(index++),
    new mobile_furong_1.MobileFuRong(index++),
    new hujinding_1.HuJinDing(index++),
    new fuqian_1.FuQian(index++),
    new lingcao_1.LingCao(index++),
    new sunru_1.SunRu(index++),
    new liuzan_1.LiuZan(index++),
    new yangbiao_1.YangBiao(index++),
    new mobile_sufei_1.MobileSuFei(index++),
    new xing_ganning_1.XingGanNing(index++),
    new gongsunkang_1.GongSunKang(index++),
    new mayuanyi_1.MaYuanYi(index++),
    new yanpu_1.YanPu(index++),
    new xing_huangzhong_1.XingHuangZhong(index++),
];
exports.MobilePackage = MobilePackage;
