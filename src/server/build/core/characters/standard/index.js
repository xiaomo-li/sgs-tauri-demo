"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardCharacterPackage = void 0;
const caocao_1 = require("./caocao");
const caozhang_1 = require("./caozhang");
const daqiao_1 = require("./daqiao");
const diaochan_1 = require("./diaochan");
const ganning_1 = require("./ganning");
const gongsunzan_1 = require("./gongsunzan");
const guanyu_1 = require("./guanyu");
const guojia_1 = require("./guojia");
const huanggai_1 = require("./huanggai");
const huangyueying_1 = require("./huangyueying");
const huatuo_1 = require("./huatuo");
const huaxiong_1 = require("./huaxiong");
const jiexushu_1 = require("./jiexushu");
const lidian_1 = require("./lidian");
const liubei_1 = require("./liubei");
const luxun_1 = require("./luxun");
const lvbu_1 = require("./lvbu");
const lvmeng_1 = require("./lvmeng");
const machao_1 = require("./machao");
const simayi_1 = require("./simayi");
const sunquan_1 = require("./sunquan");
const sunshangxiang_1 = require("./sunshangxiang");
const xiahoudun_1 = require("./xiahoudun");
const xuchu_1 = require("./xuchu");
const yiji_c_1 = require("./yiji_c");
const yuanshu_1 = require("./yuanshu");
const zhangfei_1 = require("./zhangfei");
const zhangliao_1 = require("./zhangliao");
const zhaoyun_1 = require("./zhaoyun");
const zhenji_1 = require("./zhenji");
const zhouyu_1 = require("./zhouyu");
const zhugeliang_1 = require("./zhugeliang");
const StandardCharacterPackage = index => [
    new sunquan_1.SunQuan(index++),
    new ganning_1.GanNing(index++),
    new lvmeng_1.LvMeng(index++),
    new huanggai_1.HuangGai(index++),
    new zhouyu_1.ZhouYu(index++),
    new daqiao_1.DaQiao(index++),
    new luxun_1.LuXun(index++),
    new sunshangxiang_1.SunShangXiang(index++),
    new liubei_1.LiuBei(index++),
    new guanyu_1.GuanYu(index++),
    new zhangfei_1.ZhangFei(index++),
    new zhugeliang_1.ZhuGeLiang(index++),
    new zhaoyun_1.ZhaoYun(index++),
    new machao_1.MaChao(index++),
    new huangyueying_1.HuangYueYing(index++),
    new jiexushu_1.JieXuShu(index++),
    new yiji_c_1.YiJi(index++),
    new caocao_1.CaoCao(index++),
    new simayi_1.SiMaYi(index++),
    new xiahoudun_1.XiaHouDun(index++),
    new zhangliao_1.ZhangLiao(index++),
    new xuchu_1.XuChu(index++),
    new guojia_1.GuoJia(index++),
    new zhenji_1.ZhenJi(index++),
    new lidian_1.LiDian(index++),
    new caozhang_1.CaoZhang(index++),
    new huatuo_1.HuaTuo(index++),
    new lvbu_1.LvBu(index++),
    new diaochan_1.DiaoChan(index++),
    new huaxiong_1.HuaXiong(index++),
    new yuanshu_1.YuanShu(index++),
    new gongsunzan_1.GongSunZan(index++),
];
exports.StandardCharacterPackage = StandardCharacterPackage;
