"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JinZhiShadow = exports.JinZhi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JinZhi = class JinZhi extends skill_1.ViewAsSkill {
    canViewAs(room, owner) {
        return engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */));
    }
    canUse(room, owner) {
        return (engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */)).find(name => owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: [name] }))) !== undefined);
    }
    cardFilter(room, owner, cards) {
        return cards.length === owner.hasUsedSkillTimes(this.Name) + 1;
    }
    isAvailableCard(room, owner, cardId, selectedCards) {
        if (!room.canDropCard(owner.Id, cardId)) {
            return false;
        }
        return selectedCards.length > 0
            ? engine_1.Sanguosha.getCardById(cardId).Color === engine_1.Sanguosha.getCardById(selectedCards[0]).Color
            : true;
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown jinzhi card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
            cardNumber: 0,
            cardSuit: 0 /* NoSuit */,
            hideActualCard: true,
        }, selectedCards);
    }
};
JinZhi = tslib_1.__decorate([
    skill_wrappers_1.CircleSkill,
    skill_wrappers_1.CommonSkill({ name: 'jinzhi', description: 'jinzhi_description' })
], JinZhi);
exports.JinZhi = JinZhi;
let JinZhiShadow = class JinZhiShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    get Muted() {
        return true;
    }
    isTriggerable(event, stage) {
        return ((stage === "PreCardUse" /* PreCardUse */ || stage === "PreCardResponse" /* PreCardResponse */) &&
            card_1.Card.isVirtualCardId(event.cardId));
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).findByGeneratedSkill(this.GeneralName));
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        const multiEvent = event.triggeredOnEvent;
        const realCards = card_1.VirtualCard.getActualCards([multiEvent.cardId]);
        await room.dropCards(4 /* SelfDrop */, realCards, event.fromId, event.fromId, this.Name);
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        multiEvent.cardId = card_1.VirtualCard.create({
            cardName: engine_1.Sanguosha.getCardById(multiEvent.cardId).Name,
            bySkill: this.Name,
        }).Id;
        return true;
    }
};
JinZhiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JinZhi.Name, description: JinZhi.Description })
], JinZhiShadow);
exports.JinZhiShadow = JinZhiShadow;
