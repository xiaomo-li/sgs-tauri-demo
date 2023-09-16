"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiZhengShadow = exports.YiZheng = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YiZheng = class YiZheng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return targetId !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        const toId = precondition_1.Precondition.exists(toIds, 'Unable to get yizheng target')[0];
        const yiZhengUsers = room.getFlag(toId, this.Name) || [];
        if (!yiZhengUsers.includes(fromId)) {
            yiZhengUsers.push(fromId);
        }
        room.setFlag(toId, this.Name, yiZhengUsers, this.Name);
        return true;
    }
};
YiZheng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'yizheng', description: 'yizheng_description' })
], YiZheng);
exports.YiZheng = YiZheng;
let YiZhengShadow = class YiZhengShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer.Id === owner &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    clearFlag(room, owner) {
        for (const other of room.getOtherPlayers(owner)) {
            const yiZhengUsers = other.getFlag(this.GeneralName);
            if (yiZhengUsers && yiZhengUsers.includes(owner)) {
                if (yiZhengUsers.length === 1) {
                    room.removeFlag(other.Id, this.GeneralName);
                    continue;
                }
                const index = yiZhengUsers.findIndex(playerId => playerId === owner);
                yiZhengUsers.splice(index, 1);
                room.setFlag(other.Id, this.GeneralName, yiZhengUsers, this.GeneralName);
            }
        }
    }
    async whenDead(room, player) {
        this.clearFlag(room, player.Id);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "DamageEffect" /* DamageEffect */ ||
            stage === "RecoverEffecting" /* RecoverEffecting */ ||
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            if (!damageEvent.fromId || room.getPlayerById(damageEvent.fromId).Dead) {
                return false;
            }
            const source = room.getPlayerById(damageEvent.fromId);
            const yiZhengUsers = source.getFlag(this.GeneralName);
            return yiZhengUsers && yiZhengUsers.includes(owner.Id) && source.MaxHp < owner.MaxHp;
        }
        else if (identifier === 138 /* RecoverEvent */) {
            const recoverEvent = content;
            const to = room.getPlayerById(recoverEvent.toId);
            const yiZhengUsers = to.getFlag(this.GeneralName);
            return yiZhengUsers && yiZhengUsers.includes(owner.Id) && to.MaxHp < owner.MaxHp;
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return phaseChangeEvent.toPlayer === owner.Id && phaseChangeEvent.to === 0 /* PhaseBegin */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            await room.changeMaxHp(fromId, -1);
            const damageEvent = unknownEvent;
            damageEvent.damage++;
        }
        else if (identifier === 138 /* RecoverEvent */) {
            await room.changeMaxHp(fromId, -1);
            const recoverEvent = unknownEvent;
            recoverEvent.recoveredHp++;
        }
        else {
            this.clearFlag(room, fromId);
        }
        return true;
    }
};
YiZhengShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: YiZheng.Name, description: YiZheng.Description })
], YiZhengShadow);
exports.YiZhengShadow = YiZhengShadow;
