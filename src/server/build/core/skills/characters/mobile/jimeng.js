"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiMeng = void 0;
const tslib_1 = require("tslib");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiMeng = class JiMeng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 13 /* PlayCardStageStart */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            room.getOtherPlayers(owner.Id).find(player => player.getPlayerCards().length > 0) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getPlayerCards().length > 0;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('jimeng {0}: do you want to prey a card from another player?', this.Name).extract();
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
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId,
            toId: toIds[0],
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
        if (!response) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: toIds[0],
            toId: fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        const hp = room.getPlayerById(fromId).Hp;
        if (hp < 1 || room.getPlayerById(toIds[0]).Dead) {
            return false;
        }
        let selectedCards = room.getPlayerById(fromId).getPlayerCards();
        if (selectedCards.length > hp) {
            const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: hp,
                toId: fromId,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give {1} {2} card(s)', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0])), hp).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, fromId, true);
            selectedCards = resp.selectedCards.length > 0 ? resp.selectedCards : algorithm_1.Algorithm.randomPick(hp, selectedCards);
        }
        selectedCards.length > 0 &&
            (await room.moveCards({
                movingCards: selectedCards.map(card => ({ card, fromArea: room.getPlayerById(fromId).cardFrom(card) })),
                fromId,
                toId: toIds[0],
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
JiMeng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jimeng', description: 'jimeng_description' })
], JiMeng);
exports.JiMeng = JiMeng;
