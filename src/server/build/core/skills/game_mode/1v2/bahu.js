"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaHuShadow = exports.BaHu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let BaHu = class BaHu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && content.toStage === 3 /* PrepareStageStart */;
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        await room.drawCards(1, fromId);
        return true;
    }
    get Muted() {
        return true;
    }
};
BaHu = tslib_1.__decorate([
    skill_wrappers_1.PersistentSkill({ stubbornSkill: true }),
    skill_wrappers_1.CompulsorySkill({ name: 'bahu', description: 'bahu_description' })
], BaHu);
exports.BaHu = BaHu;
let BaHuShadow = class BaHuShadow extends skill_1.RulesBreakerSkill {
    get Muted() {
        return true;
    }
    breakCardUsableTimes(cardId, room, owner) {
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? 1 : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? 1 : 0;
        }
    }
};
BaHuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill({ stubbornSkill: true }),
    skill_wrappers_1.CompulsorySkill({ name: BaHu.Name, description: BaHu.Description })
], BaHuShadow);
exports.BaHuShadow = BaHuShadow;
