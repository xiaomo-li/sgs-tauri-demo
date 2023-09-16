"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShengXi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShengXi = class ShengXi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            room.Analytics.getDamageRecord(owner.Id, 'round', undefined, 1).length === 0);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw 2 cards?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ShengXi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shengxi', description: 'shengxi_description' })
], ShengXi);
exports.ShengXi = ShengXi;
