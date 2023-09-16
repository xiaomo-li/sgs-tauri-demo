"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouJieYue = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MouJieYue = class MouJieYue extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to gain 1 armor?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.changeArmor(event.toIds[0], 1);
        if (room.getPlayerById(event.toIds[0]).getPlayerCards().length > 0) {
            const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                cardAmount: 1,
                toId: event.toIds[0],
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give 1 card to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }), event.toIds[0]);
            response.selectedCards.length > 0 &&
                (await room.moveCards({
                    movingCards: [
                        {
                            card: response.selectedCards[0],
                            fromArea: room.getPlayerById(event.toIds[0]).cardFrom(response.selectedCards[0]),
                        },
                    ],
                    fromId: event.toIds[0],
                    toId: event.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: event.toIds[0],
                    triggeredBySkills: [this.Name],
                }));
        }
        return true;
    }
};
MouJieYue = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mou_jieyue', description: 'mou_jieyue_description' })
], MouJieYue);
exports.MouJieYue = MouJieYue;
