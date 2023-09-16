"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoGuo = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XiaoGuo = class XiaoGuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId !== owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            !room.getPlayerById(content.playerId).Dead);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).is(0 /* Basic */) && room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to discard a basic card to use {0} to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.playerId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const toId = event.triggeredOnEvent.playerId;
        if (room.getPlayerById(toId).getPlayerCards().length > 0) {
            const response = await room.askForCardDrop(toId, 1, [0 /* HandArea */, 1 /* EquipArea */], false, room
                .getPlayerById(toId)
                .getPlayerCards()
                .filter(id => !engine_1.Sanguosha.getCardById(id).is(1 /* Equip */)), this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please discard a equip card, or you will take 1 damage from {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract());
            if (response.droppedCards.length > 0) {
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId, toId, this.Name);
                await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
                return true;
            }
        }
        await room.damage({
            fromId: event.fromId,
            toId,
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
XiaoGuo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xiaoguo', description: 'xiaoguo_description' })
], XiaoGuo);
exports.XiaoGuo = XiaoGuo;
