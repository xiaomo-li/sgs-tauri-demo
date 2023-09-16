"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QianJieShadow = exports.QianJie = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let QianJie = class QianJie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeChainingOn" /* BeforeChainingOn */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && content.linked === true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const chainLockedEvent = event.triggeredOnEvent;
        event_packer_1.EventPacker.terminate(chainLockedEvent);
        return true;
    }
};
QianJie = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'qianjie', description: 'qianjie_description' })
], QianJie);
exports.QianJie = QianJie;
let QianJieShadow = class QianJieShadow extends skill_1.FilterSkill {
    canBeUsedCard(cardId, room, owner, attacker) {
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !new card_matcher_1.CardMatcher({ type: [8 /* DelayedTrick */] }).match(cardId);
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            return !card.is(8 /* DelayedTrick */);
        }
    }
    canBePindianTarget() {
        return false;
    }
};
QianJieShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: QianJie.Name, description: QianJie.Description })
], QianJieShadow);
exports.QianJieShadow = QianJieShadow;
