"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LieGongShadow = exports.LieGong = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LieGong = class LieGong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    async onTrigger(room, event) {
        return true;
    }
    canUse(room, owner, content) {
        const canUse = content.fromId === owner.Id &&
            content.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash';
        if (!canUse) {
            return false;
        }
        const to = room.getPlayerById(content.toId);
        return (to.getCardIds(0 /* HandArea */).length <= owner.getCardIds(0 /* HandArea */).length ||
            to.Hp >= owner.Hp);
    }
    async onEffect(room, event) {
        const aimEvent = event.triggeredOnEvent;
        const from = room.getPlayerById(aimEvent.fromId);
        const to = room.getPlayerById(aimEvent.toId);
        if (to.getCardIds(0 /* HandArea */).length <= from.getCardIds(0 /* HandArea */).length) {
            event_packer_1.EventPacker.setDisresponsiveEvent(aimEvent);
        }
        if (to.Hp >= from.Hp) {
            aimEvent.additionalDamage = aimEvent.additionalDamage ? aimEvent.additionalDamage++ : 1;
        }
        return true;
    }
};
LieGong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'liegong', description: 'liegong_description' })
], LieGong);
exports.LieGong = LieGong;
let LieGongShadow = class LieGongShadow extends skill_1.RulesBreakerSkill {
    breakAttackDistance(cardId, room, owner) {
        if (cardId === undefined || cardId instanceof card_matcher_1.CardMatcher) {
            return 0;
        }
        else {
            return Math.max(0, engine_1.Sanguosha.getCardById(cardId).CardNumber - owner.getAttackRange(room));
        }
    }
};
LieGongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: LieGong.Name, description: LieGong.Description })
], LieGongShadow);
exports.LieGongShadow = LieGongShadow;
