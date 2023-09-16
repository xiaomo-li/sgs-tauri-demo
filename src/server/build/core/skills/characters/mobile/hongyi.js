"use strict";
var HongYi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HongYiDebuff = exports.HongYiShadow = exports.HongYi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let HongYi = HongYi_1 = class HongYi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const originalTargets = room.getFlag(event.fromId, HongYi_1.Targets) || [];
        originalTargets.push(event.toIds[0]);
        room.setFlag(event.fromId, HongYi_1.Targets, originalTargets);
        room.getFlag(event.toIds[0], this.Name) ||
            room.setFlag(event.toIds[0], this.Name, true, this.Name);
        room.getPlayerById(event.toIds[0]).hasShadowSkill(HongYiDebuff.Name) ||
            (await room.obtainSkill(event.toIds[0], HongYiDebuff.Name));
        return true;
    }
};
HongYi.Targets = 'hongyi_targets';
HongYi = HongYi_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'hongyi', description: 'hongyi_description' })
], HongYi);
exports.HongYi = HongYi;
let HongYiShadow = class HongYiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer === room.getPlayerById(owner) &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    async removeDebuff(room, player) {
        const targets = player.getFlag(HongYi.Targets) || [];
        if (targets.length > 0) {
            for (const target of targets) {
                await room.loseSkill(target, HongYiDebuff.Name);
            }
        }
        player.removeFlag(HongYi.Targets);
    }
    async whenDead(room, player) {
        await this.removeDebuff(room, player);
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
    canUse(room, owner, content) {
        return (owner.Id === content.toPlayer &&
            content.to === 0 /* PhaseBegin */ &&
            owner.getFlag(HongYi.Targets) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        await this.removeDebuff(room, from);
        return true;
    }
};
HongYiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: HongYi.Name, description: HongYi.Description })
], HongYiShadow);
exports.HongYiShadow = HongYiShadow;
let HongYiDebuff = class HongYiDebuff extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    async whenLosingSkill(room, owner) {
        owner.getFlag(HongYi.Name) && room.removeFlag(owner.Id, HongYi.Name);
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && owner.getFlag(HongYi.Name);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const judgeEvent = await room.judge(event.fromId, undefined, HongYi.Name);
        if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).isRed()) {
            const victim = event.triggeredOnEvent.toId;
            room.getPlayerById(victim).Dead || (await room.drawCards(1, victim, 'top', event.fromId, HongYi.Name));
        }
        else if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).isBlack()) {
            const damageEvent = event.triggeredOnEvent;
            damageEvent.damage -= 1;
            damageEvent.damage < 1 && event_packer_1.EventPacker.terminate(damageEvent);
        }
        return true;
    }
};
HongYiDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_hongyi_debuff', description: 's_hongyi_debuff_description' })
], HongYiDebuff);
exports.HongYiDebuff = HongYiDebuff;
