"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangMie = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LangMie = class LangMie extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return event !== undefined && event.toStage === 19 /* FinishStageStart */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        if (owner.Id === content.playerId) {
            return false;
        }
        if (content.toStage === 15 /* PlayCardStageEnd */) {
            const types = [];
            let canUse = false;
            for (const record of room.Analytics.getCardUseRecord(content.playerId, 'phase')) {
                const type = engine_1.Sanguosha.getCardById(record.cardId).BaseType;
                if (types.includes(type)) {
                    canUse = true;
                    break;
                }
                types.push(type);
            }
            return canUse;
        }
        else if (content.toStage === 19 /* FinishStageStart */) {
            return (room.Analytics.getDamage(content.playerId, 'round') >= 2 &&
                owner.getPlayerCards().find(id => room.canDropCard(owner.Id, id)) !== undefined);
        }
        return false;
    }
    async beforeUse(room, event) {
        const phaseStageChangeEvent = event.triggeredOnEvent;
        if (phaseStageChangeEvent.toStage === 19 /* FinishStageStart */) {
            const response = await room.askForCardDrop(event.fromId, 1, [0 /* HandArea */, 1 /* EquipArea */], false, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard a card to deal 1 damage to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(phaseStageChangeEvent.playerId))).extract());
            if (response.droppedCards.length === 0) {
                return false;
            }
            else {
                event.cardIds = response.droppedCards;
            }
        }
        return true;
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event.triggeredOnEvent.toStage ===
            19 /* FinishStageStart */) {
            await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
            await room.damage({
                fromId: event.fromId,
                toId: event.triggeredOnEvent.playerId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
LangMie = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'langmie', description: 'langmie_description' })
], LangMie);
exports.LangMie = LangMie;
