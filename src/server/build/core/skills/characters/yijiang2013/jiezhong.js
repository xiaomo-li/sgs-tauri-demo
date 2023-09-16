"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieZhong = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JieZhong = class JieZhong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 13 /* PlayCardStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length < owner.MaxHp);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s)?', this.GeneralName, owner.MaxHp - owner.getCardIds(0 /* HandArea */).length).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        await room.drawCards(from.MaxHp - from.getCardIds(0 /* HandArea */).length, fromId, 'top', fromId, this.Name);
        return true;
    }
};
JieZhong = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'jiezhong', description: 'jiezhong_description' })
], JieZhong);
exports.JieZhong = JieZhong;
