"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecadePackage = void 0;
const caimaozhangyun_1 = require("./caimaozhangyun");
const caoxing_1 = require("./caoxing");
const decade_dengzhi_1 = require("./decade_dengzhi");
//import { DecadeHuangChengYan } from './decade_huangchengyan';
const decade_liuba_1 = require("./decade_liuba");
const decade_miheng_1 = require("./decade_miheng");
const duanwei_1 = require("./duanwei");
const dufuren_1 = require("./dufuren");
const fanchou_1 = require("./fanchou");
const fengxi_1 = require("./fengxi");
const guosi_1 = require("./guosi");
const huaxin_1 = require("./huaxin");
const liangxing_1 = require("./liangxing");
const licaiwei_1 = require("./licaiwei");
const lijue_1 = require("./lijue");
const luyusheng_1 = require("./luyusheng");
const lvlingqi_1 = require("./lvlingqi");
const mamidi_1 = require("./mamidi");
const mifangfushiren_1 = require("./mifangfushiren");
const niujin_1 = require("./niujin");
const panfeng_1 = require("./panfeng");
const tongyuan_1 = require("./tongyuan");
const wanniangongzhu_1 = require("./wanniangongzhu");
const xiahoujie_1 = require("./xiahoujie");
const xingdaorong_1 = require("./xingdaorong");
const xugong_1 = require("./xugong");
const xunchen_1 = require("./xunchen");
const zhangheng_1 = require("./zhangheng");
const zhanghu_1 = require("./zhanghu");
const zhangji_1 = require("./zhangji");
const zhangwen_1 = require("./zhangwen");
const zhaozhong_1 = require("./zhaozhong");
const DecadePackage = index => [
    new niujin_1.NiuJin(index++),
    new huaxin_1.HuaXin(index++),
    new zhanghu_1.ZhangHu(index++),
    new dufuren_1.DuFuRen(index++),
    new xiahoujie_1.XiaHouJie(index++),
    new caimaozhangyun_1.CaiMaoZhangYun(index++),
    new decade_dengzhi_1.DecadeDengZhi(index++),
    new mifangfushiren_1.MiFangFuShiRen(index++),
    new decade_liuba_1.DecadeLiuBa(index++),
    new xugong_1.XuGong(index++),
    new zhangwen_1.ZhangWen(index++),
    new luyusheng_1.LuYuSheng(index++),
    new fengxi_1.FengXi(index++),
    new lijue_1.LiJue(index++),
    new guosi_1.GuoSi(index++),
    new fanchou_1.FanChou(index++),
    new zhangji_1.ZhangJi(index++),
    new liangxing_1.LiangXing(index++),
    new duanwei_1.DuanWei(index++),
    new zhangheng_1.ZhangHeng(index++),
    new panfeng_1.PanFeng(index++),
    new xingdaorong_1.XingDaoRong(index++),
    new caoxing_1.CaoXing(index++),
    new zhaozhong_1.ZhaoZhong(index++),
    new tongyuan_1.TongYuanC(index++),
    new wanniangongzhu_1.WanNianGongZhu(index++),
    new xunchen_1.XunChen(index++),
    new lvlingqi_1.LvLingQi(index++),
    new decade_miheng_1.DecadeMiHeng(index++),
    new licaiwei_1.LiCaiWei(index++),
    new mamidi_1.MaMiDi(index++),
    //new DecadeHuangChengYan(index++),
];
exports.DecadePackage = DecadePackage;
