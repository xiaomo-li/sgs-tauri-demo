"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiLi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WeiLi = class WeiLi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 13 /* PlayCardStageStart */ &&
            (owner.Hp > 0 || owner.getMark("orange" /* Orange */) > 0));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to gain 1 orange?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const options = [];
        room.getPlayerById(fromId).Hp > 0 && options.push('weili:loseHp');
        room.getMark(fromId, "orange" /* Orange */) > 0 && options.unshift('weili:loseOrange');
        if (options.length > 0) {
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose weili options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }), fromId);
            response.selectedOption = response.selectedOption || options[0];
            if (response.selectedOption === 'weili:loseOrange') {
                room.addMark(fromId, "orange" /* Orange */, -1);
            }
            else {
                await room.loseHp(fromId, 1);
            }
            room.addMark(toIds[0], "orange" /* Orange */, 1);
        }
        return true;
    }
};
WeiLi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'weili', description: 'weili_description' })
], WeiLi);
exports.WeiLi = WeiLi;
