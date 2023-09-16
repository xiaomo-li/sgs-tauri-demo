"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitedPackage = void 0;
const baosanniang_1 = require("./baosanniang");
const caochun_1 = require("./caochun");
const caoshuang_1 = require("./caoshuang");
const chenlin_1 = require("./chenlin");
const decade_luotong_1 = require("./decade_luotong");
const fanyufeng_1 = require("./fanyufeng");
const fengyu_1 = require("./fengyu");
const gexuan_1 = require("./gexuan");
const guozhao_1 = require("./guozhao");
const jianggan_1 = require("./jianggan");
const liubian_1 = require("./liubian");
const new_liuzan_1 = require("./new_liuzan");
const panshu_1 = require("./panshu");
const ruanyu_1 = require("./ruanyu");
const sunyi_1 = require("./sunyi");
const wangshuang_1 = require("./wangshuang");
const wenyang_1 = require("./wenyang");
const xurong_1 = require("./xurong");
const yangwan_1 = require("./yangwan");
const zhouyi_1 = require("./zhouyi");
const zhugeguo_1 = require("./zhugeguo");
const LimitedPackage = index => [
    new chenlin_1.ChenLin(index++),
    new caochun_1.CaoChun(index++),
    new jianggan_1.JiangGan(index++),
    new caoshuang_1.CaoShuang(index++),
    new wangshuang_1.WangShuang(index++),
    new guozhao_1.GuoZhao(index++),
    new ruanyu_1.RuanYu(index++),
    new wenyang_1.WenYang(index++),
    new zhugeguo_1.ZhuGeGuo(index++),
    new baosanniang_1.BaoSanNiang(index++),
    new yangwan_1.YangWan(index++),
    new gexuan_1.GeXuan(index++),
    new new_liuzan_1.NewLiuZan(index++),
    new panshu_1.PanShu(index++),
    new zhouyi_1.ZhouYi(index++),
    new sunyi_1.SunYi(index++),
    new decade_luotong_1.DecadeLuoTong(index++),
    new xurong_1.XuRong(index++),
    new liubian_1.LiuBian(index++),
    new fanyufeng_1.FanYuFeng(index++),
    new fengyu_1.FengYu(index++),
];
exports.LimitedPackage = LimitedPackage;
