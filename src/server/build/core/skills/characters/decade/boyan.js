"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoYanRemover = exports.BoYanBlocker = exports.BoYan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let BoYan = class BoYan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const drawNum = Math.min(room.getPlayerById(event.toIds[0]).MaxHp -
            room.getPlayerById(event.toIds[0]).getCardIds(0 /* HandArea */).length, 5);
        drawNum && (await room.drawCards(drawNum, event.toIds[0], 'top', event.fromId, this.Name));
        room.setFlag(event.toIds[0], this.Name, true, this.Name);
        for (const skill of [BoYanBlocker.Name, BoYanRemover.Name]) {
            room.getPlayerById(event.toIds[0]).hasShadowSkill(skill) || (await room.obtainSkill(event.toIds[0], skill));
        }
        return true;
    }
};
BoYan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'boyan', description: 'boyan_description' })
], BoYan);
exports.BoYan = BoYan;
let BoYanBlocker = class BoYanBlocker extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        return cardId instanceof card_matcher_1.CardMatcher || room.getPlayerById(owner).cardFrom(cardId) !== 0 /* HandArea */;
    }
};
BoYanBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_boyan_blocker', description: 's_boyan_blocker_description' })
], BoYanBlocker);
exports.BoYanBlocker = BoYanBlocker;
let BoYanRemover = class BoYanRemover extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        room.removeFlag(player.Id, BoYan.Name);
        await room.loseSkill(player.Id, this.Name);
        player.hasShadowSkill(BoYanBlocker.Name) && (await room.loseSkill(player.Id, BoYanBlocker.Name));
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(BoYan.Name) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, BoYan.Name);
        await room.loseSkill(event.fromId, this.Name);
        room.getPlayerById(event.fromId).hasShadowSkill(BoYanBlocker.Name) &&
            (await room.loseSkill(event.fromId, BoYanBlocker.Name));
        return true;
    }
};
BoYanRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_boyan_remover', description: 's_boyan_remover_description' })
], BoYanRemover);
exports.BoYanRemover = BoYanRemover;
