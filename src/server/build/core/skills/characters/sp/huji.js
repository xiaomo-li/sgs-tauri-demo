"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuJiShadow = exports.HuJi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const offense_horse_1 = require("core/skills/cards/standard/offense_horse");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let HuJi = class HuJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId && room.CurrentPlayer !== owner;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const judge = await room.judge(fromId, undefined, this.Name, 10 /* HuJi */);
        const sourceId = triggeredOnEvent.fromId;
        const source = sourceId && room.getPlayerById(sourceId);
        if (!source || source.Dead) {
            return false;
        }
        if (judge_matchers_1.JudgeMatcher.onJudge(judge.judgeMatcherEnum, engine_1.Sanguosha.getCardById(judge.judgeCardId))) {
            room.getPlayerById(fromId).canUseCardTo(room, new card_matcher_1.CardMatcher({ name: ['slash'] }), sourceId) &&
                (await room.useCard({
                    fromId,
                    targetGroup: [[sourceId]],
                    cardId: card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id,
                    triggeredBySkills: [this.Name],
                }));
        }
        return true;
    }
};
HuJi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'huji', description: 'huji_description' })
], HuJi);
exports.HuJi = HuJi;
let HuJiShadow = class HuJiShadow extends offense_horse_1.OffenseHorseSkill {
};
HuJiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: HuJi.Name, description: HuJi.Description })
], HuJiShadow);
exports.HuJiShadow = HuJiShadow;
