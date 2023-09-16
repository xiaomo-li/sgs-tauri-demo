"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianYingUnlimited = exports.JianYingRecord = exports.JianYingTrigger = exports.JianYing = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JianYing = class JianYing extends skill_1.ViewAsSkill {
    canViewAs() {
        return engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */));
    }
    isRefreshAt(room, owner, phase) {
        return phase === 0 /* PhaseBegin */ && room.CurrentPlayer.Id === owner.Id;
    }
    canUse(room, owner) {
        return (!owner.hasUsedSkill(this.Name) &&
            owner.getPlayerCards().length > 0 &&
            owner.canUseCard(room, new card_matcher_1.CardMatcher({
                name: engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */)),
            })));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */, 1 /* EquipArea */];
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown jianying card');
        const lastCardId = owner.getFlag(JianYingRecord.Name);
        let card;
        if (lastCardId !== undefined) {
            card = engine_1.Sanguosha.getCardById(lastCardId);
        }
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
            cardNumber: card ? card.CardNumber : 0,
            cardSuit: card ? card.Suit : 0 /* NoSuit */,
        }, selectedCards);
    }
};
JianYing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jianying', description: 'jianying_description' })
], JianYing);
exports.JianYing = JianYing;
let JianYingTrigger = class JianYingTrigger extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, event) {
        if (event.fromId !== owner.Id ||
            room.CurrentPlayerPhase !== 4 /* PlayCardStage */ ||
            room.CurrentPhasePlayer !== owner) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(event.cardId);
        const lastCardId = room.getFlag(owner.Id, JianYingRecord.Name);
        if (lastCardId !== undefined) {
            const lastCard = engine_1.Sanguosha.getCardById(lastCardId);
            if ((lastCard.Suit !== 0 /* NoSuit */ && lastCard.Suit === card.Suit) ||
                (lastCard.CardNumber !== 0 && lastCard.CardNumber === card.CardNumber)) {
                return true;
            }
        }
        return false;
    }
    async onTrigger(room, event) {
        event.mute = false;
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
JianYingTrigger = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: JianYing.Name, description: JianYing.Description })
], JianYingTrigger);
exports.JianYingTrigger = JianYingTrigger;
let JianYingRecord = class JianYingRecord extends skill_1.TriggerSkill {
    getPriority(room, owner, event) {
        return 2 /* Low */;
    }
    isAutoTrigger(room, owner, event) {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardUseEffect" /* AfterCardUseEffect */;
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */ && room.CurrentPlayer.Id === owner.Id;
    }
    whenRefresh(room, owner) {
        room.removeFlag(owner.Id, this.Name);
    }
    canUse(room, owner, event) {
        if (event.fromId !== owner.Id ||
            room.CurrentPlayerPhase !== 4 /* PlayCardStage */ ||
            room.CurrentPhasePlayer !== owner) {
            return false;
        }
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardEvent = event.triggeredOnEvent;
        room.setFlag(event.fromId, this.Name, cardEvent.cardId);
        return true;
    }
};
JianYingRecord = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: JianYingTrigger.Name, description: JianYingTrigger.Description })
], JianYingRecord);
exports.JianYingRecord = JianYingRecord;
let JianYingUnlimited = class JianYingUnlimited extends skill_1.RulesBreakerSkill {
    breakCardUsableTimes(cardId) {
        return !(cardId instanceof card_matcher_1.CardMatcher) &&
            engine_1.Sanguosha.getCardById(cardId).isVirtualCard() &&
            engine_1.Sanguosha.getCardById(cardId).findByGeneratedSkill(this.GeneralName)
            ? game_props_1.INFINITE_TRIGGERING_TIMES
            : 0;
    }
};
JianYingUnlimited = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: JianYingRecord.Name, description: JianYingRecord.Description })
], JianYingUnlimited);
exports.JianYingUnlimited = JianYingUnlimited;
