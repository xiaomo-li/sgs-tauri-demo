"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JunXing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JunXing = class JunXing extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const { fromId, cardIds, toIds } = skillEffectEvent;
        const toId = toIds[0];
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const dropCardsNum = cardIds.length;
        const playerCardsNum = room.getPlayerById(toId).getPlayerCards().length;
        if (playerCardsNum < dropCardsNum) {
            await room.turnOver(toId);
            await room.drawCards(dropCardsNum, toId, undefined, fromId, this.Name);
        }
        else {
            const response = await room.askForCardDrop(toId, dropCardsNum, [1 /* EquipArea */, 0 /* HandArea */], false, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: drop {1} cards or turn over', this.Name, dropCardsNum).toString());
            if (response.droppedCards.length === dropCardsNum) {
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId);
                await room.loseHp(toId, 1);
            }
            else {
                await room.turnOver(toId);
                await room.drawCards(dropCardsNum, toId, undefined, fromId, this.Name);
            }
        }
        return true;
    }
};
JunXing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'junxing', description: 'junxing_description' })
], JunXing);
exports.JunXing = JunXing;
