"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuiLieClear = exports.ZhuiLieShadow = exports.ZhuiLie = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhuiLie = class ZhuiLie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            !content.extraUse &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
            !room.withinAttackDistance(owner, room.getPlayerById(content.toId)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const aimEvent = event.triggeredOnEvent;
        aimEvent.extraUse = true;
        room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === room.getPlayerById(event.fromId) &&
            room.syncGameCommonRules(event.fromId, user => {
                room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), 1, user);
                user.addInvisibleMark(this.Name, 1);
            });
        const judgeEvent = await room.judge(event.fromId, undefined, this.Name, 13 /* ZhuiLie */);
        if (judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId))) {
            aimEvent.additionalDamage =
                room.getPlayerById(aimEvent.toId).Hp - 1 - (event_packer_1.EventPacker.getMiddleware("drunkLevel" /* DrunkTag */, aimEvent) || 0);
        }
        else {
            await room.loseHp(event.fromId, 1);
        }
        return true;
    }
};
ZhuiLie = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhuilie', description: 'zhuilie_description' })
], ZhuiLie);
exports.ZhuiLie = ZhuiLie;
let ZhuiLieShadow = class ZhuiLieShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableDistance(cardId, room, owner) {
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
};
ZhuiLieShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: ZhuiLie.Name, description: ZhuiLie.Description })
], ZhuiLieShadow);
exports.ZhuiLieShadow = ZhuiLieShadow;
let ZhuiLieClear = class ZhuiLieClear extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    clearZhuiLieHistory(room, from) {
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
        this.clearZhuiLieHistory(room, player);
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
        this.clearZhuiLieHistory(room, room.getPlayerById(event.fromId));
        return true;
    }
};
ZhuiLieClear = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: ZhuiLieShadow.Name, description: ZhuiLieShadow.Description })
], ZhuiLieClear);
exports.ZhuiLieClear = ZhuiLieClear;
