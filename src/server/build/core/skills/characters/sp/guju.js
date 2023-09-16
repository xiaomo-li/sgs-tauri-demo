"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuJu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuJu = class GuJu extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.HiddenFlag = 'guju_hidden_flag';
    }
    async whenLosingSkill(room, owner) {
        if (owner.getFlag(this.Name)) {
            owner.setFlag(this.HiddenFlag, owner.getFlag(this.Name));
            room.removeFlag(owner.Id, this.Name);
        }
    }
    async whenObtainingSkill(room, owner) {
        owner.getFlag(this.HiddenFlag) &&
            room.setFlag(owner.Id, this.Name, owner.getFlag(this.HiddenFlag), translation_json_tool_1.TranslationPack.translationJsonPatcher('guju times: {0}', owner.getFlag(this.HiddenFlag)).toString());
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return room.getMark(content.toId, "kui" /* Kui */) > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        const originalTimes = room.getFlag(event.fromId, this.Name) || 0;
        room.setFlag(event.fromId, this.Name, originalTimes + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('guju times: {0}', originalTimes + 1).toString());
        return true;
    }
};
GuJu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'guju', description: 'guju_description' })
], GuJu);
exports.GuJu = GuJu;
