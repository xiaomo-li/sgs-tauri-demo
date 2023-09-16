"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueSkillRule = void 0;
const qinggang_1 = require("./cards/standard/qinggang");
const xianzhen_1 = require("./characters/yijiang2011/xianzhen");
const benxi_1 = require("./characters/yijiang2014/benxi");
const _1 = require(".");
class UniqueSkillRule {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    static isProhibitedBySkillRule(bySkill, toSkill) {
        switch (bySkill.Name) {
            case qinggang_1.QingGangSkill.Name:
            case xianzhen_1.XianZhenNullify.Name:
            case benxi_1.BenXi.Name:
            case _1.SheQue.Name:
                return toSkill.Name === 'bazhen' || toSkill.Name === 'linglong';
            default:
                return false;
        }
    }
    static canTriggerCardSkillRule(bySkill, card) {
        switch (bySkill.Name) {
            case qinggang_1.QingGangSkill.Name:
            case xianzhen_1.XianZhenNullify.Name:
            case benxi_1.BenXi.Name:
            case _1.SheQue.Name:
            case _1.YangWei.Name:
            case _1.DuJiang.Name:
                return !card.is(3 /* Shield */);
            default:
                return true;
        }
    }
    static isProhibited(skill, owner, cardContainer, except = []) {
        if (skill.isPersistentSkill()) {
            return false;
        }
        if (cardContainer) {
            if (owner.getFlag('wuqian')) {
                return cardContainer.is(3 /* Shield */);
            }
        }
        for (const pSkill of owner.getSkillProhibitedSkills()) {
            if (except.includes(pSkill)) {
                continue;
            }
            const copyList = [];
            copyList.push(...except, pSkill);
            if (!this.isProhibited(pSkill, owner, cardContainer, copyList) &&
                pSkill.skillFilter(skill, owner, cardContainer)) {
                return true;
            }
        }
        if (owner.getFlag('wuqian')) {
            return skill.Name === 'bazhen' || skill.Name === 'linglong';
        }
        return false;
    }
}
exports.UniqueSkillRule = UniqueSkillRule;
