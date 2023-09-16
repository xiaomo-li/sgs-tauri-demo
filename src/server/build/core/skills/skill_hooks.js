"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillLifeCycle = void 0;
class SkillLifeCycle {
    static isHookedAfterLosingSkill(skill) {
        const hookedSkill = skill;
        return hookedSkill.afterLosingSkill;
    }
    static isHookedAfterDead(skill) {
        const hookedSkill = skill;
        return hookedSkill.afterDead;
    }
    static async executeHookOnObtainingSkill(skill, room, owner) {
        const hookedSkill = skill;
        hookedSkill.whenObtainingSkill && (await hookedSkill.whenObtainingSkill(room, owner));
    }
    static async executeHookOnLosingSkill(skill, room, owner) {
        const hookedSkill = skill;
        hookedSkill.whenLosingSkill && (await hookedSkill.whenLosingSkill(room, owner));
    }
    static async executeHookedOnDead(skill, room, owner) {
        const hookedSkill = skill;
        hookedSkill.whenDead && (await hookedSkill.whenDead(room, owner));
    }
    static async executeHookedOnNullifying(skill, room, owner) {
        const hookedSkill = skill;
        hookedSkill.whenNullifying && (await hookedSkill.whenNullifying(room, owner));
    }
    static async executeHookedOnEffecting(skill, room, owner) {
        const hookedSkill = skill;
        hookedSkill.whenEffecting && (await hookedSkill.whenEffecting(room, owner));
    }
}
exports.SkillLifeCycle = SkillLifeCycle;
