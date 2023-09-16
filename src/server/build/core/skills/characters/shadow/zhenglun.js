"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhengLun = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhengLun = class ZhengLun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    canUse(room, owner, content) {
        return (content.toPlayer === owner.Id && content.to === 3 /* DrawCardStage */ && owner.getMark("orange" /* Orange */) === 0);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to skip draw card phase to gain 1 orange?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.addMark(event.fromId, "orange" /* Orange */, 1);
        await room.skip(event.fromId, 3 /* DrawCardStage */);
        return true;
    }
};
ZhengLun = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhenglun', description: 'zhenglun_description' })
], ZhengLun);
exports.ZhengLun = ZhengLun;
