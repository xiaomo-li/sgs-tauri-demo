"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenevolencePackage = void 0;
const caizhenji_1 = require("./caizhenji");
const liuzhang_1 = require("./liuzhang");
const ren_xujing_1 = require("./ren_xujing");
//import { XiangChong } from './xiangchong';
const BenevolencePackage = index => [
    new caizhenji_1.CaiZhenJi(index++),
    new ren_xujing_1.RenXuJing(index++),
    //new XiangChong(index++),
    new liuzhang_1.LiuZhang(index++),
];
exports.BenevolencePackage = BenevolencePackage;
