"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiangZhu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiangZhu = class LiangZhu extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.LiangZhuOptions = ['liangzhu:you', 'liangzhu:opponent'];
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterRecoverEffect" /* AfterRecoverEffect */;
    }
    canUse(room, owner, content) {
        return (room.CurrentPhasePlayer &&
            room.CurrentPhasePlayer.Id === content.toId &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */);
    }
    async beforeUse(room, event) {
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options: this.LiangZhuOptions,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose liangzhu options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.triggeredOnEvent.toId))).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (response.selectedOption) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedOption }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const chosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        if (chosen === this.LiangZhuOptions[1]) {
            const toId = event.triggeredOnEvent.toId;
            await room.drawCards(2, toId, 'top', fromId, this.Name);
            const originalPlayers = room.getFlag(fromId, this.Name) || [];
            originalPlayers.includes(toId) || originalPlayers.push(toId);
            room.getPlayerById(fromId).setFlag(this.Name, originalPlayers);
        }
        else {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
LiangZhu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'liangzhu', description: 'liangzhu_description' })
], LiangZhu);
exports.LiangZhu = LiangZhu;
