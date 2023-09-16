"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhengNan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhengNan = class ZhengNan extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['decade_dangxian', 'wusheng', 'zhiman'];
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, event) {
        var _a;
        return !((_a = owner.getFlag(this.Name)) === null || _a === void 0 ? void 0 : _a.includes(event.dying));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const originalPlayers = room.getFlag(fromId, this.Name) || [];
        originalPlayers.push(event.triggeredOnEvent.dying);
        room.getPlayerById(fromId).setFlag(this.Name, originalPlayers);
        await room.recover({
            toId: fromId,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        const options = ['decade_dangxian', 'wusheng', 'zhiman'];
        options.filter(skillName => !room.getPlayerById(fromId).hasSkill(skillName));
        await room.drawCards(options.length > 0 ? 1 : 3, fromId, 'top', fromId, this.Name);
        if (options.length > 0) {
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a skill to gain', this.Name).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption = response.selectedOption || options[0];
            await room.obtainSkill(fromId, response.selectedOption);
        }
        return true;
    }
};
ZhengNan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhengnan', description: 'zhengnan_description' })
], ZhengNan);
exports.ZhengNan = ZhengNan;
