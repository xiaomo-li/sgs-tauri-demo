"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuJin = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DuJin = class DuJin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s) additionally?', this.Name, Math.floor(owner.getCardIds(1 /* EquipArea */).length / 2) + 1).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const drawCardEvent = event.triggeredOnEvent;
        drawCardEvent.drawAmount +=
            Math.floor(room.getPlayerById(event.fromId).getCardIds(1 /* EquipArea */).length / 2) + 1;
        return true;
    }
};
DuJin = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'dujin', description: 'dujin_description' })
], DuJin);
exports.DuJin = DuJin;
