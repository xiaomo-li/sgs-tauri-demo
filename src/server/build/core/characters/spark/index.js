"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparkPackage = void 0;
const liuyan_1 = require("./liuyan");
const liuyao_1 = require("./liuyao");
const lvdai_1 = require("./lvdai");
const lvqian_1 = require("./lvqian");
const panjun_1 = require("./panjun");
const spark_pangtong_1 = require("./spark_pangtong");
const yanjun_1 = require("./yanjun");
const zhoufang_1 = require("./zhoufang");
const SparkPackage = index => [
    new lvqian_1.LvQian(index++),
    new spark_pangtong_1.SparkPangTong(index++),
    new panjun_1.PanJun(index++),
    new yanjun_1.YanJun(index++),
    new zhoufang_1.ZhouFang(index++),
    new lvdai_1.LvDai(index++),
    new liuyan_1.LiuYan(index++),
    new liuyao_1.LiuYao(index++),
];
exports.SparkPackage = SparkPackage;
