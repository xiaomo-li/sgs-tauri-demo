"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiMan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiMan = class ZhiMan extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['guansuo'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, event) {
        return event.fromId === owner.Id && event.toId !== owner.Id;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to prevent the damage to {1} to pick one card in areas?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const damageEffect = triggeredOnEvent;
        event_packer_1.EventPacker.terminate(damageEffect);
        const toId = damageEffect.toId;
        const to = room.getPlayerById(toId);
        if (to.getCardIds().length > 0) {
            const options = {
                [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId,
                toId,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
            if (!response) {
                return false;
            }
            await room.moveCards({
                movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                fromId: chooseCardEvent.toId,
                toId: chooseCardEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: chooseCardEvent.fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
ZhiMan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhiman', description: 'zhiman_description' })
], ZhiMan);
exports.ZhiMan = ZhiMan;
