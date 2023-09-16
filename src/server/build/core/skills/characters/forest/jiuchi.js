"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiuChiExtra = exports.JiuChiDrunk = exports.JiuChi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JiuChi = class JiuChi extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['alcohol'];
    }
    canUse(room, owner) {
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['alcohol'] })) &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return engine_1.Sanguosha.getCardById(pendingCardId).Suit === 1 /* Spade */;
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'alcohol',
            bySkill: this.Name,
        }, selectedCards);
    }
};
JiuChi.Used = 'JiuChi_Used';
JiuChi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jiuchi', description: 'jiuchi_description' })
], JiuChi);
exports.JiuChi = JiuChi;
let JiuChiDrunk = class JiuChiDrunk extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, event) {
        const drunkLevel = event_packer_1.EventPacker.getMiddleware('drunkLevel', event);
        const { fromId, cardIds } = event;
        if (!fromId || !cardIds || !drunkLevel) {
            return false;
        }
        return (fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(cardIds[0]).GeneralName === 'slash' &&
            drunkLevel > 0 &&
            !owner.hasUsedSkill(this.Name));
    }
    isRefreshAt(room, owner, stage) {
        return stage === 1 /* PrepareStage */;
    }
    whenRefresh(room, owner) {
        if (room.getFlag(owner.Id, JiuChi.Used) === true) {
            room.removeFlag(owner.Id, JiuChi.Used);
        }
    }
    async whenDead(room, owner) {
        this.whenRefresh(room, owner);
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        room.setFlag(event.fromId, JiuChi.Used, true, JiuChi.Used);
        return true;
    }
};
JiuChiDrunk = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: JiuChi.GeneralName, description: JiuChi.Description })
], JiuChiDrunk);
exports.JiuChiDrunk = JiuChiDrunk;
let JiuChiExtra = class JiuChiExtra extends skill_1.RulesBreakerSkill {
    breakCardUsableTimes(cardId) {
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ name: ['alcohol'] })) ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).Name === 'alcohol' ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
        }
    }
};
JiuChiExtra = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: JiuChiDrunk.Name, description: JiuChi.Description })
], JiuChiExtra);
exports.JiuChiExtra = JiuChiExtra;
