"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanXing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuanXing = class GuanXing extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['jiangwei', 'gexuan'];
    }
    audioIndex(characterName) {
        return characterName && characterName === this.RelatedCharacters[1] ? 1 : 2;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        if (owner.Id !== content.playerId ||
            ![4 /* PrepareStage */, 20 /* FinishStage */].includes(content.toStage)) {
            return false;
        }
        if (content.toStage === 20 /* FinishStage */) {
            if (owner.getInvisibleMark(this.Name) === 0) {
                return false;
            }
            else {
                owner.removeInvisibleMark(this.Name);
                return true;
            }
        }
        return true;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const guanxingAmount = room.AlivePlayers.length >= 4 ? 5 : 3;
        const cards = room.getCards(guanxingAmount, 'top');
        const guanxingEvent = {
            cardIds: cards,
            top: guanxingAmount,
            topStackName: 'draw stack top',
            bottom: guanxingAmount,
            bottomStackName: 'draw stack bottom',
            toId: skillUseEvent.fromId,
            movable: true,
            triggeredBySkills: [this.Name],
        };
        room.notify(172 /* AskForPlaceCardsInDileEvent */, guanxingEvent, skillUseEvent.fromId);
        const { top, bottom } = await room.onReceivingAsyncResponseFrom(172 /* AskForPlaceCardsInDileEvent */, skillUseEvent.fromId);
        room.broadcast(103 /* CustomGameDialog */, {
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('guanxing finished, {0} cards placed on the top and {1} cards placed at the bottom', top.length, bottom.length).extract(),
        });
        room.putCards('top', ...top);
        room.putCards('bottom', ...bottom);
        if (top.length === 0 && room.CurrentPlayerPhase === 1 /* PrepareStage */) {
            room.getPlayerById(skillUseEvent.fromId).addInvisibleMark(this.Name, 1);
        }
        return true;
    }
};
GuanXing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'guanxing', description: 'guanxing_description' })
], GuanXing);
exports.GuanXing = GuanXing;
