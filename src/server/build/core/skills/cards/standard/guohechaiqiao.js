"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuoHeChaiQiaoSkill = void 0;
const tslib_1 = require("tslib");
const guohechaiqiao_1 = require("core/ai/skills/cards/guohechaiqiao");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let GuoHeChaiQiaoSkill = class GuoHeChaiQiaoSkill extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return (target !== owner &&
            room.getPlayerById(owner).canUseCardTo(room, containerCard, target) &&
            room.getPlayerById(target).getCardIds().length > 0);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const to = room.getPlayerById(precondition_1.Precondition.exists(event.toIds, 'Unknown targets in guohechaiqiao')[0]);
        if ((to.Id === event.fromId && to.getCardIds().filter(id => room.canDropCard(to.Id, id)).length === 0) ||
            to.getCardIds().length === 0) {
            return true;
        }
        const options = {
            [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId: event.fromId,
            toId: to.Id,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, true, true);
        if (!response) {
            return false;
        }
        await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], chooseCardEvent.toId, chooseCardEvent.fromId, this.Name);
        return true;
    }
};
GuoHeChaiQiaoSkill = tslib_1.__decorate([
    skill_1.AI(guohechaiqiao_1.GuoHeChaiQiaoSkillTrigger),
    skill_1.CommonSkill({ name: 'guohechaiqiao', description: 'guohechaiqiao_description' })
], GuoHeChaiQiaoSkill);
exports.GuoHeChaiQiaoSkill = GuoHeChaiQiaoSkill;
