"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongYinClear = exports.LongYin = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const jiezhong_1 = require("./jiezhong");
let LongYin = class LongYin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const event = content;
        return (room.CurrentPhasePlayer.Id === event.fromId &&
            engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'slash' &&
            owner.getPlayerCards().length > 0 &&
            !event.extraUse);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, cardIds, triggeredOnEvent } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        const event = triggeredOnEvent;
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        from.setFlag(this.Name, event.fromId);
        event.extraUse = true;
        room.syncGameCommonRules(event.fromId, target => {
            room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), 1, room.getPlayerById(event.fromId));
            from.addInvisibleMark(this.Name, 1);
        });
        if (engine_1.Sanguosha.getCardById(event.cardId).isRed()) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        if (from.hasUsedSkill(jiezhong_1.JieZhong.Name) &&
            engine_1.Sanguosha.getCardById(cardIds[0]).CardNumber === engine_1.Sanguosha.getCardById(event.cardId).CardNumber) {
            room.refreshPlayerOnceSkill(fromId, jiezhong_1.JieZhong.Name);
        }
        return true;
    }
};
LongYin = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'longyin', description: 'longyin_description' })
], LongYin);
exports.LongYin = LongYin;
let LongYinClear = class LongYinClear extends skill_1.TriggerSkill {
    get Muted() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterStageChanged" /* AfterStageChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    afterLosingSkill(room) {
        return room.CurrentPlayerStage === 15 /* PlayCardStageEnd */;
    }
    afterDead(room) {
        return room.CurrentPlayerStage === 15 /* PlayCardStageEnd */;
    }
    clearLongYinHistory(room, from) {
        const targetId = from.getFlag(this.GeneralName);
        const extraUse = from.getInvisibleMark(this.GeneralName);
        if (extraUse === 0 || !targetId) {
            return;
        }
        room.syncGameCommonRules(targetId, target => {
            room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), -extraUse, room.getPlayerById(targetId));
            from.removeInvisibleMark(this.GeneralName);
            from.removeFlag(this.GeneralName);
        });
        from.removeFlag(this.GeneralName);
    }
    canUse(room, owner, content) {
        const event = content;
        return (event.toStage === 15 /* PlayCardStageEnd */ && owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        this.clearLongYinHistory(room, from);
        return true;
    }
};
LongYinClear = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: LongYin.Name, description: LongYin.Description })
], LongYinClear);
exports.LongYinClear = LongYinClear;
