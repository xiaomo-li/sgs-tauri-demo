"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianXiang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JianXiang = class JianXiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && content.fromId !== owner.Id;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (room
            .getOtherPlayers(target)
            .find(player => player.getCardIds(0 /* HandArea */).length <
            room.getPlayerById(target).getCardIds(0 /* HandArea */).length) === undefined);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a jianxiang target to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        await room.drawCards(1, toIds[0], 'top', fromId, this.Name);
        return true;
    }
};
JianXiang = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jianxiang', description: 'jianxiang_description' })
], JianXiang);
exports.JianXiang = JianXiang;
