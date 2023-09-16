"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WanGongClear = exports.WanGongBuff = exports.WanGongShadow = exports.WanGong = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WanGong = class WanGong extends skill_1.TriggerSkill {
    async whenLosingSkill(room, owner) {
        room.removeFlag(owner.Id, this.Name);
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            !content.extraUse &&
            owner.getFlag(this.Name) &&
            engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash');
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        cardUseEvent.extraUse = true;
        room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === room.getPlayerById(event.fromId) &&
            room.syncGameCommonRules(event.fromId, user => {
                room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), 1, user);
                user.addInvisibleMark(this.Name, 1);
            });
        cardUseEvent.additionalDamage = cardUseEvent.additionalDamage || 0;
        cardUseEvent.additionalDamage++;
        return true;
    }
};
WanGong = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'wangong', description: 'wangong_description' })
], WanGong);
exports.WanGong = WanGong;
let WanGongShadow = class WanGongShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            (owner.getFlag(this.GeneralName)
                ? !engine_1.Sanguosha.getCardById(content.cardId).is(0 /* Basic */)
                : engine_1.Sanguosha.getCardById(content.cardId).is(0 /* Basic */)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardId = event.triggeredOnEvent.cardId;
        const card = engine_1.Sanguosha.getCardById(cardId);
        if (card.is(0 /* Basic */)) {
            room.setFlag(event.fromId, this.GeneralName, true, this.GeneralName);
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
WanGongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: WanGong.Name, description: WanGong.Description })
], WanGongShadow);
exports.WanGongShadow = WanGongShadow;
let WanGongBuff = class WanGongBuff extends skill_1.RulesBreakerSkill {
    breakCardUsableDistance(cardId, room, owner) {
        if (!owner.getFlag(this.GeneralName)) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? game_props_1.INFINITE_DISTANCE : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? game_props_1.INFINITE_DISTANCE : 0;
        }
    }
    breakCardUsableTimes(cardId, room, owner) {
        if (!owner.getFlag(this.GeneralName)) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
        }
    }
};
WanGongBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: WanGongShadow.Name, description: WanGongShadow.Description })
], WanGongBuff);
exports.WanGongBuff = WanGongBuff;
let WanGongClear = class WanGongClear extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    clearWanGongHistory(room, from) {
        const extraUse = from.getInvisibleMark(this.GeneralName);
        if (extraUse === 0) {
            return;
        }
        room.syncGameCommonRules(from.Id, user => {
            room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), -extraUse, user);
            from.removeInvisibleMark(this.GeneralName);
        });
    }
    async whenDead(room, player) {
        this.clearWanGongHistory(room, player);
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        return (content.fromPlayer === owner.Id &&
            content.from === 4 /* PlayCardStage */ &&
            owner.getInvisibleMark(this.GeneralName) > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        this.clearWanGongHistory(room, room.getPlayerById(event.fromId));
        return true;
    }
};
WanGongClear = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: WanGongBuff.Name, description: WanGongBuff.Description })
], WanGongClear);
exports.WanGongClear = WanGongClear;
