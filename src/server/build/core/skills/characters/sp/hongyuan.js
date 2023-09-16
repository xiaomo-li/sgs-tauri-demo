"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HongYuan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HongYuan = class HongYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            event.bySpecialReason === 0 /* GameStage */ &&
            event.drawAmount > 0);
    }
    numberOfTargets() {
        return [1, 2];
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most two targets to draw 1 card each?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        event.triggeredOnEvent.drawAmount -= 1;
        for (const toId of event.toIds) {
            await room.drawCards(1, toId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
HongYuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'hongyuan', description: 'hongyuan_description' })
], HongYuan);
exports.HongYuan = HongYuan;
