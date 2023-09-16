"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveLianZhen = exports.PveQiSha = exports.PveTianXiang = exports.PveTianJi = exports.PveTianLiang = exports.PveTianTong = exports.PveSoldier = void 0;
const character_1 = require("core/characters/character");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const skills_1 = require("core/skills");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class PveSoldier extends character_1.Character {
    constructor(id) {
        super(id, 'pve_soldier', 1 /* Female */, 4 /* God */, 4, 4, "pve" /* Pve */, []);
    }
}
exports.PveSoldier = PveSoldier;
class PveTianTong extends character_1.Character {
    constructor(id) {
        super(id, 'pve_tiantong', 1 /* Female */, 4 /* God */, 4, 4, "pve" /* Pve */, [
            skillLoaderInstance.getSkillByName(skills_1.PveClassicTianTong.Name),
        ]);
    }
}
exports.PveTianTong = PveTianTong;
class PveTianLiang extends character_1.Character {
    constructor(id) {
        super(id, 'pve_tianliang', 1 /* Female */, 4 /* God */, 4, 4, "pve" /* Pve */, [
            skillLoaderInstance.getSkillByName(skills_1.PveClassicTianLiang.Name),
        ]);
    }
}
exports.PveTianLiang = PveTianLiang;
class PveTianJi extends character_1.Character {
    constructor(id) {
        super(id, 'pve_tianji', 1 /* Female */, 4 /* God */, 4, 4, "pve" /* Pve */, [
            skillLoaderInstance.getSkillByName(skills_1.PveClassicTianJi.Name),
        ]);
    }
}
exports.PveTianJi = PveTianJi;
class PveTianXiang extends character_1.Character {
    constructor(id) {
        super(id, 'pve_tianxiang', 1 /* Female */, 4 /* God */, 4, 4, "pve" /* Pve */, [
            skillLoaderInstance.getSkillByName(skills_1.PveClassicTianXiang.Name),
        ]);
    }
}
exports.PveTianXiang = PveTianXiang;
class PveQiSha extends character_1.Character {
    constructor(id) {
        super(id, 'pve_qisha', 1 /* Female */, 4 /* God */, 4, 4, "pve" /* Pve */, [
            skillLoaderInstance.getSkillByName(skills_1.PveClassicQiSha.Name),
        ]);
    }
}
exports.PveQiSha = PveQiSha;
class PveLianZhen extends character_1.Character {
    constructor(id) {
        super(id, 'pve_lianzhen', 1 /* Female */, 4 /* God */, 4, 4, "pve" /* Pve */, [
            ...skillLoaderInstance.getSkillsByName(skills_1.PveClassicLianZhen.GeneralName),
        ]);
    }
}
exports.PveLianZhen = PveLianZhen;
