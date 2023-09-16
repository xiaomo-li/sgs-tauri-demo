"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanWei = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuanWei = class GuanWei extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        let canUse = content.toStage === 15 /* PlayCardStageEnd */ && !owner.hasUsedSkill(this.Name);
        if (canUse) {
            const events = room.Analytics.getCardUseRecord(content.playerId, 'round');
            if (events.length > 1) {
                let suit = engine_1.Sanguosha.getCardById(events[0].cardId).Suit;
                events.shift();
                for (const event of events) {
                    const nowSuit = engine_1.Sanguosha.getCardById(event.cardId).Suit;
                    if (suit === 0 /* NoSuit */ || suit !== nowSuit) {
                        canUse = false;
                        break;
                    }
                    suit = nowSuit;
                }
            }
            else {
                canUse = false;
            }
        }
        return canUse;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop a card to let {1} draw 2 cards and gain an extra play phase?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.playerId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        const toId = event.triggeredOnEvent.playerId;
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        await room.drawCards(2, toId, 'top', fromId, this.Name);
        room.insertPlayerPhase(toId, 4 /* PlayCardStage */);
        return true;
    }
};
GuanWei = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'guanwei', description: 'guanwei_description' })
], GuanWei);
exports.GuanWei = GuanWei;
