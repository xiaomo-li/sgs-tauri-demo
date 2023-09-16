"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaWuShadow = exports.DaWu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const qixing_1 = require("./qixing");
let DaWu = class DaWu extends skill_1.TriggerSkill {
    async whenLosingSkill(room, player) {
        for (const other of room.getOtherPlayers(player.Id)) {
            if (other.getMark("dawu" /* DaWu */) === 0) {
                continue;
            }
            room.removeMark(other.Id, "dawu" /* DaWu */);
        }
    }
    async whenDead(room, player) {
        for (const other of room.getOtherPlayers(player.Id)) {
            if (other.getMark("dawu" /* DaWu */) === 0) {
                continue;
            }
            room.removeMark(other.Id, "dawu" /* DaWu */);
        }
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.toStage === 19 /* FinishStageStart */ &&
            event.playerId === owner.Id &&
            owner.getCardIds(3 /* OutsideArea */, qixing_1.QiXing.Name).length > 0);
    }
    availableCardAreas() {
        return [3 /* OutsideArea */];
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard(owner, room, pendingCardId) {
        return room.getPlayerById(owner).getCardIds(3 /* OutsideArea */, qixing_1.QiXing.Name).includes(pendingCardId);
    }
    targetFilter(room, owner, targets, selectedCards) {
        return targets.length === selectedCards.length;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        return selectedTargets.length < selectedCards.length;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.dropCards(6 /* PlaceToDropStack */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        for (const player of skillUseEvent.toIds) {
            room.addMark(player, "dawu" /* DaWu */, 1);
        }
        return true;
    }
};
DaWu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'dawu', description: 'dawu_description' })
], DaWu);
exports.DaWu = DaWu;
let DaWuShadow = class DaWuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isFlaggedSkill(room, event, stage) {
        return stage !== "DamagedEffect" /* DamagedEffect */;
    }
    getPriority() {
        return 2 /* Low */;
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
            return damageEvent.damageType !== "thunder_property" /* Thunder */ && room.getMark(damageEvent.toId, "dawu" /* DaWu */) > 0;
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (phaseChangeEvent.to === 0 /* PhaseBegin */ &&
                phaseChangeEvent.toPlayer === owner.Id &&
                !!room.getAlivePlayersFrom().find(player => player.getMark("dawu" /* DaWu */) > 0));
        }
        return false;
    }
    async onTrigger(room, skillUseEvent) {
        const unknownEvent = skillUseEvent.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, nullified damage event', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.GeneralName).extract();
        }
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const unknownEvent = skillEffectEvent.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            event_packer_1.EventPacker.terminate(damageEvent);
        }
        else {
            for (const player of room.getAlivePlayersFrom()) {
                if (player.getMark("dawu" /* DaWu */) > 0) {
                    room.removeMark(player.Id, "dawu" /* DaWu */);
                }
            }
        }
        return true;
    }
};
DaWuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: DaWu.Name, description: DaWu.Description })
], DaWuShadow);
exports.DaWuShadow = DaWuShadow;
