"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodFuHai = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let GodFuHai = class GodFuHai extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    whenRefresh(room, owner) {
        owner.removeFlag(this.Name);
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "OnAim" /* OnAim */ || stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        const identifer = event_packer_1.EventPacker.getIdentifier(content);
        if (identifer === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return (cardUseEvent.fromId === owner.Id &&
                target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).find(playerId => room.getMark(playerId, "pingding" /* PingDing */) > 0) !== undefined);
        }
        else if (identifer === 131 /* AimEvent */) {
            const aimEvent = content;
            return (aimEvent.fromId === owner.Id &&
                room.getMark(aimEvent.toId, "pingding" /* PingDing */) > 0 &&
                (owner.getFlag(this.Name) || 0) < 2);
        }
        else if (identifer === 153 /* PlayerDiedEvent */) {
            const toId = content.playerId;
            return toId !== owner.Id && room.getPlayerById(toId).getMark("pingding" /* PingDing */) > 0;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifer = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifer === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            cardUseEvent.disresponsiveList = cardUseEvent.disresponsiveList || [];
            cardUseEvent.disresponsiveList.push(...target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).filter(target => room.getPlayerById(target).getMark("pingding" /* PingDing */) > 0));
        }
        else if (identifer === 131 /* AimEvent */) {
            room.getPlayerById(fromId).setFlag(this.Name, (room.getFlag(fromId, this.Name) || 0) + 1);
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        else {
            const toId = unknownEvent.playerId;
            const markNum = room.getMark(toId, "pingding" /* PingDing */);
            await room.changeMaxHp(fromId, markNum);
            await room.drawCards(markNum, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
GodFuHai = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'god_fuhai', description: 'god_fuhai_description' })
], GodFuHai);
exports.GodFuHai = GodFuHai;
