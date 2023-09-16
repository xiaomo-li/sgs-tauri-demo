"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsGeneratedCardPackage = void 0;
const qizhengxiangsheng_1 = require("./qizhengxiangsheng");
const SkillsGeneratedCardPackage = index => [
    new qizhengxiangsheng_1.QiZhengXiangSheng(index++, 2, 1 /* Spade */),
    new qizhengxiangsheng_1.QiZhengXiangSheng(index++, 4, 1 /* Spade */),
    new qizhengxiangsheng_1.QiZhengXiangSheng(index++, 6, 1 /* Spade */),
    new qizhengxiangsheng_1.QiZhengXiangSheng(index++, 8, 1 /* Spade */),
    new qizhengxiangsheng_1.QiZhengXiangSheng(index++, 3, 3 /* Club */),
    new qizhengxiangsheng_1.QiZhengXiangSheng(index++, 5, 3 /* Club */),
    new qizhengxiangsheng_1.QiZhengXiangSheng(index++, 7, 3 /* Club */),
    new qizhengxiangsheng_1.QiZhengXiangSheng(index++, 9, 3 /* Club */),
];
exports.SkillsGeneratedCardPackage = SkillsGeneratedCardPackage;
