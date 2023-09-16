"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuiDao = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuiDao = class GuiDao extends skill_1.TriggerSkill {
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
        return (engine_1.Sanguosha.getCardById(cardId).isBlack() &&
            room
                .getPlayerById(owner)
                .getSkills('filter')
                .find(skill => !skill.canUseCard(cardId, room, owner, undefined, true)) === undefined);
    }
    async onTrigger(room, skillUseEvent) {
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
        await room.moveCards({
            moveReason: 2 /* ActiveMove */,
            movingCards: [{ card: judgeEvent.judgeCardId, fromArea: 6 /* ProcessingArea */ }],
            toId: skillUseEvent.fromId,
            toArea: 0 /* HandArea */,
            proposer: skillUseEvent.fromId,
            movedByReason: this.Name,
        });
        room.endProcessOnTag(judgeEvent.judgeCardId.toString());
        judgeEvent.judgeCardId = cardIds[0];
        room.addProcessingCards(judgeEvent.judgeCardId.toString(), cardIds[0]);
        const guidaoCard = engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId);
        if (guidaoCard.Suit === 1 /* Spade */ && guidaoCard.CardNumber >= 2 && guidaoCard.CardNumber <= 9) {
            await room.drawCards(1, skillUseEvent.fromId, 'top', undefined, this.Name);
        }
        return true;
    }
};
GuiDao = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'guidao', description: 'guidao_description' })
], GuiDao);
exports.GuiDao = GuiDao;
