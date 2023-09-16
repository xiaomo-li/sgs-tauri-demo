"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianYuShadow = exports.JianYu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JianYu = class JianYu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 2;
    }
    isAvailableTarget() {
        return true;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds || toIds.length !== 2) {
            return false;
        }
        const firstTarget = room.getFlag(toIds[0], this.Name) || [];
        const secondTarget = room.getFlag(toIds[1], this.Name) || [];
        firstTarget.push(toIds[1]);
        secondTarget.push(toIds[0]);
        room.setFlag(toIds[0], this.Name, firstTarget, translation_json_tool_1.TranslationPack.translationJsonPatcher('jianyu target: {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...firstTarget.map(playerId => room.getPlayerById(playerId)))).toString());
        room.setFlag(toIds[1], this.Name, secondTarget, translation_json_tool_1.TranslationPack.translationJsonPatcher('jianyu target: {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...secondTarget.map(playerId => room.getPlayerById(playerId)))).toString());
        return true;
    }
};
JianYu = tslib_1.__decorate([
    skill_1.CircleSkill,
    skill_1.CommonSkill({ name: 'jianyu', description: 'jianyu_description' })
], JianYu);
exports.JianYu = JianYu;
let JianYuShadow = class JianYuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer.Id === owner &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    clearFlag(room, owner) {
        for (const player of room.getAlivePlayersFrom()) {
            if (player.getFlag(this.GeneralName)) {
                room.removeFlag(player.Id, this.GeneralName);
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
        return stage === "OnAim" /* OnAim */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = content;
            const targets = room.getFlag(aimEvent.fromId, this.GeneralName);
            return targets && targets.includes(aimEvent.toId);
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
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = unknownEvent;
            await room.drawCards(1, aimEvent.toId, 'top', fromId, this.GeneralName);
        }
        else {
            this.clearFlag(room, fromId);
        }
        return true;
    }
};
JianYuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: JianYu.Name, description: JianYu.Description })
], JianYuShadow);
exports.JianYuShadow = JianYuShadow;
