"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuZhongShengYouSkill = void 0;
const tslib_1 = require("tslib");
const wuzhongshengyou_1 = require("core/ai/skills/cards/wuzhongshengyou");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WuZhongShengYouSkill = class WuZhongShengYouSkill extends skill_1.ActiveSkill {
    canUse(room, owner, containerCard) {
        return containerCard !== undefined && owner.canUseCardTo(room, containerCard, owner.Id);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget() {
        return true;
    }
    isAvailableTarget() {
        return false;
    }
    async onUse(room, event) {
        event.targetGroup = [[event.fromId]];
        return true;
    }
    async onEffect(room, event) {
        const toId = precondition_1.Precondition.exists(event.toIds, 'Unknown targets in wuzhongshengyou')[0];
        await room.drawCards(2, toId, undefined, toId, this.Name);
        return true;
    }
};
WuZhongShengYouSkill = tslib_1.__decorate([
    skill_wrappers_1.AI(wuzhongshengyou_1.WuZhongShengYouSkillTrigger),
    skill_1.CommonSkill({ name: 'wuzhongshengyou', description: 'wuzhongshengyou_description' }),
    skill_1.SelfTargetSkill
], WuZhongShengYouSkill);
exports.WuZhongShengYouSkill = WuZhongShengYouSkill;
