"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuQianShadow = exports.WuQian = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const wushuang_1 = require("../standard/wushuang");
let WuQian = class WuQian extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return room.getMark(owner.Id, "nu" /* Wrath */) >= 2;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return !room.getFlag(target, this.GeneralName) && target !== owner;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        room.addMark(skillEffectEvent.fromId, "nu" /* Wrath */, -2);
        const target = skillEffectEvent.toIds[0];
        room.setFlag(target, this.GeneralName, true);
        if (!room.getPlayerById(skillEffectEvent.fromId).hasSkill(wushuang_1.WuShuang.GeneralName)) {
            await room.obtainSkill(skillEffectEvent.fromId, wushuang_1.WuShuang.GeneralName);
            room.setFlag(skillEffectEvent.fromId, this.GeneralName, true);
        }
        return true;
    }
};
WuQian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'wuqian', description: 'wuqian_description' })
], WuQian);
exports.WuQian = WuQian;
let WuQianShadow = class WuQianShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterDead() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterStageChanged" /* AfterStageChanged */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            event.toStage === 24 /* PhaseFinishEnd */ &&
            !!room.getAlivePlayersFrom().find(player => !!room.getFlag(player.Id, this.GeneralName)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        if (room.getFlag(skillEffectEvent.fromId, this.GeneralName)) {
            await room.loseSkill(skillEffectEvent.fromId, wushuang_1.WuShuang.GeneralName);
            room.removeFlag(skillEffectEvent.fromId, this.GeneralName);
        }
        for (const player of room.getOtherPlayers(skillEffectEvent.fromId)) {
            if (room.getFlag(player.Id, this.GeneralName)) {
                room.removeFlag(player.Id, this.GeneralName);
            }
        }
        return true;
    }
};
WuQianShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: WuQian.GeneralName, description: WuQian.Description })
], WuQianShadow);
exports.WuQianShadow = WuQianShadow;
