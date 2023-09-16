"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianLiang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JianLiang = class JianLiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            event.toStage === 10 /* DrawCardStageStart */ &&
            !!room
                .getOtherPlayers(owner.Id)
                .find(player => player.getCardIds(0 /* HandArea */).length > owner.getCardIds(0 /* HandArea */).length));
    }
    numberOfTargets() {
        return [1, 2];
    }
    isAvailableTarget() {
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most 2 targets to draw 1 card each?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        for (const toId of event.toIds) {
            await room.drawCards(1, toId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
JianLiang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jianliang', description: 'jianliang_description' })
], JianLiang);
exports.JianLiang = JianLiang;
