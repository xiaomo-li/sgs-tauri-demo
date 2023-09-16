"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuYi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BuYi = class BuYi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        const dyingPlayer = room.getPlayerById(content.dying);
        return dyingPlayer.Hp <= 0 && dyingPlayer.getCardIds(0 /* HandArea */).length > 0;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to reveal a hand card from {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.dying))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const dyingEvent = event.triggeredOnEvent;
        const dyingPlayer = room.getPlayerById(dyingEvent.dying);
        const options = {
            [0 /* HandArea */]: dyingPlayer.getCardIds(0 /* HandArea */).length,
        };
        if (event.fromId === dyingEvent.dying) {
            options[0 /* HandArea */] = dyingPlayer.getCardIds(0 /* HandArea */);
        }
        const chooseCardEvent = {
            fromId: event.fromId,
            toId: dyingEvent.dying,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, false, true);
        if (!response) {
            return false;
        }
        room.broadcast(126 /* CardDisplayEvent */, {
            displayCards: [response.selectedCard],
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(dyingPlayer), translation_json_tool_1.TranslationPack.patchCardInTranslation(response.selectedCard)).extract(),
        });
        if (!engine_1.Sanguosha.getCardById(response.selectedCard).is(0 /* Basic */) &&
            !(event.fromId === dyingEvent.dying && !room.canDropCard(event.fromId, response.selectedCard))) {
            await room.dropCards(4 /* SelfDrop */, [response.selectedCard], dyingEvent.dying, dyingEvent.dying, this.Name);
            await room.recover({
                toId: dyingEvent.dying,
                recoveredHp: 1,
                recoverBy: dyingEvent.dying,
            });
        }
        return true;
    }
};
BuYi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'buyi', description: 'buyi_description' })
], BuYi);
exports.BuYi = BuYi;
