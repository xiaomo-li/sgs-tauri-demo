"use strict";
var TianYi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianYiBlock = exports.TianYiExtra = exports.TianYiRemove = exports.TianYi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let TianYi = TianYi_1 = class TianYi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        const targetPlayer = room.getPlayerById(target);
        return (target !== owner && targetPlayer.getCardIds(0 /* HandArea */).length > 0 && room.canPindian(owner, target));
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, fromId } = event;
        const { pindianRecord } = await room.pindian(fromId, toIds, this.Name);
        if (!pindianRecord.length) {
            return false;
        }
        if (pindianRecord[0].winner === fromId) {
            room.setFlag(fromId, TianYi_1.Win, true, TianYi_1.Win);
        }
        else {
            room.setFlag(fromId, TianYi_1.Lose, true, TianYi_1.Lose);
        }
        return true;
    }
};
TianYi.Win = 'tianyi_win';
TianYi.Lose = 'tianyi_lose';
TianYi = TianYi_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'tianyi', description: 'tianyi_description' })
], TianYi);
exports.TianYi = TianYi;
let TianYiRemove = class TianYiRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */;
    }
    canUse(room, owner, content) {
        return (content.fromPlayer === owner.Id &&
            (room.getFlag(owner.Id, TianYi.Win) !== undefined ||
                room.getFlag(owner.Id, TianYi.Lose) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        if (room.getFlag(skillUseEvent.fromId, TianYi.Win) !== undefined) {
            room.removeFlag(skillUseEvent.fromId, TianYi.Win);
        }
        if (room.getFlag(skillUseEvent.fromId, TianYi.Lose) !== undefined) {
            room.removeFlag(skillUseEvent.fromId, TianYi.Lose);
        }
        return true;
    }
};
TianYiRemove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: TianYi.Name, description: TianYi.Description })
], TianYiRemove);
exports.TianYiRemove = TianYiRemove;
let TianYiExtra = class TianYiExtra extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableTargets(cardId, room, owner) {
        if (!room.getFlag(owner.Id, TianYi.Win)) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? 1 : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? 1 : 0;
        }
    }
    breakCardUsableDistance(cardId, room, owner) {
        if (!room.getFlag(owner.Id, TianYi.Win)) {
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
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
    breakCardUsableTimes(cardId, room, owner) {
        if (!room.getFlag(owner.Id, TianYi.Win)) {
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
            return 1;
        }
        else {
            return 0;
        }
    }
};
TianYiExtra = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: TianYiRemove.Name, description: TianYiRemove.Description })
], TianYiExtra);
exports.TianYiExtra = TianYiExtra;
let TianYiBlock = class TianYiBlock extends skill_1.FilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        if (!room.getFlag(owner, TianYi.Lose) || isCardResponse) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? !cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }))
            : engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'slash';
    }
};
TianYiBlock = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: TianYiExtra.Name, description: TianYiExtra.Description })
], TianYiBlock);
exports.TianYiBlock = TianYiBlock;
