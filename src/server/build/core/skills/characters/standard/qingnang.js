"use strict";
var QingNang_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingNangShadow = exports.QingNang = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let QingNang = QingNang_1 = class QingNang extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) || room.getFlag(owner.Id, QingNang_1.exUse) === true;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        return (room.getPlayerById(target).Hp < room.getPlayerById(target).MaxHp &&
            room.getFlag(target, this.Name) !== true);
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        const recoverContent = {
            recoverBy: skillUseEvent.fromId,
            toId: skillUseEvent.toIds[0],
            recoveredHp: 1,
            triggeredBySkills: [this.Name],
        };
        await room.recover(recoverContent);
        room.setFlag(skillUseEvent.toIds[0], this.Name, true);
        if (engine_1.Sanguosha.getCardById(skillUseEvent.cardIds[0]).isRed()) {
            room.setFlag(skillUseEvent.fromId, QingNang_1.exUse, true);
        }
        else {
            room.setFlag(skillUseEvent.fromId, QingNang_1.exUse, false);
        }
        return true;
    }
};
QingNang.exUse = 'QingNang_ExUse';
QingNang = QingNang_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qingnang', description: 'qingnang_description' })
], QingNang);
exports.QingNang = QingNang;
let QingNangShadow = class QingNangShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return event.from === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return room.getFlag(owner.Id, QingNang.exUse) !== undefined;
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const phaseChangeEvent = triggeredOnEvent;
        phaseChangeEvent.fromPlayer && room.removeFlag(phaseChangeEvent.fromPlayer, QingNang.exUse);
        for (const player of room.AlivePlayers) {
            room.removeFlag(player.Id, this.GeneralName);
        }
        return true;
    }
};
QingNangShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: QingNang.GeneralName, description: QingNang.Description })
], QingNangShadow);
exports.QingNangShadow = QingNangShadow;
