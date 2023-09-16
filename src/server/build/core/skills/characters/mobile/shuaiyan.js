"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuaiYan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShuaiYan = class ShuaiYan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 16 /* DropCardStageStart */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            owner.getCardIds(0 /* HandArea */).length > 1 &&
            room.getOtherPlayers(owner.Id).find(player => player.getPlayerCards().length > 0) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getPlayerCards().length > 0;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to display all your hand cards to let another player give you a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const displayEvent = {
            fromId: event.fromId,
            displayCards: room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */),
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(...room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */))).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, displayEvent);
        let selectedCards = room.getPlayerById(event.toIds[0]).getPlayerCards();
        if (selectedCards.length > 1) {
            const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 1,
                toId: event.toIds[0],
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give {1} a card', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, event.toIds[0], true);
            selectedCards =
                resp.selectedCards.length > 0
                    ? resp.selectedCards
                    : [selectedCards[Math.floor(Math.random() * selectedCards.length)]];
        }
        selectedCards.length > 0 &&
            (await room.moveCards({
                movingCards: [
                    { card: selectedCards[0], fromArea: room.getPlayerById(event.toIds[0]).cardFrom(selectedCards[0]) },
                ],
                fromId: event.toIds[0],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.toIds[0],
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
ShuaiYan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shuaiyan', description: 'shuaiyan_description' })
], ShuaiYan);
exports.ShuaiYan = ShuaiYan;
