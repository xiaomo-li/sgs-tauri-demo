"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiXia = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const biluan_1 = require("./biluan");
let LiXia = class LiXia extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id !== content.playerId &&
            19 /* FinishStageStart */ === content.toStage &&
            !room.withinAttackDistance(room.getPlayerById(content.playerId), owner));
    }
    getAnimationSteps(event) {
        return [
            {
                from: event.fromId,
                tos: [event.triggeredOnEvent.playerId],
            },
        ];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const toId = event.triggeredOnEvent.playerId;
        const options = ['lixia:you', 'lixia:opponent'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose lixia options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId))).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        }, fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        if (response.selectedOption === options[1]) {
            await room.drawCards(2, toId, 'top', fromId, this.Name);
        }
        else {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        let originalDistance = room.getFlag(fromId, biluan_1.BiLuan.Name) || 0;
        originalDistance -= 1;
        room.setFlag(fromId, biluan_1.BiLuan.Name, originalDistance, originalDistance !== 0
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher(originalDistance > 0 ? 'distance buff: {0}' : 'distance debuff: {0}', originalDistance).toString()
            : undefined);
        room.getPlayerById(fromId).hasShadowSkill(biluan_1.BiLuanDistance.Name) ||
            (await room.obtainSkill(fromId, biluan_1.BiLuanDistance.Name));
        return true;
    }
};
LiXia = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'lixia', description: 'lixia_description' })
], LiXia);
exports.LiXia = LiXia;
