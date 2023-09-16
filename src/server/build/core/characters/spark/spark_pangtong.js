"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparkPangTong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class SparkPangTong extends character_1.Character {
    constructor(id) {
        super(id, 'spark_pangtong', 0 /* Male */, 2 /* Wu */, 3, 3, "spark" /* Spark */, [
            skillLorderInstance.getSkillByName('guolun'),
            skillLorderInstance.getSkillByName('songsang'),
        ]);
    }
}
exports.SparkPangTong = SparkPangTong;
