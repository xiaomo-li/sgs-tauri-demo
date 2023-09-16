"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuLve = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LuLve = class LuLve extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 13 /* PlayCardStageStart */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            room.getOtherPlayers(owner.Id).find(player => {
                const handcards = player.getCardIds(0 /* HandArea */).length;
                return handcards > 0 && handcards < owner.getCardIds(0 /* HandArea */).length;
            }) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        if (owner === target) {
            return false;
        }
        const handcards = room.getPlayerById(target).getCardIds(0 /* HandArea */).length;
        return handcards > 0 && handcards < room.getPlayerById(owner).getCardIds(0 /* HandArea */).length;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a lulve target to use this skill?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const options = ['lulve:prey', 'lulve:turnOver'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose lulve options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
            toId: toIds[0],
            triggeredBySkills: [this.Name],
        }, toIds[0], true);
        response.selectedOption = response.selectedOption || options[0];
        if (response.selectedOption === options[1]) {
            await room.turnOver(toIds[0]);
            const virtualSlash = card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id;
            room.getPlayerById(toIds[0]).canUseCardTo(room, virtualSlash, fromId, true) &&
                (await room.useCard({
                    fromId: toIds[0],
                    targetGroup: [[fromId]],
                    cardId: virtualSlash,
                }));
        }
        else {
            await room.moveCards({
                movingCards: room
                    .getPlayerById(toIds[0])
                    .getCardIds(0 /* HandArea */)
                    .map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: toIds[0],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: toIds[0],
                triggeredBySkills: [this.Name],
            });
            await room.turnOver(fromId);
        }
        return true;
    }
};
LuLve = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lulve', description: 'lulve_description' })
], LuLve);
exports.LuLve = LuLve;
