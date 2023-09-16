"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuXiaoRemover = exports.HuXiaoShadow = exports.HuXiao = void 0;
const tslib_1 = require("tslib");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let HuXiao = class HuXiao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id && content.damageType === "fire_property" /* Fire */ && !room.getPlayerById(content.toId).Dead);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const victim = event.triggeredOnEvent.toId;
        await room.drawCards(1, victim, 'top', event.fromId, this.Name);
        const originalTargets = room.getFlag(event.fromId, this.Name) || [];
        originalTargets.includes(victim) || originalTargets.push(victim);
        room.setFlag(event.fromId, this.Name, originalTargets);
        return true;
    }
};
HuXiao = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'huxiao', description: 'huxiao_description' })
], HuXiao);
exports.HuXiao = HuXiao;
let HuXiaoShadow = class HuXiaoShadow extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableTimesTo(cardId, room, owner, target) {
        return (room.getFlag(owner.Id, this.GeneralName) || []).includes(target.Id)
            ? game_props_1.INFINITE_TRIGGERING_TIMES
            : 0;
    }
};
HuXiaoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: HuXiao.Name, description: HuXiao.Description })
], HuXiaoShadow);
exports.HuXiaoShadow = HuXiaoShadow;
let HuXiaoRemover = class HuXiaoRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 7 /* PhaseFinish */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
HuXiaoRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: HuXiaoShadow.Name, description: HuXiaoShadow.Description })
], HuXiaoRemover);
exports.HuXiaoRemover = HuXiaoRemover;
