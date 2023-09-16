"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuangFengShadow = exports.KuangFeng = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const qixing_1 = require("./qixing");
let KuangFeng = class KuangFeng extends skill_1.TriggerSkill {
    async whenLosingSkill(room, player) {
        for (const other of room.getOtherPlayers(player.Id)) {
            if (other.getMark("kuangfeng" /* KuangFeng */) === 0) {
                continue;
            }
            room.removeMark(other.Id, "kuangfeng" /* KuangFeng */);
        }
    }
    async whenDead(room, player) {
        for (const other of room.getOtherPlayers(player.Id)) {
            if (other.getMark("kuangfeng" /* KuangFeng */) === 0) {
                continue;
            }
            room.removeMark(other.Id, "kuangfeng" /* KuangFeng */);
        }
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.toStage === 19 /* FinishStageStart */ &&
            content.playerId === owner.Id &&
            owner.getCardIds(3 /* OutsideArea */, qixing_1.QiXing.Name).length > 0);
    }
    availableCardAreas() {
        return [3 /* OutsideArea */];
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, pendingCardId) {
        return room.getPlayerById(owner).getCardIds(3 /* OutsideArea */, qixing_1.QiXing.Name).includes(pendingCardId);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(ownerId, room, targetId) {
        return ownerId !== targetId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.dropCards(6 /* PlaceToDropStack */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        room.addMark(skillUseEvent.toIds[0], "kuangfeng" /* KuangFeng */, 1);
        return true;
    }
};
KuangFeng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'kuangfeng', description: 'kuangfeng_description' })
], KuangFeng);
exports.KuangFeng = KuangFeng;
let KuangFengShadow = class KuangFengShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isFlaggedSkill(room, event, stage) {
        return stage !== "DamagedEffect" /* DamagedEffect */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return damageEvent.damageType === "fire_property" /* Fire */ && room.getMark(damageEvent.toId, "kuangfeng" /* KuangFeng */) > 0;
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (phaseChangeEvent.to === 0 /* PhaseBegin */ &&
                phaseChangeEvent.toPlayer === owner.Id &&
                !!room.getAlivePlayersFrom().find(player => player.getMark("kuangfeng" /* KuangFeng */) > 0));
        }
        return false;
    }
    async onTrigger(room, skillUseEvent) {
        const unknownEvent = skillUseEvent.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.GeneralName, damageEvent.damage + 1).extract();
        }
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const unknownEvent = skillEffectEvent.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            damageEvent.damage++;
        }
        else {
            for (const player of room.getAlivePlayersFrom()) {
                if (player.getMark("kuangfeng" /* KuangFeng */) > 0) {
                    room.removeMark(player.Id, "kuangfeng" /* KuangFeng */);
                }
            }
        }
        return true;
    }
};
KuangFengShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: KuangFeng.Name, description: KuangFeng.Description })
], KuangFengShadow);
exports.KuangFengShadow = KuangFengShadow;
