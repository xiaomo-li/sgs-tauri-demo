"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpPackage = void 0;
const beimihu_1 = require("./beimihu");
const caoang_1 = require("./caoang");
const caohong_1 = require("./caohong");
const dingfeng_1 = require("./dingfeng");
const dongyun_1 = require("./dongyun");
const fuwan_1 = require("./fuwan");
const guanyinping_1 = require("./guanyinping");
const heqi_1 = require("./heqi");
const huangzu_1 = require("./huangzu");
const litong_1 = require("./litong");
const liuqi_1 = require("./liuqi");
const liuxie_1 = require("./liuxie");
const maliang_1 = require("./maliang");
const mayunlu_1 = require("./mayunlu");
const mazhong_1 = require("./mazhong");
const mizhu_1 = require("./mizhu");
const ol_zhuling_1 = require("./ol_zhuling");
const quyi_1 = require("./quyi");
const shamoke_1 = require("./shamoke");
const shixie_1 = require("./shixie");
const simalang_1 = require("./simalang");
const sp_caiwenji_1 = require("./sp_caiwenji");
const sp_caoren_1 = require("./sp_caoren");
const sp_diaochan_1 = require("./sp_diaochan");
const sp_huangyueying_1 = require("./sp_huangyueying");
const sp_jiangwei_1 = require("./sp_jiangwei");
const sp_luzhi_1 = require("./sp_luzhi");
const sp_machao_1 = require("./sp_machao");
const sp_pangde_1 = require("./sp_pangde");
const sp_sunshangxiang_1 = require("./sp_sunshangxiang");
const sp_zhaoyun_1 = require("./sp_zhaoyun");
const sunhao_1 = require("./sunhao");
const sunqian_1 = require("./sunqian");
const wenpin_1 = require("./wenpin");
const wutugu_1 = require("./wutugu");
const xiahouba_1 = require("./xiahouba");
const xizhicai_1 = require("./xizhicai");
const xsp_liubei_1 = require("./xsp_liubei");
const xujing_1 = require("./xujing");
const yangxiu_1 = require("./yangxiu");
const yuejin_1 = require("./yuejin");
const zhangbao_1 = require("./zhangbao");
const zhangliang_1 = require("./zhangliang");
const zhangling_1 = require("./zhangling");
const zhouqun_1 = require("./zhouqun");
const zhugedan_1 = require("./zhugedan");
const zumao_1 = require("./zumao");
const SpPackage = index => [
    new yangxiu_1.YangXiu(index++),
    new sp_caiwenji_1.SPCaiWenJi(index++),
    new sp_jiangwei_1.SPJiangWei(index++),
    new sp_pangde_1.SPPangDe(index++),
    new sp_caoren_1.SPCaoRen(index++),
    new caohong_1.CaoHong(index++),
    new yuejin_1.YueJin(index++),
    new caoang_1.CaoAng(index++),
    new wenpin_1.WenPin(index++),
    new zhugedan_1.ZhuGeDan(index++),
    new litong_1.LiTong(index++),
    new simalang_1.SiMaLang(index++),
    new xizhicai_1.XiZhiCai(index++),
    new sp_luzhi_1.SPLuZhi(index++),
    new ol_zhuling_1.OLZhuLing(index++),
    new guanyinping_1.GuanYinPing(index++),
    new xiahouba_1.XiaHouBa(index++),
    new sp_sunshangxiang_1.SPSunShangXiang(index++),
    new mayunlu_1.MaYunLu(index++),
    new sunqian_1.SunQian(index++),
    new mizhu_1.MiZhu(index++),
    new maliang_1.MaLiang(index++),
    new mazhong_1.MaZhong(index++),
    new zhouqun_1.ZhouQun(index++),
    new dongyun_1.DongYun(index++),
    new shamoke_1.ShaMoKe(index++),
    new xujing_1.XuJing(index++),
    new sunhao_1.SunHao(index++),
    new zumao_1.ZuMao(index++),
    new dingfeng_1.DingFeng(index++),
    new heqi_1.HeQi(index++),
    new sp_zhaoyun_1.SPZhaoYun(index++),
    new fuwan_1.FuWan(index++),
    new liuxie_1.LiuXie(index++),
    new sp_machao_1.SPMaChao(index++),
    new sp_huangyueying_1.SPHuangYueYing(index++),
    new zhangbao_1.ZhangBao(index++),
    new shixie_1.ShiXie(index++),
    new zhangliang_1.ZhangLiang(index++),
    new quyi_1.QuYi(index++),
    new liuqi_1.LiuQi(index++),
    new zhangling_1.ZhangLing(index++),
    new wutugu_1.WuTuGu(index++),
    new sp_diaochan_1.SPDiaochan(index++),
    new beimihu_1.BeiMiHu(index++),
    new huangzu_1.HuangZu(index++),
    new xsp_liubei_1.XSPLiuBei(index++),
];
exports.SpPackage = SpPackage;
