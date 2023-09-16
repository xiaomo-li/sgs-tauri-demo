"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhaXiangDistance = exports.ZhaXiangShadow = exports.ZhaXiang = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let ZhaXiang = class ZhaXiang extends skill_1.TriggerSkill {
    whenRefresh(room, owner) {
        owner.getFlag(this.Name) && room.removeFlag(owner.Id, this.GeneralName);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */ && room.CurrentPlayer.Id === owner.Id;
    }
    isTriggerable(event, stage) {
        return stage === "AfterLostHp" /* AfterLostHp */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId;
    }
    triggerableTimes(event) {
        return event.lostHp;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.drawCards(3, skillUseEvent.fromId, undefined, skillUseEvent.fromId, this.Name);
        if (room.CurrentPlayer.Id === skillUseEvent.fromId) {
            const num = room.getFlag(skillUseEvent.fromId, this.GeneralName) || 0;
            room.setFlag(skillUseEvent.fromId, this.GeneralName, num + 1);
        }
        return true;
    }
};
ZhaXiang = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'zhaxiang', description: 'zhaxiang_description' })
], ZhaXiang);
exports.ZhaXiang = ZhaXiang;
let ZhaXiangShadow = class ZhaXiangShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return (event.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash' &&
            engine_1.Sanguosha.getCardById(event.byCardId).isRed());
    }
    canUse(room, owner, event) {
        return room.getFlag(owner.Id, this.GeneralName) !== 0 && owner.Id === event.cardUserId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const currentEvent = triggeredOnEvent;
        if (room.getFlag(currentEvent.cardUserId, this.GeneralName) > 0) {
            currentEvent.cardMatcher = new card_matcher_1.CardMatcher(currentEvent.cardMatcher)
                .without({ name: ['jink'] })
                .toSocketPassenger();
        }
        return true;
    }
};
ZhaXiangShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: ZhaXiang.GeneralName, description: ZhaXiang.Description })
], ZhaXiangShadow);
exports.ZhaXiangShadow = ZhaXiangShadow;
let ZhaXiangDistance = class ZhaXiangDistance extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, playerId) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */;
    }
    breakCardUsableDistance(cardId, room, owner) {
        if (room.CurrentPlayer !== owner || !room.getFlag(owner.Id, this.GeneralName)) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ suit: [2 /* Heart */, 4 /* Diamond */], generalName: ['slash'] }));
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            match = card.GeneralName === 'slash' && card.isRed();
        }
        return match ? game_props_1.INFINITE_DISTANCE : 0;
    }
    breakCardUsableTimes(cardId, room, owner) {
        const extra = room.getFlag(owner.Id, this.GeneralName);
        if (room.CurrentPlayer !== owner || !extra) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        return match ? extra : 0;
    }
};
ZhaXiangDistance = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: ZhaXiangShadow.Name, description: ZhaXiang.Description })
], ZhaXiangDistance);
exports.ZhaXiangDistance = ZhaXiangDistance;
