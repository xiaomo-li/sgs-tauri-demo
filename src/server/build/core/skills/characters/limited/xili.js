"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiLi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XiLi = class XiLi extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, event) {
        return (!owner.hasUsedSkill(this.Name) &&
            !!event.fromId &&
            event.fromId !== owner.Id &&
            !room.getPlayerById(event.fromId).Dead &&
            room.getPlayerById(event.fromId).hasSkill(this.Name) &&
            room.CurrentPlayer === room.getPlayerById(event.fromId) &&
            !room.getPlayerById(event.toId).hasSkill(this.Name) &&
            owner.getPlayerCards().length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard a card to increase the damage to {2} which dealt by {1} by 1, then you and {1} will draw 2 cards?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const damageEvent = event.triggeredOnEvent;
        damageEvent.damage++;
        for (const toId of [damageEvent.fromId, event.fromId]) {
            await room.drawCards(2, toId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
XiLi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'xili', description: 'xili_description' })
], XiLi);
exports.XiLi = XiLi;
