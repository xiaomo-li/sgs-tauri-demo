"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuanShi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuanShi = class HuanShi extends skill_1.TriggerSkill {
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeJudgeEffect" /* BeforeJudgeEffect */;
    }
    canUse(room, owner) {
        return owner.getCardIds(0 /* HandArea */).length > 0;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const judgeEvent = event.triggeredOnEvent;
        const to = room.getPlayerById(judgeEvent.toId);
        const options = {
            [1 /* EquipArea */]: to
                .getCardIds(1 /* EquipArea */)
                .filter(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName !== judgeEvent.bySkill),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */),
        };
        const chooseCardEvent = {
            fromId: judgeEvent.toId,
            toId: event.fromId,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, judgeEvent.toId, false, true);
        if (!response ||
            room
                .getPlayerById(event.fromId)
                .getSkills('filter')
                .find(skill => !skill.canUseCard(response.selectedCard, room, event.fromId, undefined, true)) === undefined) {
            return false;
        }
        const selectedCard = response.selectedCard;
        await room.responseCard({
            cardId: selectedCard,
            fromId: event.fromId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} responsed card {1} to replace judge card {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(selectedCard), translation_json_tool_1.TranslationPack.patchCardInTranslation(judgeEvent.judgeCardId)).extract(),
            mute: true,
        });
        room.moveCards({
            movingCards: [{ card: judgeEvent.judgeCardId, fromArea: 6 /* ProcessingArea */ }],
            toArea: 4 /* DropStack */,
            moveReason: 6 /* PlaceToDropStack */,
            proposer: event.fromId,
            movedByReason: this.Name,
        });
        room.endProcessOnTag(judgeEvent.judgeCardId.toString());
        judgeEvent.judgeCardId = selectedCard;
        room.addProcessingCards(judgeEvent.judgeCardId.toString(), selectedCard);
        return true;
    }
};
HuanShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'huanshi', description: 'huanshi_description' })
], HuanShi);
exports.HuanShi = HuanShi;
