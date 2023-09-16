"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DangZai = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DangZai = class DangZai extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 13 /* PlayCardStageStart */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            room
                .getOtherPlayers(owner.Id)
                .find(player => player.getCardIds(2 /* JudgeArea */).find(id => room.canPlaceCardTo(id, owner.Id))) !==
                undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (owner !== target &&
            room
                .getPlayerById(target)
                .getCardIds(2 /* JudgeArea */)
                .find(id => room.canPlaceCardTo(id, owner)) !== undefined);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to move a card from another player’s judge area?', this.Name).extract();
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
            [1 /* EquipArea */]: to
                .getCardIds(2 /* JudgeArea */)
                .filter(id => room.canPlaceCardTo(id, event.fromId)),
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
            movingCards: [{ card: response.selectedCard, fromArea: 2 /* JudgeArea */ }],
            fromId: toIds[0],
            toId: fromId,
            toArea: 2 /* JudgeArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
DangZai = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'dangzai', description: 'dangzai_description' })
], DangZai);
exports.DangZai = DangZai;
