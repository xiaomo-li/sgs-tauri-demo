"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardCardPackage = void 0;
const baguazhen_1 = require("./baguazhen");
const chitu_1 = require("./chitu");
const cixiongjian_1 = require("./cixiongjian");
const dayuan_1 = require("./dayuan");
const dilu_1 = require("./dilu");
const duel_1 = require("./duel");
const fangtianhuaji_1 = require("./fangtianhuaji");
const guanshifu_1 = require("./guanshifu");
const guohechaiqiao_1 = require("./guohechaiqiao");
const hanbingjian_1 = require("./hanbingjian");
const jiedaosharen_1 = require("./jiedaosharen");
const jink_1 = require("./jink");
const jueying_1 = require("./jueying");
const lebusishu_1 = require("./lebusishu");
const lightning_1 = require("./lightning");
const nanmanruqing_1 = require("./nanmanruqing");
const peach_1 = require("./peach");
const qilingong_1 = require("./qilingong");
const qinggang_1 = require("./qinggang");
const qinglongdao_1 = require("./qinglongdao");
const renwangdun_1 = require("./renwangdun");
const shunshouqianyang_1 = require("./shunshouqianyang");
const slash_1 = require("./slash");
const taoyuanjieyi_1 = require("./taoyuanjieyi");
const wanjianqifa_1 = require("./wanjianqifa");
const wugufengdeng_1 = require("./wugufengdeng");
const wuxiekeji_1 = require("./wuxiekeji");
const wuzhongshengyou_1 = require("./wuzhongshengyou");
const zhangbashemao_1 = require("./zhangbashemao");
const zhuahuangfeidian_1 = require("./zhuahuangfeidian");
const zhugeliannu_1 = require("./zhugeliannu");
const zixing_1 = require("./zixing");
const StandardCardPackage = index => [
    new slash_1.Slash(index++, 7, 1 /* Spade */),
    new slash_1.Slash(index++, 8, 1 /* Spade */),
    new slash_1.Slash(index++, 8, 1 /* Spade */),
    new slash_1.Slash(index++, 9, 1 /* Spade */),
    new slash_1.Slash(index++, 9, 1 /* Spade */),
    new slash_1.Slash(index++, 10, 1 /* Spade */),
    new slash_1.Slash(index++, 10, 1 /* Spade */),
    new slash_1.Slash(index++, 2, 3 /* Club */),
    new slash_1.Slash(index++, 3, 3 /* Club */),
    new slash_1.Slash(index++, 4, 3 /* Club */),
    new slash_1.Slash(index++, 5, 3 /* Club */),
    new slash_1.Slash(index++, 6, 3 /* Club */),
    new slash_1.Slash(index++, 7, 3 /* Club */),
    new slash_1.Slash(index++, 8, 3 /* Club */),
    new slash_1.Slash(index++, 8, 3 /* Club */),
    new slash_1.Slash(index++, 9, 3 /* Club */),
    new slash_1.Slash(index++, 9, 3 /* Club */),
    new slash_1.Slash(index++, 10, 3 /* Club */),
    new slash_1.Slash(index++, 10, 3 /* Club */),
    new slash_1.Slash(index++, 11, 3 /* Club */),
    new slash_1.Slash(index++, 11, 3 /* Club */),
    new slash_1.Slash(index++, 10, 2 /* Heart */),
    new slash_1.Slash(index++, 10, 2 /* Heart */),
    new slash_1.Slash(index++, 11, 2 /* Heart */),
    new slash_1.Slash(index++, 6, 4 /* Diamond */),
    new slash_1.Slash(index++, 7, 4 /* Diamond */),
    new slash_1.Slash(index++, 8, 4 /* Diamond */),
    new slash_1.Slash(index++, 9, 4 /* Diamond */),
    new slash_1.Slash(index++, 10, 4 /* Diamond */),
    new slash_1.Slash(index++, 13, 4 /* Diamond */),
    new jink_1.Jink(index++, 2, 2 /* Heart */),
    new jink_1.Jink(index++, 2, 2 /* Heart */),
    new jink_1.Jink(index++, 13, 2 /* Heart */),
    new jink_1.Jink(index++, 2, 4 /* Diamond */),
    new jink_1.Jink(index++, 2, 4 /* Diamond */),
    new jink_1.Jink(index++, 3, 4 /* Diamond */),
    new jink_1.Jink(index++, 4, 4 /* Diamond */),
    new jink_1.Jink(index++, 5, 4 /* Diamond */),
    new jink_1.Jink(index++, 6, 4 /* Diamond */),
    new jink_1.Jink(index++, 7, 4 /* Diamond */),
    new jink_1.Jink(index++, 8, 4 /* Diamond */),
    new jink_1.Jink(index++, 9, 4 /* Diamond */),
    new jink_1.Jink(index++, 10, 4 /* Diamond */),
    new jink_1.Jink(index++, 11, 4 /* Diamond */),
    new jink_1.Jink(index++, 11, 4 /* Diamond */),
    new peach_1.Peach(index++, 3, 2 /* Heart */),
    new peach_1.Peach(index++, 4, 2 /* Heart */),
    new peach_1.Peach(index++, 6, 2 /* Heart */),
    new peach_1.Peach(index++, 7, 2 /* Heart */),
    new peach_1.Peach(index++, 8, 2 /* Heart */),
    new peach_1.Peach(index++, 9, 2 /* Heart */),
    new peach_1.Peach(index++, 12, 2 /* Heart */),
    new peach_1.Peach(index++, 12, 4 /* Diamond */),
    new nanmanruqing_1.NanManRuQing(index++, 7, 1 /* Spade */),
    new nanmanruqing_1.NanManRuQing(index++, 13, 1 /* Spade */),
    new nanmanruqing_1.NanManRuQing(index++, 7, 3 /* Club */),
    new wanjianqifa_1.WanJianQiFa(index++, 1, 2 /* Heart */),
    new lightning_1.Lightning(index++, 12, 2 /* Heart */),
    new lightning_1.Lightning(index++, 1, 1 /* Spade */),
    new guohechaiqiao_1.GuoHeChaiQiao(index++, 3, 1 /* Spade */),
    new guohechaiqiao_1.GuoHeChaiQiao(index++, 4, 1 /* Spade */),
    new guohechaiqiao_1.GuoHeChaiQiao(index++, 12, 1 /* Spade */),
    new guohechaiqiao_1.GuoHeChaiQiao(index++, 3, 3 /* Club */),
    new guohechaiqiao_1.GuoHeChaiQiao(index++, 4, 3 /* Club */),
    new guohechaiqiao_1.GuoHeChaiQiao(index++, 12, 2 /* Heart */),
    new shunshouqianyang_1.ShunshouQianYang(index++, 3, 1 /* Spade */),
    new shunshouqianyang_1.ShunshouQianYang(index++, 4, 1 /* Spade */),
    new shunshouqianyang_1.ShunshouQianYang(index++, 11, 1 /* Spade */),
    new shunshouqianyang_1.ShunshouQianYang(index++, 3, 4 /* Diamond */),
    new shunshouqianyang_1.ShunshouQianYang(index++, 4, 4 /* Diamond */),
    new wuxiekeji_1.WuXieKeJi(index++, 11, 1 /* Spade */),
    new wuxiekeji_1.WuXieKeJi(index++, 12, 3 /* Club */),
    new wuxiekeji_1.WuXieKeJi(index++, 13, 3 /* Club */),
    new wuxiekeji_1.WuXieKeJi(index++, 12, 4 /* Diamond */),
    new duel_1.Duel(index++, 1, 1 /* Spade */),
    new duel_1.Duel(index++, 1, 3 /* Club */),
    new duel_1.Duel(index++, 1, 4 /* Diamond */),
    new wuzhongshengyou_1.WuZhongShengYou(index++, 7, 2 /* Heart */),
    new wuzhongshengyou_1.WuZhongShengYou(index++, 8, 2 /* Heart */),
    new wuzhongshengyou_1.WuZhongShengYou(index++, 9, 2 /* Heart */),
    new wuzhongshengyou_1.WuZhongShengYou(index++, 11, 2 /* Heart */),
    new lebusishu_1.LeBuSiShu(index++, 6, 1 /* Spade */),
    new lebusishu_1.LeBuSiShu(index++, 6, 3 /* Club */),
    new jiedaosharen_1.JieDaoShaRen(index++, 12, 3 /* Club */),
    new jiedaosharen_1.JieDaoShaRen(index++, 13, 3 /* Club */),
    new taoyuanjieyi_1.TaoYuanJieYi(index++, 1, 2 /* Heart */),
    new wugufengdeng_1.WuGuFengDeng(index++, 3, 2 /* Heart */),
    new wugufengdeng_1.WuGuFengDeng(index++, 4, 2 /* Heart */),
    new baguazhen_1.BaGuaZhen(index++, 2, 1 /* Spade */),
    new baguazhen_1.BaGuaZhen(index++, 2, 3 /* Club */),
    new renwangdun_1.RenWangDun(index++, 2, 3 /* Club */),
    new zixing_1.ZiXing(index++, 13, 4 /* Diamond */),
    new chitu_1.ChiTu(index++, 5, 2 /* Heart */),
    new dayuan_1.DaYuan(index++, 13, 1 /* Spade */),
    new jueying_1.JueYing(index++, 5, 1 /* Spade */),
    new dilu_1.DiLu(index++, 5, 3 /* Club */),
    new zhuahuangfeidian_1.ZhuaHuangFeiDian(index++, 13, 2 /* Heart */),
    new qinggang_1.QingGang(index++, 6, 1 /* Spade */),
    new zhugeliannu_1.ZhuGeLianNu(index++, 1, 3 /* Club */),
    new zhugeliannu_1.ZhuGeLianNu(index++, 1, 4 /* Diamond */),
    new guanshifu_1.GuanShiFu(index++, 5, 4 /* Diamond */),
    new zhangbashemao_1.ZhangBaSheMao(index++, 12, 1 /* Spade */),
    new fangtianhuaji_1.FangTianHuaJi(index++, 12, 4 /* Diamond */),
    new qinglongdao_1.QingLongYanYueDao(index++, 5, 1 /* Spade */),
    new qilingong_1.QiLinGong(index++, 5, 2 /* Heart */),
    new cixiongjian_1.CiXiongJian(index++, 2, 1 /* Spade */),
    new hanbingjian_1.HanBingJian(index++, 2, 1 /* Spade */),
];
exports.StandardCardPackage = StandardCardPackage;
