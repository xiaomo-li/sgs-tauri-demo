"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingZheng = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BingZheng = class BingZheng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 15 /* PlayCardStageEnd */ &&
            room.getAlivePlayersFrom().find(player => player.getCardIds(0 /* HandArea */).length !== player.Hp) !==
                undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        const target = room.getPlayerById(targetId);
        return target.Hp !== target.getCardIds(0 /* HandArea */).length;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to let him draw a card or drop a hand card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const to = room.getPlayerById(toIds[0]);
        const options = ['bingzheng:draw'];
        to.getCardIds(0 /* HandArea */).length > 0 && options.push('bingzheng:drop');
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose bingzheng options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        }, fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        if (response.selectedOption === options[0]) {
            await room.drawCards(1, toIds[0], 'top', fromId, this.Name);
        }
        else {
            const response = await room.askForCardDrop(toIds[0], 1, [0 /* HandArea */], true, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please drop a hand card', this.Name).extract());
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, toIds[0], toIds[0], this.Name));
        }
        if (to.Hp === to.getCardIds(0 /* HandArea */).length) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
            if (fromId !== toIds[0] && room.getPlayerById(fromId).getPlayerCards().length > 0) {
                const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                    cardAmount: 1,
                    toId: fromId,
                    reason: this.Name,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can to give a card to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
                    fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                    triggeredBySkills: [this.Name],
                }, fromId);
                if (response.selectedCards && response.selectedCards.length > 0) {
                    await room.moveCards({
                        movingCards: [{ card: response.selectedCards[0], fromArea: to.cardFrom(response.selectedCards[0]) }],
                        moveReason: 2 /* ActiveMove */,
                        fromId,
                        toId: toIds[0],
                        toArea: 0 /* HandArea */,
                        proposer: fromId,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
        }
        return true;
    }
};
BingZheng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'bingzheng', description: 'bingzheng_description' })
], BingZheng);
exports.BingZheng = BingZheng;
