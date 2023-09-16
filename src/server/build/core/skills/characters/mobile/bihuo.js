"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiHuoRemove = exports.BiHuoBuff = exports.BiHuo = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BiHuo = class BiHuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPlayerDying" /* AfterPlayerDying */;
    }
    canUse(room, owner, content) {
        return !room.getPlayerById(content.dying).Dead;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.dying))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const dying = event.triggeredOnEvent.dying;
        await room.drawCards(3, dying, 'top', event.fromId, this.Name);
        room.setFlag(dying, this.Name, room.AlivePlayers.length, translation_json_tool_1.TranslationPack.translationJsonPatcher('bihuo distance: {0}', room.AlivePlayers.length).toString());
        const dyingPlayer = room.getPlayerById(dying);
        dyingPlayer.hasShadowSkill(BiHuoBuff.Name) || (await room.obtainSkill(dying, BiHuoBuff.Name));
        dyingPlayer.hasShadowSkill(BiHuoRemove.Name) || (await room.obtainSkill(dying, BiHuoRemove.Name));
        return true;
    }
};
BiHuo = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'bihuo', description: 'bihuo_description' })
], BiHuo);
exports.BiHuo = BiHuo;
let BiHuoBuff = class BiHuoBuff extends skill_1.RulesBreakerSkill {
    breakDefenseDistance(room, owner) {
        return owner.getFlag(BiHuo.Name) || 0;
    }
};
BiHuoBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_bihuo_buff', description: 's_bihuo_buff_description' })
], BiHuoBuff);
exports.BiHuoBuff = BiHuoBuff;
let BiHuoRemove = class BiHuoRemove extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCircleStarted" /* AfterCircleStarted */;
    }
    canUse(room, owner, event) {
        return owner.getFlag(BiHuo.Name) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, BiHuo.Name);
        const from = room.getPlayerById(event.fromId);
        from.hasShadowSkill(BiHuoBuff.Name) && (await room.loseSkill(event.fromId, BiHuoBuff.Name));
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
BiHuoRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_bihuo_remove', description: 's_bihuo_remove_description' })
], BiHuoRemove);
exports.BiHuoRemove = BiHuoRemove;
