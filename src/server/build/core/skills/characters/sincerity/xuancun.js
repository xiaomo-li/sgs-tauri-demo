"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuanCun = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XuanCun = class XuanCun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (event.fromPlayer !== undefined &&
            event.fromPlayer !== owner.Id &&
            !room.getPlayerById(event.fromPlayer).Dead &&
            event.from === 7 /* PhaseFinish */ &&
            owner.Hp > owner.getCardIds(0 /* HandArea */).length);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} draws {2} card(s)?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromPlayer)), Math.min(owner.Hp - owner.getCardIds(0 /* HandArea */).length, 2)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(Math.min(room.getPlayerById(event.fromId).Hp -
            room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length, 2), event.triggeredOnEvent.fromPlayer, 'top', event.fromId, this.Name);
        return true;
    }
};
XuanCun = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xuancun', description: 'xuancun_description' })
], XuanCun);
exports.XuanCun = XuanCun;
