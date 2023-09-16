"use strict";
var SPLiuBeiShiChou_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPLiuBeiShiChouBuff = exports.SPLiuBeiShiChou = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let SPLiuBeiShiChou = SPLiuBeiShiChou_1 = class SPLiuBeiShiChou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 4 /* PrepareStage */ &&
            owner.getPlayerCards().length >= 1);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        const to = room.getPlayerById(targetId);
        return to.Nationality !== 1 /* Shu */ && targetId !== owner;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { toIds, fromId } = skillUseEvent;
        const toId = toIds[0];
        await room.moveCards({
            movingCards: skillUseEvent.cardIds.map(cardId => ({
                card: cardId,
                fromArea: room.getPlayerById(fromId).cardFrom(cardId),
            })),
            fromId,
            toId,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        await room.obtainSkill(fromId, SPLiuBeiShiChouBuff.Name);
        room.getPlayerById(toId).setFlag(SPLiuBeiShiChou_1.Name, true);
        return true;
    }
};
SPLiuBeiShiChou = SPLiuBeiShiChou_1 = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.LimitSkill({ name: 'liubei_shichou', description: 'liubei_shichou_description' })
], SPLiuBeiShiChou);
exports.SPLiuBeiShiChou = SPLiuBeiShiChou;
let SPLiuBeiShiChouBuff = class SPLiuBeiShiChouBuff extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent, fromId } = event;
        const damageEvent = triggeredOnEvent;
        for (const player of room.getOtherPlayers(fromId)) {
            if (room.getFlag(player.Id, SPLiuBeiShiChou.Name) === true) {
                await room.damage({
                    toId: player.Id,
                    damage: damageEvent.damage,
                    damageType: "normal_property" /* Normal */,
                    triggeredBySkills: [this.Name],
                });
                await room.drawCards(damageEvent.damage, player.Id);
                await room.drawCards(damageEvent.damage, damageEvent.toId);
            }
        }
        return true;
    }
};
SPLiuBeiShiChouBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: SPLiuBeiShiChou.Name, description: SPLiuBeiShiChou.Description })
], SPLiuBeiShiChouBuff);
exports.SPLiuBeiShiChouBuff = SPLiuBeiShiChouBuff;
