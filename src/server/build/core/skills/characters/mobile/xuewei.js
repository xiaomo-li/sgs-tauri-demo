"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XueWeiShadow = exports.XueWei = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XueWei = class XueWei extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && 3 /* PrepareStageStart */ === content.toStage;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a Xue Wei target?', this.Name).extract();
    }
    getAnimationSteps() {
        return [];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const players = room.getFlag(event.toIds[0], this.Name) || [];
        players.includes(event.fromId) || players.push(event.fromId);
        room.setFlag(event.toIds[0], this.Name, players, this.Name, players);
        return true;
    }
};
XueWei = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xuewei', description: 'xuewei_description' })
], XueWei);
exports.XueWei = XueWei;
let XueWeiShadow = class XueWeiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (content.toPlayer === owner &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    removeXueWeiFlag(room, player) {
        for (const other of room.getOtherPlayers(player)) {
            const players = other.getFlag(this.GeneralName);
            if (players && players.includes(player)) {
                if (players.length === 1) {
                    room.removeFlag(other.Id, this.GeneralName);
                }
                else {
                    const index = players.findIndex(p => p === player);
                    players.splice(index, 1);
                    room.setFlag(other.Id, this.GeneralName, players, this.GeneralName, players);
                }
            }
        }
    }
    async whenDead(room, player) {
        this.removeXueWeiFlag(room, player.Id);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, event) {
        var _a;
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            return (_a = room
                .getFlag(event.toId, this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(owner.Id);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.toPlayer === owner.Id && phaseChangeEvent.to === 0 /* PhaseBegin */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            const players = room.getFlag(damageEvent.toId, this.GeneralName);
            if (players.length === 1) {
                room.removeFlag(damageEvent.toId, this.GeneralName);
            }
            else {
                const index = players.findIndex(p => p === event.fromId);
                players.splice(index, 1);
                room.setFlag(damageEvent.toId, this.GeneralName, players, this.GeneralName, players);
            }
            event_packer_1.EventPacker.terminate(damageEvent);
            const source = damageEvent.fromId
                ? room.getPlayerById(damageEvent.fromId).Dead
                    ? undefined
                    : damageEvent.fromId
                : undefined;
            await room.damage({
                fromId: source,
                toId: event.fromId,
                damage: damageEvent.damage,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
            source &&
                (await room.damage({
                    fromId: event.fromId,
                    toId: source,
                    damage: damageEvent.damage,
                    damageType: damageEvent.damageType,
                    triggeredBySkills: [this.Name],
                }));
        }
        else {
            this.removeXueWeiFlag(room, event.fromId);
        }
        return true;
    }
};
XueWeiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XueWei.Name, description: XueWei.Description })
], XueWeiShadow);
exports.XueWeiShadow = XueWeiShadow;
