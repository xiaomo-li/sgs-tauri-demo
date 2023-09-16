"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillLoader = void 0;
const tslib_1 = require("tslib");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const SkillList = tslib_1.__importStar(require("core/skills"));
class SkillLoader {
    constructor(skills = [], shadowSkills = []) {
        this.skills = skills;
        this.shadowSkills = shadowSkills;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SkillLoader();
            this.instance.addSkills(...Object.values(SkillList));
        }
        return this.instance;
    }
    addSkills(...skills) {
        for (const skillProto of skills) {
            const skill = new skillProto();
            if (skill.isShadowSkill()) {
                precondition_1.Precondition.assert(this.shadowSkills.find(s => s.Name === skill.Name) === undefined, `Duplicate shadow skill instance of ${skill.Name}`);
                this.shadowSkills.push(skill);
            }
            else {
                precondition_1.Precondition.assert(this.skills.find(s => s.Name === skill.Name) === undefined, `Duplicate skill instance of ${skill.Name}`);
                this.skills.push(skill);
            }
        }
    }
    getAllSkills() {
        return [...this.skills, ...this.shadowSkills];
    }
    getSkillByName(skillName) {
        const skill = this.skills.find(skill => skill.Name === skillName);
        return precondition_1.Precondition.exists(skill, `Unable to get skill ${skillName}`);
    }
    getShadowSkillsByName(skillName) {
        const skills = this.shadowSkills.filter(skill => skill.GeneralName === skillName);
        return precondition_1.Precondition.exists(skills, `Unable to get shadow skills ${skillName}`);
    }
    getSkillsByName(skillName) {
        const skills = this.getAllSkills().filter(skill => skill.GeneralName === skillName && !skill.isSideEffectSkill());
        return skills;
    }
}
exports.SkillLoader = SkillLoader;
