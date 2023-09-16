"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LieWei = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LieWei = class LieWei extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        return room.CurrentPlayer === owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
LieWei = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'liewei', description: 'liewei_description' })
], LieWei);
exports.LieWei = LieWei;
