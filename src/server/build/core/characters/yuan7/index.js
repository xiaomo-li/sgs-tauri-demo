"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yuan7Package = void 0;
const jikang_1 = require("./jikang");
const xuezong_1 = require("./xuezong");
const xushi_1 = require("./xushi");
const Yuan7Package = index => [
    new jikang_1.JiKang(index++),
    new xushi_1.XuShi(index++),
    new xuezong_1.XueZong(index++),
];
exports.Yuan7Package = Yuan7Package;
