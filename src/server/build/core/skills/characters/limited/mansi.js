"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManSiShadow = exports.ManSi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ManSi = class ManSi extends skill_1.ViewAsSkill {
    canViewAs(room, owner, selectedCards, cardMatcher) {
        return cardMatcher ? [] : ['nanmanruqing'];
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    canUse(room, owner) {
        return (!owner.hasUsedSkill(this.Name) &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            owner.canUseCard(room, new card_matcher_1.CardMatcher({
                name: ['nanmanruqing'],
            })));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown mansi card');
        return card_1.VirtualCard.create({
            cardName: 'nanmanruqing',
            bySkill: this.Name,
        }, owner.getCardIds(0 /* HandArea */));
    }
};
ManSi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mansi', description: 'mansi_description' })
], ManSi);
exports.ManSi = ManSi;
let ManSiShadow = class ManSiShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, event) {
        return !!event.cardIds && engine_1.Sanguosha.getCardById(event.cardIds[0]).GeneralName === 'nanmanruqing';
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ManSiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: 'manyi', description: 'manyi_description' })
], ManSiShadow);
exports.ManSiShadow = ManSiShadow;
