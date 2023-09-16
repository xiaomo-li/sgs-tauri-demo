"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MingJianRemover = exports.MingJianBuff = exports.MingJian = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let MingJian = class MingJian extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        await room.moveCards({
            movingCards: room
                .getPlayerById(fromId)
                .getCardIds(0 /* HandArea */)
                .map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        room.addMark(toIds[0], "jian" /* Jian */, 1);
        room.getPlayerById(toIds[0]).hasShadowSkill(MingJianBuff.Name) ||
            (await room.obtainSkill(toIds[0], MingJianBuff.Name));
        room.getPlayerById(toIds[0]).hasShadowSkill(MingJianRemover.Name) ||
            (await room.obtainSkill(toIds[0], MingJianRemover.Name));
        return true;
    }
};
MingJian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mingjian', description: 'mingjian_description' })
], MingJian);
exports.MingJian = MingJian;
let MingJianBuff = class MingJianBuff extends skill_1.RulesBreakerSkill {
    breakCardUsableTimes(cardId, room, owner) {
        if (room.getMark(owner.Id, "jian" /* Jian */) === 0) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return owner.getMark("jian" /* Jian */);
        }
        else {
            return 0;
        }
    }
    breakAdditionalCardHoldNumber(room, owner) {
        return owner.getMark("jian" /* Jian */) || 0;
    }
};
MingJianBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_mingjian_buff', description: 's_mingjian_buff_description' })
], MingJianBuff);
exports.MingJianBuff = MingJianBuff;
let MingJianRemover = class MingJianRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, player) {
        player.hasShadowSkill(MingJianBuff.Name) && (await room.loseSkill(player.Id, MingJianBuff.Name));
        await room.loseSkill(player.Id, this.Name);
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
        return owner.Id === event.fromPlayer && event.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeMark(event.fromId, "jian" /* Jian */);
        room.getPlayerById(event.fromId).hasShadowSkill(MingJianBuff.Name) &&
            (await room.loseSkill(event.fromId, MingJianBuff.Name));
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
MingJianRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_mingjian_remover', description: 's_mingjian_remover_description' })
], MingJianRemover);
exports.MingJianRemover = MingJianRemover;
