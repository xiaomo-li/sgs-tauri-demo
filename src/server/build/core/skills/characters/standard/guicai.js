"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuiCai = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuiCai = class GuiCai extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['god_simayi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeJudgeEffect" /* BeforeJudgeEffect */;
    }
    canUse(room, owner) {
        return owner.getPlayerCards().length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return (room
            .getPlayerById(owner)
            .getSkills('filter')
            .find(skill => !skill.canUseCard(cardId, room, owner, undefined, true)) === undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, cardIds } = skillUseEvent;
        const judgeEvent = triggeredOnEvent;
        await room.responseCard({
            cardId: cardIds[0],
            fromId: skillUseEvent.fromId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} responsed card {1} to replace judge card {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(cardIds[0]), translation_json_tool_1.TranslationPack.patchCardInTranslation(judgeEvent.judgeCardId)).extract(),
            mute: true,
        });
        room.moveCards({
            movingCards: [{ card: judgeEvent.judgeCardId, fromArea: 6 /* ProcessingArea */ }],
            toArea: 4 /* DropStack */,
            moveReason: 6 /* PlaceToDropStack */,
            proposer: skillUseEvent.fromId,
            movedByReason: this.GeneralName,
        });
        room.endProcessOnTag(judgeEvent.judgeCardId.toString());
        judgeEvent.judgeCardId = cardIds[0];
        room.addProcessingCards(judgeEvent.judgeCardId.toString(), cardIds[0]);
        return true;
    }
};
GuiCai = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'guicai', description: 'guicai_description' })
], GuiCai);
exports.GuiCai = GuiCai;
