"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuiKe = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let CuiKe = class CuiKe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.toStage === 13 /* PlayCardStageStart */ && content.playerId === owner.Id;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget(ownerId, room, targetId) {
        const target = room.getPlayerById(targetId);
        if (room.getMark(ownerId, "junlve" /* JunLve */) % 2 === 0) {
            return !target.ChainLocked || target.getPlayerCards().length > 0;
        }
        else {
            return true;
        }
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        const to = room.getPlayerById(toIds[0]);
        if (room.getMark(fromId, "junlve" /* JunLve */) % 2 === 0) {
            if (to.Id === fromId
                ? to.getCardIds().filter(id => room.canDropCard(fromId, id)).length > 0
                : to.getCardIds().length > 0) {
                const options = {
                    [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                    [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                    [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                };
                const chooseCardEvent = {
                    fromId,
                    toId: toIds[0],
                    options,
                    triggeredBySkills: [this.Name],
                };
                const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
                response &&
                    (await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], chooseCardEvent.toId, chooseCardEvent.fromId, this.Name));
            }
            if (!to.ChainLocked) {
                await room.chainedOn(toIds[0]);
            }
        }
        else {
            await room.damage({
                fromId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                toId: toIds[0],
                triggeredBySkills: [this.Name],
            });
        }
        const numOfName = room.getMark(fromId, "junlve" /* JunLve */);
        if (numOfName > 7) {
            const askForInvokeSkill = {
                toId: fromId,
                options: ['yes', 'no'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('cuike: do you wanna to throw {0} marks to do special skill', numOfName).extract(),
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, askForInvokeSkill, fromId);
            const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
            if (selectedOption === 'yes') {
                room.addMark(fromId, "junlve" /* JunLve */, -numOfName);
                for (const player of room.getOtherPlayers(fromId)) {
                    await room.damage({
                        fromId,
                        toId: player.Id,
                        damage: 1,
                        damageType: "normal_property" /* Normal */,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
        }
        return true;
    }
};
CuiKe = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'cuike', description: 'cuike_description' })
], CuiKe);
exports.CuiKe = CuiKe;
