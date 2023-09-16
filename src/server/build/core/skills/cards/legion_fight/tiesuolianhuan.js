"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TieSuoLianHuanSkill = void 0;
const tslib_1 = require("tslib");
const tiesuolianhuan_1 = require("core/ai/skills/cards/tiesuolianhuan");
const skill_1 = require("core/skills/skill");
let TieSuoLianHuanSkill = class TieSuoLianHuanSkill extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return [1, 2];
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return room.getPlayerById(owner).canUseCardTo(room, containerCard, target);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        for (const toId of toIds) {
            await room.chainedOn(toId);
        }
        return true;
    }
};
TieSuoLianHuanSkill = tslib_1.__decorate([
    skill_1.AI(tiesuolianhuan_1.TieSuoLianHuanSkillTrigger),
    skill_1.CommonSkill({ name: 'tiesuolianhuan', description: 'tiesuolianhuan_description' })
], TieSuoLianHuanSkill);
exports.TieSuoLianHuanSkill = TieSuoLianHuanSkill;
