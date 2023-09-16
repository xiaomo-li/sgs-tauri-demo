"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiaoXianShadow = exports.MiaoXian = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let MiaoXian = class MiaoXian extends skill_1.ViewAsSkill {
    canViewAs() {
        return engine_1.Sanguosha.getCardNameByType(types => types.includes(7 /* Trick */) && !types.includes(8 /* DelayedTrick */));
    }
    isRefreshAt(room, owner, phase) {
        return phase === 0 /* PhaseBegin */;
    }
    canUse(room, owner) {
        return (!owner.hasUsedSkill(this.Name) &&
            owner.getCardIds(0 /* HandArea */).filter(card => engine_1.Sanguosha.getCardById(card).Color === 1 /* Black */)
                .length === 1);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return (engine_1.Sanguosha.getCardById(pendingCardId).Color === 1 /* Black */ &&
            owner.getCardIds(0 /* HandArea */).includes(pendingCardId));
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown guhuo card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
        }, selectedCards);
    }
};
MiaoXian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'miaoxian', description: 'miaoxian_description' })
], MiaoXian);
exports.MiaoXian = MiaoXian;
let MiaoXianShadow = class MiaoXianShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => info.fromId === owner.Id &&
            info.moveReason === 8 /* CardUse */ &&
            info.movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card) &&
                engine_1.Sanguosha.getCardById(card.card).Color === 0 /* Red */ &&
                card.fromArea === 0 /* HandArea */).length === 1) !== undefined &&
            owner.getCardIds(0 /* HandArea */).find(card => engine_1.Sanguosha.getCardById(card).Color === 0 /* Red */) ===
                undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
MiaoXianShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: MiaoXian.Name, description: MiaoXian.Description })
], MiaoXianShadow);
exports.MiaoXianShadow = MiaoXianShadow;
