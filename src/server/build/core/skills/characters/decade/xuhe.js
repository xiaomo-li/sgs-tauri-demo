"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuHe = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XuHe = class XuHe extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.XuHeOptions = ['xuhe:draw', 'xuhe:discard'];
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            (content.toStage === 13 /* PlayCardStageStart */ ||
                (content.toStage === 15 /* PlayCardStageEnd */ &&
                    !room.getOtherPlayers(owner.Id).find(player => player.MaxHp > owner.MaxHp))));
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        if (room.CurrentPlayerStage === 13 /* PlayCardStageStart */) {
            const targets = room
                .getAlivePlayersFrom()
                .filter(player => room.distanceBetween(room.getPlayerById(fromId), player) <= 1);
            const options = this.XuHeOptions.slice();
            targets.find(target => fromId === target.Id
                ? target.getPlayerCards().find(id => room.canDropCard(fromId, id))
                : target.getPlayerCards().length > 0) || options.shift();
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose xuhe options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...targets)).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId);
            if (response.selectedOption) {
                event.toIds = targets.map(player => player.Id);
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedOption }, event);
            }
            else {
                return false;
            }
        }
        return true;
    }
    getAnimationSteps(event) {
        return event.toIds ? [{ from: event.fromId, tos: event.toIds }] : [];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (room.CurrentPlayerStage === 13 /* PlayCardStageStart */ && toIds) {
            await room.changeMaxHp(fromId, -1);
            for (const toId of toIds) {
                const chosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
                if (chosen === this.XuHeOptions[0]) {
                    await room.drawCards(1, toId, 'top', fromId, this.Name);
                }
                else {
                    const to = room.getPlayerById(toId);
                    if (fromId === toId
                        ? !to.getPlayerCards().find(id => room.canDropCard(fromId, id))
                        : to.getPlayerCards().length === 0) {
                        continue;
                    }
                    const options = {
                        [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                        [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                    };
                    const chooseCardEvent = {
                        fromId,
                        toId,
                        options,
                        triggeredBySkills: [this.Name],
                    };
                    const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
                    if (!resp) {
                        continue;
                    }
                    await room.dropCards(fromId === toId ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [resp.selectedCard], toId, fromId, this.Name);
                }
            }
        }
        else {
            await room.changeMaxHp(fromId, 1);
            const options = ['xuhe:draw2'];
            room.getPlayerById(fromId).LostHp > 0 && options.unshift('xuhe:recover');
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose xuhe buff options', this.Name).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption = response.selectedOption || options[0];
            if (response.selectedOption === 'xuhe:recover') {
                await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                    recoverBy: fromId,
                });
            }
            else {
                await room.drawCards(2, fromId, 'top', fromId, this.Name);
            }
        }
        return true;
    }
};
XuHe = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xuhe', description: 'xuhe_description' })
], XuHe);
exports.XuHe = XuHe;
