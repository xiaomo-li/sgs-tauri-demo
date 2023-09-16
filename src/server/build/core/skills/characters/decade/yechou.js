"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YeChouDebuff = exports.YeChou = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YeChou = class YeChou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id && room.getOtherPlayers(owner.Id).find(player => player.LostHp > 1) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).LostHp > 1;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a yechou target to use this skill?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        room.getPlayerById(event.toIds[0]).hasShadowSkill(YeChouDebuff.Name) ||
            (await room.obtainSkill(event.toIds[0], YeChouDebuff.Name));
        room.getFlag(event.toIds[0], this.Name) ||
            room.setFlag(event.toIds[0], this.Name, true, this.Name);
        return true;
    }
};
YeChou = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yechou', description: 'yechou_description' })
], YeChou);
exports.YeChou = YeChou;
let YeChouDebuff = class YeChouDebuff extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        room.removeFlag(player.Id, YeChou.Name);
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, event, stage) {
        return ((stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */) ||
            (stage === "AfterPhaseChanged" /* AfterPhaseChanged */ &&
                event.to === 0 /* PhaseBegin */ &&
                event.toPlayer === owner.Id));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const phaseChangeEvent = event.triggeredOnEvent;
        if (phaseChangeEvent.to === 0 /* PhaseBegin */ && phaseChangeEvent.toPlayer === event.fromId) {
            room.removeFlag(event.fromId, YeChou.Name);
            await room.loseSkill(event.fromId, this.Name);
        }
        else {
            await room.loseHp(event.fromId, 1);
        }
        return true;
    }
};
YeChouDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_yechou_debuff', description: 's_yechou_debuff_description' })
], YeChouDebuff);
exports.YeChouDebuff = YeChouDebuff;
