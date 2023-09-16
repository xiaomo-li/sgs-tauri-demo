"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShunShouQianYangSkill = void 0;
const tslib_1 = require("tslib");
const shunshouqianyang_1 = require("core/ai/skills/cards/shunshouqianyang");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let ShunShouQianYangSkill = class ShunShouQianYangSkill extends skill_1.ActiveSkill {
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
        const to = room.getPlayerById(target);
        return (target !== owner &&
            room.getPlayerById(owner).canUseCardTo(room, containerCard, target) &&
            to.getCardIds().length > 0);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        const from = room.getPlayerById(owner);
        const to = room.getPlayerById(target);
        return (this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) &&
            room.cardUseDistanceBetween(room, containerCard, from, to) <=
                engine_1.Sanguosha.getCardById(containerCard).EffectUseDistance);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const to = room.getPlayerById(precondition_1.Precondition.exists(event.toIds, 'Unknown targets in shunshouqianyang')[0]);
        if ((event.fromId === to.Id &&
            to.getCardIds(1 /* EquipArea */).length === 0 &&
            to.getCardIds(2 /* JudgeArea */).length === 0) ||
            to.getCardIds().length === 0) {
            return true;
        }
        const options = {
            [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
        };
        if (event.fromId !== to.Id) {
            options[0 /* HandArea */] = to.getCardIds(0 /* HandArea */).length;
        }
        const chooseCardEvent = {
            fromId: event.fromId,
            toId: to.Id,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
        if (!response) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: chooseCardEvent.toId,
            toId: chooseCardEvent.fromId,
            moveReason: 1 /* ActivePrey */,
            toArea: 0 /* HandArea */,
            proposer: chooseCardEvent.fromId,
        });
        return true;
    }
};
ShunShouQianYangSkill = tslib_1.__decorate([
    skill_1.AI(shunshouqianyang_1.ShunShouQianYangSkillTrigger),
    skill_1.CommonSkill({ name: 'shunshouqianyang', description: 'shunshouqianyang_description' })
], ShunShouQianYangSkill);
exports.ShunShouQianYangSkill = ShunShouQianYangSkill;
